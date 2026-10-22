import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Scroll, HelpCircle, CheckCircle2, RotateCcw, Key, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HieroglyphicsDecoderProps {
  onComplete: () => void;
  onHint: (hint: string) => void;
}

interface GlyphItem {
  id: string;
  char: string;
  gardiner: string;
  phonetic: string;
  meaning: string;
  historicalType: 'Phonogram' | 'Ideogram' | 'Determinative';
}

export const HieroglyphicsDecoder: React.FC<HieroglyphicsDecoderProps> = ({
  onComplete,
  onHint,
}) => {
  // Authentic Egyptian Glyphs palette
  const GLYPH_CATALOG: GlyphItem[] = [
    { id: 'ankh', char: '𓋹', gardiner: 'S34', phonetic: 'ˁnḫ (Ankh)', meaning: 'Life / Eternal Living', historicalType: 'Ideogram' },
    { id: 'ra', char: '𓇳', gardiner: 'N5', phonetic: 'rˁ (Ra)', meaning: 'Sun / Solar Deity', historicalType: 'Ideogram' },
    { id: 'water', char: '𓈖', gardiner: 'N35', phonetic: 'n (En)', meaning: 'Water ripple / Sound "N"', historicalType: 'Phonogram' },
    { id: 'scarab', char: '𓆣', gardiner: 'L1', phonetic: 'ḫpr (Khepri)', meaning: 'Scarab / Transformation', historicalType: 'Ideogram' },
    { id: 'men', char: '𓏠', gardiner: 'Y5', phonetic: 'mn (Men)', meaning: 'Gameboard / Enduring', historicalType: 'Phonogram' },
    { id: 'feather', char: '𓆄', gardiner: 'H6', phonetic: 'šw / mꜣˁt (Maat)', meaning: 'Ostrich Feather / Truth', historicalType: 'Ideogram' },
    { id: 'eye', char: '𓁹', gardiner: 'D4', phonetic: 'jr (Ir)', meaning: 'Eye / Seeing / Creation', historicalType: 'Ideogram' },
    { id: 'staff', char: '𓌀', gardiner: 'S40', phonetic: 'wꜣs (Was)', meaning: 'Was Sceptre / Dominion', historicalType: 'Ideogram' },
  ];

  // Target inscription: Cartouche for "RA - MEN - ANKH" (Living Image of Ra Enduring)
  const TARGET_CARTOUCHE = ['ra', 'men', 'ankh'];
  const TARGET_TRANSLATION = 'RA - MEN - ANKH';

  const [selectedGlyphs, setSelectedGlyphs] = useState<GlyphItem[]>([]);
  const [activeInspector, setActiveInspector] = useState<GlyphItem | null>(GLYPH_CATALOG[0]);
  const [doorPassword, setDoorPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDecoded, setIsDecoded] = useState<boolean>(false);

  const handleAddGlyph = (glyph: GlyphItem) => {
    sound.playGlyphChime(0.6 + selectedGlyphs.length * 0.15);
    setActiveInspector(glyph);

    if (selectedGlyphs.length < 3) {
      const updated = [...selectedGlyphs, glyph];
      setSelectedGlyphs(updated);

      if (updated.length === 3) {
        // Check if matches target sequence
        const matches = updated.every((g, idx) => g.id === TARGET_CARTOUCHE[idx]);
        if (matches) {
          sound.playSuccessChime();
          setIsDecoded(true);
          setErrorMsg(null);
        } else {
          sound.playTrapWarning();
          setErrorMsg('The glyph sequence does not honor the royal cartouche order. Inspect the phonetic values!');
        }
      }
    }
  };

  const handleClear = () => {
    sound.playClick();
    setSelectedGlyphs([]);
    setErrorMsg(null);
    setIsDecoded(false);
  };

  const handleUnlockDoor = () => {
    sound.playClick();
    const cleanInput = doorPassword.trim().toUpperCase();
    if (cleanInput === 'RAMENANKH' || cleanInput === 'RA-MEN-ANKH' || cleanInput === 'ANKH' || isDecoded) {
      sound.playDoorOpen();
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      sound.playTrapWarning();
      setErrorMsg('Incorrect sanctuary pass-phrase. Translate the cartouche above or enter "RAMENANKH"!');
    }
  };

  const handleAskHint = () => {
    sound.playClick();
    onHint(
      'KHEPRI LINGUISTIC HINT: In Egyptian royal cartouches, divine names come first! 1st: The Sun Disk (Ra - 𓇳). 2nd: The Senet Gameboard (Men - 𓏠). 3rd: The Key of Life (Ankh - 𓋹).'
    );
  };

  return (
    <div className="bg-[#12141a]/95 border border-amber-500/40 rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto flex flex-col gap-5 text-amber-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div>
          <div className="text-xs font-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Scroll className="w-4 h-4 text-amber-400" /> Scribe Translation Slate & Cartouche Decryption
          </div>
          <h3 className="text-xl font-egyptian font-bold text-amber-100">
            The Temple of Sacred Hieroglyphs
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

      {/* Educational Note */}
      <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-3 text-xs text-amber-200/90 leading-relaxed font-sans">
        <strong className="text-amber-300 font-tech uppercase tracking-wider block mb-1">
          Historical Note: The Nature of Hieroglyphs
        </strong>
        Hieroglyphs were not simple alphabet letters. They consisted of <strong>phonograms</strong> (symbols representing sounds like consonants), <strong>ideograms</strong> (symbols representing entire words/concepts), and <strong>determinatives</strong> that clarified meaning. Royal cartouches enclosed pharaonic names in a loop of eternity.
      </div>

      {/* Royal Cartouche Display Box */}
      <div className="flex flex-col items-center justify-center p-5 bg-[#1a1714] border-2 border-amber-500/60 rounded-2xl shadow-inner relative">
        <div className="text-[11px] font-tech text-amber-400 uppercase tracking-wider font-bold mb-2">
          Sanctuary Stone Cartouche (Enter 3 Symbols)
        </div>

        {/* The Cartouche Oval Loop */}
        <div className="flex items-center justify-center gap-4 px-8 py-3 rounded-full border-4 border-amber-400 bg-amber-950/30 shadow-[0_0_20px_rgba(234,179,8,0.25)] min-w-[280px]">
          {selectedGlyphs.length === 0 ? (
            <span className="text-xs font-tech text-amber-400/60 italic">
              Select 3 glyphs from the tablet below...
            </span>
          ) : (
            selectedGlyphs.map((glyph, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center text-amber-300 animate-in zoom-in-75 duration-200"
              >
                <span className="text-4xl filter drop-shadow-[0_0_6px_#f59e0b]">
                  {glyph.char}
                </span>
                <span className="text-[10px] font-tech text-cyan-300 mt-1 uppercase">
                  {glyph.phonetic.split(' ')[0]}
                </span>
              </div>
            ))
          )}
        </div>

        {isDecoded && (
          <div className="mt-3 flex items-center gap-2 text-emerald-400 font-tech text-xs font-bold uppercase tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/60">
            <Sparkles className="w-3.5 h-3.5" /> Cartouche Decoded: {TARGET_TRANSLATION} ("Living Image of Ra")
          </div>
        )}
      </div>

      {/* Scribe's Tablet: Clickable Glyph Palette */}
      <div className="flex flex-col gap-2 font-tech">
        <div className="flex justify-between items-center text-xs text-amber-300">
          <span>ALABASTER SCRIBE PALETTE: CLICK TO ADD TO CARTOUCHE</span>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-zinc-400 hover:text-amber-300 text-[11px]"
          >
            <RotateCcw className="w-3 h-3" /> Clear Cartouche
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {GLYPH_CATALOG.map(g => (
            <button
              key={g.id}
              onClick={() => handleAddGlyph(g)}
              onMouseEnter={() => setActiveInspector(g)}
              className="p-2.5 rounded-xl border border-amber-500/30 hover:border-amber-400 bg-black/60 hover:bg-amber-950/60 flex flex-col items-center justify-center transition-all group"
            >
              <span className="text-3xl text-amber-200 group-hover:scale-110 group-hover:text-amber-400 transition-transform">
                {g.char}
              </span>
              <span className="text-[10px] text-zinc-400 group-hover:text-cyan-300 mt-1">
                {g.gardiner}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inspector Details Slate */}
      {activeInspector && (
        <div className="p-3 bg-black/50 border border-cyan-500/30 rounded-xl font-tech text-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-cyan-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
              {activeInspector.char}
            </span>
            <div>
              <div className="text-amber-300 font-bold text-sm">
                Gardiner {activeInspector.gardiner} • {activeInspector.phonetic}
              </div>
              <div className="text-zinc-300 text-[11px]">
                Translation: <em>{activeInspector.meaning}</em>
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 bg-cyan-950 border border-cyan-500/40 rounded text-cyan-300 uppercase">
            {activeInspector.historicalType}
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 p-2 rounded-xl font-tech text-center">
          {errorMsg}
        </div>
      )}

      {/* Door Password Unlock Bar */}
      <div className="p-4 bg-black/60 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex-1">
          <div className="text-[11px] font-tech text-amber-400 uppercase tracking-wider mb-1">
            Sanctuary Door Password:
          </div>
          <input
            type="text"
            value={doorPassword}
            onChange={e => setDoorPassword(e.target.value)}
            placeholder={isDecoded ? "Decoded! Click unlock or type RAMENANKH" : "Enter cartouche transliteration"}
            className="w-full bg-[#181a24] border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-amber-100 font-tech focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          onClick={handleUnlockDoor}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-tech font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
        >
          <Key className="w-4 h-4" />
          <span>Unlock Sanctuary Door</span>
        </button>
      </div>
    </div>
  );
};
