import { useState, useEffect, ChangeEvent } from 'react';
import { User, ShieldCheck, ShieldAlert, Sparkles, Dice5, Copy, Check, Send } from 'lucide-react';
import { Dictionary } from '../types';

interface UsernameWidgetProps {
  dict: Dictionary;
}

const GENERATOR_THEMES = {
  cyber: {
    prefixes: ['Aero', 'Neon', 'Cyber', 'Synth', 'Glitch', 'Byte', 'Grid', 'Static', 'Retro', 'Vector', 'Quantum', 'Cipher', 'Matrix', 'Tokyo'],
    suffixes: ['Runner', 'Phantom', 'Vixen', 'Scribe', 'Hacker', 'Rogue', 'Ghost', 'Driver', 'Nomad', 'Wire', 'Code', 'Punk', 'Core', 'Flux'],
  },
  crypto: {
    prefixes: ['Satoshi', 'Block', 'Gas', 'Hash', 'Ether', 'Crypto', 'Token', 'Yield', 'Gwei', 'Ledger', 'Node', 'Miner', 'Whale', 'Validator'],
    suffixes: ['Whale', 'Gwei', 'Validator', 'Master', 'Node', 'Staker', 'Trader', 'HODLer', 'King', 'Sage', 'Broker', 'DeFi', 'Swap', 'Protocol'],
  },
  gaming: {
    prefixes: ['Shadow', 'Silver', 'Crimson', 'Dark', 'Mystic', 'Frost', 'Blaze', 'Apex', 'Elite', 'Pico', 'Glitch', 'Pixel', 'Alpha', 'Omega', 'Viper', 'Titan'],
    suffixes: ['Slayer', 'Knight', 'Rogue', 'Archer', 'Mage', 'Warrior', 'Boss', 'Champion', 'Guild', 'Master', 'Ranger', 'Beast', 'Hunter', 'Striker'],
  },
  clean: {
    prefixes: ['Mind', 'Vertex', 'Vortex', 'Aura', 'Zenith', 'Nova', 'Pure', 'Soft', 'Epic', 'True', 'Bold', 'Prime', 'Fine', 'Peak', 'Aero'],
    suffixes: ['Dev', 'Scribe', 'Grid', 'Echo', 'Lab', 'Hub', 'Base', 'Zone', 'Line', 'Space', 'Wave', 'Axis', 'Link', 'Mark'],
  },
};

type ThemeType = 'cyber' | 'crypto' | 'gaming' | 'clean';

export default function UsernameWidget({ dict }: UsernameWidgetProps) {
  const [username, setUsername] = useState<string>('');
  const [activeTheme, setActiveTheme] = useState<ThemeType>('cyber');
  const [safetyStatus, setSafetyStatus] = useState<string>('typing');
  const [copied, setCopied] = useState<boolean>(false);
  const [generatedList, setGeneratedList] = useState<string[]>([]);

  // Safety rating updater
  const evaluateUsername = (val: string) => {
    if (!val || val.trim().length === 0) {
      setSafetyStatus('typing');
      return;
    }

    // Invalid symbols check
    // Allows letters, digits, underscore, hyphen
    const validRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validRegex.test(val)) {
      setSafetyStatus('invalid');
      return;
    }

    // Length check
    if (val.length < 5 || val.length > 15) {
      setSafetyStatus('weak');
      return;
    }

    // Premium Check:
    // 5-9 letters, has an underscore or hyphen, no ending numbers, starts with a letter
    const startsWithLetter = /^[a-zA-Z]/;
    const endsWithNumber = /[0-9]$/;
    const hasConnector = /[_-]/;

    if (
      val.length >= 6 &&
      val.length <= 11 &&
      startsWithLetter.test(val) &&
      !endsWithNumber.test(val) &&
      hasConnector.test(val)
    ) {
      setSafetyStatus('premium');
    } else {
      setSafetyStatus('good');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);
    evaluateUsername(val);
  };

  const generateRandomUsername = () => {
    const theme = GENERATOR_THEMES[activeTheme];
    const prefix = theme.prefixes[Math.floor(Math.random() * theme.prefixes.length)];
    const suffix = theme.suffixes[Math.floor(Math.random() * theme.suffixes.length)];
    // Randomly choose separator: "", "_", or "-"
    const separators = ['_', '-', ''];
    const separator = separators[Math.floor(Math.random() * separators.length)];

    const res = `${prefix}${separator}${suffix}`;
    setUsername(res);
    evaluateUsername(res);
    setCopied(false);

    // Save up to 4 quick history list items
    setGeneratedList((prev) => {
      const filtered = prev.filter((item) => item !== res);
      return [res, ...filtered].slice(0, 4);
    });
  };

  const copyUsernameToClipboard = () => {
    if (!username) return;
    try {
      navigator.clipboard.writeText(username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = username;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Pre-populate username with a generator on mount
  useEffect(() => {
    generateRandomUsername();
  }, [activeTheme]);

  // Map status key to display tag
  const getStatusDisplay = () => {
    switch (safetyStatus) {
      case 'typing':
        return {
          text: dict.status_typing,
          colorClass: 'text-slate-400 bg-slate-900/40 border-slate-800',
          icon: <User className="h-4 w-4 text-slate-500" />,
        };
      case 'invalid':
        return {
          text: dict.status_invalid,
          colorClass: 'text-rose-400 bg-rose-950/20 border-rose-500/30 shadow-[0_0_8px_rgba(239,68,68,0.15)]',
          icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
        };
      case 'weak':
        return {
          text: dict.status_weak,
          colorClass: 'text-amber-400 bg-amber-950/20 border-amber-500/30',
          icon: <ShieldAlert className="h-4 w-4 text-amber-500" />,
        };
      case 'good':
        return {
          text: dict.status_good,
          colorClass: 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]',
          icon: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
        };
      case 'premium':
        return {
          text: dict.status_premium,
          colorClass: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 font-extrabold border-purple-500/30 bg-purple-950/20 shadow-[0_0_12px_rgba(168,85,247,0.3)] border animate-pulse',
          icon: <Sparkles className="h-4 w-4 text-purple-400" />,
        };
      default:
        return {
          text: '',
          colorClass: '',
          icon: null,
        };
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <div
      id="username-widget-container"
      className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-900/40 bg-slate-950/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-purple-500/10"
    >
      <div>
        {/* Title */}
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-5">
          <User className="h-5 w-5 text-purple-400" />
          <span className="font-sans text-sm font-semibold tracking-wider text-purple-200">
            {dict.user_subtitle}
          </span>
        </div>

        {/* Style Selection Selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {dict.theme_label}
          </label>
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-purple-950/20 p-1 border border-purple-900/20">
            <button
              onClick={() => setActiveTheme('cyber')}
              className={`rounded-lg py-1.5 text-[11px] font-bold tracking-wide transition ${
                activeTheme === 'cyber' ? 'bg-[#9333ea] text-white shadow' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              {dict.theme_cyber}
            </button>
            <button
              onClick={() => setActiveTheme('crypto')}
              className={`rounded-lg py-1.5 text-[11px] font-bold tracking-wide transition ${
                activeTheme === 'crypto' ? 'bg-[#9333ea] text-white shadow' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              {dict.theme_crypto}
            </button>
            <button
              onClick={() => setActiveTheme('gaming')}
              className={`rounded-lg py-1.5 text-[11px] font-bold tracking-wide transition ${
                activeTheme === 'gaming' ? 'bg-[#9333ea] text-white shadow' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              {dict.theme_gaming}
            </button>
            <button
              onClick={() => setActiveTheme('clean')}
              className={`rounded-lg py-1.5 text-[11px] font-bold tracking-wide transition ${
                activeTheme === 'clean' ? 'bg-[#9333ea] text-white shadow' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              {dict.theme_clean}
            </button>
          </div>
        </div>

        {/* Input area */}
        <div className="relative mb-4">
          <input
            type="text"
            value={username}
            onChange={handleInputChange}
            placeholder={dict.user_placeholder}
            className="w-full bg-slate-950 border border-purple-900/40 focus:border-purple-500 rounded-2xl px-5 py-4 text-white text-sm outline-none transition-all duration-200 placeholder-slate-600 focus:shadow-[0_0_15px_rgba(147,51,234,0.15)] font-medium"
          />
        </div>

        {/* Safety Status Field */}
        <div className="mb-5 flex items-center justify-between rounded-xl bg-purple-950/15 border border-purple-900/10 p-3 text-xs leading-none">
          <span className="font-sans font-semibold text-slate-400">
            {dict.status_lbl}
          </span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs ${statusInfo.colorClass}`}>
            {statusInfo.icon}
            <span className="leading-none">{statusInfo.text}</span>
          </div>
        </div>

        {/* Row Action buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={generateRandomUsername}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/20 py-3 text-xs font-bold text-white transition duration-200 shadow"
          >
            <Dice5 className="h-4 w-4 text-purple-300" />
            <span>{dict.btn_gen}</span>
          </button>
          <button
            onClick={copyUsernameToClipboard}
            disabled={!username}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-bold transition duration-200 shadow ${
              copied
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 hover:bg-slate-800 border-white/5 text-white disabled:opacity-50'
            }`}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 text-slate-300" />}
            <span>{copied ? dict.btn_copied : dict.btn_copy}</span>
          </button>
        </div>

        {/* History Quick Pills */}
        {generatedList.length > 0 && (
          <div className="rounded-xl bg-slate-950/40 p-3 border border-white/5 mb-2">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
              Quick Suggestions History
            </span>
            <div className="flex flex-wrap gap-1.5">
              {generatedList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUsername(item);
                    evaluateUsername(item);
                    setCopied(false);
                  }}
                  className="rounded-lg bg-purple-950/20 px-2.5 py-1 text-xs font-semibold text-purple-300 border border-purple-500/10 hover:border-purple-500/30 hover:bg-purple-900/20 transition-all font-mono"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Join Official Telegram CTA */}
      <div className="mt-4">
        <a
          href="https://t.me/GetVerse/177601"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0088cc] hover:bg-[#0077b3] py-4 font-bold text-white shadow-[0_4px_15px_rgba(0,136,204,0.25)] transition duration-200 text-center text-sm"
        >
          <Send className="h-4 w-4" />
          <span>{dict.btn_tg}</span>
        </a>
      </div>
    </div>
  );
}
