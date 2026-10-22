import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Scale, Flame, Key, ShieldAlert, CheckCircle2, RotateCcw, HelpCircle, Sparkles, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LostTombPuzzleProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

export const LostTombPuzzle: React.FC<LostTombPuzzleProps> = ({
  onComplete,
  onHint,
}) => {
  // Phase 1: Disarm Pressure Plate Corridor (Correct order: Jackal -> Scarab -> Ankh -> Cobra)
  const PRESSURE_SEQUENCE = ['jackal', 'scarab', 'ankh', 'cobra'];
  const [currentStep, setCurrentStep] = useState<string[]>([]);
  const [platesDisarmed, setPlatesDisarmed] = useState<boolean>(false);

  // Phase 2: Combine Torch + Oil to light Chamber Braziers
  const [hasTorch, setHasTorch] = useState<boolean>(true);
  const [hasOil, setHasOil] = useState<boolean>(true);
  const [torchLit, setTorchLit] = useState<boolean>(false);

  // Phase 3: Weighing of the Heart (Balance Scale)
  // Heart weight = 42 debens (symbolic of the 42 Negative Confessions!)
  const [heartWeight] = useState<number>(42);
  const [scaleWeights, setScaleWeights] = useState<number[]>([]);
  const currentScaleTotal = scaleWeights.reduce((a, b) => a + b, 0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle stepping on pressure plates
  const handleStepPlate = (symbol: string) => {
    if (platesDisarmed) return;
    const nextIndex = currentStep.length;

    if (PRESSURE_SEQUENCE[nextIndex] === symbol) {
      sound.playGlyphChime(0.5 + nextIndex * 0.2);
      const updated = [...currentStep, symbol];
      setCurrentStep(updated);
      setErrorMsg(null);

      if (updated.length === PRESSURE_SEQUENCE.length) {
        sound.playSuccessChime();
        setPlatesDisarmed(true);
      }
    } else {
      sound.playTrapWarning();
      setErrorMsg('TRAP TRIGGERED! Dart mechanism rattled. The order of guardians must be respected.');
      setCurrentStep([]);
    }
  };

  // Combine items
  const handleCombineTorch = () => {
    if (hasTorch && hasOil) {
      sound.playSuccessChime();
      setTorchLit(true);
      setErrorMsg(null);
    }
  };

  // Add weight to Ma'at's scale
  const handleAddWeight = (val: number) => {
    sound.playClick();
    setScaleWeights(prev => [...prev, val]);
  };

  const handleClearWeights = () => {
    sound.playClick();
    setScaleWeights([]);
  };

  // Final validation of tomb trials
  const handleValidateTomb = () => {
    if (!platesDisarmed) {
      sound.playTrapWarning();
      setErrorMsg('The corridor pressure plates are still armed!');
      return;
    }
    if (!torchLit) {
      sound.playTrapWarning();
      setErrorMsg('The burial chamber is pitch black! Combine the torch and temple oil to light the way.');
      return;
    }
    if (currentScaleTotal !== heartWeight) {
      sound.playTrapWarning();
      setErrorMsg(`The scales are unbalanced (${currentScaleTotal} vs ${heartWeight} debens)! Ammit the Devourer growls.`);
      return;
    }

    // Success!
    sound.playDoorOpen();
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.6 } });
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const handleAskHint = () => {
    sound.playClick();
    if (!platesDisarmed) {
      onHint('KHEPRI TRAP HINT: Ancient texts state: "First walks the Jackal of the threshold (Anubis), then the Scarab of dawn, then the Ankh of life, and last the protective Cobra (Wadjet)!"');
    } else if (!torchLit) {
      onHint('KHEPRI HINT: Click the "Soak Torch in Sacred Oil" button to ignite the eternal fire.');
    } else {
      onHint('KHEPRI WEIGHING HINT: In the Book of the Dead, there are 42 judges of Ma\'at. You need exactly 42 debens of weight on the right side of the scale (e.g. 20 + 20 + 2)!');
    }
  };

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Skull className="w-4 h-4 text-purple-400" /> Underworld Trials & Trap Navigation
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            The Lost Tomb of Anubis
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

      {/* Trial 1: Pressure Plate Corridor */}
      <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-tech">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Trial 1: Pressure Plate Corridor
          </span>
          {platesDisarmed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Traps Disarmed
            </span>
          ) : (
            <span className="text-amber-300">
              Sequence: {currentStep.length}/4
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2 pt-1">
          {[
            { id: 'jackal', label: 'Jackal of Anubis', symbol: '𓃦' },
            { id: 'scarab', label: 'Sacred Scarab', symbol: '𓆣' },
            { id: 'ankh', label: 'Key of Life', symbol: '𓋹' },
            { id: 'cobra', label: 'Uraeus Cobra', symbol: '𓆓' },
          ].map(plate => (
            <button
              key={plate.id}
              onClick={() => handleStepPlate(plate.id)}
              disabled={platesDisarmed}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 font-tech transition-all ${
                platesDisarmed
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : currentStep.includes(plate.id)
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 scale-95 shadow-[0_0_10px_#f59e0b]'
                  : 'bg-black/60 border-zinc-700 hover:border-amber-400 text-zinc-300'
              }`}
            >
              <span className="text-2xl">{plate.symbol}</span>
              <span className="text-[10px] text-center">{plate.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Trial 2: Item Combining */}
      <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-amber-400">
            <Flame className={`w-6 h-6 ${torchLit ? 'text-amber-400 animate-bounce' : 'text-zinc-500'}`} />
          </div>
          <div>
            <div className="text-xs font-tech text-amber-400 font-bold uppercase">
              Trial 2: Chamber Illumination
            </div>
            <div className="text-xs text-zinc-300">
              {torchLit
                ? 'Ceremonial torch ignited with sacred oil! The burial chamber glows with warm light.'
                : 'Burial chamber is shrouded in impenetrable dark. Combine torch with temple oil.'}
            </div>
          </div>
        </div>

        {!torchLit && (
          <button
            onClick={handleCombineTorch}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-md flex-shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soak & Light Torch</span>
          </button>
        )}
      </div>

      {/* Trial 3: The Weighing of the Heart (Scales of Ma'at) */}
      <div className="bg-black/50 border border-amber-500/30 rounded-xl p-4 flex flex-col gap-3 font-tech">
        <div className="flex justify-between items-center text-xs">
          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-cyan-400" /> Trial 3: Scales of Ma'at (Hall of Judgment)
          </span>
          <span className="text-xs text-zinc-400">
            Target: <strong className="text-cyan-300">42 Debens</strong> (The 42 Confessions)
          </span>
        </div>

        {/* Visual Scale balance */}
        <div className="flex items-center justify-between bg-black/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex flex-col items-center">
            <span className="text-2xl">❤️</span>
            <span className="text-[11px] text-amber-300 font-bold mt-1">Heart of Pharaoh</span>
            <span className="text-xs text-zinc-400">{heartWeight} Debens</span>
          </div>

          {/* Scale beam */}
          <div className="flex-1 mx-6 flex flex-col items-center">
            <div className="w-full h-1 bg-amber-500/60 relative">
              {/* Fulcrum marker */}
              <div
                style={{
                  transform: `rotate(${Math.min(25, Math.max(-25, (currentScaleTotal - heartWeight) * 2))}deg)`,
                }}
                className="w-full h-1 bg-amber-400 transition-transform duration-300"
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-2">
              Status: {currentScaleTotal === heartWeight ? '⚖️ PERFECT EQUILIBRIUM' : currentScaleTotal > heartWeight ? 'Too Heavy!' : 'Too Light!'}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl">🪶</span>
            <span className="text-[11px] text-cyan-300 font-bold mt-1">Feather of Truth</span>
            <span className="text-xs font-bold text-amber-400">{currentScaleTotal} Debens</span>
          </div>
        </div>

        {/* Weight Counterweights */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-400">Place Weights:</span>
            {[2, 5, 10, 20].map(val => (
              <button
                key={val}
                onClick={() => handleAddWeight(val)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-amber-950 border border-zinc-700 hover:border-amber-500 rounded text-amber-200 text-xs font-bold"
              >
                +{val}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearWeights}
            className="flex items-center gap-1 text-zinc-400 hover:text-amber-300 text-xs"
          >
            <RotateCcw className="w-3 h-3" /> Reset Scales
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 p-2.5 rounded-xl font-tech text-center">
          {errorMsg}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end border-t border-amber-500/20 pt-4">
        <button
          onClick={handleValidateTomb}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        >
          <Key className="w-4 h-4" />
          <span>Unlock Golden Anubis Sarcophagus</span>
        </button>
      </div>
    </div>
  );
};
