import { useState } from 'react';
import { Trophy, ExternalLink, ListChecks, HelpCircle, CheckCircle } from 'lucide-react';
import { Dictionary } from '../types';

interface ScavengerHuntWidgetProps {
  dict: Dictionary;
}

interface TriviaQuestion {
  question: string;
  options: string[];
  correctIdx: number;
  clue: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: 'How many primary tasks are in the Verse Hub Scavenger Hunt?',
    options: ['2 tasks', '3 tasks', '5 tasks', '7 tasks'],
    correctIdx: 1, // 3 tasks
    clue: 'Check the Scavenger Objectives list: Follow, Generate & Complete trivia!',
  },
  {
    question: 'Where are official Verse Hub announcements distributed?',
    options: ['Discord Guild', 'Twitter/X feed', 'Telegram @GetVerse', 'Reddit community'],
    correctIdx: 2, // Telegram @GetVerse
    clue: 'Click the Telegram button at the bottom of the card or check hunt rule 1.',
  },
  {
    question: 'What is the minimum recommended length of a secure custom username?',
    options: ['3 characters', '5 characters', '8 characters', '12 characters'],
    correctIdx: 1, // 5 characters
    clue: 'Our username checklist highlights format verification of 5 to 15 characters.',
  },
];

export default function ScavengerHuntWidget({ dict }: ScavengerHuntWidgetProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'objectives' | 'trivia'>('info');
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showAnswerResult, setShowAnswerResult] = useState<boolean>(false);
  const [revealedBonusCode, setRevealedBonusCode] = useState<string | null>(null);

  const handleTriviaAnswer = (optIndex: number) => {
    setSelectedOpt(optIndex);
    setShowAnswerResult(true);

    if (optIndex === TRIVIA_QUESTIONS[currentTriviaIdx].correctIdx) {
      if (currentTriviaIdx === TRIVIA_QUESTIONS.length - 1) {
        setRevealedBonusCode('VERSE_SCIFI_MASTER_2026');
      }
    }
  };

  const nextTrivia = () => {
    setSelectedOpt(null);
    setShowAnswerResult(false);
    setCurrentTriviaIdx((prev) => (prev + 1) % TRIVIA_QUESTIONS.length);
  };

  const resetTrivia = () => {
    setSelectedOpt(null);
    setShowAnswerResult(false);
    setCurrentTriviaIdx(0);
    setRevealedBonusCode(null);
  };

  const trivia = TRIVIA_QUESTIONS[currentTriviaIdx];

  return (
    <div
      id="hunt-card-container"
      className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-purple-900/40 bg-slate-950/60 p-8 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-purple-500/40 hover:shadow-purple-500/10"
    >
      {/* Decorative top grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.08),transparent_50%)] pointer-events-none" />

      {/* Header and Pill */}
      <div>
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400 animate-bounce" />
            <span className="font-sans text-sm font-semibold tracking-wider text-purple-200">
              {dict.hunt_title}
            </span>
          </div>
          <span className="rounded-full bg-purple-900/40 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-purple-500/20 shadow-[0_0_8px_rgba(168,85,247,0.2)]">
            {dict.hunt_status}
          </span>
        </div>

        {/* Tab Buttons for Submodules */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-purple-950/30 p-1 border border-purple-900/20 mb-5">
          <button
            onClick={() => setActiveTab('info')}
            className={`rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'info'
                ? 'bg-[#9333ea] text-white shadow-md shadow-purple-950'
                : 'text-purple-300/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('objectives')}
            className={`rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'objectives'
                ? 'bg-[#9333ea] text-white shadow-md shadow-purple-950'
                : 'text-purple-300/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Objectives
          </button>
          <button
            onClick={() => {
              setActiveTab('trivia');
              resetTrivia();
            }}
            className={`rounded-lg py-1.5 text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'trivia'
                ? 'bg-[#9333ea] text-white shadow-md shadow-purple-950'
                : 'text-purple-300/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Trivia Quiz
          </button>
        </div>

        {/* Tab Area content */}
        <div className="min-height-[180px] flex flex-col justify-start">
          {activeTab === 'info' && (
            <div className="fade-in">
              <div className="text-xl font-extrabold text-[#c084fc] mb-2 tracking-tight">
                {dict.hunt_sub}
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-300 mb-4 font-sans">
                {dict.hunt_desc}
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mt-4">
                <Trophy className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="font-mono text-xs font-semibold text-amber-300">
                  {dict.hunt_rewards}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div className="fade-in text-slate-300 font-sans">
              <div className="font-bold text-xs text-purple-300/90 mb-3 tracking-widest uppercase flex items-center gap-1.5">
                <ListChecks className="h-4 w-4" />
                {dict.hunt_rules_title}
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{dict.hunt_rule_1}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{dict.hunt_rule_2}</span>
                </li>
                <li className="flex items-start gap-2 text-slate-300">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{dict.hunt_rule_3}</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'trivia' && (
            <div className="fade-in font-sans">
              {!revealedBonusCode ? (
                <>
                  <div className="flex items-center gap-1.5 mb-2 text-purple-300/90">
                    <HelpCircle className="h-4 w-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Question {currentTriviaIdx + 1} of {TRIVIA_QUESTIONS.length}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mb-3">
                    {trivia.question}
                  </div>
                  <div className="space-y-2">
                    {trivia.options.map((opt, i) => {
                      let btnBg = 'bg-slate-900/80 border-purple-900/30 text-slate-300 hover:border-purple-500/20 hover:bg-slate-900';
                      if (showAnswerResult) {
                        if (i === trivia.correctIdx) {
                          btnBg = 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300';
                        } else if (i === selectedOpt) {
                          btnBg = 'bg-rose-950/40 border-rose-500/50 text-rose-300';
                        } else {
                          btnBg = 'bg-slate-900/40 border-slate-950 text-slate-500';
                        }
                      }
                      return (
                        <button
                          key={i}
                          disabled={showAnswerResult}
                          onClick={() => handleTriviaAnswer(i)}
                          className={`w-full rounded-xl border p-2.5 text-left text-xs font-medium transition-all ${btnBg}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showAnswerResult && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 max-w-[200px]">
                        {selectedOpt === trivia.correctIdx ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Correct Answer!
                          </span>
                        ) : (
                          <span className="text-rose-400 font-semibold">
                            Clue: {trivia.clue}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={nextTrivia}
                        className="rounded-lg bg-purple-900/60 px-3 py-1.5 text-xs font-bold text-purple-200 border border-purple-500/20 hover:bg-purple-800 transition"
                      >
                        {currentTriviaIdx === TRIVIA_QUESTIONS.length - 1 ? 'Finish & Check' : 'Next Riddle'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Trophy className="h-10 w-10 text-amber-400 mb-2 animate-pulse" />
                  <div className="text-sm font-bold text-emerald-400 mb-1">Quest Completed!</div>
                  <p className="text-xs text-slate-400 mb-4 max-w-[240px]">
                    You have solved all official riddles. Here is your secret quest token:
                  </p>
                  <div className="rounded-xl bg-purple-900/20 border border-purple-500/30 px-4 py-2 font-mono text-sm font-extrabold tracking-widest text-[#c084fc] select-all shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                    {revealedBonusCode}
                  </div>
                  <button
                    onClick={resetTrivia}
                    className="mt-4 text-xs font-semibold text-purple-400/80 hover:text-purple-300 underline"
                  >
                    Reset & Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Button footer */}
      <div className="mt-8">
        <a
          href="https://t.me/GetVerse/355506"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 py-4 font-bold text-white shadow-[0_4px_20px_rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_4px_25px_rgba(147,51,234,0.55)] cursor-pointer text-center text-sm"
        >
          <span>{dict.hunt_btn}</span>
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
