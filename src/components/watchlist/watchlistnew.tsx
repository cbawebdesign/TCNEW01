// pages/watchlist.tsx
import React, { useState, useEffect } from 'react';
import LogoImage from '~/core/ui/Logo/LogoImage';
import { FaFlag, FaSave, FaTag, FaTrash } from 'react-icons/fa';

/** Each symbol’s data in a watchlist */
interface WatchlistSymbol {
  id: number;
  symbol: string;
  percentChange: string;
  lastPrice: string;

  // Press Release
  pressName: string;
  pressAccount: string;
  pressDateTime: string;
  pressHeadline: string;

  // Tweets
  tweetName: string;
  tweetAccount: string;
  tweetDateTime: string;
  tweetContent: string;

  // Trade Exchange
  tradeDateTime: string;
  tradeMessage: string;

  // Filings
  filingsDateTime: string;
  filingsForm: string;
  filingsNotes: string;

  // Additional flags
  flag: boolean;
  save: boolean;
  tag: boolean;
}

/** A watchlist has a name and an array of symbols */
interface Watchlist {
  name: string;
  symbols: WatchlistSymbol[];
}

/** For the bottom Press Release Template that spans full width */
interface BottomPressRelease {
  id: number;
  symbol: string;
  companyTitle: string;
  timeStamp: string;
  headline: string;
  flag: boolean;
  save: boolean;
  tag: boolean;
}

export default function WatchlistPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Master list of watchlists
  const [watchlists, setWatchlists] = useState<Watchlist[]>([
    {
      name: 'Watchlist 1',
      symbols: [
        {
          id: 1,
          symbol: 'AAPL',
          percentChange: '+2.3%',
          lastPrice: '238.59',
          pressName: '',
          pressAccount: '',
          pressDateTime: '',
          pressHeadline: '',
          tweetName: '',
          tweetAccount: '',
          tweetDateTime: '',
          tweetContent: '',
          tradeDateTime: '',
          tradeMessage: '',
          filingsDateTime: '',
          filingsForm: '',
          filingsNotes: '',
          flag: false,
          save: false,
          tag: false,
        },
        {
          id: 2,
          symbol: 'MSTR',
          percentChange: '+5.9%',
          lastPrice: '362.37',
          pressName: '',
          pressAccount: '',
          pressDateTime: '',
          pressHeadline: '',
          tweetName: '',
          tweetAccount: '',
          tweetDateTime: '',
          tweetContent: '',
          tradeDateTime: '',
          tradeMessage: '',
          filingsDateTime: '',
          filingsForm: '',
          filingsNotes: '',
          flag: false,
          save: false,
          tag: false,
        },
      ],
    },
    {
      name: 'Watchlist 2',
      symbols: [
        {
          id: 1,
          symbol: 'TSLA',
          percentChange: '+3.4%',
          lastPrice: '215.65',
          pressName: '',
          pressAccount: '',
          pressDateTime: '',
          pressHeadline: '',
          tweetName: '',
          tweetAccount: '',
          tweetDateTime: '',
          tweetContent: '',
          tradeDateTime: '',
          tradeMessage: '',
          filingsDateTime: '',
          filingsForm: '',
          filingsNotes: '',
          flag: false,
          save: false,
          tag: false,
        },
      ],
    },
  ]);
  const [selectedWatchlistIndex, setSelectedWatchlistIndex] = useState(0);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newSymbolText, setNewSymbolText] = useState('');

  // Track which symbol is selected
  const [selectedSymbolId, setSelectedSymbolId] = useState<number | null>(null);

  // "Press Release Template" at the bottom
  const [bottomPressReleases, setBottomPressReleases] = useState<BottomPressRelease[]>([
    {
      id: 1,
      symbol: 'GOOG',
      companyTitle: 'Alphabet Inc.',
      timeStamp: '10:30 AM',
      headline: 'Press Release Headline 1',
      flag: false,
      save: false,
      tag: false,
    },
    {
      id: 2,
      symbol: 'AMZN',
      companyTitle: 'Amazon.com Inc.',
      timeStamp: '11:45 AM',
      headline: 'Press Release Headline 2',
      flag: true,
      save: false,
      tag: true,
    },
  ]);

  useEffect(() => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(darkMode ? 'dark' : 'light');
  }, []);

  const currentWatchlist = watchlists[selectedWatchlistIndex];

  // Auto-select first symbol if available when watchlist changes
  useEffect(() => {
    if (currentWatchlist && currentWatchlist.symbols.length > 0) {
      setSelectedSymbolId(currentWatchlist.symbols[0].id);
    } else {
      setSelectedSymbolId(null);
    }
  }, [selectedWatchlistIndex, currentWatchlist]);

  /***************************************************
   * WATCHLIST ACTIONS
   ***************************************************/
  const handleAddWatchlist = () => {
    const trimmed = newWatchlistName.trim();
    if (!trimmed) return;
    const newWL: Watchlist = { name: trimmed, symbols: [] };
    setWatchlists((prev) => [...prev, newWL]);
    setSelectedWatchlistIndex(watchlists.length);
    setNewWatchlistName('');
    setSelectedSymbolId(null);
  };

  const handleDeleteWatchlist = () => {
    if (watchlists.length === 1) return;
    setWatchlists((prev) =>
      prev.filter((_, i) => i !== selectedWatchlistIndex)
    );
    setSelectedWatchlistIndex(0);
    setSelectedSymbolId(null);
  };

  /***************************************************
   * SYMBOL ACTIONS
   ***************************************************/
  const handleAddSymbol = () => {
    if (!newSymbolText.trim() || !currentWatchlist) return;
    const newId = currentWatchlist.symbols.length
      ? currentWatchlist.symbols[currentWatchlist.symbols.length - 1].id + 1
      : 1;
    const newSymbol: WatchlistSymbol = {
      id: newId,
      symbol: newSymbolText.toUpperCase(),
      percentChange: '+0.0%',
      lastPrice: '0.00',
      pressName: '',
      pressAccount: '',
      pressDateTime: '',
      pressHeadline: '',
      tweetName: '',
      tweetAccount: '',
      tweetDateTime: '',
      tweetContent: '',
      tradeDateTime: '',
      tradeMessage: '',
      filingsDateTime: '',
      filingsForm: '',
      filingsNotes: '',
      flag: false,
      save: false,
      tag: false,
    };
    const updatedWL = {
      ...currentWatchlist,
      symbols: [...currentWatchlist.symbols, newSymbol],
    };
    setWatchlists((prev) =>
      prev.map((wl, i) => (i === selectedWatchlistIndex ? updatedWL : wl))
    );
    setNewSymbolText('');
    setSelectedSymbolId(newId);
  };

  const handleDeleteSymbol = (symbolId: number) => {
    if (!currentWatchlist) return;
    const updatedSymbols = currentWatchlist.symbols.filter(
      (s) => s.id !== symbolId
    );
    const updatedWL = { ...currentWatchlist, symbols: updatedSymbols };
    setWatchlists((prev) =>
      prev.map((wl, i) => (i === selectedWatchlistIndex ? updatedWL : wl))
    );
    if (symbolId === selectedSymbolId) {
      if (updatedSymbols.length > 0) {
        setSelectedSymbolId(updatedSymbols[0].id);
      } else {
        setSelectedSymbolId(null);
      }
    }
  };

  const toggleSymbolField = (
    symbolId: number,
    field: keyof Pick<WatchlistSymbol, 'flag' | 'save' | 'tag'>
  ) => {
    if (!currentWatchlist) return;
    const updatedSymbols = currentWatchlist.symbols.map((sym) =>
      sym.id === symbolId ? { ...sym, [field]: !sym[field] } : sym
    );
    const updatedWL = { ...currentWatchlist, symbols: updatedSymbols };
    setWatchlists((prev) =>
      prev.map((wl, i) => (i === selectedWatchlistIndex ? updatedWL : wl))
    );
  };

  const updateSymbolField = (
    symbolId: number,
    field: keyof WatchlistSymbol,
    newValue: string
  ) => {
    if (!currentWatchlist) return;
    const updatedSymbols = currentWatchlist.symbols.map((sym) =>
      sym.id === symbolId ? { ...sym, [field]: newValue } : sym
    );
    const updatedWL = { ...currentWatchlist, symbols: updatedSymbols };
    setWatchlists((prev) =>
      prev.map((wl, i) => (i === selectedWatchlistIndex ? updatedWL : wl))
    );
  };

  const selectedSymbol =
    currentWatchlist?.symbols.find((s) => s.id === selectedSymbolId) || null;

  /***************************************************
   * BOTTOM PRESS RELEASES ACTIONS
   ***************************************************/
  const toggleBottomPRField = (
    id: number,
    field: keyof Pick<BottomPressRelease, 'flag' | 'save' | 'tag'>
  ) => {
    setBottomPressReleases((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  const handleDeleteBottomPR = (id: number) => {
    setBottomPressReleases((prev) => prev.filter((item) => item.id !== id));
  };

  if (!currentWatchlist) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          theme === 'dark'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <p>No watchlists available.</p>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-screen text-base ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {/* Gradient Background */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
            : 'bg-gradient-to-br from-blue-50 via-blue-100 to-purple-200'
        } z-0`}
        style={{ backgroundAttachment: 'fixed' }}
      />

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-4">
        {/* Centered Logo */}
        <div className="flex justify-center">
          <LogoImage style={{ width: '200px', height: '120px' }} />
        </div>

        {/* Top Bar */}
        <div className="flex flex-wrap items-center space-x-3">
          <h1 className="text-3xl font-extrabold">Top Ranked</h1>
          <select
            value={selectedWatchlistIndex}
            onChange={(e) => {
              setSelectedWatchlistIndex(Number(e.target.value));
            }}
            className={`text-sm px-3 py-2 border rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
          >
            {watchlists.map((wl, index) => (
              <option key={index} value={index}>
                {wl.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New watchlist name"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            className={`text-sm px-3 py-2 border rounded-lg ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-600'
                : 'bg-white text-gray-800 border-gray-300'
            }`}
            style={{ width: '180px' }}
          />
          <button
            onClick={handleAddWatchlist}
            className="text-sm px-3 py-2 bg-blue-600 text-white rounded shadow hover:scale-105 transition transform"
          >
            New
          </button>
          <button
            onClick={handleDeleteWatchlist}
            className="text-sm px-3 py-2 bg-red-600 text-white rounded shadow hover:scale-105 transition transform"
          >
            Delete
          </button>
          <div className="flex items-center space-x-2 ml-4">
            <input
              type="text"
              placeholder="Add Symbol"
              value={newSymbolText}
              onChange={(e) => setNewSymbolText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddSymbol();
                }
              }}
              className={`text-sm px-3 py-2 border rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white border-gray-600'
                  : 'bg-white text-gray-800 border-gray-300'
              }`}
              style={{ width: '120px' }}
            />
            <button
              onClick={handleAddSymbol}
              className="text-sm px-3 py-2 bg-green-600 text-white rounded shadow hover:scale-105 transition transform"
            >
              Add
            </button>
          </div>
        </div>

        {/* Main Content: left table, right detail panel */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT: Symbol Table */}
          <div className="bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-lg p-4 overflow-x-auto">
            <h2 className="text-base font-bold mb-3">{currentWatchlist.name}</h2>
            <table className="w-full border-collapse text-base">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2">Symbol</th>
                  <th className="px-3 py-2">% Ch</th>
                  <th className="px-3 py-2">Last</th>
                </tr>
              </thead>
              <tbody>
                {currentWatchlist.symbols.map((sym) => (
                  <tr
                    key={sym.id}
                    className="cursor-pointer transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white"
                    onClick={() => setSelectedSymbolId(sym.id)}
                  >
                    <td className="px-3 py-2 font-medium">{sym.symbol}</td>
                    <td className="px-3 py-2">{sym.percentChange}</td>
                    <td className="px-3 py-2">{sym.lastPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT: Detail Panel for Selected Symbol */}
          <div className="bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-lg p-4 overflow-x-auto">
            {selectedSymbol ? (
              <div className="space-y-6">
                {/* 1) Press Release Window */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Press Release</h3>
                    <div className="flex items-center space-x-3">
                      <FaFlag
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'flag')
                        }
                      />
                      <FaSave
                        size={25}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'save')
                        }
                      />
                      <FaTag
                        size={25}
                        className="cursor-pointer text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'tag')
                        }
                      />
                      <FaTrash
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSymbol(selectedSymbol.id)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Name"
                        value={selectedSymbol.pressName}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'pressName',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Account
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Account"
                        value={selectedSymbol.pressAccount}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'pressAccount',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Date &amp; Time
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="MM/DD/YYYY HH:MM"
                        value={selectedSymbol.pressDateTime}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'pressDateTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Headline
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Headline linked to URL"
                        value={selectedSymbol.pressHeadline}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'pressHeadline',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 2) Tweets Window */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Tweets</h3>
                    <div className="flex items-center space-x-3">
                      <FaFlag
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'flag')
                        }
                      />
                      <FaSave
                        size={25}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'save')
                        }
                      />
                      <FaTag
                        size={25}
                        className="cursor-pointer text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'tag')
                        }
                      />
                      <FaTrash
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSymbol(selectedSymbol.id)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Name"
                        value={selectedSymbol.tweetName}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tweetName',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Account
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Account"
                        value={selectedSymbol.tweetAccount}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tweetAccount',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Date &amp; Time
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="MM/DD/YYYY HH:MM"
                        value={selectedSymbol.tweetDateTime}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tweetDateTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Tweet Content
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Tweet content"
                        value={selectedSymbol.tweetContent}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tweetContent',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 3) Trade Exchange Window */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">
                      Trade Exchange Template
                    </h3>
                    <div className="flex items-center space-x-3">
                      <FaFlag
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'flag')
                        }
                      />
                      <FaSave
                        size={25}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'save')
                        }
                      />
                      <FaTag
                        size={25}
                        className="cursor-pointer text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'tag')
                        }
                      />
                      <FaTrash
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSymbol(selectedSymbol.id)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Date &amp; Time
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="MM/DD/YYYY HH:MM"
                        value={selectedSymbol.tradeDateTime}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tradeDateTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Trade Exchange Message
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Trade Exchange message"
                        value={selectedSymbol.tradeMessage}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'tradeMessage',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* 4) Filings Window */}
                <div className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Filings Template</h3>
                    <div className="flex items-center space-x-3">
                      <FaFlag
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'flag')
                        }
                      />
                      <FaSave
                        size={25}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'save')
                        }
                      />
                      <FaTag
                        size={25}
                        className="cursor-pointer text-purple-500 hover:text-purple-700"
                        onClick={() =>
                          toggleSymbolField(selectedSymbol.id, 'tag')
                        }
                      />
                      <FaTrash
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteSymbol(selectedSymbol.id)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Date &amp; Time
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="MM/DD/YYYY HH:MM"
                        value={selectedSymbol.filingsDateTime}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'filingsDateTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        Form
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Filing Form"
                        value={selectedSymbol.filingsForm}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'filingsForm',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-300">
                        User Saved Notes
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-2 py-2 dark:bg-gray-800"
                        placeholder="Let user type here"
                        value={selectedSymbol.filingsNotes}
                        onChange={(e) =>
                          updateSymbolField(
                            selectedSymbol.id,
                            'filingsNotes',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-base text-gray-500 dark:text-gray-300">
                No symbol selected.
              </div>
            )}
          </div>
        </div>

        {/* VERY BOTTOM: Press Release Template spanning full width */}
        <div className="mt-8 bg-opacity-70 rounded-xl shadow-2xl backdrop-blur-lg p-4 w-full">
          <h2 className="text-lg font-bold mb-3">
            Press Release Template (Bottom)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-base">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">Symbol</th>
                  <th className="px-3 py-2 text-left">Company Title</th>
                  <th className="px-3 py-2 text-left">Time Stamp</th>
                  <th className="px-3 py-2 text-left">Headline</th>
                  <th className="px-3 py-2 text-left">Flag</th>
                  <th className="px-3 py-2 text-left">Save</th>
                  <th className="px-3 py-2 text-left">Tag</th>
                  <th className="px-3 py-2 text-left">Del</th>
                </tr>
              </thead>
              <tbody>
                {bottomPressReleases.map((pr) => (
                  <tr
                    key={pr.id}
                    className="border-b transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white"
                  >
                    <td className="px-3 py-2">{pr.symbol}</td>
                    <td className="px-3 py-2">{pr.companyTitle}</td>
                    <td className="px-3 py-2">{pr.timeStamp}</td>
                    <td className="px-3 py-2">{pr.headline}</td>
                    <td className="px-3 py-2">
                      <FaFlag
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => toggleBottomPRField(pr.id, 'flag')}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FaSave
                        size={25}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                        onClick={() => toggleBottomPRField(pr.id, 'save')}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FaTag
                        size={25}
                        className="cursor-pointer text-purple-500 hover:text-purple-700"
                        onClick={() => toggleBottomPRField(pr.id, 'tag')}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <FaTrash
                        size={25}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteBottomPR(pr.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
