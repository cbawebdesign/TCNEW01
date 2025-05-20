// src/components/watchlist/WatchlistPage.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { getAuth } from 'firebase/auth';
import LogoImage from '~/core/ui/Logo/LogoImage';
import {
  FaRegComment,
  FaBullhorn,
  FaTrash,
  FaFileAlt,
  FaBell
} from 'react-icons/fa';

interface WatchlistSymbol {
  id: number;
  symbol: string;
  percentChange: string;
  lastPrice: string;
}

interface Watchlist {
  name: string;
  symbols: WatchlistSymbol[];
}

interface Tweet {
  id: string;
  username: string;
  created_at: string;
  text: string;
  symbol?: string;
}

interface TradeExchangePost {
  id: string;
  source: string;
  content: string;
  save_time_utc: string;
}

interface Filing {
  symbol: string;
  form: string;
  dcn: string;
  cik: number;
  save_time: string;
  url: string;
}

interface Quote {
  s: string;
  l: number;
  o?: number;
}

interface PriceAlert {
  id: string;
  symbol: string;
  target: number;
  direction: 'above' | 'below';
  note: string;
  triggered: boolean;
}

export default function WatchlistPage() {
  // 1) Watchlists
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedWatchlistIndex, setSelectedWatchlistIndex] = useState(0);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newSymbolText, setNewSymbolText] = useState('');

  // 2) Quotes (SignalR)
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  // 3) Tweets
  const [tweetsBySymbol, setTweetsBySymbol] = useState<Record<string, Tweet[]>>({});
  const [tweetFilter, setTweetFilter] = useState<string | null>('*');
  const [expandedTweets, setExpandedTweets] = useState<Set<string>>(new Set());

  // 4) TradeExchange
  const [tradePosts, setTradePosts] = useState<TradeExchangePost[]>([]);
  const [expandedTrades, setExpandedTrades] = useState<Set<string>>(new Set());

  // 5) Filings
  const [rawFilings, setRawFilings] = useState<Filing[]>([]);
  const [filings, setFilings] = useState<Filing[]>([]);

  // 6) Price Alerts + Toasts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [alertModalSymbol, setAlertModalSymbol] = useState<string|null>(null);
  const [newAlertTarget, setNewAlertTarget] = useState<number>(0);
  const [newAlertDirection, setNewAlertDirection] = useState<'above'|'below'>('above');
  const [newAlertNote, setNewAlertNote] = useState<string>('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const priceAlertsRef = useRef<PriceAlert[]>([]);
  useEffect(() => { priceAlertsRef.current = priceAlerts; }, [priceAlerts]);

  const srUrl = 'https://tradecompanion.azurewebsites.net/api';
  const current = watchlists[selectedWatchlistIndex] || { name:'', symbols:[] };

  // Base button styles
  const btnClasses = `
    bg-gradient-to-r from-blue-600/20 via-cyan-300/20 to-purple-600/20
    border border-gray-600 rounded px-4 py-2
    transition transform hover:-translate-y-0.5 hover:scale-105
    hover:bg-gradient-to-r hover:from-blue-500/40 hover:via-cyan-400/40 hover:to-purple-500/40
    hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50
  `;

  // Helper: Firebase ID token
  async function getIdToken(): Promise<string|null> {
    const user = getAuth().currentUser;
    return user ? await user.getIdToken() : null;
  }

  // Load price alerts from backend
  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      if (!token) return;
      const res = await fetch('/api/alerts/priceAlerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      setPriceAlerts(await res.json());
    })();
  }, []);

  // SignalR: Quotes & Filings
  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(srUrl, { transport: signalR.HttpTransportType.WebSockets, withCredentials:false })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.on('BroadcastQuotes', (data: Quote[]) => {
      setWatchlists(prev =>
        prev.map(wl => ({
          ...wl,
          symbols: wl.symbols.map(s => {
            const q = data.find(q => q.s === s.symbol);
            if (!q) return s;
            const last = q.l;
            const open = (q.o ?? parseFloat(s.lastPrice)) || 0;
            return {
              ...s,
              lastPrice: last.toFixed(2),
              percentChange: open > 0
                ? `${(((last - open)/open)*100).toFixed(2)}%`
                : s.percentChange
            };
          })
        }))
      );
      // check price alerts
      data.forEach(q =>
        priceAlertsRef.current.forEach(alert => {
          if (!alert.triggered && alert.symbol === q.s) {
            if (
              (alert.direction === 'above' && q.l >= alert.target) ||
              (alert.direction === 'below' && q.l <= alert.target)
            ) {
              setPriceAlerts(pa =>
                pa.map(a => a.id === alert.id ? { ...a, triggered: true } : a)
              );
              setNotifications(n => [
                ...n,
                `🔔 ${alert.symbol} is ${alert.direction} ${alert.target.toFixed(2)}`
              ]);
            }
          }
        })
      );
    });

    conn.on('BroadcastFiling', (f: Filing) => {
      setRawFilings(prev => [f, ...prev]);
    });

    conn.start().then(() => setConnection(conn)).catch(console.error);
    return () => void conn.stop();
  }, []);

  // Auto‑subscribe symbols
  useEffect(() => {
    if (!connection) return;
    current.symbols.forEach(s => {
      connection.invoke('Subscribe', s.symbol).catch(console.error);
    });
  }, [connection, current.symbols]);

  const subscribe = async (sym: string) => {
    if (!connection?.connectionId) return;
    await fetch(`${srUrl}/SubL1?symbol=${sym}&connectionId=${connection.connectionId}`);
  };

  // Load watchlists
  useEffect(() => {
    (async () => {
      const auth = getAuth(), user = auth.currentUser;
      if (!user) return;
      const res = await fetch('/api/watchlist/loadwatchlist', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ uid: user.uid })
      });
      if (!res.ok) return;
      const { watchlists } = await res.json();
      setWatchlists(watchlists.length
        ? watchlists
        : [{ name:'Watchlist 1', symbols:[] }]
      );
    })();
  }, []);

  // CRUD: Watchlists & Symbols
  const addWatchlist = () => {
    const nm = newWatchlistName.trim();
    if (!nm) return;
    setWatchlists(wl => [...wl, { name: nm, symbols: [] }]);
    setSelectedWatchlistIndex(watchlists.length);
    setNewWatchlistName('');
  };
  const addSymbol = () => {
    const txt = newSymbolText.trim().toUpperCase();
    if (!txt) return;
    const id = current.symbols.length
      ? current.symbols[current.symbols.length - 1].id + 1
      : 1;
    const sym = { id, symbol: txt, percentChange: '+0.00%', lastPrice: '0.00' };
    setWatchlists(prev =>
      prev.map((w,i) =>
        i === selectedWatchlistIndex
          ? { ...w, symbols: [...w.symbols, sym] }
          : w
      )
    );
    setNewSymbolText('');
    subscribe(txt);
  };
  const deleteSymbol = (symbolId: number) => {
    setWatchlists(prev =>
      prev.map((w,i) =>
        i === selectedWatchlistIndex
          ? { ...w, symbols: w.symbols.filter(s => s.id !== symbolId) }
          : w
      )
    );
    setTweetFilter('*');
  };
  const saveToFirebase = async () => {
    const auth = getAuth(), user = auth.currentUser;
    if (!user) { alert('Please log in'); return; }
    const res = await fetch('/api/watchlist/savewatchlist', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ uid:user.uid, watchlists })
    });
    alert(res.ok ? '✅ Saved' : '❌ Save failed');
  };

  // Tweets
  useEffect(() => {
    if (!current.symbols.length) { setTweetsBySymbol({}); return; }
    (async () => {
      const res = await fetch(`${srUrl}/tweets?since=0&t=${Date.now()}`);
      if (!res.ok) { setTweetsBySymbol({}); return; }
      const all: Tweet[] = await res.json();
      const bySym: Record<string, Tweet[]> = {};
      current.symbols.forEach(s => {
        bySym[s.symbol] = all
          .filter(t => t.text.includes(`$${s.symbol}`))
          .slice(-6)
          .reverse();
      });
      setTweetsBySymbol(bySym);
      setTweetFilter('*');
      setExpandedTweets(new Set());
    })();
  }, [current.symbols]);

  // TradeExchange
  useEffect(() => {
    (async () => {
      const res = await fetch(`${srUrl}/TradeExchangeGet`);
      if (!res.ok) return;
      setTradePosts(await res.json());
    })();
  }, []);

  // Initial Filings
  useEffect(() => {
    (async () => {
      const since = new Date(0).toISOString().substring(0,19);
      const res = await fetch(`${srUrl}/Filings?since=${encodeURIComponent(since)}`);
      if (!res.ok) return;
      setRawFilings(await res.json());
    })();
  }, []);

  // Filter filings
  useEffect(() => {
    const allowed = new Set(current.symbols.map(s => s.symbol));
    setFilings(
      rawFilings.filter(f =>
        f.symbol.split(',').some(sym => allowed.has(sym.trim()))
      )
    );
  }, [rawFilings, current.symbols]);

  // Helpers
  const toggleExpandTweet = (id: string) => {
    setExpandedTweets(prev => {
      const nxt = new Set(prev);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      return nxt;
    });
  };
  const toggleExpandTrade = (id: string) => {
    setExpandedTrades(prev => {
      const nxt = new Set(prev);
      nxt.has(id) ? nxt.delete(id) : nxt.add(id);
      return nxt;
    });
  };
  const linkify = (text: string) =>
    text.split(/(https?:\/\/[^\s]+)/g).map((part,i) =>
      /^https?:\/\//.test(part)
        ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline">{part}</a>
        : part
    );

  const displayedTweets = tweetFilter === '*'
    ? Object.entries(tweetsBySymbol).flatMap(([sym,arr]) => arr.map(t => ({ ...t, symbol: sym }))).slice(0,12)
    : (tweetsBySymbol[tweetFilter!] || []).map(t => ({ ...t, symbol: tweetFilter! }));

  const displayedTrades = tradePosts
    .filter(p => p.content.length >= 5)
    .slice(-6)
    .reverse();

  // Price‑Alerts API calls
  const createPriceAlert = async () => {
    if (!alertModalSymbol) return;
    try {
      const token = await getIdToken(); if (!token) return;
      const res = await fetch('/api/alerts/priceAlerts', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({
          symbol: alertModalSymbol,
          target: newAlertTarget,
          direction: newAlertDirection,
          note: newAlertNote
        })
      });
      const saved: PriceAlert = await res.json();
      setPriceAlerts(pa => [...pa, saved]);
      setNewAlertTarget(0);
      setNewAlertNote('');
    } catch(e) {
      console.error('create alert failed', e);
    }
  };
  const deletePriceAlert = async (id: string) => {
    try {
      const token = await getIdToken(); if (!token) return;
      await fetch('/api/alerts/priceAlerts', {
        method:'DELETE',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      setPriceAlerts(pa => pa.filter(a => a.id !== id));
    } catch(e) {
      console.error('delete alert failed', e);
    }
  };

  // Alert Modal
  const renderAlertModal = () => {
    if (!alertModalSymbol) return null;
    const symbolAlerts = priceAlerts.filter(a => a.symbol === alertModalSymbol);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg space-y-4 max-w-sm w-full">
          <h3 className="text-lg">🔔 Alerts for {alertModalSymbol}</h3>
          {symbolAlerts.map(a => (
            <div key={a.id} className="flex justify-between items-center">
              <span>
                {a.direction} {a.target.toFixed(2)}
                {a.note && ` – ${a.note}`}
                {a.triggered && <span className="text-green-400"> (✔️)</span>}
              </span>
              <button onClick={() => deletePriceAlert(a.id)} className="text-red-400 hover:text-red-200">✖️</button>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <input
              type="number"
              className="px-2 py-1 rounded bg-gray-700 text-white"
              value={newAlertTarget}
              onChange={e => setNewAlertTarget(parseFloat(e.target.value))}
              placeholder="Price"
            />
            <select
              className="px-2 py-1 rounded bg-gray-700 text-white"
              value={newAlertDirection}
              onChange={e => setNewAlertDirection(e.target.value as any)}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
            <input
              type="text"
              className="px-2 py-1 rounded bg-gray-700 text-white"
              value={newAlertNote}
              onChange={e => setNewAlertNote(e.target.value)}
              placeholder="Note (optional)"
            />
            <button onClick={createPriceAlert} className={btnClasses}>Add Alert</button>
          </div>
          <button onClick={() => setAlertModalSymbol(null)} className="underline text-sm">Close</button>
        </div>
      </div>
    );
  };

  // Pop‑out TradeExchange
  const openTradeExchangePopup = () => {
    const w = window.open('', 'TradeExchangeWindow', 'width=400,height=600');
    if (!w) return;
    const html = `
      <html><head><title>TradeExchange</title>
        <style>
          body{margin:0;padding:20px;background:#111;color:#eee;font-family:sans-serif}
          .card{background:#222;border:1px solid #3f3;padding:10px;margin-bottom:10px;border-radius:6px}
          .meta{font-size:0.8rem;color:#0f0;margin-bottom:4px}.content{color:#ddd}
        </style>
      </head><body>
        <h2>📣 TradeExchange Posts</h2>
        ${tradePosts.map(p => `
          <div class="card">
            <div class="meta">${new Date(p.save_time_utc).toLocaleString()} – ${p.source}</div>
            <div class="content">${p.content}</div>
          </div>
        `).join('')}
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  // Pop‑out Filings
  const openFilingsPopup = () => {
    const w = window.open('', 'FilingsWindow', 'width=400,height=600');
    if (!w) return;
    const html = `
      <html><head><title>Filings</title>
        <style>
          body{margin:0;padding:20px;background:#111;color:#eee;font-family:sans-serif}
          .card{background:#222;border:1px solid #fa0;padding:10px;margin-bottom:10px;border-radius:6px}
          .meta{font-size:0.8rem;color:#fa0;margin-bottom:4px}.content{color:#ddd}
        </style>
      </head><body>
        <h2>📄 Recent Filings</h2>
        ${filings.map(f => `
          <div class="card">
            <div class="meta">${new Date(f.save_time).toLocaleString()} – ${f.form}</div>
            <div class="content">${f.symbol}</div>
            <div><a href="${f.url}" target="_blank" style="color:#6cf;">View Document</a></div>
          </div>
        `).join('')}
      </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen relative">
      {/* Toasts */}
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {notifications.map((msg,i) => (
          <div key={i} className="bg-yellow-500 text-black px-4 py-2 rounded shadow flex justify-between items-center">
            <span>{msg}</span>
            <button onClick={() => setNotifications(n => n.filter((_,idx) => idx!==i))} className="ml-2 font-bold">×</button>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" style={{ backgroundAttachment:'fixed' }}/>
      <div className="relative z-10 max-w-7xl mx-auto p-6 space-y-8">

        {/* Logo */}
        <div className="flex justify-center"><LogoImage style={{ width:200, height:120 }}/></div>

        {/* Top Controls */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <select
            value={selectedWatchlistIndex}
            onChange={e => { setSelectedWatchlistIndex(+e.target.value); setTweetFilter('*'); }}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded"
          >
            {watchlists.map((w,i) => <option key={i} value={i}>{w.name}</option>)}
          </select>
          <input
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded"
            placeholder="New Watchlist"
            value={newWatchlistName}
            onChange={e => setNewWatchlistName(e.target.value)}
          />
          <button onClick={addWatchlist} className={btnClasses}>Add Watchlist</button>

          <input
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded"
            placeholder="Add Symbol"
            value={newSymbolText}
            onChange={e => setNewSymbolText(e.target.value)}
            onKeyDown={e => e.key==='Enter' && addSymbol()}
          />
          <button onClick={addSymbol} className={btnClasses}>Add Symbol</button>

          <button onClick={() => setTweetFilter(f => f==='*'?null:'*')} className={btnClasses}>
            {tweetFilter==='*' ? 'Hide All Tweets' : 'Show All Tweets'}
          </button>

          <button onClick={saveToFirebase} className={btnClasses}>💾 Save</button>
          <button onClick={openTradeExchangePopup} className={btnClasses}>🪟 Pop Out TradeExchange</button>
          <button onClick={openFilingsPopup} className={btnClasses}>🪟 Pop Out Filings</button>
        </div>

        {/* Quotes Table */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="px-4 py-2 border border-gray-700">Symbol</th>
                <th className="px-4 py-2 border border-gray-700">% Change</th>
                <th className="px-4 py-2 border border-gray-700">Last Price</th>
                <th className="px-4 py-2 border border-gray-700">Tweets</th>
                <th className="px-4 py-2 border border-gray-700">Alerts</th>
                <th className="px-4 py-2 border border-gray-700">Delete</th>
              </tr>
            </thead>
            <tbody>
              {current.symbols.map(s => (
                <tr key={s.id} className="hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white transition transform">
                  <td className="px-4 py-2 border border-gray-700">{s.symbol}</td>
                  <td className="px-4 py-2 border border-gray-700">{s.percentChange}</td>
                  <td className="px-4 py-2 border border-gray-700">{s.lastPrice}</td>
                  <td className="px-4 py-2 border border-gray-700 text-center">
                    <button onClick={()=>setTweetFilter(f=>f===s.symbol?'*':s.symbol)} className="text-blue-300 hover:text-white transition">
                      {tweetFilter===s.symbol?'Hide':'Show'}
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-700 text-center">
                    <button onClick={()=>setAlertModalSymbol(s.symbol)} className="text-yellow-300 hover:text-yellow-200 transition">
                      <FaBell/>
                    </button>
                  </td>
                  <td className="px-4 py-2 border border-gray-700 text-center">
                    <button onClick={()=>deleteSymbol(s.id)} className="text-red-400 hover:text-red-200 transition">
                      <FaTrash/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tweets Section */}
        {tweetFilter !== null && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center justify-center">
              <FaRegComment className="mr-2"/>
              {tweetFilter==='*' ? 'All Recent Tweets' : `Tweets for ${tweetFilter}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTweets.length > 0 ? displayedTweets.map(t => {
                const isLong = t.text.length > 200;
                const exp    = expandedTweets.has(t.id);
                return (
                  <a
                    key={t.id}
                    href={`https://twitter.com/${t.username}/status/${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 bg-opacity-60 border border-gray-600 rounded-lg p-4 shadow-lg ring-1 ring-inset ring-gray-600 transition transform hover:-translate-y-1 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/30 hover:via-cyan-400/30 hover:to-purple-500/30 hover:text-white flex flex-col"
                    style={{ minHeight:'14rem' }}
                  >
                    <div className="text-blue-300 text-sm font-medium">
                      @{t.username}
                      <span className="text-xs text-gray-400 ml-2">{new Date(t.created_at).toLocaleString()}</span>
                    </div>
                    <p className={`mt-2 text-gray-100 whitespace-pre-wrap flex-1 leading-relaxed ${!exp && isLong ? 'max-h-24 overflow-hidden' : ''}`}>
                      {linkify(t.text)}
                    </p>
                    {isLong && (
                      <button onClick={()=>toggleExpandTweet(t.id)} className="mt-2 text-blue-400 hover:text-blue-200 self-end text-sm">
                        {exp ? '⏶ Show Less' : '⏷ Show More'}
                      </button>
                    )}
                  </a>
                );
              }) : (
                <p className="col-span-full text-center text-gray-500">No tweets found.</p>
              )}
            </div>
          </div>
        )}

        {/* TradeExchange Inline (now expandable) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center justify-center">
            <FaBullhorn className="mr-2"/> Recent TradeExchange Posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedTrades.length > 0 ? displayedTrades.map(p => {
              const isLong = p.content.length > 200;
              const exp    = expandedTrades.has(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-gray-700 bg-opacity-60 border border-green-600 rounded-lg p-4 shadow-lg ring-1 ring-inset ring-green-600 transition transform hover:-translate-y-1 hover:scale-105 hover:bg-gradient-to-r hover:from-green-500/30 hover:via-lime-400/30 hover:to-green-300/30 hover:text-white flex flex-col"
                  style={{ minHeight:'14rem' }}
                >
                  <div className="text-green-300 text-sm font-medium">
                    {new Date(p.save_time_utc).toLocaleString()}
                    <span className="text-xs text-gray-400 ml-2">{p.source}</span>
                  </div>
                  <p className={`mt-2 text-gray-100 whitespace-pre-wrap flex-1 leading-relaxed ${!exp && isLong ? 'max-h-24 overflow-hidden' : ''}`}>
                    {p.content}
                  </p>
                  {isLong && (
                    <button
                      onClick={()=>toggleExpandTrade(p.id)}
                      className="mt-2 text-green-400 hover:text-green-200 self-end text-sm"
                    >
                      {exp ? '⏶ Show Less' : '⏷ Show More'}
                    </button>
                  )}
                </div>
              );
            }) : (
              <p className="col-span-full text-center text-gray-500">No TradeExchange posts.</p>
            )}
          </div>
        </div>

        {/* Filings Inline */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center justify-center">
            <FaFileAlt className="mr-2"/> Recent Filings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filings.length > 0 ? filings.map((f,i) => (
              <a
                key={i}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 bg-opacity-60 border border-yellow-600 rounded-lg p-4 shadow-lg ring-1 ring-inset ring-yellow-600 transition transform hover:-translate-y-1 hover:scale-105 hover:bg-gradient-to-r hover:from-yellow-500/30 hover:via-orange-400/30 hover:to-red-300/30 hover:text-white flex flex-col"
                style={{ minHeight:'12rem' }}
              >
                <div className="text-yellow-300 text-sm font-medium">
                  {new Date(f.save_time).toLocaleString()}
                  <span className="text-xs text-gray-400 ml-2">{f.form}</span>
                </div>
                <p className="mt-2 text-gray-100 flex-1 leading-relaxed">{f.symbol}</p>
                <span className="mt-2 text-sm text-blue-300 underline">View Document</span>
              </a>
            )) : (
              <p className="col-span-full text-center text-gray-500">No filings found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Price‑Alert Modal */}
      {renderAlertModal()}
    </div>
  );
}
