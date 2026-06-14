import { useEffect, useState } from 'react';
import { Clock, Globe } from 'lucide-react';
import { Dictionary } from '../types';

interface ClockWidgetProps {
  dict: Dictionary;
}

export default function ClockWidget({ dict }: ClockWidgetProps) {
  const [time, setTime] = useState<string>('00:00:00');
  const [dateStr, setDateStr] = useState<string>('UTC TIME PROTOCOL');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Calculate UTC parts
      const hh = String(now.getUTCHours()).padStart(2, '0');
      const mm = String(now.getUTCMinutes()).padStart(2, '0');
      const ss = String(now.getUTCSeconds()).padStart(2, '0');
      setTime(`${hh}:${mm}:${ss}`);

      // Format UTC Date: SUN, 14 JUN 2026
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
      setDateStr(formattedDate.toUpperCase());
      setPulse((prev) => !prev);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="clock-widget-container"
      className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-purple-900/40 bg-slate-950/60 p-8 text-center backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-purple-500/10"
    >
      {/* Background ambient glow */}
      <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-purple-600/10 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-indigo-600/10 blur-2xl" />

      {/* Title */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 w-full justify-center">
        <Clock className="h-5 w-5 text-purple-400" />
        <span className="font-sans text-sm font-semibold tracking-wider text-purple-200">
          {dict.utc_clock}
        </span>
      </div>

      {/* Main Clock */}
      <div className="my-6">
        <div className="font-mono text-4xl sm:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] select-all">
          {time}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] ${pulse ? 'animate-ping' : ''}`} />
          <span className="font-mono text-xs text-purple-300/80 tracking-widest">
            {dict.utc_subtitle}
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-950/30 px-4 py-2 border border-purple-500/10 mt-2">
        <Globe className="h-4 w-4 text-purple-400 animate-spin-slow" />
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#a78bfa]">
          {dateStr}
        </span>
      </div>
    </div>
  );
}
