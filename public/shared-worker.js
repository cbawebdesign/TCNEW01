// public/shared-worker.js

// Keep track of all connected ports
const connections = [];

// Azure Function base endpoint for quotes
const azureFunctionUrl = "https://tradecompanion.azurewebsites.net/api/";

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
 * Fetch quote data for a given symbol via the Azure Function endpoint.
 */
function fetchQuoteForSymbol(symbol) {
  // Construct the REST URL for the quote data.
  const url = `${azureFunctionUrl}quote?symbol=${encodeURIComponent(symbol)}`;
  console.log(`[Worker] Fetching quote for ${symbol} from URL: ${url}`);
  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log(`[Worker] Fetched data for ${symbol}:`, data);
      // Publish the fetched quote data to subscribers.
      quoteManager.publish(symbol, data);
    })
    .catch((err) => {
      console.error(`[Worker] Error fetching quote for ${symbol}:`, err);
    });
}

/**
 * Poll all subscribed symbols periodically.
 */
function pollQuotes() {
  if (subscribedSymbols.size === 0) return;
  subscribedSymbols.forEach((symbol) => {
    fetchQuoteForSymbol(symbol);
  });
}

// Start polling every second (adjust interval as needed)
setInterval(pollQuotes, 1000);

/**
 * onconnect handler for shared worker clients.
 */
onconnect = function (e) {
  const port = e.ports[0];
  connections.push(port);
  console.log("New port connected to shared worker.");
  port.postMessage({
    type: 'status',
    message: 'Shared worker connected to Azure Function endpoint',
  });
  port.onmessage = function (event) {
    const data = event.data;
    if (data.type === "connect") {
      // Client initiated connection message.
      broadcast({ type: 'status', message: 'Connected to Azure Function endpoint' });
    } else if (data.type === "subscribe") {
      if (data.symbol) {
        // Register subscription for the symbol.
        quoteManager.subscribe(data.symbol, port);
        if (!subscribedSymbols.has(data.symbol)) {
          subscribedSymbols.add(data.symbol);
          broadcast({
            type: 'status',
            message: `Subscribed to ${data.symbol}`,
          });
        }
      }
    } else if (data.type === "unsubscribe") {
      if (data.symbol) {
        // Remove the subscription for the symbol.
        quoteManager.unsubscribe(data.symbol, port);
        const subs = quoteManager.subscribers.get(data.symbol);
        if (!subs || subs.length === 0) {
          subscribedSymbols.delete(data.symbol);
          broadcast({
            type: 'status',
            message: `Unsubscribed from ${data.symbol}`,
          });
        }
      }
    } else {
      console.warn("Unknown message type from client:", data.type);
    }
  };
};
