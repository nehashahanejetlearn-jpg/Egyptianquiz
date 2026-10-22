import React from 'react';
import { sound } from '../../utils/audio';
import { Compass, Landmark, Swords, Settings, Play, Sparkles, BookOpen, User, RotateCcw } from 'lucide-react';

interface MainMenuViewProps {
  hasSaveGame: boolean;
  onStartAdventure: () => void;
  onContinueAdventure: () => void;
  onOpenMuseum: () => void;
  onOpenQuiz: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({
  hasSaveGame,
  onStartAdventure,
  onContinueAdventure,
  onOpenMuseum,
  onOpenQuiz,
  onOpenSettings,
  onOpenProfile,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Cinematic Egyptian & Holographic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#18130e]/70 via-[#0b0c10]/80 to-[#0b0c10] pointer-events-none" />
      <div className="absolute inset-0 scanline-overlay pointer-events-none" />

      {/* Top Bar with Explorer Profile & Settings quick access */}
      <div className="relative z-10 w-full flex items-center justify-between">
        <div className="flex items-center gap-2 font-tech text-xs text-amber-400 bg-black/60 px-3.5 py-1.5 rounded-full border border-amber-500/30">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>EXPEDITION PROTOCOL: ACTIVE</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="p-2.5 bg-black/60 hover:bg-amber-950 border border-amber-500/40 rounded-xl text-amber-300 font-tech text-xs flex items-center gap-1.5 transition-colors"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Explorer Profile</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2.5 bg-black/60 hover:bg-amber-950 border border-amber-500/40 rounded-xl text-amber-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Central Hero Branding & Monumental Title */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl my-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-cyan-400 flex items-center justify-center text-black mb-4 shadow-[0_0_30px_rgba(234,179,8,0.6)]">
          <span className="text-3xl">𓋹</span>
        </div>

        <div className="text-xs sm:text-sm font-tech text-cyan-400 uppercase tracking-[0.3em] font-bold mb-2">
          Ancient Secrets • Holographic Archaeology
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-egyptian font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider">
          PHARAOH'S LEGACY
        </h1>

        <div className="text-base sm:text-xl font-egyptian text-amber-200/90 tracking-widest mt-1 mb-6">
          THE LOST SECRETS OF ANCIENT EGYPT
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 font-sans max-w-xl leading-relaxed mb-8">
          Uncover the mysteries of Khufu's pyramid, translate sacred hieroglyphic tablets, balance the scales of judgment in the underworld, and restore the legendary Eye of Ra.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md font-tech">
          {hasSaveGame ? (
            <>
              <button
                onClick={() => {
                  sound.playDoorOpen();
                  onContinueAdventure();
                }}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continue Adventure</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onStartAdventure();
                }}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-black/60 hover:bg-amber-950 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>New Game</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                sound.playDoorOpen();
                onStartAdventure();
              }}
              className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-base tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Enter Ancient Egypt</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Showcase Pillars (Museum & Quiz Arena) */}
      <div className="relative z-10 w-full max-w-2xl grid grid-cols-2 gap-4 font-tech">
        <button
          onClick={() => {
            sound.playClick();
            onOpenMuseum();
          }}
          className="p-4 bg-black/60 hover:bg-amber-950/60 border border-amber-500/30 hover:border-amber-400 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-3 bg-amber-500/20 border border-amber-400/50 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-200">The Grand Museum</div>
            <div className="text-[10px] text-zinc-400">10 Exhibits & 3D Relic Scanner</div>
          </div>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenQuiz();
          }}
          className="p-4 bg-black/60 hover:bg-amber-950/60 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl flex items-center gap-3 transition-all text-left group"
        >
          <div className="p-3 bg-cyan-500/20 border border-cyan-400/50 rounded-xl text-cyan-400 group-hover:scale-110 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-cyan-200">Knowledge Arena</div>
            <div className="text-[10px] text-zinc-400">30+ Quiz Battles & Boss Trials</div>
          </div>
        </button>
      </div>
    </div>
  );
};
