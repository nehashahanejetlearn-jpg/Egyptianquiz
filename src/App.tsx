import React, { useState, useEffect } from 'react';
import { GameView, LocationId, PlayerProfile, GameSettings, InventoryItem } from './types/game';
import { LOCATIONS, INITIAL_INVENTORY, ACHIEVEMENTS } from './data/gameData';
import { sound } from './utils/audio';

// 3D Canvas
import { EgyptianWorldCanvas } from './components/3d/EgyptianWorldCanvas';

// Views
import { MainMenuView } from './components/menu/MainMenuView';
import { WorldMapView } from './components/map/WorldMapView';
import { MuseumView } from './components/museum/MuseumView';
import { QuizArena } from './components/quiz/QuizArena';

// Puzzles
import { DesertScannerPuzzle } from './components/puzzles/DesertScannerPuzzle';
import { PyramidGeometryPuzzle } from './components/puzzles/PyramidGeometryPuzzle';
import { HieroglyphicsDecoder } from './components/puzzles/HieroglyphicsDecoder';
import { LostTombPuzzle } from './components/puzzles/LostTombPuzzle';
import { NileSimulator } from './components/puzzles/NileSimulator';
import { PharaohsChamberPuzzle } from './components/puzzles/PharaohsChamberPuzzle';

// Companion & Modals
import { KhepriCompanion } from './components/companion/KhepriCompanion';
import { ProfileModal } from './components/profile/ProfileModal';
import { JournalModal } from './components/journal/JournalModal';
import { SettingsModal } from './components/settings/SettingsModal';

// Icons
import { Compass, BookOpen, User, Settings, ArrowLeft, Sparkles, Volume2, VolumeX, ShieldCheck, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_PROFILE_KEY = 'pharaohs_legacy_profile_v2';
const STORAGE_SETTINGS_KEY = 'pharaohs_legacy_settings_v2';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Explorer Alex',
  title: 'Apprentice Archaeologist',
  avatar: 'liam',
  companionSkin: 'gold',
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  scarabTokens: 50,
  discoveredArtifacts: [],
  inventory: INITIAL_INVENTORY,
  completedLocations: [],
  unlockedLocations: ['desert'],
  achievements: ACHIEVEMENTS,
  highScoreQuiz: 0,
  hintsUsed: 0,
};

const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 0.8,
  musicVolume: 0.4,
  sfxVolume: 0.8,
  narrationVolume: 0.9,
  soundEnabled: true,
  dyslexiaFont: false,
  reducedMotion: false,
  scannerHudGlow: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [activeLocation, setActiveLocation] = useState<LocationId | null>(null);

  // Persistent Player Profile & Settings
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // External hint triggered by puzzle into Khepri
  const [activeHintMessage, setActiveHintMessage] = useState<string | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Audio start on user interaction
  const handleStartMusic = () => {
    if (settings.soundEnabled) {
      sound.setVolumes(false, settings.sfxVolume, settings.musicVolume);
      sound.startAmbient();
    }
  };

  // Profile update handler with automatic rank / level calculations
  const handleUpdateProfile = (updated: Partial<PlayerProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      return next;
    });
  };

  // Add XP and Tokens helper
  const handleAddTokensAndXp = (tokens: number, xpGained: number) => {
    setProfile(prev => {
      let newXp = prev.xp + xpGained;
      let newLevel = prev.level;
      let newNextXp = prev.xpToNextLevel;
      let newTitle = prev.title;

      // Level up checks
      if (newXp >= newNextXp) {
        newLevel += 1;
        newNextXp = Math.round(newNextXp * 1.6);
        sound.playSuccessChime();

        if (newLevel === 2) newTitle = 'Temple Surveyor';
        else if (newLevel === 3) newTitle = 'Royal Cryptographer';
        else if (newLevel === 4) newTitle = 'Master Architect of Giza';
        else if (newLevel === 5) newTitle = 'High Priest of Thoth';
        else if (newLevel >= 6) newTitle = 'Living Legend of Kemet';
      }

      return {
        ...prev,
        scarabTokens: prev.scarabTokens + tokens,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newNextXp,
        title: newTitle,
      };
    });
  };

  // Complete a game location puzzle
  const handleCompleteLocation = (locId: LocationId) => {
    const locInfo = LOCATIONS.find(l => l.id === locId);
    if (!locInfo) return;

    sound.playSuccessChime();
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });

    // Determine next location to unlock
    const locationOrder: LocationId[] = ['desert', 'pyramid', 'hieroglyphs', 'tomb', 'nile', 'chamber'];
    const currIdx = locationOrder.indexOf(locId);
    const nextLoc = locationOrder[currIdx + 1];

    setProfile(prev => {
      const completed = prev.completedLocations.includes(locId)
        ? prev.completedLocations
        : [...prev.completedLocations, locId];

      const unlocked = nextLoc && !prev.unlockedLocations.includes(nextLoc)
        ? [...prev.unlockedLocations, nextLoc]
        : prev.unlockedLocations;

      const relics = prev.discoveredArtifacts.includes(locInfo.artifactReward)
        ? prev.discoveredArtifacts
        : [...prev.discoveredArtifacts, locInfo.artifactReward];

      // Add artifact to inventory as well
      const newInventoryItem: InventoryItem = {
        id: `artifact_${locId}`,
        name: locInfo.artifactReward,
        icon: 'Sparkles',
        description: `Sacred restored relic from ${locInfo.name}.`,
        historicalNote: locInfo.description,
        category: 'artifact',
      };

      const inventory = prev.inventory.some(i => i.id === newInventoryItem.id)
        ? prev.inventory
        : [...prev.inventory, newInventoryItem];

      // Update badge
      const badgeIdMap: Record<LocationId, string> = {
        desert: 'eye_awoken',
        pyramid: 'pyramid_architect',
        hieroglyphs: 'royal_scribe',
        tomb: 'tomb_survivor',
        nile: 'nile_governor',
        chamber: 'pharaohs_heir',
      };
      const targetBadgeId = badgeIdMap[locId];
      const achievements = prev.achievements.map(a =>
        a.id === targetBadgeId ? { ...a, unlocked: true } : a
      );

      return {
        ...prev,
        completedLocations: completed,
        unlockedLocations: unlocked,
        discoveredArtifacts: relics,
        inventory,
        achievements,
      };
    });

    handleAddTokensAndXp(locInfo.tokensReward, locInfo.xpReward);
  };

  const handleResetAllProgress = () => {
    sound.playClick();
    localStorage.removeItem(STORAGE_PROFILE_KEY);
    setProfile(DEFAULT_PROFILE);
    setActiveLocation(null);
    setCurrentView('menu');
  };

  const hasSave = profile.completedLocations.length > 0 || profile.xp > 0;

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden bg-[#0b0c10] text-[#e0e2ec] flex flex-col ${
        settings.dyslexiaFont ? 'font-sans' : ''
      }`}
      onClick={handleStartMusic}
    >
      {/* Background 3D World Canvas (persistent across menu & exploration) */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <EgyptianWorldCanvas
          activeLocation={activeLocation}
          onSelectLocation={loc => {
            if (profile.unlockedLocations.includes(loc)) {
              setActiveLocation(loc);
              setCurrentView('adventure');
            } else {
              sound.playTrapWarning();
            }
          }}
          scannerMode={settings.scannerHudGlow}
          unlockedLocations={profile.unlockedLocations}
        />
      </div>

      {/* Global Top HUD Header (Shown in worldmap and adventure views) */}
      {currentView !== 'menu' && (
        <header className="relative z-30 w-full flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/75 border-b border-amber-500/30 backdrop-blur-none font-tech">
          {/* Left Brand & Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                if (currentView === 'adventure') {
                  setCurrentView('worldmap');
                  setActiveLocation(null);
                } else {
                  setCurrentView('menu');
                  setActiveLocation(null);
                }
              }}
              className="p-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-600/40 text-amber-300 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">
                {currentView === 'adventure' ? 'World Map' : 'Main Menu'}
              </span>
            </button>

            <span className="font-egyptian font-bold text-amber-200 text-sm hidden md:inline tracking-wider">
              PHARAOH'S LEGACY
            </span>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setCurrentView('worldmap');
                setActiveLocation(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentView === 'worldmap'
                  ? 'bg-amber-500 text-black border border-amber-400'
                  : 'bg-black/40 text-zinc-300 hover:text-amber-300 border border-zinc-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentView('museum');
                setActiveLocation(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentView === 'museum'
                  ? 'bg-amber-500 text-black border border-amber-400'
                  : 'bg-black/40 text-zinc-300 hover:text-amber-300 border border-zinc-700'
              }`}
            >
              Museum
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentView('quiz');
                setActiveLocation(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentView === 'quiz'
                  ? 'bg-amber-500 text-black border border-amber-400'
                  : 'bg-black/40 text-zinc-300 hover:text-amber-300 border border-zinc-700'
              }`}
            >
              Quiz Arena
            </button>
          </div>

          {/* Right Action Icons (Tokens, Journal, Profile, Settings) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 bg-amber-950/70 border border-amber-500/40 px-2.5 py-1 rounded-lg text-xs text-amber-300">
              <span>🪙</span>
              <span className="font-bold">{profile.scarabTokens}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                setShowJournalModal(true);
              }}
              title="Expedition Journal & Inventory"
              className="p-1.5 bg-black/60 hover:bg-amber-950 border border-amber-500/40 rounded-lg text-amber-300"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowProfileModal(true);
              }}
              title="Explorer Profile & Badges"
              className="p-1.5 bg-black/60 hover:bg-amber-950 border border-amber-500/40 rounded-lg text-amber-300"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setShowSettingsModal(true);
              }}
              title="Settings"
              className="p-1.5 bg-black/60 hover:bg-amber-950 border border-amber-500/40 rounded-lg text-amber-300"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main View Router */}
      <main className="relative z-10 flex-1 overflow-hidden pointer-events-auto">
        {currentView === 'menu' && (
          <MainMenuView
            hasSaveGame={hasSave}
            onStartAdventure={() => {
              setCurrentView('worldmap');
              setActiveLocation(null);
            }}
            onContinueAdventure={() => {
              const lastUnlocked = profile.unlockedLocations[profile.unlockedLocations.length - 1] || 'desert';
              setActiveLocation(lastUnlocked);
              setCurrentView('adventure');
            }}
            onOpenMuseum={() => {
              setCurrentView('museum');
              setActiveLocation(null);
            }}
            onOpenQuiz={() => {
              setCurrentView('quiz');
              setActiveLocation(null);
            }}
            onOpenSettings={() => setShowSettingsModal(true)}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}

        {currentView === 'worldmap' && (
          <WorldMapView
            unlockedLocations={profile.unlockedLocations}
            completedLocations={profile.completedLocations}
            onSelectLocation={locId => {
              setActiveLocation(locId);
              setCurrentView('adventure');
            }}
            playerLevel={profile.level}
          />
        )}

        {currentView === 'adventure' && activeLocation && (
          <div className="relative w-full h-full flex items-center justify-center p-4 overflow-y-auto pointer-events-auto">
            {activeLocation === 'desert' && (
              <DesertScannerPuzzle
                onComplete={() => handleCompleteLocation('desert')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
            {activeLocation === 'pyramid' && (
              <PyramidGeometryPuzzle
                onComplete={() => handleCompleteLocation('pyramid')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
            {activeLocation === 'hieroglyphs' && (
              <HieroglyphicsDecoder
                onComplete={() => handleCompleteLocation('hieroglyphs')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
            {activeLocation === 'tomb' && (
              <LostTombPuzzle
                onComplete={() => handleCompleteLocation('tomb')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
            {activeLocation === 'nile' && (
              <NileSimulator
                onComplete={() => handleCompleteLocation('nile')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
            {activeLocation === 'chamber' && (
              <PharaohsChamberPuzzle
                onComplete={() => handleCompleteLocation('chamber')}
                onHint={hint => setActiveHintMessage(hint)}
              />
            )}
          </div>
        )}

        {currentView === 'museum' && (
          <MuseumView
            onBack={() => setCurrentView('worldmap')}
            onRewardTokens={handleAddTokensAndXp}
          />
        )}

        {currentView === 'quiz' && (
          <QuizArena
            onBack={() => setCurrentView('worldmap')}
            onRewardTokens={handleAddTokensAndXp}
          />
        )}
      </main>

      {/* Floating Khepri AI Guide Companion */}
      <KhepriCompanion
        activeLocation={activeLocation}
        externalHint={activeHintMessage}
        onClearExternalHint={() => setActiveHintMessage(null)}
      />

      {/* Profile & Badges Modal */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Inventory & Quests Modal */}
      {showJournalModal && (
        <JournalModal
          inventory={profile.inventory}
          completedLocations={profile.completedLocations}
          unlockedLocations={profile.unlockedLocations}
          discoveredArtifacts={profile.discoveredArtifacts}
          onClose={() => setShowJournalModal(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={s => setSettings(prev => ({ ...prev, ...s }))}
          onResetProgress={handleResetAllProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}
