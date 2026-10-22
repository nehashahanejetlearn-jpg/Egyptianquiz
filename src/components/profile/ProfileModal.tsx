import React, { useState } from 'react';
import { PlayerProfile, AchievementBadge } from '../../types/game';
import { EXPLORER_AVATARS, COMPANION_SKINS } from '../../data/gameData';
import { sound } from '../../utils/audio';
import { X, Award, User, Shield, Sparkles, Check, Edit2 } from 'lucide-react';

interface ProfileModalProps {
  profile: PlayerProfile;
  onUpdateProfile: (updated: Partial<PlayerProfile>) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [activeTab, setActiveTab] = useState<'overview' | 'avatars' | 'badges'>('overview');

  const handleSaveName = () => {
    sound.playClick();
    if (nameInput.trim()) {
      onUpdateProfile({ name: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatarId: string) => {
    sound.playClick();
    onUpdateProfile({ avatar: avatarId });
  };

  const handleSelectCompanion = (skinId: string) => {
    sound.playClick();
    onUpdateProfile({ companionSkin: skinId });
  };

  const xpPercentage = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#12141a] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#181a24] to-[#0c0d12] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold shadow-md">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-[10px] font-tech text-amber-400 uppercase tracking-widest font-bold">
                Royal Archaeological Dossier
              </div>
              <h2 className="text-xl font-egyptian font-bold text-amber-100">
                {profile.name}
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
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('avatars')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'avatars'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Explorer & Companion Gear
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`py-3 px-4 border-b-2 font-bold transition-all ${
              activeTab === 'badges'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Achievements ({profile.achievements.filter(a => a.unlocked).length}/{profile.achievements.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-xs">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Explorer Name edit */}
              <div className="flex items-center justify-between p-3.5 bg-black/50 border border-zinc-800 rounded-xl">
                <div>
                  <span className="text-[10px] font-tech text-zinc-400 uppercase">Explorer Name</span>
                  {isEditingName ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        className="bg-zinc-800 border border-amber-500 rounded px-2 py-1 text-xs text-amber-100 font-tech"
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-2 py-1 bg-amber-500 text-black font-bold text-xs rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm font-bold text-amber-200 flex items-center gap-2">
                      <span>{profile.name}</span>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-zinc-400 hover:text-amber-300"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-tech text-zinc-400 uppercase">Rank & Title</span>
                  <div className="text-sm font-bold text-cyan-300 font-tech">
                    {profile.title} (Level {profile.level})
                  </div>
                </div>
              </div>

              {/* XP Progression Bar */}
              <div className="flex flex-col gap-1.5 font-tech">
                <div className="flex justify-between text-xs text-amber-300">
                  <span>Experience Points (XP)</span>
                  <span className="font-bold text-cyan-300">
                    {profile.xp} / {profile.xpToNextLevel} XP ({xpPercentage}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                  <div
                    style={{ width: `${xpPercentage}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 shadow-[0_0_10px_#f59e0b]"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech text-center">
                <div className="p-3 bg-black/60 border border-amber-500/30 rounded-xl">
                  <div className="text-[10px] text-zinc-400 uppercase">Scarab Tokens</div>
                  <div className="text-base font-bold text-yellow-400 mt-1">
                    🪙 {profile.scarabTokens}
                  </div>
                </div>
                <div className="p-3 bg-black/60 border border-amber-500/30 rounded-xl">
                  <div className="text-[10px] text-zinc-400 uppercase">Locations Cleared</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    {profile.completedLocations.length} / 6
                  </div>
                </div>
                <div className="p-3 bg-black/60 border border-amber-500/30 rounded-xl">
                  <div className="text-[10px] text-zinc-400 uppercase">Artifacts Found</div>
                  <div className="text-base font-bold text-cyan-300 mt-1">
                    {profile.discoveredArtifacts.length} Relics
                  </div>
                </div>
                <div className="p-3 bg-black/60 border border-amber-500/30 rounded-xl">
                  <div className="text-[10px] text-zinc-400 uppercase">Quiz High Score</div>
                  <div className="text-base font-bold text-amber-300 mt-1">
                    {profile.highScoreQuiz} Pts
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'avatars' && (
            <div className="flex flex-col gap-6">
              {/* Explorer Avatar Selector */}
              <div>
                <span className="text-xs font-tech font-bold text-amber-400 uppercase tracking-wider block mb-3">
                  Select Explorer Persona
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {EXPLORER_AVATARS.map(avatar => (
                    <div
                      key={avatar.id}
                      onClick={() => handleSelectAvatar(avatar.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        profile.avatar === avatar.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md'
                          : 'bg-black/40 border-zinc-700 hover:border-zinc-500 text-zinc-300'
                      }`}
                    >
                      <div className="p-2 bg-black/60 border border-zinc-700 rounded-lg text-amber-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-tech font-bold text-xs text-amber-200">
                          {avatar.name}
                        </div>
                        <div className="text-[11px] text-cyan-400 font-tech">
                          {avatar.title}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-1">
                          {avatar.bio}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Companion Drone Skin Selector */}
              <div>
                <span className="text-xs font-tech font-bold text-cyan-400 uppercase tracking-wider block mb-3">
                  Khepri Scarab Chassis Finish
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {COMPANION_SKINS.map(skin => (
                    <div
                      key={skin.id}
                      onClick={() => handleSelectCompanion(skin.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                        profile.companionSkin === skin.id
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-200 shadow-md'
                          : 'border-zinc-700 bg-black/40 hover:border-zinc-500 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-tech font-bold text-xs">
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: skin.color }}
                        />
                        <span>{skin.name}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">{skin.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.achievements.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                    badge.unlocked
                      ? 'bg-amber-950/40 border-amber-400/80 text-amber-200 shadow-md'
                      : 'bg-black/40 border-zinc-800 text-zinc-500 opacity-60'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border ${
                      badge.unlocked
                        ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                        : 'bg-black/60 border-zinc-700 text-zinc-600'
                    }`}
                  >
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-tech font-bold text-xs text-amber-300 flex items-center justify-between">
                      <span>{badge.title}</span>
                      {badge.unlocked && (
                        <span className="text-[10px] text-emerald-400 font-bold uppercase">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-300 mt-1 leading-snug">
                      {badge.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
