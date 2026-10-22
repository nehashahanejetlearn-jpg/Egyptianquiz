import React, { useState } from 'react';
import { GameSettings } from '../../types/game';
import { sound } from '../../utils/audio';
import { Settings as SettingsIcon, Volume2, VolumeX, Eye, ShieldAlert, X, RotateCcw, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleToggleSound = () => {
    const updated = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: updated });
    sound.setVolumes(!updated, settings.sfxVolume, settings.musicVolume);
    sound.playClick();
  };

  const handleVolumeChange = (type: 'music' | 'sfx', val: number) => {
    if (type === 'music') {
      onUpdateSettings({ musicVolume: val });
      sound.setVolumes(!settings.soundEnabled, settings.sfxVolume, val);
    } else {
      onUpdateSettings({ sfxVolume: val });
      sound.setVolumes(!settings.soundEnabled, val, settings.musicVolume);
    }
    sound.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-none animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-lg bg-[#12141a] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#181a24] to-[#0c0d12] border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 flex items-center justify-center text-black font-bold shadow-md">
              <SettingsIcon className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="text-[10px] font-tech text-amber-400 uppercase tracking-widest font-bold">
                Expedition Preferences
              </div>
              <h2 className="text-xl font-egyptian font-bold text-amber-100">
                System & Audio Settings
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

        {/* Settings Body */}
        <div className="p-6 flex flex-col gap-5 text-xs text-amber-100">
          {/* Audio Master Toggle */}
          <div className="flex items-center justify-between p-3 bg-black/50 border border-zinc-800 rounded-xl font-tech">
            <div className="flex items-center gap-2.5">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-amber-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-zinc-500" />
              )}
              <div>
                <div className="text-sm font-bold text-amber-200">Master Sound FX & Music</div>
                <div className="text-[10px] text-zinc-400">Web Audio synthesis and speech narration</div>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg font-bold border transition-all ${
                settings.soundEnabled
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}
            >
              {settings.soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* Volume Sliders */}
          <div className="flex flex-col gap-3 p-3 bg-black/50 border border-zinc-800 rounded-xl font-tech">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-300">
                <span>Sound Effects (SFX) Volume</span>
                <span className="font-bold text-amber-400">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={e => handleVolumeChange('sfx', Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-zinc-300">
                <span>Ambient Music & Drone Volume</span>
                <span className="font-bold text-amber-400">{Math.round(settings.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.musicVolume}
                onChange={e => handleVolumeChange('music', Number(e.target.value))}
                className="accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Accessibility & Visual FX */}
          <div className="flex flex-col gap-3 font-tech">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">
              Accessibility & Visual FX
            </span>

            <div className="flex items-center justify-between p-3 bg-black/50 border border-zinc-800 rounded-xl">
              <div>
                <div className="text-xs font-bold text-amber-200">Holographic HUD & Scanline Glow</div>
                <div className="text-[10px] text-zinc-400">Futuristic archaeological telemetry overlay</div>
              </div>
              <button
                onClick={() => onUpdateSettings({ scannerHudGlow: !settings.scannerHudGlow })}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  settings.scannerHudGlow
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {settings.scannerHudGlow ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/50 border border-zinc-800 rounded-xl">
              <div>
                <div className="text-xs font-bold text-amber-200">Reduced Motion Mode</div>
                <div className="text-[10px] text-zinc-400">Minimizes screen shakes and particle animations</div>
              </div>
              <button
                onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
                className={`px-3 py-1 rounded-lg border font-bold ${
                  settings.reducedMotion
                    ? 'bg-amber-950 border-amber-400 text-amber-300'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                }`}
              >
                {settings.reducedMotion ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Danger Zone: Reset Progress with confirmation */}
          <div className="p-4 bg-rose-950/30 border border-rose-500/40 rounded-xl flex flex-col gap-2 font-tech">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>Reset Saved Expedition Progress</span>
            </div>
            <p className="text-[11px] text-zinc-300 font-sans">
              Erase all unlocked pyramid chambers, inventory relics, scores, and custom profile settings from browser local storage.
            </p>

            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="mt-1 px-4 py-2 bg-rose-900/60 hover:bg-rose-800 border border-rose-600/60 rounded-xl text-rose-200 text-xs font-bold transition-colors w-fit"
              >
                Reset Progress...
              </button>
            ) : (
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowConfirmReset(false);
                    onClose();
                  }}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
                >
                  Yes, Erase Everything
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
