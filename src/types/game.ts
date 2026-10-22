/**
 * Pharaoh's Legacy - TypeScript Definitions
 */

export type LocationId = 'desert' | 'pyramid' | 'hieroglyphs' | 'tomb' | 'nile' | 'chamber';

export type GameView = 'menu' | 'worldmap' | 'adventure' | 'museum' | 'quiz' | 'settings';

export interface LocationInfo {
  id: LocationId;
  name: string;
  subtitle: string;
  description: string;
  requiredLevel: number;
  unlocked: boolean;
  completed: boolean;
  coordinates: { x: number; y: number };
  artifactReward: string;
  xpReward: number;
  tokensReward: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  historicalNote: string;
  category: 'artifact' | 'tool' | 'key' | 'scroll';
  usableInLocation?: LocationId;
}

export interface MuseumExhibit {
  id: string;
  title: string;
  category: string;
  era: string;
  summary: string;
  detailedText: string[];
  keyFacts: string[];
  artifactType: 'sarcophagus' | 'canopic' | 'rosetta' | 'ankh' | 'pyramid' | 'boat' | 'eye' | 'sphinx' | 'khopesh' | 'senet';
  audioTranscript: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface QuizQuestion {
  id: number;
  category: 'History & Dynasties' | 'Pyramids & Engineering' | 'Gods & Religion' | 'Hieroglyphs & Daily Life';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Apprentice' | 'Explorer' | 'High Priest';
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'story' | 'puzzle' | 'knowledge' | 'simulation';
}

export interface PlayerProfile {
  name: string;
  title: string;
  avatar: string;
  companionSkin: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  scarabTokens: number;
  discoveredArtifacts: string[];
  inventory: InventoryItem[];
  completedLocations: LocationId[];
  unlockedLocations: LocationId[];
  achievements: AchievementBadge[];
  highScoreQuiz: number;
  hintsUsed: number;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  narrationVolume: number;
  soundEnabled: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  scannerHudGlow: boolean;
}
