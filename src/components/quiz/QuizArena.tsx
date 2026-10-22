import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/gameData';
import { QuizQuestion } from '../../types/game';
import { sound } from '../../utils/audio';
import { Swords, Clock, Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft, Zap, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizArenaProps {
  onBack: () => void;
  onRewardTokens: (tokens: number, xp: number) => void;
}

type QuizMode = 'standard' | 'timed' | 'boss';

export const QuizArena: React.FC<QuizArenaProps> = ({ onBack, onRewardTokens }) => {
  const [mode, setMode] = useState<QuizMode>('standard');
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'results'>('lobby');

  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<Array<{ question: QuizQuestion; chosen: number; correct: boolean }>>([]);

  // Timer for Timed mode
  const [timeLeft, setTimeLeft] = useState<number>(20);

  // Start a new game with randomized questions
  const startGame = (selectedMode: QuizMode) => {
    sound.playClick();
    setMode(selectedMode);

    // Shuffle question bank
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    const count = selectedMode === 'standard' ? 10 : selectedMode === 'timed' ? 12 : 25;
    const selected = shuffled.slice(0, count);

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setAnswersLog([]);
    setTimeLeft(20);
    setGameState('playing');
  };

  // Timer countdown hook
  useEffect(() => {
    if (gameState !== 'playing' || mode !== 'timed' || isAnswerSubmitted) return;

    if (timeLeft <= 0) {
      handleTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, mode, timeLeft, isAnswerSubmitted]);

  const handleTimeExpired = () => {
    sound.playTrapWarning();
    setIsAnswerSubmitted(true);
    setStreak(0);
    const currQ = activeQuestions[currentIndex];
    setAnswersLog(prev => [...prev, { question: currQ, chosen: -1, correct: false }]);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    sound.playClick();
    setIsAnswerSubmitted(true);

    const currQ = activeQuestions[currentIndex];
    const isCorrect = selectedOption === currQ.correctIndex;

    if (isCorrect) {
      sound.playSuccessChime();
      const streakBonus = streak * 10;
      const timeBonus = mode === 'timed' ? timeLeft * 5 : 0;
      const pts = 100 + streakBonus + timeBonus;

      setScore(prev => prev + pts);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      setAnswersLog(prev => [...prev, { question: currQ, chosen: selectedOption, correct: true }]);
    } else {
      sound.playTrapWarning();
      setStreak(0);
      setAnswersLog(prev => [...prev, { question: currQ, chosen: selectedOption, correct: false }]);
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(20);
    } else {
      // Completed!
      setGameState('results');
      sound.playDoorOpen();
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });

      // Reward player
      const tokenReward = Math.round(score / 15);
      const xpReward = Math.round(score * 1.2);
      onRewardTokens(tokenReward, xpReward);
    }
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="w-full h-full bg-[#0b0c10] overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 text-amber-100 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              if (gameState !== 'lobby') {
                setGameState('lobby');
              } else {
                onBack();
              }
            }}
            className="p-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 rounded-xl text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Swords className="w-4 h-4 text-amber-400" /> Temple of Thoth • Quiz & Knowledge Battle
            </div>
            <h1 className="text-2xl sm:text-3xl font-egyptian font-bold text-amber-100">
              The Pharaoh's Trial of Wisdom
            </h1>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-3 font-tech">
            {mode === 'timed' && (
              <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                timeLeft <= 5 ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse' : 'bg-black/60 border-cyan-500/40 text-cyan-300'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{timeLeft}s</span>
              </div>
            )}
            <div className="bg-black/60 border border-amber-500/40 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Score: <strong className="text-amber-300">{score}</strong></span>
            </div>
            {streak > 1 && (
              <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-black px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md">
                <Flame className="w-4 h-4 text-black" />
                <span>{streak}x Streak!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* LOBBY VIEW */}
      {gameState === 'lobby' && (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          <div className="p-6 bg-amber-950/30 border border-amber-500/30 rounded-2xl text-center flex flex-col items-center gap-3">
            <Swords className="w-12 h-12 text-amber-400" />
            <h2 className="text-2xl font-egyptian font-bold text-amber-100">
              Prove Your Egyptological Mastery
            </h2>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              Answer verified historical questions covering Pharaonic Dynasties, Pyramid Engineering, Deities of the Duat, and Hieroglyphic Decryption. Earn scarab tokens, level up your explorer rank, and claim high-priest honors!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-tech">
            {/* Standard Mode */}
            <div className="p-6 bg-[#12141a]/95 border border-amber-500/40 rounded-2xl flex flex-col justify-between gap-4 shadow-xl hover:border-amber-400 transition-all">
              <div>
                <div className="text-xs text-cyan-400 font-bold uppercase mb-1">Casual Scholar</div>
                <h3 className="text-xl font-egyptian font-bold text-amber-100 mb-2">
                  Classic Expedition
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  10 questions at your own pace. Detailed explanations for every question, perfect for learning ancient secrets.
                </p>
              </div>
              <button
                onClick={() => startGame('standard')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs shadow-md"
              >
                Start Classic (10 Qs)
              </button>
            </div>

            {/* Timed Sprint */}
            <div className="p-6 bg-[#12141a]/95 border border-cyan-500/50 rounded-2xl flex flex-col justify-between gap-4 shadow-xl hover:border-cyan-400 transition-all">
              <div>
                <div className="text-xs text-amber-400 font-bold uppercase mb-1">Adrenaline Challenge</div>
                <h3 className="text-xl font-egyptian font-bold text-cyan-200 mb-2">
                  Speed Trial of Thoth
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  12 questions with a 20-second timer per question! Faster answers yield massive point bonuses.
                </p>
              </div>
              <button
                onClick={() => startGame('timed')}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs shadow-md"
              >
                Start Speed Sprint (20s)
              </button>
            </div>

            {/* Boss Challenge */}
            <div className="p-6 bg-[#12141a]/95 border border-purple-500/50 rounded-2xl flex flex-col justify-between gap-4 shadow-xl hover:border-purple-400 transition-all">
              <div>
                <div className="text-xs text-purple-400 font-bold uppercase mb-1">Grand Master Trial</div>
                <h3 className="text-xl font-egyptian font-bold text-purple-200 mb-2">
                  Pharaoh's Boss Trial
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  25 grueling questions spanning all dynasties, advanced seked mathematics, and sacred theology.
                </p>
              </div>
              <button
                onClick={() => startGame('boss')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-amber-500 hover:from-purple-400 hover:to-amber-400 text-black font-tech font-bold text-xs shadow-md"
              >
                Enter Boss Trial (25 Qs)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE PLAYING VIEW */}
      {gameState === 'playing' && currentQ && (
        <div className="max-w-2xl mx-auto w-full bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          {/* Progress Tracker */}
          <div className="flex justify-between items-center text-xs font-tech">
            <span className="text-cyan-400 font-bold uppercase tracking-wider">
              Question {currentIndex + 1} of {activeQuestions.length}
            </span>
            <span className="text-zinc-400">
              Topic: <strong className="text-amber-300">{currentQ.category}</strong> • Level: {currentQ.difficulty}
            </span>
          </div>

          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
            />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-egyptian font-bold text-amber-100 leading-snug">
            {currentQ.question}
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-2.5 font-sans text-xs">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;

              let style = 'bg-[#181a24] border-zinc-700 hover:border-zinc-500 text-zinc-200';
              if (isSelected && !isAnswerSubmitted) {
                style = 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md';
              } else if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  style = 'bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrectAnswer) {
                  style = 'bg-rose-950/70 border-rose-500 text-rose-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!isAnswerSubmitted) {
                      sound.playClick();
                      setSelectedOption(idx);
                    }
                  }}
                  disabled={isAnswerSubmitted}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner */}
          {isAnswerSubmitted && (
            <div className="p-4 bg-black/60 border border-amber-500/30 rounded-xl text-xs font-sans animate-in fade-in duration-200">
              <strong className="text-amber-400 font-tech uppercase tracking-wider block mb-1">
                Historical Context & Verification:
              </strong>
              <p className="text-zinc-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex justify-end pt-2 border-t border-amber-500/20">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs disabled:opacity-40 shadow-md transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-tech font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <span>{currentIndex + 1 === activeQuestions.length ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {gameState === 'results' && (
        <div className="max-w-2xl mx-auto w-full bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-black mx-auto shadow-[0_0_20px_#f59e0b]">
            <Award className="w-8 h-8 text-black" />
          </div>

          <div>
            <div className="text-xs font-tech text-amber-400 uppercase tracking-widest font-bold">
              Expedition Completed
            </div>
            <h2 className="text-2xl sm:text-3xl font-egyptian font-bold text-amber-100">
              The Weighing of Your Knowledge
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3 font-tech">
            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Final Score</div>
              <div className="text-lg font-bold text-amber-300">{score}</div>
            </div>
            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Correct Answers</div>
              <div className="text-lg font-bold text-emerald-400">
                {answersLog.filter(a => a.correct).length} / {activeQuestions.length}
              </div>
            </div>
            <div className="p-3 bg-black/50 border border-zinc-800 rounded-xl">
              <div className="text-[10px] text-zinc-400 uppercase">Highest Streak</div>
              <div className="text-lg font-bold text-cyan-300">{highestStreak}x</div>
            </div>
          </div>

          <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs font-tech text-amber-200">
            Rewards Dispatched to Explorer Profile: +{Math.round(score / 15)} Scarab Tokens • +{Math.round(score * 1.2)} XP!
          </div>

          <div className="flex justify-center gap-3 font-tech">
            <button
              onClick={() => setGameState('lobby')}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Mode</span>
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md"
            >
              Return to World Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
