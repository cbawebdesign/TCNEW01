// pages/alerts.tsx
import React, { useState, useEffect } from 'react';
import LogoImage from '~/core/ui/Logo/LogoImage';
import { FaFlag, FaSave, FaTag, FaTrash, FaRegComment } from 'react-icons/fa';

export default function AlertsPage() {
  // THEME: default to dark
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    // Optionally detect system preference:
    // const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // setTheme(darkMode ? 'dark' : 'light');
  }, []);

  /***************************************************
   * TOP TABLE STATE
   ***************************************************/
  // Example values for the main table (MSTR & RGTI data)
  const [symbol1, setSymbol1] = useState('MSTR');
  const [percent1, setPercent1] = useState('+5.9%');
  const [last1, setLast1] = useState('362.37');

  const [symbol2, setSymbol2] = useState('RGTI');
  const [percent2, setPercent2] = useState('+21.5%');
  const [last2, setLast2] = useState('10.87');

  // Template details
  const [pr3, setPr3] = useState('');
  const [pr2, setPr2] = useState('');
  const [filings2, setFilings2] = useState('');
  const [trade2, setTrade2] = useState('');
  const [rg11, setRg11] = useState('');
  const [tweetName, setTweetName] = useState('');
  const [tweetAccount, setTweetAccount] = useState('');
  const [tweetDateTime, setTweetDateTime] = useState('');
  const [tweetContent, setTweetContent] = useState('');
  const [customNote, setCustomNote] = useState('');
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n');
    if (lines.length <= 2) {
      setCustomNote(e.target.value);
    }
  };

  /***************************************************
   * LOWER SECTION STATE
   ***************************************************/
  // These fields are for the lower section (row 8) that spans the full width.
  // The desired header for this lower section is: "#", "Upper", "Lower", "Watchlists", [Flag Icon], "RGTI", "Rigetti Computing"
  const [upperVal, setUpperVal] = useState('15.00');
  const [lowerVal, setLowerVal] = useState('10.00');
  const [watchlists, setWatchlists] = useState('Top Ranked\nSwing Short');
  // Added state for rgtiname (and its setter) to fix the error.
  const [rgtiname, setRgtiname] = useState('RGTI');
  const [rigetti, setRigetti] = useState('Rigetti Computing');

  /***************************************************
   * ALERTS WINDOWS (Bottom Section)
   ***************************************************/
  interface PressReleaseAlert {
    id: number;
    symbol: string;
    companyTitle: string;
    timeStamp: string;
    message: string;
    flag: boolean;
    save: boolean;
    tag: boolean;
    del: boolean;
  }
  const [pressReleaseAlerts] = useState<PressReleaseAlert[]>(
    Array.from({ length: 4 }, (_, i) => ({
      id: i + 1,
      symbol: 'Symbol',
      companyTitle: 'Company Title',
      timeStamp: 'Time Stamp',
      message: 'Message',
      flag: false,
      save: false,
      tag: false,
      del: false,
    }))
  );

  interface FilingsAlert {
    id: number;
    symbol: string;
    companyTitle: string;
    timeStamp: string;
    filingForm: string;
    userNotes: string;
    flag: boolean;
    save: boolean;
    tag: boolean;
    note: boolean;
    del: boolean;
  }
  const [filingsAlerts] = useState<FilingsAlert[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      symbol: 'Symbol',
      companyTitle: 'Company Title',
      timeStamp: 'Time Stamp',
      filingForm: 'Filing Form',
      userNotes: 'User Notes',
      flag: false,
      save: false,
      tag: false,
      note: false,
      del: false,
    }))
  );

  interface TradeExchangeAlert {
    id: number;
    symbol: string;
    companyTitle: string;
    timeStamp: string;
    message: string;
    flag: boolean;
    save: boolean;
    tag: boolean;
    del: boolean;
  }
  const [tradeExchangeAlerts] = useState<TradeExchangeAlert[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      symbol: 'Symbol',
      companyTitle: 'Company Title',
      timeStamp: 'Time Stamp',
      message: 'Trade Exchange Message',
      flag: false,
      save: false,
      tag: false,
      del: false,
    }))
  );

  return (
    <div
      className={`${
        theme === 'dark' ? 'bg-black text-gray-200' : 'bg-white text-black'
      } min-h-screen relative`}
    >
      {/* Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0"
        style={{ backgroundAttachment: 'fixed' }}
      ></div>
      
      <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Centered Logo at the Top */}
        <div className="flex justify-center">
          <LogoImage style={{ width: '200px', height: '120px' }} />
        </div>

        {/* TOP TABLE (Main Section) */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-blue-300">
              <tr>
                <th className="border border-gray-700 p-2 w-20">Symb</th>
                <th className="border border-gray-700 p-2 w-20">% Ch</th>
                <th className="border border-gray-700 p-2 w-20">Last</th>
                <th className="border border-gray-700 p-2">Description / Template</th>
              </tr>
            </thead>
            <tbody>
              {/* Row for Press Release Template (3) */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-yellow-400 font-bold">{symbol1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{percent1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{last1}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">
                    Press Release Template - Stock News Window (3)
                  </span>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="Headline / Date & Time"
                      value={pr3}
                      onChange={(e) => setPr3(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              {/* Row for Press Release Template (2) */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-yellow-400">{symbol1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{percent1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{last1}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">
                    Press Release Template - Stock News Window (2)
                  </span>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="Another Press Release..."
                      value={pr2}
                      onChange={(e) => setPr2(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              {/* Row for Filings Template (2) */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-yellow-400">{symbol1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{percent1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{last1}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">
                    Filings Template - Stock News Window (2)
                  </span>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="Filings content..."
                      value={filings2}
                      onChange={(e) => setFilings2(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              {/* Row for Trade Exchange Template (2) */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-yellow-400">{symbol1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{percent1}</td>
                <td className="border border-gray-700 p-1 text-yellow-400">{last1}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">
                    Trade Exchange Template - Stock News Window (2)
                  </span>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="Trade Exchange content..."
                      value={trade2}
                      onChange={(e) => setTrade2(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              {/* Row for RG11 / Right Computing */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-purple-300">{symbol2}</td>
                <td className="border border-gray-700 p-1 text-purple-300">{percent2}</td>
                <td className="border border-gray-700 p-1 text-purple-300">{last2}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">RG11 / Right Computing</span>
                  <div className="mt-1">
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="RG11 details..."
                      value={rg11}
                      onChange={(e) => setRg11(e.target.value)}
                    />
                  </div>
                </td>
              </tr>
              {/* Row for Tweets */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-purple-300">{symbol2}</td>
                <td className="border border-gray-700 p-1 text-purple-300">{percent2}</td>
                <td className="border border-gray-700 p-1 text-purple-300">{last2}</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">Tweets - Stock News Window (3)</span>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-400 block">Name</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 p-1"
                        placeholder="Tweet name"
                        value={tweetName}
                        onChange={(e) => setTweetName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block">Account</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 p-1"
                        placeholder="Tweet account"
                        value={tweetAccount}
                        onChange={(e) => setTweetAccount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block">Date &amp; Time</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 p-1"
                        placeholder="MM/DD HH:mm"
                        value={tweetDateTime}
                        onChange={(e) => setTweetDateTime(e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs text-gray-400 block">Tweet Content</label>
                      <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-600 p-1"
                        placeholder="Tweet content..."
                        value={tweetContent}
                        onChange={(e) => setTweetContent(e.target.value)}
                      />
                    </div>
                  </div>
                </td>
              </tr>
              {/* Row for Custom Note */}
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-1 text-gray-400">--</td>
                <td className="border border-gray-700 p-1 text-gray-400">--</td>
                <td className="border border-gray-700 p-1 text-gray-400">--</td>
                <td className="border border-gray-700 p-1">
                  <span className="font-bold">Custom Note (2 lines max)</span>
                  <div className="mt-1">
                    <textarea
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-600 p-1"
                      placeholder="Type a quick note..."
                      value={customNote}
                      onChange={handleNoteChange}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LOWER SECTION: Separate Table with 7 Columns */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-blue-300">
              <tr>
                <th className="border border-gray-700 p-2 w-8">#</th>
                <th className="border border-gray-700 p-2">Upper</th>
                <th className="border border-gray-700 p-2">Lower</th>
                <th className="border border-gray-700 p-2">Watchlists</th>
                <th className="border border-gray-700 p-2">
                  <FaFlag size={20} />
                </th>
                <th className="border border-gray-700 p-2">RGTI</th>
                <th className="border border-gray-700 p-2">Rigetti Computing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-2 text-center">8</td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={upperVal}
                    onChange={(e) => setUpperVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={lowerVal}
                    onChange={(e) => setLowerVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <textarea
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={watchlists}
                    onChange={(e) => setWatchlists(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rgtiname}
                    onChange={(e) => setRgtiname(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rigetti}
                    onChange={(e) => setRigetti(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM ALERTS WINDOWS */}
        <div className="space-y-6">
          {/* Press Release Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Press Release Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Press Release (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pressReleaseAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1" colSpan={3}>{item.message}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Filings Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Filings Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Filings (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filingsAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaRegComment size={20} className="cursor-pointer text-orange-500 hover:text-orange-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1">{item.filingForm}</td>
                        <td className="border border-gray-700 p-1">{item.userNotes}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Exchange Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Trade Exchange Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Trade Exchange (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tradeExchangeAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">Time Stamp</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-center font-bold text-blue-300" colSpan={3}>
                          Trade Exchange Message
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Separate Table with 7 Columns */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-blue-300">
              <tr>
                <th className="border border-gray-700 p-2 w-8">#</th>
                <th className="border border-gray-700 p-2">Upper</th>
                <th className="border border-gray-700 p-2">Lower</th>
                <th className="border border-gray-700 p-2">Watchlists</th>
                <th className="border border-gray-700 p-2">
                  <FaFlag size={20} />
                </th>
                <th className="border border-gray-700 p-2">RGTI</th>
                <th className="border border-gray-700 p-2">Rigetti Computing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-2 text-center">8</td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={upperVal}
                    onChange={(e) => setUpperVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={lowerVal}
                    onChange={(e) => setLowerVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <textarea
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={watchlists}
                    onChange={(e) => setWatchlists(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rgtiname}
                    onChange={(e) => setRgtiname(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rigetti}
                    onChange={(e) => setRigetti(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM ALERTS WINDOWS */}
        <div className="space-y-6">
          {/* Press Release Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Press Release Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Press Release (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pressReleaseAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1" colSpan={3}>{item.message}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Filings Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Filings Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Filings (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filingsAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaRegComment size={20} className="cursor-pointer text-orange-500 hover:text-orange-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1">{item.filingForm}</td>
                        <td className="border border-gray-700 p-1">{item.userNotes}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Exchange Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Trade Exchange Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Trade Exchange (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tradeExchangeAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">Time Stamp</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-center font-bold text-blue-300" colSpan={3}>
                          Trade Exchange Message
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Separate Table with 7 Columns */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-blue-300">
              <tr>
                <th className="border border-gray-700 p-2 w-8">#</th>
                <th className="border border-gray-700 p-2">Upper</th>
                <th className="border border-gray-700 p-2">Lower</th>
                <th className="border border-gray-700 p-2">Watchlists</th>
                <th className="border border-gray-700 p-2">
                  <FaFlag size={20} />
                </th>
                <th className="border border-gray-700 p-2">RGTI</th>
                <th className="border border-gray-700 p-2">Rigetti Computing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-2 text-center">8</td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={upperVal}
                    onChange={(e) => setUpperVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={lowerVal}
                    onChange={(e) => setLowerVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <textarea
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={watchlists}
                    onChange={(e) => setWatchlists(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rgtiname}
                    onChange={(e) => setRgtiname(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rigetti}
                    onChange={(e) => setRigetti(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM ALERTS WINDOWS */}
        <div className="space-y-6">
          {/* Press Release Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Press Release Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Press Release (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pressReleaseAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1" colSpan={3}>{item.message}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Filings Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Filings Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Filings (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filingsAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaRegComment size={20} className="cursor-pointer text-orange-500 hover:text-orange-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">{item.timeStamp}</td>
                        <td className="border border-gray-700 p-1">{item.filingForm}</td>
                        <td className="border border-gray-700 p-1">{item.userNotes}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Trade Exchange Alerts Window */}
          <div
            className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700"
            style={{ boxShadow: '0 10px 15px -3px rgba(0,0,0,0.7), 0 4px 6px -2px rgba(0,0,0,0.5)' }}
          >
            <h2 className="text-xl font-semibold mb-3 text-blue-400 border-b border-gray-700 pb-2">
              Trade Exchange Template - Alerts Window
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm text-gray-300">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="border border-gray-700 p-2 text-left font-bold text-blue-300" colSpan={3}>
                      Trade Exchange (Alerts)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tradeExchangeAlerts.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 w-1/4 text-yellow-400">{item.symbol}</td>
                        <td className="border border-gray-700 p-1 w-2/4">{item.companyTitle}</td>
                        <td className="border border-gray-700 p-1 text-right w-1/4">
                          <div className="flex items-center space-x-2">
                            <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                            <FaSave size={20} className="cursor-pointer text-green-500 hover:text-green-700" />
                            <FaTag size={20} className="cursor-pointer text-purple-500 hover:text-purple-700" />
                            <FaTrash size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                          </div>
                        </td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-gray-400">Time Stamp</td>
                        <td className="border border-gray-700 p-1" colSpan={2}></td>
                      </tr>
                      <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                        <td className="border border-gray-700 p-1 text-center font-bold text-blue-300" colSpan={3}>
                          Trade Exchange Message
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Separate Table with 7 Columns */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-4 border border-gray-700 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-blue-300">
              <tr>
                <th className="border border-gray-700 p-2 w-8">#</th>
                <th className="border border-gray-700 p-2">Upper</th>
                <th className="border border-gray-700 p-2">Lower</th>
                <th className="border border-gray-700 p-2">Watchlists</th>
                <th className="border border-gray-700 p-2">
                  <FaFlag size={20} />
                </th>
                <th className="border border-gray-700 p-2">RGTI</th>
                <th className="border border-gray-700 p-2">Rigetti Computing</th>
              </tr>
            </thead>
            <tbody>
              <tr className="transition duration-200 hover:bg-gradient-to-r hover:from-blue-500 hover:via-cyan-500 hover:to-purple-500 hover:text-white">
                <td className="border border-gray-700 p-2 text-center">8</td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={upperVal}
                    onChange={(e) => setUpperVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={lowerVal}
                    onChange={(e) => setLowerVal(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <textarea
                    rows={2}
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={watchlists}
                    onChange={(e) => setWatchlists(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  <FaFlag size={20} className="cursor-pointer text-red-500 hover:text-red-700" />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rgtiname}
                    onChange={(e) => setRgtiname(e.target.value)}
                  />
                </td>
                <td className="border border-gray-700 p-2">
                  <input
                    type="text"
                    className="w-full bg-gray-800 border border-gray-600 p-1"
                    value={rigetti}
                    onChange={(e) => setRigetti(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
