import React, { useState } from 'react';
import { MUSEUM_EXHIBITS } from '../../data/gameData';
import { MuseumExhibit } from '../../types/game';
import { sound } from '../../utils/audio';
import { ArtifactInspector3D } from '../3d/ArtifactInspector3D';
import { Landmark, Eye, CheckCircle2, Volume2, Sparkles, HelpCircle, ArrowLeft, BookOpen, Clock, Award } from 'lucide-react';

interface MuseumViewProps {
  onBack: () => void;
  onRewardTokens: (tokens: number, xp: number) => void;
}

export const MuseumView: React.FC<MuseumViewProps> = ({ onBack, onRewardTokens }) => {
  const [selectedExhibit, setSelectedExhibit] = useState<MuseumExhibit>(MUSEUM_EXHIBITS[0]);
  const [inspectingArtifact, setInspectingArtifact] = useState<MuseumExhibit | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [exhibitId: string]: boolean }>({});
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Leadership & Rulership', 'Architecture & Mathematics', 'Rituals & Spiritual Beliefs', 'Religion & Mythology', 'Language & Literature', 'Geography & Agriculture'];

  const filteredExhibits = filterCategory === 'All'
    ? MUSEUM_EXHIBITS
    : MUSEUM_EXHIBITS.filter(e => e.category === filterCategory);

  const handleSelectExhibit = (exhibit: MuseumExhibit) => {
    sound.playClick();
    setSelectedExhibit(exhibit);
    setQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleInspect3D = (exhibit: MuseumExhibit) => {
    sound.playScanBeep();
    setInspectingArtifact(exhibit);
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null) return;
    sound.playClick();
    setQuizSubmitted(true);

    if (quizAnswer === selectedExhibit.quiz.correctIndex) {
      sound.playSuccessChime();
      if (!completedQuizzes[selectedExhibit.id]) {
        setCompletedQuizzes(prev => ({ ...prev, [selectedExhibit.id]: true }));
        onRewardTokens(25, 50); // Scarab tokens and XP!
      }
    } else {
      sound.playTrapWarning();
    }
  };

  const handlePlayAudio = (text: string) => {
    sound.playClick();
    sound.speak(text);
  };

  return (
    <div className="w-full h-full bg-[#0b0c10] overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 text-amber-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 rounded-xl text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" /> Royal Grand Museum of Antiquities
            </div>
            <h1 className="text-2xl sm:text-3xl font-egyptian font-bold text-amber-100">
              Chronicles of Ancient Kemet
            </h1>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="bg-black/60 border border-amber-500/40 rounded-xl px-4 py-2 font-tech flex items-center gap-3">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase">Knowledge Badges</div>
            <div className="text-xs font-bold text-amber-300">
              {Object.keys(completedQuizzes).length} / {MUSEUM_EXHIBITS.length} Exhibits Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 font-tech text-xs">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setFilterCategory(cat)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full border transition-all ${
              filterCategory === cat
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md'
                : 'bg-black/40 border-zinc-700 text-zinc-300 hover:border-amber-500/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Museum Exhibit Grid & Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Exhibit Thumbnails Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredExhibits.map(exhibit => {
            const isSelected = selectedExhibit.id === exhibit.id;
            const isCompleted = completedQuizzes[exhibit.id];

            return (
              <div
                key={exhibit.id}
                onClick={() => handleSelectExhibit(exhibit)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-950/80 to-black/80 border-amber-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                    : 'bg-black/40 border-zinc-800 hover:border-amber-500/40 hover:bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-tech">
                  <span className="text-cyan-400 font-semibold">{exhibit.category}</span>
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] uppercase font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  )}
                </div>

                <div className="text-base font-egyptian font-bold text-amber-200">
                  {exhibit.title}
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-400 font-tech">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{exhibit.era}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Exhibit Deep-Dive Showcase (8 cols) */}
        <div className="lg:col-span-8 bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
          {/* Header of Exhibit */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-amber-500/20 pb-4">
            <div>
              <div className="text-xs font-tech text-amber-400 uppercase tracking-widest">
                {selectedExhibit.category} • {selectedExhibit.era}
              </div>
              <h2 className="text-2xl sm:text-3xl font-egyptian font-bold text-amber-100">
                {selectedExhibit.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayAudio(selectedExhibit.audioTranscript)}
                className="px-3.5 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-600/50 text-amber-300 font-tech text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Audio Tour</span>
              </button>

              <button
                onClick={() => handleInspect3D(selectedExhibit)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
              >
                <Eye className="w-4 h-4" />
                <span>Inspect in 3D</span>
              </button>
            </div>
          </div>

          {/* Summary Quote */}
          <div className="p-4 bg-amber-950/30 border-l-4 border-amber-500 rounded-r-xl text-sm italic text-amber-200/90 leading-relaxed font-sans">
            "{selectedExhibit.summary}"
          </div>

          {/* Detailed Paragraphs */}
          <div className="flex flex-col gap-3 font-sans text-sm text-zinc-300 leading-relaxed">
            {selectedExhibit.detailedText.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Key Facts Callout Grid */}
          <div className="flex flex-col gap-2 font-tech">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Curated Egyptological Facts
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedExhibit.keyFacts.map((fact, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-black/50 border border-zinc-800 rounded-xl text-xs text-zinc-200 leading-normal flex flex-col justify-between"
                >
                  <span>{fact}</span>
                  <span className="text-[10px] text-cyan-400/80 font-bold mt-2">
                    FACT #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Check Mini-Quiz */}
          <div className="p-5 bg-black/60 border border-amber-500/30 rounded-2xl flex flex-col gap-3 font-tech">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Exhibit Knowledge Check
              </span>
              <span className="text-[11px] text-amber-400">
                Reward: +25 Scarab Tokens • +50 XP
              </span>
            </div>

            <div className="text-sm font-sans font-semibold text-amber-100">
              {selectedExhibit.quiz.question}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-sans text-xs">
              {selectedExhibit.quiz.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => {
                    sound.playClick();
                    setQuizAnswer(oIdx);
                    setQuizSubmitted(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    quizAnswer === oIdx
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                      : 'bg-[#181a24] border-zinc-700 hover:border-zinc-500 text-zinc-300'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div
                className={`p-3 rounded-xl text-xs font-sans ${
                  quizAnswer === selectedExhibit.quiz.correctIndex
                    ? 'bg-emerald-950/70 border border-emerald-500/60 text-emerald-200'
                    : 'bg-rose-950/70 border border-rose-500/60 text-rose-200'
                }`}
              >
                <strong>
                  {quizAnswer === selectedExhibit.quiz.correctIndex
                    ? 'Correct! '
                    : 'Incorrect. '}
                </strong>
                {selectedExhibit.quiz.explanation}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleQuizSubmit}
                disabled={quizAnswer === null}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs disabled:opacity-40 transition-all shadow-md"
              >
                Submit Knowledge Check
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Artifact Inspector Modal */}
      {inspectingArtifact && (
        <ArtifactInspector3D
          artifactType={inspectingArtifact.artifactType}
          title={inspectingArtifact.title}
          era={inspectingArtifact.era}
          summary={inspectingArtifact.summary}
          significance={inspectingArtifact.keyFacts.join(' ')}
          audioTranscript={inspectingArtifact.audioTranscript}
          onClose={() => setInspectingArtifact(null)}
        />
      )}
    </div>
  );
};
