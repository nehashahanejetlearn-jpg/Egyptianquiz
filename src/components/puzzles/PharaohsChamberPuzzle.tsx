import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Crown, Sparkles, CheckCircle2, RotateCcw, HelpCircle, Star, Shield, Sun } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PharaohsChamberPuzzleProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

export const PharaohsChamberPuzzle: React.FC<PharaohsChamberPuzzleProps> = ({
  onComplete,
  onHint,
}) => {
  // Challenge 1: Egyptian Hieroglyphic Numerals
  // Stroke = 1, Heel bone = 10, Coil of rope = 100, Lotus = 1000
  // Riddle: What is [Coil of rope (100)] + [3 Heel bones (30)] + [6 Strokes (6)]? (Answer = 136)
  const [numeralAnswer, setNumeralAnswer] = useState<string>('');
  const [numeralSolved, setNumeralSolved] = useState<boolean>(false);

  // Challenge 2: Orion's Belt Star Alignment (3 stars: Alnitak, Alnilam, Mintaka)
  const [starSequence, setStarSequence] = useState<string[]>([]);
  const [starsSolved, setStarsSolved] = useState<boolean>(false);

  // Challenge 3: Restore the Eye of Ra Shards
  const [shardsPlaced, setShardsPlaced] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerifyNumeral = () => {
    sound.playClick();
    if (numeralAnswer.trim() === '136') {
      sound.playSuccessChime();
      setNumeralSolved(true);
      setErrorMsg(null);
    } else {
      sound.playTrapWarning();
      setErrorMsg('Incorrect numeral tally. Remember: Coil of Rope = 100, Heel Bone = 10, Stroke = 1!');
    }
  };

  const handleStarClick = (starId: string) => {
    if (starsSolved) return;
    const required = ['alnitak', 'alnilam', 'mintaka'];
    const nextIdx = starSequence.length;

    if (required[nextIdx] === starId) {
      sound.playGlyphChime(0.5 + nextIdx * 0.25);
      const updated = [...starSequence, starId];
      setStarSequence(updated);

      if (updated.length === 3) {
        sound.playSuccessChime();
        setStarsSolved(true);
        setErrorMsg(null);
      }
    } else {
      sound.playTrapWarning();
      setErrorMsg('Cosmic discord! Align Orion\'s belt from East to West: Alnitak -> Alnilam -> Mintaka.');
      setStarSequence([]);
    }
  };

  const handleInsertShard = () => {
    if (!numeralSolved || !starsSolved) {
      sound.playTrapWarning();
      setErrorMsg('You must solve the Hieroglyphic Math & Celestial Alignment before unlocking the Sun Core!');
      return;
    }

    sound.playTokenCollect();
    const next = shardsPlaced + 1;
    setShardsPlaced(next);

    if (next === 3) {
      sound.playDoorOpen();
      confetti({ particleCount: 150, spread: 120, origin: { y: 0.5 } });
      setTimeout(() => {
        onComplete();
      }, 1600);
    }
  };

  const handleAskHint = () => {
    sound.playClick();
    if (!numeralSolved) {
      onHint('KHEPRI NUMERAL HINT: In Egyptian numerals, 1 coil of rope = 100, 3 heel bones = 30, and 6 vertical strokes = 6. Sum: 100 + 30 + 6 = 136!');
    } else if (!starsSolved) {
      onHint('KHEPRI ASTRONOMY HINT: The Great Pyramid aligns with Orion\'s belt. Click Alnitak (East), then Alnilam (Middle), then Mintaka (West)!');
    } else {
      onHint('KHEPRI CORE HINT: Click "Insert Artifact Shard" 3 times to seal the Eye of Ra and awaken the Pharaoh\'s ultimate legacy!');
    }
  };

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-400" /> Sanctum of the Sun King • Final Knowledge Trial
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            The Pharaoh's Final Chamber
          </h3>
        </div>
        <button
          onClick={handleAskHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/40 text-amber-300 font-tech text-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Khepri Hint</span>
        </button>
      </div>

      {/* Trial 1: Egyptian Hieroglyphic Numerals */}
      <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3 font-tech">
        <div className="flex justify-between items-center text-xs">
          <span className="text-amber-400 font-bold uppercase tracking-wider">
            Trial 1: Hieroglyphic Numeral Arithmetic
          </span>
          {numeralSolved && (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Decoded (136)
            </span>
          )}
        </div>

        <div className="bg-amber-950/30 border border-amber-500/20 p-3 rounded-lg flex items-center justify-center gap-6 text-center">
          <div>
            <div className="text-3xl text-amber-300">𓍢</div>
            <div className="text-[10px] text-zinc-400 mt-1">Coil of Rope (100)</div>
          </div>
          <span className="text-xl text-zinc-500">+</span>
          <div>
            <div className="text-3xl text-amber-300">𓎆 𓎆 𓎆</div>
            <div className="text-[10px] text-zinc-400 mt-1">3 Heel Bones (30)</div>
          </div>
          <span className="text-xl text-zinc-500">+</span>
          <div>
            <div className="text-2xl text-amber-300">𓏺 𓏺 𓏺 𓏺 𓏺 𓏺</div>
            <div className="text-[10px] text-zinc-400 mt-1">6 Strokes (6)</div>
          </div>
        </div>

        {!numeralSolved && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Enter decimal sum (e.g. 136)"
              value={numeralAnswer}
              onChange={e => setNumeralAnswer(e.target.value)}
              className="bg-[#181a24] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-200 flex-1 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={handleVerifyNumeral}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg"
            >
              Verify Numeral
            </button>
          </div>
        )}
      </div>

      {/* Trial 2: Orion's Belt Celestial Alignment */}
      <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3 font-tech">
        <div className="flex justify-between items-center text-xs">
          <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-cyan-400" /> Trial 2: Celestial Alignment of Sah (Orion)
          </span>
          {starsSolved ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stars Aligned
            </span>
          ) : (
            <span className="text-zinc-400">Order: {starSequence.length}/3</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'alnitak', name: 'Alnitak (Eastern Star)', glyph: '⭐' },
            { id: 'alnilam', name: 'Alnilam (Center Star)', glyph: '🌟' },
            { id: 'mintaka', name: 'Mintaka (Western Star)', glyph: '✨' },
          ].map(star => (
            <button
              key={star.id}
              onClick={() => handleStarClick(star.id)}
              disabled={starsSolved}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                starsSolved
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : starSequence.includes(star.id)
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_10px_#06b6d4]'
                  : 'bg-black/60 border-zinc-700 hover:border-cyan-400 text-zinc-300'
              }`}
            >
              <span className="text-2xl">{star.glyph}</span>
              <span className="text-[11px] text-center font-bold">{star.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trial 3: Restoration of the Eye of Ra Core */}
      <div className="bg-gradient-to-r from-amber-950/40 via-black/60 to-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-tech">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 border border-amber-400 rounded-xl text-amber-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <Sun className={`w-8 h-8 ${shardsPlaced === 3 ? 'text-amber-300 animate-spin' : 'text-amber-500'}`} />
          </div>
          <div>
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Trial 3: Eye of Ra Solar Restoration
            </div>
            <div className="text-xs text-zinc-300">
              Shards Embedded: <strong>{shardsPlaced}/3</strong> • {shardsPlaced === 3 ? 'Eternal Radiance Restored!' : 'Insert fragments to awaken the portal.'}
            </div>
          </div>
        </div>

        {shardsPlaced < 3 && (
          <button
            onClick={handleInsertShard}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech font-bold text-xs flex items-center gap-2 shadow-lg flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Insert Eye of Ra Shard ({shardsPlaced + 1}/3)</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 p-2.5 rounded-xl font-tech text-center">
          {errorMsg}
        </div>
      )}

      {shardsPlaced === 3 && (
        <div className="p-4 bg-emerald-950/70 border border-emerald-500/60 rounded-xl text-center text-emerald-200 font-tech font-bold text-sm animate-in zoom-in-95 duration-300 flex items-center justify-center gap-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <span>PHARAOH'S LEGACY UNLOCKED! The gods bestow upon you the Crown of Eternity!</span>
        </div>
      )}
    </div>
  );
};
