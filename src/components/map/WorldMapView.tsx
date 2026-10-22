import React, { useState } from 'react';
import { LocationId, LocationInfo } from '../../types/game';
import { LOCATIONS } from '../../data/gameData';
import { sound } from '../../utils/audio';
import { MapPin, Lock, CheckCircle2, Sparkles, Compass, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface WorldMapViewProps {
  unlockedLocations: LocationId[];
  completedLocations: LocationId[];
  onSelectLocation: (locId: LocationId) => void;
  playerLevel: number;
}

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  unlockedLocations,
  completedLocations,
  onSelectLocation,
  playerLevel,
}) => {
  const [selectedLoc, setSelectedLoc] = useState<LocationInfo>(LOCATIONS[0]);

  const handleSelectNode = (loc: LocationInfo) => {
    sound.playClick();
    setSelectedLoc(loc);
  };

  const handleEmbark = () => {
    const isUnlocked = unlockedLocations.includes(selectedLoc.id);
    if (!isUnlocked) {
      sound.playTrapWarning();
      return;
    }
    sound.playDoorOpen();
    onSelectLocation(selectedLoc.id);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none overflow-hidden">
      {/* Top Bar Map Title */}
      <div className="z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-black/70 border border-amber-500/40 p-4 rounded-2xl shadow-xl">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Compass className="w-4 h-4 text-amber-400" /> Sacred Nile Valley Navigation Hologram
          </div>
          <h1 className="text-xl sm:text-2xl font-egyptian font-bold text-amber-100">
            Map of Ancient Kemet
          </h1>
        </div>

        <div className="flex items-center gap-2 font-tech text-xs">
          <div className="bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl text-amber-300">
            Locations Cleared: <strong className="text-emerald-400">{completedLocations.length} / 6</strong>
          </div>
        </div>
      </div>

      {/* Interactive Map Surface */}
      <div className="relative flex-1 my-4 bg-gradient-to-b from-[#16120d] to-[#0c0d12] border-2 border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Subtle Map Topography & Nile River curve vector */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none">
          {/* Nile River Blue Band */}
          <path
            d="M 680 0 Q 640 200 660 400 T 700 800"
            fill="none"
            stroke="#0284c7"
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 680 0 Q 640 200 660 400 T 700 800"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="6"
            strokeDasharray="12 12"
          />
        </svg>

        {/* Scanlines */}
        <div className="absolute inset-0 scanline-overlay pointer-events-none" />

        {/* Map Nodes */}
        {LOCATIONS.map(loc => {
          const isUnlocked = unlockedLocations.includes(loc.id);
          const isCompleted = completedLocations.includes(loc.id);
          const isSelected = selectedLoc.id === loc.id;

          return (
            <div
              key={loc.id}
              style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
            >
              {/* Pulsing ring if unlocked and not completed */}
              {isUnlocked && !isCompleted && (
                <div className="absolute -inset-3 rounded-full border border-amber-400/60 animate-ping pointer-events-none" />
              )}

              <button
                onClick={() => handleSelectNode(loc)}
                className={`relative w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-tech transition-all duration-300 ${
                  isSelected
                    ? 'scale-125 border-cyan-400 bg-cyan-950 text-cyan-200 shadow-[0_0_20px_#06b6d4]'
                    : isCompleted
                    ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : isUnlocked
                    ? 'border-amber-400 bg-amber-950/80 text-amber-200 hover:scale-110 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                    : 'border-zinc-700 bg-black/80 text-zinc-600 opacity-60'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : isUnlocked ? (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                ) : (
                  <Lock className="w-5 h-5 text-zinc-600" />
                )}
              </button>

              {/* Pin Label */}
              <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 border border-amber-500/40 px-2.5 py-1 rounded-md text-[11px] font-tech text-amber-200 pointer-events-none shadow-md">
                {loc.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Location Bottom Drawer */}
      <div className="z-10 bg-[#12141a]/95 border border-amber-500/50 p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-tech text-cyan-400 font-bold uppercase tracking-wider mb-1">
            <span>Expedition Waypoint</span>
            <span className="text-zinc-500">•</span>
            <span className="text-amber-400">{selectedLoc.subtitle}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-egyptian font-bold text-amber-100">
            {selectedLoc.name}
          </h2>

          <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
            {selectedLoc.description}
          </p>

          <div className="flex items-center gap-4 mt-2 font-tech text-xs text-amber-300">
            <span>Relic: <strong className="text-cyan-300">{selectedLoc.artifactReward}</strong></span>
            <span>Reward: +{selectedLoc.tokensReward} Tokens • +{selectedLoc.xpReward} XP</span>
          </div>
        </div>

        {/* Embark Action Button */}
        <div>
          {unlockedLocations.includes(selectedLoc.id) ? (
            <button
              onClick={handleEmbark}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech font-bold text-sm tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all transform hover:scale-105 active:scale-95"
            >
              <span>{completedLocations.includes(selectedLoc.id) ? 'Revisit Chamber' : 'Embark Expedition'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-400 font-tech text-xs">
              <Lock className="w-4 h-4 text-zinc-500" />
              <span>Requires Preceding Seals Decoded</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
