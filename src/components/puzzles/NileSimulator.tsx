import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Waves, Sprout, ShoppingCart, Users, CheckCircle2, RotateCcw, HelpCircle, ArrowRight, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NileSimulatorProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

type Season = 'Akhet' | 'Peret' | 'Shemu';

export const NileSimulator: React.FC<NileSimulatorProps> = ({
  onComplete,
  onHint,
}) => {
  const [year, setYear] = useState<number>(1);
  const [season, setSeason] = useState<Season>('Akhet');
  const [floodGateLevel, setFloodGateLevel] = useState<number>(16); // 16 cubits = ideal Nilometer flood
  const [canalsDug, setCanalsDug] = useState<number>(2); // 0 to 5
  const [cropsPlanted, setCropsPlanted] = useState<{ wheat: number; flax: number }>({ wheat: 3, flax: 2 });
  const [foodStorage, setFoodStorage] = useState<number>(120);
  const [population, setPopulation] = useState<number>(50);
  const [treasury, setTreasury] = useState<number>(60);
  const [log, setLog] = useState<string[]>([
    'Welcome to the Delta Settlement! Akhet has begun: adjust flood sluices on the Nilometer.',
  ]);

  const advanceSeason = () => {
    sound.playClick();

    if (season === 'Akhet') {
      // Inundation consequence
      let floodResult = '';
      let siltBonus = 0;
      if (floodGateLevel >= 15 && floodGateLevel <= 18) {
        floodResult = 'Ideal Inundation! 16 cubits of dark rich Kemet silt blanketed the floodplain.';
        siltBonus = 40;
      } else if (floodGateLevel < 15) {
        floodResult = 'Low Nile! Silt did not reach distant fields, risking dry soil.';
        siltBonus = -20;
      } else {
        floodResult = 'Violent High Flood! Dikes breached, requiring extra repairs.';
        siltBonus = 10;
        setTreasury(prev => Math.max(0, prev - 15));
      }
      setLog(prev => [floodResult, ...prev]);
      setSeason('Peret');
    } else if (season === 'Peret') {
      // Planting season consequence
      const totalFields = cropsPlanted.wheat + cropsPlanted.flax;
      const waterSupport = canalsDug * 2;
      let plantResult = '';
      if (waterSupport >= totalFields) {
        plantResult = `Flourishing growth! Your ${canalsDug} irrigation canals supplied abundant Nile water to all ${totalFields} fields.`;
      } else {
        plantResult = `Water deficit! Some outer fields dried out due to lack of irrigation canals.`;
      }
      setLog(prev => [plantResult, ...prev]);
      setSeason('Shemu');
    } else if (season === 'Shemu') {
      // Harvest & Trade consequence
      const harvestGain = (cropsPlanted.wheat * 28) + (canalsDug * 10);
      const foodNeeded = population * 2;
      const netFood = foodStorage + harvestGain - foodNeeded;
      const tradeIncome = cropsPlanted.flax * 15;

      const newFood = Math.max(0, netFood);
      const newTreasury = treasury + tradeIncome;
      let newPop = population;

      let harvestResult = '';
      if (netFood >= 0) {
        newPop += 8;
        harvestResult = `Abundant Harvest! Gathered ${harvestGain} sacks of emmer wheat. Delta pop grew to ${newPop}. Earned +${tradeIncome} gold from linen trade.`;
      } else {
        newPop = Math.max(20, newPop - 5);
        harvestResult = `Grain Shortage! Storage depleted by ${Math.abs(netFood)} sacks. Rations tightened.`;
      }

      setFoodStorage(newFood);
      setTreasury(newTreasury);
      setPopulation(newPop);
      setLog(prev => [harvestResult, ...prev]);

      // Check victory condition: Year 3 reached or 200 food storage + 60+ population
      if ((year >= 2 && newFood >= 180) || year >= 3) {
        sound.playSuccessChime();
        confetti({ particleCount: 85, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        setYear(prev => prev + 1);
        setSeason('Akhet');
      }
    }
  };

  const handleDigCanal = () => {
    if (treasury >= 20 && canalsDug < 5) {
      sound.playClick();
      setTreasury(prev => prev - 20);
      setCanalsDug(prev => prev + 1);
      setLog(prev => [`Engineers excavated a new irrigation canal! Canal network: ${canalsDug + 1}/5`, ...prev]);
    } else {
      sound.playTrapWarning();
    }
  };

  const handleTradeWithNubia = () => {
    if (foodStorage >= 40) {
      sound.playTokenCollect();
      setFoodStorage(prev => prev - 40);
      setTreasury(prev => prev + 50);
      setLog(prev => ['Traded 40 sacks of grain to Nubian merchants for 50 gold pieces & cedar wood.', ...prev]);
    } else {
      sound.playTrapWarning();
    }
  };

  const handleAskHint = () => {
    sound.playClick();
    onHint(
      'KHEPRI GOVERNOR HINT: On the Nilometer, 16 cubits was the golden mean ("the flood of joy")! Dig at least 3 canals to keep your wheat and flax fields watered, then advance to Year 2 harvest with a healthy food surplus.'
    );
  };

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-cyan-400" /> Ancient Egyptian Nilotic Simulator
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            The Nile Kingdom — Inundation of Life
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

      {/* Top HUD Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech">
        <div className="bg-black/50 border border-amber-500/30 p-2.5 rounded-xl">
          <div className="text-[10px] text-zinc-400 uppercase">Season & Year</div>
          <div className="text-sm font-bold text-amber-300">
            Year {year} • {season}
          </div>
        </div>
        <div className="bg-black/50 border border-amber-500/30 p-2.5 rounded-xl">
          <div className="text-[10px] text-zinc-400 uppercase">Settlement Citizens</div>
          <div className="text-sm font-bold text-cyan-300 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {population} People
          </div>
        </div>
        <div className="bg-black/50 border border-amber-500/30 p-2.5 rounded-xl">
          <div className="text-[10px] text-zinc-400 uppercase">Grain Granary</div>
          <div className="text-sm font-bold text-amber-400 flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5" /> {foodStorage} Sacks
          </div>
        </div>
        <div className="bg-black/50 border border-amber-500/30 p-2.5 rounded-xl">
          <div className="text-[10px] text-zinc-400 uppercase">Pharaoh Treasury</div>
          <div className="text-sm font-bold text-yellow-400 flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5" /> {treasury} Gold
          </div>
        </div>
      </div>

      {/* Active Season Controls */}
      <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex flex-col gap-4">
        {season === 'Akhet' && (
          <div className="flex flex-col gap-3 font-tech">
            <div className="flex justify-between items-center text-xs">
              <span className="text-cyan-300 font-bold uppercase tracking-wider">
                Akhet: Nile Inundation & Sluice Gate Control
              </span>
              <span className="text-amber-300 font-bold">
                Nilometer: {floodGateLevel} Cubits
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Monsoons have reached the Ethiopian highlands! Regulate the stone floodgate sluices. Ancient records note that 16 cubits guarantees prosperity, while below 14 means famine and above 19 destroys mudbrick settlements.
            </p>
            <input
              type="range"
              min="10"
              max="22"
              value={floodGateLevel}
              onChange={e => setFloodGateLevel(Number(e.target.value))}
              className="accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>10 Cubits (Severe Drought)</span>
              <span className="text-emerald-400 font-bold">16 Cubits (Flood of Joy)</span>
              <span>22 Cubits (Catastrophic Deluge)</span>
            </div>
          </div>
        )}

        {season === 'Peret' && (
          <div className="flex flex-col gap-3 font-tech">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Peret: Emergence, Sowing Crops & Digging Canals
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              The waters have receded, leaving fertile black silt. Allocate land to emmer wheat (nourishes people) and flax (woven into linen for trade). Dig irrigation canals to carry water to distant fields.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300">Irrigation Canals:</span>
                <span className="text-amber-400 font-bold">{canalsDug}/5</span>
                <button
                  onClick={handleDigCanal}
                  disabled={treasury < 20 || canalsDug >= 5}
                  className="px-2.5 py-1 bg-amber-950 hover:bg-amber-800 border border-amber-600/50 rounded text-amber-200 text-xs disabled:opacity-40"
                >
                  Dig Canal (-20 Gold)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-300">Fields:</span>
                <button
                  onClick={() => setCropsPlanted({ wheat: Math.min(5, cropsPlanted.wheat + 1), flax: Math.max(1, cropsPlanted.flax - 1) })}
                  className="px-2 py-0.5 bg-zinc-800 border rounded text-xs"
                >
                  More Wheat ({cropsPlanted.wheat})
                </button>
                <button
                  onClick={() => setCropsPlanted({ wheat: Math.max(1, cropsPlanted.wheat - 1), flax: Math.min(5, cropsPlanted.flax + 1) })}
                  className="px-2 py-0.5 bg-zinc-800 border rounded text-xs"
                >
                  More Flax ({cropsPlanted.flax})
                </button>
              </div>
            </div>
          </div>
        )}

        {season === 'Shemu' && (
          <div className="flex flex-col gap-3 font-tech">
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              Shemu: Golden Harvest & Foreign Trade
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Summer sun ripens the grain! Reapers sickle the barley and thresh wheat on stone floors. Trade surplus grain to Nubian and Levantine traders to enrich the treasury.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTradeWithNubia}
                disabled={foodStorage < 40}
                className="px-3.5 py-1.5 bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500/50 rounded-xl text-yellow-300 text-xs font-bold disabled:opacity-40 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trade 40 Grain for 50 Gold</span>
              </button>
            </div>
          </div>
        )}

        {/* Advance Season Button */}
        <div className="flex justify-end pt-2 border-t border-amber-500/20">
          <button
            onClick={advanceSeason}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-tech font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <span>Advance to {season === 'Akhet' ? 'Peret' : season === 'Peret' ? 'Shemu' : `Year ${year + 1} Akhet`}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chronicle Log */}
      <div className="bg-black/60 border border-zinc-800 p-3 rounded-xl flex flex-col gap-1 max-h-28 overflow-y-auto font-tech text-xs">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">
          Scribe\'s Delta Chronicle:
        </span>
        {log.slice(0, 4).map((entry, idx) => (
          <div key={idx} className="text-zinc-300">
            • {entry}
          </div>
        ))}
      </div>
    </div>
  );
};
