import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Box, RotateCw, CheckCircle2, RotateCcw, HelpCircle, Triangle, Sparkles, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PyramidGeometryPuzzleProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

interface BlockPiece {
  id: number;
  label: string;
  shape: number[][]; // 2D matrix
  rotation: number; // 0, 90, 180, 270
  placed: boolean;
  color: string;
}

export const PyramidGeometryPuzzle: React.FC<PyramidGeometryPuzzleProps> = ({
  onComplete,
  onHint,
}) => {
  // 5x5 Pyramid Chamber Arch Grid: 1 = target stone, 0 = empty air corridor
  // The goal is to construct the corbelled ceiling arch leading to the King's Chamber!
  const TARGET_GRID = [
    [0, 0, 1, 0, 0], // Capstone slot
    [0, 1, 1, 1, 0], // Tier 2
    [1, 1, 0, 1, 1], // Corbelled vault archway
    [1, 1, 0, 1, 1], // Lower wall support
  ];

  const INITIAL_BLOCKS: BlockPiece[] = [
    {
      id: 1,
      label: 'West Pillar Block',
      shape: [
        [1, 1],
        [1, 1],
      ],
      rotation: 0,
      placed: false,
      color: '#d97706',
    },
    {
      id: 2,
      label: 'East Pillar Block',
      shape: [
        [1, 1],
        [1, 1],
      ],
      rotation: 0,
      placed: false,
      color: '#b45309',
    },
    {
      id: 3,
      label: 'Corbel Lintel Beam',
      shape: [
        [1, 1, 1],
      ],
      rotation: 0,
      placed: false,
      color: '#ca8a04',
    },
    {
      id: 4,
      label: 'Apex Capstone (Pyramidion)',
      shape: [
        [1],
      ],
      rotation: 0,
      placed: false,
      color: '#eab308',
    },
  ];

  const [blocks, setBlocks] = useState<BlockPiece[]>(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState<number>(1);
  const [placedSlots, setPlacedSlots] = useState<{ [slotKey: string]: number }>({});
  const [sekedAnswer, setSekedAnswer] = useState<number>(51);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Rotate selected block 90 degrees
  const handleRotate = (blockId: number) => {
    sound.playClick();
    setBlocks(prev =>
      prev.map(b => (b.id === blockId ? { ...b, rotation: (b.rotation + 90) % 360 } : b))
    );
  };

  const handleSlotClick = (row: number, col: number) => {
    const slotKey = `${row}-${col}`;
    if (TARGET_GRID[row][col] === 0) {
      sound.playTrapWarning();
      setErrorMsg('This space must remain open for the Grand Gallery corridor!');
      setTimeout(() => setErrorMsg(null), 2000);
      return;
    }

    sound.playClick();
    const activeBlock = blocks.find(b => b.id === selectedBlockId);
    if (!activeBlock) return;

    // Toggle slot with active block
    setPlacedSlots(prev => {
      const next = { ...prev };
      if (next[slotKey] === activeBlock.id) {
        delete next[slotKey];
      } else {
        next[slotKey] = activeBlock.id;
      }
      return next;
    });
  };

  const handleReset = () => {
    sound.playClick();
    setPlacedSlots({});
    setErrorMsg(null);
  };

  const handleValidate = () => {
    sound.playClick();
    // Count target slots
    let totalTargetFilled = 0;
    let expectedTargets = 0;

    for (let r = 0; r < TARGET_GRID.length; r++) {
      for (let c = 0; c < TARGET_GRID[r].length; c++) {
        if (TARGET_GRID[r][c] === 1) {
          expectedTargets++;
          if (placedSlots[`${r}-${c}`]) {
            totalTargetFilled++;
          }
        } else {
          // Corridor must be empty
          if (placedSlots[`${r}-${c}`]) {
            sound.playTrapWarning();
            setErrorMsg('Corridor clearance violated! The center passage must remain open.');
            return;
          }
        }
      }
    }

    if (totalTargetFilled === expectedTargets && Math.abs(sekedAnswer - 51) <= 1) {
      sound.playDoorOpen();
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      sound.playTrapWarning();
      setErrorMsg(`Masonry incomplete (${totalTargetFilled}/${expectedTargets} stones positioned). Fill all wall supports and apex capstone!`);
    }
  };

  const handleAskHint = () => {
    sound.playClick();
    onHint(
      'KHEPRI GEOMETRY HINT: The ancient architects used a corbelled vault. Leave the central column (columns 2) open on rows 2 and 3 for the corridor. Place the golden capstone at the top center (row 0, col 2)!'
    );
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Triangle className="w-4 h-4 text-amber-400" /> Architectural Seked & Spatial Reasoning
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            The Great Pyramid Corbelled Arch
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

      {/* Educational Math Note */}
      <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-3.5 text-xs text-amber-200/90 leading-relaxed font-sans">
        <strong className="text-amber-300 font-tech uppercase tracking-wider block mb-1">
          Historical Engineering Principle: The Seked
        </strong>
        Egyptian builders measured pyramid slopes in <em>sekeds</em>—the horizontal run in palms for every vertical rise of one royal cubit (7 palms). For Khufu's pyramid, a seked of <strong>5½ palms</strong> created an angle of <strong>51° 50'</strong>, dispersing millions of tons of pressure away from inner royal chambers!
      </div>

      {/* Interactive Stone Laying Grid */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-2">
        {/* Chamber Cross-Section Grid */}
        <div className="flex flex-col gap-2 items-center">
          <div className="text-xs font-tech text-amber-400 uppercase font-bold tracking-wider">
            Chamber Masonry Blueprint
          </div>
          <div className="grid grid-cols-5 gap-2 p-3 bg-black/60 border border-amber-500/40 rounded-xl shadow-inner">
            {TARGET_GRID.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const key = `${rIdx}-${cIdx}`;
                const isTarget = cell === 1;
                const placedBlockId = placedSlots[key];
                const blockInfo = blocks.find(b => b.id === placedBlockId);

                return (
                  <button
                    key={key}
                    onClick={() => handleSlotClick(rIdx, cIdx)}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-tech font-bold text-xs transition-all ${
                      placedBlockId
                        ? 'border-amber-300 text-black shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                        : isTarget
                        ? 'border-dashed border-amber-500/50 hover:border-amber-400 bg-amber-950/20 text-amber-500/60'
                        : 'border-zinc-800 bg-black/40 text-zinc-600 hover:border-red-500/40'
                    }`}
                    style={{
                      backgroundColor: blockInfo ? blockInfo.color : undefined,
                    }}
                  >
                    {placedBlockId ? (
                      <Box className="w-5 h-5 text-black" />
                    ) : isTarget ? (
                      <span className="text-[10px]">Stone</span>
                    ) : (
                      <span className="text-[10px] text-zinc-600">Air</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
          <div className="text-[11px] font-tech text-zinc-400">
            Center corridor must remain open for airflow and passageway.
          </div>
        </div>

        {/* Stone Masonry Block Selector */}
        <div className="flex flex-col gap-3 w-full md:w-56 font-tech">
          <div className="text-xs text-amber-400 uppercase font-bold tracking-wider">
            Master Mason Stones
          </div>
          <div className="flex flex-col gap-2">
            {blocks.map(b => (
              <div
                key={b.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedBlockId(b.id);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  selectedBlockId === b.id
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                    : 'border-zinc-700 bg-black/40 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: b.color }}
                  />
                  <span className="text-xs truncate">{b.label}</span>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleRotate(b.id);
                  }}
                  title="Rotate Block"
                  className="p-1 rounded hover:bg-amber-400/20 text-amber-400"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Seked Incline Angle Calibration */}
          <div className="mt-2 p-3 bg-black/50 border border-amber-500/20 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-amber-300">
              <span>Pyramid Seked Angle:</span>
              <span className="font-bold text-amber-400">{sekedAnswer}°</span>
            </div>
            <input
              type="range"
              min="40"
              max="65"
              value={sekedAnswer}
              onChange={e => setSekedAnswer(Number(e.target.value))}
              className="accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>40° (Too Shallow)</span>
              <span>51° 50' (Khufu Ideal)</span>
              <span>65° (Too Steep)</span>
            </div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 p-2.5 rounded-xl font-tech text-center">
          {errorMsg}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-amber-500/20 pt-4">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-tech text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Stones</span>
        </button>

        <button
          onClick={handleValidate}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech font-bold text-sm shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Inspect & Seal Chamber Arch</span>
        </button>
      </div>
    </div>
  );
};
