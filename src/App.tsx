import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Boxes, Send, Twitter, ShieldCheck, Zap, Activity, HelpCircle, RefreshCw } from 'lucide-react';
import { LanguageCode } from './types';
import { LANGUAGES, dictionaries } from './data/languages';
import ClockWidget from './components/ClockWidget';
import ScavengerHuntWidget from './components/ScavengerHuntWidget';
import UsernameWidget from './components/UsernameWidget';

interface TickerMessage {
  id: number;
  text: string;
  badge: string;
}

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [lang, setLang] = useState<LanguageCode>('en');
  const [btcPrice, setBtcPrice] = useState<string>('Loading...');
  const [btcColor, setBtcColor] = useState<string>('text-[#f7931a]');
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [liveStreamEvents, setLiveStreamEvents] = useState<TickerMessage[]>([
    { id: 1, text: '@aero_ghost has completed the trivia! (+$2.50)', badge: 'QUEST' },
    { id: 2, text: '@satoshi_whale registered a premium Web3 username ✨', badge: 'SPARKLE' },
    { id: 3, text: '@quantum_nomad joined the Telegram announcement feed', badge: 'COMMUNITY' },
  ]);

  const dict = dictionaries[lang];

  // Fetch real-time BTC price with dual automatic fallbacks
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        // Try Coinbase API first
        const response = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
        if (response.ok) {
          const data = await response.json();
          const parsed = parseFloat(data.data.amount);
          if (!isNaN(parsed)) {
            updatePriceState(parsed);
            return;
          }
        }
      } catch (e) {
        console.warn('Coinbase BTC fetch error, trying failback Desk API...', e);
      }

      try {
        // Try Coindesk failback API
        const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        if (response.ok) {
          const data = await response.json();
          const parsed = parseFloat(data.bpi.USD.rate_float);
          if (!isNaN(parsed)) {
            updatePriceState(parsed);
            return;
          }
        }
      } catch (err) {
        console.error('All live BTC endpoints failed', err);
        setBtcPrice('Currently Offline');
      }
    };

    const updatePriceState = (newVal: number) => {
      if (lastPrice !== null) {
        if (newVal > lastPrice) {
          setBtcColor('text-emerald-400 font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]');
        } else if (newVal < lastPrice) {
          setBtcColor('text-rose-400 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]');
        } else {
          setBtcColor('text-[#f7931a]');
        }
      }
      setLastPrice(newVal);
      setBtcPrice(`$${newVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    };

    fetchBtcPrice();
    const interval = setInterval(fetchBtcPrice, 15000);
    return () => clearInterval(interval);
  }, [lastPrice]);

  // Gentle price fluctuation simulation (realistic active movement inside standard fetch times)
  useEffect(() => {
    if (lastPrice === null) return;
    const miniInterval = setInterval(() => {
      const offset = (Math.random() - 0.5) * 1.5; // +/- $0.75
      const mockVal = lastPrice + offset;
      if (mockVal > lastPrice) {
        setBtcColor('text-emerald-400');
      } else {
        setBtcColor('text-rose-400');
      }
      setBtcPrice(`$${mockVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    }, 4000);

    return () => clearInterval(miniInterval);
  }, [lastPrice]);

  // Simulate active community live feed event notifications
  useEffect(() => {
    const prefixes = ['@neon_runner', '@crypto_sage', '@synth_hacker', '@block_staker', '@pixel_knight', '@vortex_dev', '@matrix_vixen', '@satoshi_node'];
    const actions = [
      'has solved Riddle #2! (+$1.50)',
      'completed the Scavenger Hunt level 1 successfully!',
      'just registered a Premium custom Username ✨',
      'joined @GetVerse Telegram announcement channel',
      'received the official Scavenger Hunt verification badge',
      'submitted a score to the active trivia tournament',
    ];
    const badges = ['QUEST', 'COMPLETED', 'SPARKLE', 'COMMUNITY', 'VERIFIED', 'TRIVIA'];

    const feedInterval = setInterval(() => {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomBadge = badges[Math.floor(Math.random() * badges.length)];
      const newMsg: TickerMessage = {
        id: Date.now(),
        text: `${randomPrefix} ${randomAction}`,
        badge: randomBadge,
      };

      setLiveStreamEvents((prev) => [newMsg, ...prev].slice(0, 5));
    }, 7000);

    return () => clearInterval(feedInterval);
  }, []);

  return (
    <div className="min-height-screen bg-[#06040a] text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-purple-100 relative overflow-x-hidden">
      {/* Immersive radial background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <motion.div
            key="welcome"
            id="welcome-screen"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col justify-center items-center text-center p-6 bg-[radial-gradient(circle_at_center,#1e0b36_0%,#06040a_100%)]"
          >
            {/* Background glowing particles pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.01)_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-xl flex flex-col items-center"
            >
              {/* Floating logo token */}
              <div className="h-24 w-24 rounded-3xl p-1 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(147,51,234,0.4)] mb-8 animate-pulse border border-purple-300/20">
                <img
                  src="https://i.ibb.co/YBRT9QkB/IMG-20260417-223333-555.jpg"
                  alt="Verse Hub Logo"
                  className="h-full w-full rounded-[20px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                {dict.welcome_title}
              </h1>

              <p className="text-base sm:text-lg text-purple-200/70 mb-10 max-w-lg leading-relaxed font-medium">
                {dict.welcome_sub}
              </p>

              <motion.button
                id="btn-app-start"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setHasStarted(true)}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-10 py-5 text-sm font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.4)] transition hover:shadow-[0_0_40px_rgba(147,51,234,0.7)] cursor-pointer"
              >
                <span>{dict.welcome_btn}</span>
                <Zap className="h-4 w-4 transition-transform group-hover:translate-x-1 text-yellow-300" />
              </motion.button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            id="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col pt-24"
          >
            {/* Header */}
            <header className="fixed top-0 left-0 w-full h-20 bg-[#06040a]/80 backdrop-blur-md border-b border-purple-900/20 flex items-center justify-between px-6 sm:px-[5%] z-40">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.ibb.co/YBRT9QkB/IMG-20260417-223333-555.jpg"
                  alt="Verse Hub logo"
                  className="h-10 w-10 rounded-xl object-cover border border-purple-500/30 shadow-[0_0_12px_rgba(147,51,234,0.3)] hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="font-extrabold text-white text-lg tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
                  {dict.logo_name}
                </span>
              </div>

              {/* Centered Ticker with Live BTC rate */}
              <div className="hidden md:flex items-center justify-center max-w-sm flex-1 mx-4 bg-slate-950/40 border border-purple-900/10 px-5 py-2.5 rounded-full backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                    {dict.btc_label}
                  </span>
                  <span className={`font-mono text-xs font-bold transition-all duration-300 ${btcColor}`}>
                    {btcPrice}
                  </span>
                </div>
              </div>

              {/* Language selection with custom select box style */}
              <div className="flex items-center gap-3">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LanguageCode)}
                  className="bg-slate-950/90 border border-purple-900/40 hover:border-purple-500 text-slate-100 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer transition shadow"
                >
                  {Object.entries(LANGUAGES).map(([code, config]) => (
                    <option key={code} value={code} className="bg-slate-950 text-slate-100 text-xs font-bold">
                      {config.flag} {config.label}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            {/* Main grid */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch content-start">
              {/* Responsive Ticker for Mobile device */}
              <div className="md:hidden flex items-center justify-between bg-slate-950/40 border border-purple-900/20 px-5 py-4 rounded-3xl backdrop-blur mb-2">
                <span className="font-sans text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-widest leading-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                  {dict.btc_label}
                </span>
                <span className={`font-mono text-sm font-bold transition-all duration-300 ${btcColor} leading-none`}>
                  {btcPrice}
                </span>
              </div>

              {/* Clock Widget */}
              <ClockWidget dict={dict} />

              {/* Scavenger Hunt Widget with Trivia Quest Integration */}
              <ScavengerHuntWidget dict={dict} />

              {/* Username Generator Widget */}
              <UsernameWidget dict={dict} />
            </main>

            {/* Broadcast feed strip */}
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 mb-10">
              <div className="rounded-3xl border border-purple-900/20 bg-slate-950/30 p-6 backdrop-blur">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-4 w-4 text-purple-400 animate-pulse" />
                  <span className="text-xs font-bold tracking-widest text-purple-300 uppercase font-mono">
                    {dict.activity_header}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {liveStreamEvents.slice(0, 3).map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 rounded-2xl bg-purple-950/10 border border-purple-900/10 p-3 text-xs"
                    >
                      <span className="rounded-md bg-purple-900/30 px-2 py-0.5 text-[9px] font-bold text-purple-200 border border-purple-500/10 tracking-wider">
                        {event.badge}
                      </span>
                      <span className="text-slate-300 font-medium font-mono leading-normal">
                        {event.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-purple-900/20 bg-[#030205] py-10 px-6 mt-auto">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="text-sm font-bold text-slate-400 font-sans tracking-wide">
                    {dict.credits_by} <span className="text-[#c084fc] font-extrabold">@smith007r</span>
                  </span>
                  <span className="mt-1.5 text-xs text-purple-300/80 bg-purple-950/25 px-4 py-1.5 rounded-full border border-purple-500/10 font-bold tracking-wide">
                    {dict.mentor_title} JT (<span className="text-purple-400">@stone_brb</span>)
                  </span>
                </div>

                {/* Social links */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://t.me/GetVerse/177601"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-900/20 hover:border-purple-400 text-purple-300 hover:text-white transition duration-300 cursor-pointer text-xs font-bold"
                  >
                    <Send className="h-4 w-4" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href="https://x.com/VerseEcosystem"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-900/20 hover:border-purple-400 text-purple-300 hover:text-white transition duration-300 cursor-pointer text-xs font-bold"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>@VerseEcosystem</span>
                  </a>
                  <a
                    href="https://x.com/BitcoinCom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/30 border border-purple-900/20 hover:border-emerald-500/50 text-purple-300 hover:text-white transition duration-300 cursor-pointer text-xs font-bold"
                  >
                    <Twitter className="h-4 w-4 text-[#fa9e1b]" />
                    <span>Follow @Bitcoin.com</span>
                  </a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
