import React, { useState } from 'react';
import { InventoryItem, LocationInfo, LocationId } from '../../types/game';
import { LOCATIONS } from '../../data/gameData';
import { sound } from '../../utils/audio';
import { BookOpen, Backpack, X, CheckCircle2, Circle, Sparkles, Key, Compass, ShieldCheck } from 'lucide-react';

interface JournalModalProps {
  inventory: InventoryItem[];
  completedLocations: LocationId[];
  unlockedLocations: LocationId[];
  discoveredArtifacts: string[];
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  inventory,
  completedLocations,
  unlockedLocations,
  discoveredArtifacts,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'quests' | 'relics'>('quests');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(inventory[0] || null);

  const handleSelectItem = (item: InventoryItem) => {
    sound.playClick();
    setSelectedItem(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#12141a] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#181a24] to-[#0c0d12] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold shadow-md">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-[10px] font-tech text-cyan-400 uppercase tracking-widest font-bold">
                Expedition Log & Field Pack
              </div>
              <h2 className="text-xl font-egyptian font-bold text-amber-100">
                Explorer's Field Journal & Relics
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-black/40 px-5 font-tech text-xs">
          <button
            onClick={() => setActiveTab('quests')}
            className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quests'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Active Quests & Milestones</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Backpack className="w-3.5 h-3.5" />
            <span>Field Inventory ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('relics')}
            className={`py-3 px-4 border-b-2 font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'relics'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Restored Artifacts ({discoveredArtifacts.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
          {activeTab === 'quests' && (
            <div className="flex flex-col gap-3 font-tech">
              <span className="text-xs text-amber-400 uppercase font-bold tracking-wider">
                Six Legendary Pharaonic Seals
              </span>
              <div className="flex flex-col gap-2.5">
                {LOCATIONS.map((loc, idx) => {
                  const isCompleted = completedLocations.includes(loc.id);
                  const isUnlocked = unlockedLocations.includes(loc.id);

                  return (
                    <div
                      key={loc.id}
                      className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
                        isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                          : isUnlocked
                          ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                          : 'bg-black/40 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-amber-400/60" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold font-egyptian">
                            {idx + 1}. {loc.name}
                          </div>
                          <div className="text-[11px] text-zinc-300 font-sans mt-0.5">
                            {loc.description}
                          </div>
                          <div className="text-[10px] text-cyan-400 mt-1">
                            Reward: {loc.artifactReward} (+{loc.tokensReward} Tokens, +{loc.xpReward} XP)
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                          isCompleted
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : isUnlocked
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                        }`}
                      >
                        {isCompleted ? 'Seal Restored' : isUnlocked ? 'In Progress' : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              {/* Item List (5 cols) */}
              <div className="sm:col-span-5 flex flex-col gap-2">
                {inventory.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedItem?.id === item.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                        : 'bg-black/40 border-zinc-800 hover:border-zinc-600 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span className="font-tech font-bold text-xs">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-tech text-zinc-500 uppercase">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>

              {/* Inspector Pane (7 cols) */}
              <div className="sm:col-span-7 bg-black/50 border border-amber-500/30 rounded-xl p-5 flex flex-col justify-between">
                {selectedItem ? (
                  <div className="flex flex-col gap-3 font-sans">
                    <div className="flex items-center gap-2 text-xs font-tech text-amber-400 uppercase tracking-wider font-bold">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>{selectedItem.category} Equipment</span>
                    </div>

                    <h3 className="text-lg font-egyptian font-bold text-amber-100">
                      {selectedItem.name}
                    </h3>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {selectedItem.description}
                    </p>

                    <div className="p-3 bg-amber-950/40 border border-amber-600/30 rounded-lg text-xs text-amber-200/90 leading-relaxed">
                      <strong className="block text-[11px] font-tech text-amber-300 uppercase tracking-wider mb-0.5">
                        Historical Archaeological Context:
                      </strong>
                      {selectedItem.historicalNote}
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-500 text-xs text-center py-10 font-tech">
                    Select an item from your expedition pack to inspect details.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'relics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-tech">
              {discoveredArtifacts.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-zinc-500">
                  No pharaonic relics recovered yet! Embark on adventures in the Desert, Pyramid, and Temple to restore the artifacts.
                </div>
              ) : (
                discoveredArtifacts.map((relicName, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-r from-amber-950/40 to-black/60 border border-amber-400/60 rounded-xl flex items-center gap-3 shadow-md"
                  >
                    <div className="p-2.5 bg-amber-500/20 border border-amber-400 rounded-lg text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-amber-200">{relicName}</div>
                      <div className="text-[10px] text-emerald-400 uppercase">
                        Restored & Preserved
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
