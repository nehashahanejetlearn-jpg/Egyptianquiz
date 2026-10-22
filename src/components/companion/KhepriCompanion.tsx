import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Bot, Sparkles, Send, Volume2, X, ChevronUp, ChevronDown, Lightbulb, MessageSquare, BookOpen } from 'lucide-react';
import { LocationId } from '../../types/game';

interface KhepriCompanionProps {
  activeLocation: LocationId | null;
  onSelectHint?: (hint: string) => void;
  externalHint?: string | null;
  onClearExternalHint?: () => void;
}

export const KhepriCompanion: React.FC<KhepriCompanionProps> = ({
  activeLocation,
  onSelectHint,
  externalHint,
  onClearExternalHint,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'khepri' | 'user'; text: string }>>([
    {
      sender: 'khepri',
      text: 'Greetings, Explorer! I am KHEPRI, your autonomous holographic archaeological companion. Ask me anything about ancient Egyptian pyramids, gods, hieroglyphs, or request progressive hints for your mission!',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Progressive hint levels (1 = subtle, 2 = context, 3 = solution)
  const [hintTier, setHintTier] = useState<number>(1);

  // Contextual Progressive Hints Map
  const LOCATION_HINTS: Record<LocationId, { tier1: string; tier2: string; tier3: string }> = {
    desert: {
      tier1: 'Subtle Scan: Sweep across the sand dunes. Look for acoustic resonance spikes near the corners.',
      tier2: 'Frequency Tuning: The relics resonate at different frequencies between 400 and 650 kHz.',
      tier3: 'Direct Solution: Relic 1 is at coordinates (25, 35) at ~415 kHz; Relic 2 is at (75, 60) at ~520 kHz; Relic 3 is at (50, 80) at ~630 kHz.',
    },
    pyramid: {
      tier1: 'Spatial Clue: Egyptian architects used corbelled vaults to bridge ceilings without collapse.',
      tier2: 'Airway Clearance: Rows 2 and 3 require the center vertical column to remain open for the corridor.',
      tier3: 'Direct Blueprint: Keep column 2 open on the lower tiers, place the golden Pyramidion capstone at the top center (row 0, col 2), and set the seked slider to 51°!',
    },
    hieroglyphs: {
      tier1: 'Reading Order: Honorific transposition in royal cartouches means the divine sun god name is written first.',
      tier2: 'Phonetic Pairing: The 3 glyphs translate to Sun (Ra), Senet Board (Men), and Eternal Life (Ankh).',
      tier3: 'Direct Password: Select Ra (𓇳), then Men (𓏠), then Ankh (𓋹). The door password is "RAMENANKH".',
    },
    tomb: {
      tier1: 'Tomb Sequence: The wall carvings depict the progression from tomb guardian to dawn.',
      tier2: 'Illumination: The dark chamber requires temple oil combined with your exploratory torch.',
      tier3: 'Ma\'at Scales: Step order: Jackal -> Scarab -> Ankh -> Cobra. On the scale, place weights totaling exactly 42 debens (20 + 20 + 2).',
    },
    nile: {
      tier1: 'Inundation Target: The Nilometer measures seasonal river height. 16 cubits brings maximum fertile black silt.',
      tier2: 'Canal Network: Dig at least 2-3 irrigation canals to distribute water to distant barley fields.',
      tier3: 'Trade Surplus: Grow wheat to feed the people, weave flax into linen, and trade 40 grain for 50 gold to maintain a strong treasury!',
    },
    chamber: {
      tier1: 'Arithmetic Clue: Egyptian numerals: 1 coil = 100, 1 heel bone = 10, 1 stroke = 1.',
      tier2: 'Constellation: Align the three stars of Orion\'s belt from east to west.',
      tier3: 'Final Solution: Enter 136 for the arithmetic riddle. Click Alnitak -> Alnilam -> Mintaka. Then insert all 3 Eye of Ra shards into the solar pedestal!',
    },
  };

  const QUICK_QUESTIONS = [
    'Why did Egyptians build pyramids?',
    'What does the Ankh symbolize?',
    'Who was Anubis?',
    'How did the Nile flood work?',
    'Give me a progressive hint!',
  ];

  // Comprehensive rule-based knowledge engine
  const answerQuery = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('hint') || q.includes('stuck') || q.includes('help')) {
      if (!activeLocation) {
        return 'Select a destination on the World Map (like the Desert, Great Pyramid, or Lost Tomb) and I will provide tailored progressive hints!';
      }
      const hints = LOCATION_HINTS[activeLocation];
      if (hintTier === 1) {
        setHintTier(2);
        return `[HINT LEVEL 1 - OBSERVATION]: ${hints.tier1}`;
      } else if (hintTier === 2) {
        setHintTier(3);
        return `[HINT LEVEL 2 - CONTEXT]: ${hints.tier2}`;
      } else {
        setHintTier(1);
        return `[HINT LEVEL 3 - DIRECT SOLUTION]: ${hints.tier3}`;
      }
    }

    if (q.includes('pyramid') || q.includes('build') || q.includes('tomb')) {
      return 'Pyramids served as resurrection machines and monumental tombs for pharaohs. They believed preserving the pharaoh\'s body and providing grave goods ensured their soul (Ka and Ba) could ascend to the stars (the Imperishable Stars) and protect Egypt for eternity!';
    }
    if (q.includes('ankh') || q.includes('symbol') || q.includes('life')) {
      return 'The Ankh (𓋹) is the ancient Egyptian hieroglyphic symbol for "life" and "eternal living." Gods are frequently depicted holding an ankh by its loop or offering it to the pharaoh\'s nose as the breath of eternal life.';
    }
    if (q.includes('anubis') || q.includes('jackal') || q.includes('god of')) {
      return 'Anubis was the jackal-headed god of embalming, mummification, and guardian of tombs. He guided souls to the Hall of Two Truths and placed the deceased\'s heart on the scales against the Feather of Ma\'at.';
    }
    if (q.includes('nile') || q.includes('flood') || q.includes('akhet')) {
      return 'The Nile\'s annual flood (Akhet) was caused by monsoon rains in the Ethiopian highlands. It deposited rich, nutrient-packed black silt (Kemet) along the riverbanks, allowing Egyptian agriculture to thrive in the middle of a desert.';
    }
    if (q.includes('mummy') || q.includes('mummif') || q.includes('natron')) {
      return 'Mummification took 70 days! Embalmers packed the body with natural natron salt to dehydrate it for 40 days, removed the organs into 4 Canopic jars, left the heart inside, and wrapped the body in hundreds of yards of fine linen with protective amulets.';
    }
    if (q.includes('rosetta') || q.includes('hieroglyph') || q.includes('champollion')) {
      return 'The Rosetta Stone, found in 1799, contained the same decree in three scripts: Hieroglyphs, Demotic, and Ancient Greek. In 1822, Jean-François Champollion deciphered it, proving hieroglyphs were both phonetic sounds and ideographic concepts!';
    }
    if (q.includes('tut') || q.includes('king tut') || q.includes('carter')) {
      return 'Tutankhamun ruled during the 18th Dynasty and died around age 19. His tomb (KV62) was discovered almost completely intact in November 1922 by Howard Carter, revealing over 5,000 dazzling golden treasures!';
    }
    if (q.includes('eye') || q.includes('horus') || q.includes('wedjat') || q.includes('ra')) {
      return 'The Eye of Horus (Wedjat) represents protection, healing, and wholeness. The Eye of Ra represents the destructive and radiant solar power of the Sun God Ra that defends cosmic order against chaos.';
    }

    return 'Fascinating archaeological query! Ancient Egyptian civilization endured for over 3,000 years, balancing Ma\'at (cosmic harmony) against Isfet (chaos). You can explore our Museum or ask about specific gods, monuments, and puzzles!';
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    sound.playClick();
    const userMsg = { sender: 'user' as const, text };
    const reply = answerQuery(text);

    setMessages(prev => [...prev, userMsg, { sender: 'khepri' as const, text: reply }]);
    setInputText('');

    // Trigger speech if voice active
    if (isSpeaking) {
      sound.speak(reply);
    }
  };

  const handleToggleVoice = () => {
    sound.playClick();
    if (isSpeaking) {
      sound.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const lastKhepri = [...messages].reverse().find(m => m.sender === 'khepri');
      if (lastKhepri) sound.speak(lastKhepri.text, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* External Hint Alert Bubble (when triggered by puzzle) */}
      {externalHint && (
        <div className="mb-3 max-w-sm bg-gradient-to-r from-amber-950/95 to-black/95 border-2 border-amber-400 text-amber-200 p-3.5 rounded-2xl shadow-2xl font-tech text-xs animate-in slide-in-from-bottom-3 duration-300 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 block uppercase tracking-wider text-[10px]">
                KHEPRI SENSOR TRANSMISSION
              </span>
              <p className="text-zinc-200 text-xs mt-0.5">{externalHint}</p>
            </div>
          </div>
          <button
            onClick={onClearExternalHint}
            className="text-amber-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#12141a]/95 border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[460px] animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#181a24] to-[#0c0d12] p-3.5 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-cyan-400 flex items-center justify-center text-black shadow-[0_0_10px_#06b6d4]">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="font-tech font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <span>KHEPRI v2.4</span>
                  <span className="text-[10px] bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-500/40 text-cyan-300">
                    AI GUIDE
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-tech">
                  Robotic Scarab Archaeologist
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleVoice}
                title="Toggle Voice Read Aloud"
                className={`p-1.5 rounded-lg border text-xs ${
                  isSpeaking
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-black/40 border-zinc-700 text-zinc-300 hover:text-amber-300'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-black/40 border-b border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar font-tech text-[11px]">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 overflow-y-auto flex flex-col gap-3 font-sans text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-none'
                      : 'bg-black/60 border border-amber-500/30 text-amber-100 rounded-tl-none font-sans'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 bg-black/60 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask Khepri anything about Egypt..."
              className="flex-1 bg-[#181a24] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-amber-100 font-sans focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-black rounded-xl font-bold transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Companion Floating Avatar Button */}
      <button
        onClick={() => {
          sound.playScanBeep();
          setIsOpen(!isOpen);
        }}
        className="group relative flex items-center gap-2.5 bg-[#12141a]/95 hover:bg-[#1a1d26] border-2 border-cyan-400 text-cyan-200 px-4 py-2.5 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all font-tech tracking-wider text-xs"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-cyan-400 flex items-center justify-center text-black font-bold shadow-md group-hover:scale-105 transition-transform">
          <Bot className="w-4 h-4 text-black" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-cyan-300 text-xs flex items-center gap-1">
            KHEPRI GUIDE <Sparkles className="w-3 h-3 text-amber-400" />
          </span>
          <span className="text-[10px] text-zinc-400">
            {isOpen ? 'Close Assistant' : 'Ask Hints & History'}
          </span>
        </div>
      </button>
    </div>
  );
};
