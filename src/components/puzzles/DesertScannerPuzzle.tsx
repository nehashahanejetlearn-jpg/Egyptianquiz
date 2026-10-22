import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Radar, Sparkles, CheckCircle2, RotateCcw, HelpCircle, Compass, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DesertScannerPuzzleProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

interface RelicTarget {
  id: number;
  x: number;
  y: number;
  name: string;
  found: boolean;
  frequency: number; // Target frequency in kHz
}

export const DesertScannerPuzzle: React.FC<DesertScannerPuzzleProps> = ({
  onComplete,
  onHint,
}) => {
  const [frequency, setFrequency] = useState<number>(440);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [relics, setRelics] = useState<RelicTarget[]>([
    { id: 1, x: 25, y: 35, name: 'Golden Wing of Khepri', found: false, frequency: 415 },
    { id: 2, x: 75, y: 60, name: 'Sun Disk Prism', found: false, frequency: 520 },
    { id: 3, x: 50, y: 80, name: 'Eye of Horus Lens Core', found: false, frequency: 630 },
  ]);
  const [signalStrength, setSignalStrength] = useState<number>(0);
  const [detectedNear, setDetectedNear] = useState<string | null>(null);

  const calculateSignal = (x: number, y: number, freq: number) => {
    let maxSig = 0;
    let nearName: string | null = null;

    relics.forEach(relic => {
      if (relic.found) return;
      const dist = Math.hypot(relic.x - x, relic.y - y);
      const freqDiff = Math.abs(relic.frequency - freq);

      // Distance factor (0-100)
      const distFactor = Math.max(0, 100 - dist * 2.5);
      // Frequency tuning factor (0-100)
      const freqFactor = Math.max(0, 100 - freqDiff * 1.5);

      const totalSig = Math.round((distFactor * 0.6) + (freqFactor * 0.4));
      if (totalSig > maxSig) {
        maxSig = totalSig;
        if (dist < 18) {
          nearName = relic.name;
        }
      }
    });

    setSignalStrength(maxSig);
    setDetectedNear(nearName);
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setCursorPos({ x, y });
    sound.playScanBeep();
    calculateSignal(x, y, frequency);

    // Check if directly over a relic with good frequency
    relics.forEach(relic => {
      if (relic.found) return;
      const dist = Math.hypot(relic.x - x, relic.y - y);
      const freqMatch = Math.abs(relic.frequency - frequency) < 30;

      if (dist < 10 && freqMatch) {
        // Discovered!
        sound.playTokenCollect();
        const updated = relics.map(r => (r.id === relic.id ? { ...r, found: true } : r));
        setRelics(updated);

        // Check if all found
        if (updated.every(r => r.found)) {
          sound.playSuccessChime();
          confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
          setTimeout(() => {
            onComplete();
          }, 1200);
        }
      }
    });
  };

  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    calculateSignal(cursorPos.x, cursorPos.y, newFreq);
  };

  const handleGiveHint = () => {
    sound.playClick();
    const unfound = relics.find(r => !r.found);
    if (unfound) {
      onHint(
        `KHEPRI SENSOR: Try scanning near ${unfound.x < 50 ? 'Western' : 'Eastern'} sector. Tune resonance dial to around ${unfound.frequency} kHz!`
      );
    }
  };

  const allFound = relics.every(r => r.found);

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Radar className="w-4 h-4 text-cyan-400" /> Ground Penetrating Radar Calibration
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            Desert Relic Resonance Scan
          </h3>
        </div>
        <button
          onClick={handleGiveHint}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-600/40 text-amber-300 font-tech text-xs"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Ask Khepri Hint</span>
        </button>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">
        Three lost components of the <strong>Eye of Ra</strong> are buried beneath the shifting sands. Click on the desert grid to sweep the sonic scanner, and adjust the frequency dial until the signal resonance peaks to extract each relic!
      </p>

      {/* Relic Tracker */}
      <div className="grid grid-cols-3 gap-2">
        {relics.map(r => (
          <div
            key={r.id}
            className={`p-2.5 rounded-xl border text-xs font-tech flex items-center justify-between ${
              r.found
                ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                : 'bg-black/40 border-zinc-700 text-zinc-400'
            }`}
          >
            <span className="truncate">{r.name}</span>
            {r.found ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <span className="text-[10px] uppercase text-zinc-500">Uncalibrated</span>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Radar Grid */}
      <div className="relative">
        <div
          onClick={handleGridClick}
          className="relative w-full aspect-video max-h-[300px] bg-[#1a1510] border-2 border-cyan-500/40 rounded-xl overflow-hidden cursor-crosshair shadow-inner select-none"
        >
          {/* Desert Dune lines */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Scanner Grid Lines */}
          <div className="absolute inset-0 pointer-events-none scanline-overlay" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-500/20" />

          {/* Found Relic Markers */}
          {relics.map(
            r =>
              r.found && (
                <div
                  key={r.id}
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-black font-bold shadow-[0_0_15px_#f59e0b]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-black" />
                </div>
              )
          )}

          {/* Active Sensor Target Ping */}
          <div
            style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-10 h-10 border border-cyan-400 rounded-full animate-ping opacity-60" />
            <div className="w-3 h-3 bg-cyan-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#06b6d4]" />
          </div>
        </div>
      </div>

      {/* Signal Feedback & Frequency Dial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 border border-amber-500/20 p-4 rounded-xl">
        {/* Signal Strength Bar */}
        <div className="flex flex-col gap-1.5 font-tech">
          <div className="flex justify-between text-xs text-amber-300">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Acoustic Resonance Signal:
            </span>
            <span className="font-bold text-cyan-400">{signalStrength}%</span>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div
              style={{ width: `${signalStrength}%` }}
              className={`h-full transition-all duration-300 ${
                signalStrength > 70
                  ? 'bg-gradient-to-r from-emerald-500 to-amber-400 shadow-[0_0_10px_#10b981]'
                  : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
              }`}
            />
          </div>
          <div className="text-[11px] text-zinc-400">
            {detectedNear
              ? `PROXIMITY ALERT: ${detectedNear} detected nearby! Adjust frequency to lock on.`
              : 'Sweeping sand layers... Click different coordinates to pinpoint anomalies.'}
          </div>
        </div>

        {/* Frequency Slider */}
        <div className="flex flex-col gap-1.5 font-tech">
          <div className="flex justify-between text-xs text-amber-300">
            <span>Resonance Tuning Dial:</span>
            <span className="font-bold text-amber-400">{frequency} kHz</span>
          </div>
          <input
            type="range"
            min="350"
            max="700"
            step="5"
            value={frequency}
            onChange={e => handleFrequencyChange(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-500">
            <span>350 kHz (Low Penetration)</span>
            <span>700 kHz (High Spectral)</span>
          </div>
        </div>
      </div>

      {allFound && (
        <div className="bg-emerald-950/70 border border-emerald-500/60 rounded-xl p-3 text-center text-emerald-200 font-tech font-bold text-sm">
          All 3 Eye of Ra fragments uncovered! The ancient artifact powers up and reveals the path to Giza.
        </div>
      )}
    </div>
  );
};
