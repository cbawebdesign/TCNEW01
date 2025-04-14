// public/shared-worker.js

// Keep track of all connected ports
const connections = [];
let polygonSocket = null;
let isPolygonConnected = false;
let authDone = false;
let storedApiKey = null; // Store API key for fallback REST requests

// Set to track subscribed symbols (to avoid duplicate subscription messages)
const subscribedSymbols = new Set();

/**
 * QuoteManager: handles symbol subscriptions and publishes quote data.
 */
class QuoteManager {
  constructor() {
    this.subscribers = new Map();
  }

  subscribe(symbol, port) {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, []);
    }
    const subs = this.subscribers.get(symbol);
    if (!subs.includes(port)) {
      subs.push(port);
      console.log(`Port subscribed to ${symbol}`);
    }
  }

  unsubscribe(symbol, port) {
    if (this.subscribers.has(symbol)) {
      const subs = this.subscribers.get(symbol);
      const index = subs.indexOf(port);
      if (index !== -1) {
        subs.splice(index, 1);
        console.log(`Port unsubscribed from ${symbol}`);
      }
    }
  }

  publish(symbol, data) {
    const subs = this.subscribers.get(symbol);
    if (subs) {
      subs.forEach((port) => {
        port.postMessage({ type: 'quote', symbol, payload: data });
      });
    }
  }
}

const quoteManager = new QuoteManager();

/**
 * Broadcast a message to all connected ports.
 */
function broadcast(message) {
  connections.forEach((port) => {
    port.postMessage(message);
  });
}

/**
 * Fallback: Fetch previous close (last price) from Polygon’s REST API
 * if the WebSocket connection is closed.
 */
function fetchLastPricesForSymbols(symbols, apiKey) {
  symbols.forEach((symbol) => {
    // Construct the REST URL for the previous close data.
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;
    console.log(`[Worker] Fetching last price for ${symbol} from URL: ${url}`);
    fetch(url)
      .then((res) => {
        console.log(`[Worker] Response status for ${symbol}: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log(`[Worker] Fetched data for ${symbol}:`, data);
        if (data && data.results && data.results.length > 0) {
          const result = data.results[0];
          const lastPrice = result.c.toString();
          const percentChange = result.o
            ? (((result.c - result.o) / result.o) * 100).toFixed(2)
            : '0';
          console.log(`[Worker] ${symbol} fallback: lastPrice=${lastPrice}, percentChange=${percentChange}`);
          quoteManager.publish(symbol, { l: lastPrice, pc: percentChange });
        } else {
          console.warn(`[Worker] No results for ${symbol} from REST API.`);
        }
      })
      .catch((err) => {
        console.error(`[Worker] Error fetching last price for ${symbol}:`, err);
      });
  });
}

/**
 * Establish the Polygon WebSocket connection using the API key.
 */
function connectToPolygon(apiKey) {
  storedApiKey = apiKey;
  if (polygonSocket && (polygonSocket.readyState === WebSocket.OPEN || polygonSocket.readyState === WebSocket.CONNECTING)) {
    console.log("Polygon WebSocket already connected or connecting.");
    return;
  }
  polygonSocket = new WebSocket('wss://socket.polygon.io/stocks');

  polygonSocket.onopen = () => {
    console.log("Polygon WebSocket connected.");
    isPolygonConnected = true;
    polygonSocket.send(JSON.stringify({ action: "auth", params: apiKey }));
    broadcast({ type: 'status', message: 'Polygon connected, auth sent' });
  };

  polygonSocket.onerror = (error) => {
    console.error("Polygon WebSocket error:", error);
    broadcast({ type: 'error', message: error.message });
  };

  polygonSocket.onclose = () => {
    console.log("Polygon WebSocket closed.");
    isPolygonConnected = false;
    authDone = false;
    broadcast({ type: 'status', message: 'Polygon closed' });
    if (storedApiKey) {
      // Trigger REST fallback for all subscribed symbols.
      fetchLastPricesForSymbols(Array.from(subscribedSymbols), storedApiKey);
    }
  };

  polygonSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        data.forEach(handlePolygonMessage);
      } else {
        handlePolygonMessage(data);
      }
    } catch (err) {
      console.error("Error parsing Polygon message:", err);
    }
  };
}

/**
 * Handle messages from Polygon.
 */
function handlePolygonMessage(message) {
  console.log("Received message from Polygon:", message);
  broadcast({ type: 'message', payload: message });
  if (message.ev === 'status' && message.message === 'authenticated') {
    authDone = true;
    broadcast({ type: 'status', message: 'Authenticated with Polygon' });
    return;
  }
  if (message.T && message.ev !== 'status') {
    const symbol = message.T;
    quoteManager.publish(symbol, message);
  }
}

/**
 * onconnect handler for shared worker clients.
 */
onconnect = function (e) {
  const port = e.ports[0];
  connections.push(port);
  console.log("New port connected to shared worker.");
  port.postMessage({ type: 'status', message: 'Shared worker connected' });
  port.onmessage = function (event) {
    const data = event.data;
    if (data.type === "connect") {
      connectToPolygon(data.apiKey);
    } else if (data.type === "subscribe") {
      if (data.symbol) {
        quoteManager.subscribe(data.symbol, port);
        if (!subscribedSymbols.has(data.symbol)) {
          polygonSocket.send(JSON.stringify({ action: "subscribe", params: "T." + data.symbol }));
          subscribedSymbols.add(data.symbol);
          broadcast({ type: 'status', message: `Subscribed to ${data.symbol}` });
        }
      }
    } else if (data.type === "unsubscribe") {
      if (data.symbol) {
        quoteManager.unsubscribe(data.symbol, port);
        const subs = quoteManager.subscribers.get(data.symbol);
        if (!subs || subs.length === 0) {
          polygonSocket.send(JSON.stringify({ action: "unsubscribe", params: "T." + data.symbol }));
          subscribedSymbols.delete(data.symbol);
          broadcast({ type: 'status', message: `Unsubscribed from ${data.symbol}` });
        }
      }
    } else {
      console.warn("Unknown message type from client:", data.type);
    }
  };
};
