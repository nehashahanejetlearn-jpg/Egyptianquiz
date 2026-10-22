import { LocationInfo, MuseumExhibit, QuizQuestion, AchievementBadge, InventoryItem } from '../types/game';

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'desert',
    name: 'The Desert of Discovery',
    subtitle: 'Where the Legend Begins',
    description: 'Scattered among shifting desert sands lies the Dormant Eye of Ra. Calibrate your holographic archaeological scanner to reveal ancient buried relics and wake the robotic scarab companion.',
    requiredLevel: 1,
    unlocked: true,
    completed: false,
    coordinates: { x: 18, y: 70 },
    artifactReward: 'Dormant Eye of Ra',
    xpReward: 250,
    tokensReward: 50,
  },
  {
    id: 'pyramid',
    name: 'The Great Pyramid of Giza',
    subtitle: 'Monument to Eternity',
    description: 'Explore the monumental masonry of Khufu. Solve geometric alignment puzzles, balance limestone ratios, and unlock the ascending passageway leading to the King\'s Chamber.',
    requiredLevel: 2,
    unlocked: false,
    completed: false,
    coordinates: { x: 38, y: 42 },
    artifactReward: 'Golden Pyramidion Capstone',
    xpReward: 400,
    tokensReward: 75,
  },
  {
    id: 'hieroglyphs',
    name: 'The Temple of Hieroglyphs',
    subtitle: 'Voices Carved in Stone',
    description: 'Decode royal cartouches and ancient sacred glyphs. Use an interactive translation tablet to decipher the secret password to the inner sanctuary of Thoth.',
    requiredLevel: 3,
    unlocked: false,
    completed: false,
    coordinates: { x: 62, y: 55 },
    artifactReward: 'Alabaster Scribe Palette',
    xpReward: 500,
    tokensReward: 100,
  },
  {
    id: 'tomb',
    name: 'The Lost Tomb of Anubis',
    subtitle: 'Trials of the Underworld',
    description: 'Delve into the shadowy burial chambers. Disarm ancient pressure plate traps, light sacred ceremonial braziers, and balance the scales of truth to recover the Pharaonic burial treasures.',
    requiredLevel: 4,
    unlocked: false,
    completed: false,
    coordinates: { x: 50, y: 80 },
    artifactReward: 'Golden Anubis Talisman',
    xpReward: 650,
    tokensReward: 125,
  },
  {
    id: 'nile',
    name: 'The Nile Kingdom',
    subtitle: 'Lifeline of the Civilization',
    description: 'Command an interactive simulator of ancient Egyptian agriculture, flood gates (Inundation of Akhet), irrigation canals, and river trade to sustain a thriving delta city.',
    requiredLevel: 5,
    unlocked: false,
    completed: false,
    coordinates: { x: 75, y: 35 },
    artifactReward: 'Ceremonial Papyrus Sceptre',
    xpReward: 800,
    tokensReward: 150,
  },
  {
    id: 'chamber',
    name: 'The Pharaoh\'s Final Chamber',
    subtitle: 'The Ultimate Legacy',
    description: 'Enter the sanctum of the Sun God Ra. Solve ancient Egyptian numeral sequences, align the stars of Orion and Sirius, and restore the Eye of Ra to uncover the ultimate secret.',
    requiredLevel: 6,
    unlocked: false,
    completed: false,
    coordinates: { x: 88, y: 65 },
    artifactReward: 'Crowned Mask of Eternity',
    xpReward: 1200,
    tokensReward: 250,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'scanner',
    name: 'Holo-Archaeological Scanner',
    icon: 'Radar',
    description: 'A multi-spectral scanning device that reveals hidden structural anomalies, acoustic resonance, and buried artifacts.',
    historicalNote: 'Modern archaeology uses LiDAR, Ground-Penetrating Radar (GPR), and satellite imaging to discover buried Egyptian settlements.',
    category: 'tool',
  },
  {
    id: 'field_notebook',
    name: 'Explorer\'s Field Log',
    icon: 'BookOpen',
    description: 'Contains decrypted notes, hieroglyphic sound values, and architectural sketches of monument dimensions.',
    historicalNote: '19th-century Egyptologists like Jean-François Champollion kept meticulous notebooks that cracked the code of hieroglyphs.',
    category: 'scroll',
  },
];

export const MUSEUM_EXHIBITS: MuseumExhibit[] = [
  {
    id: 'pharaohs',
    title: 'Pharaohs & The Divine Kings',
    category: 'Leadership & Rulership',
    era: 'c. 3100 BCE – 30 BCE',
    summary: 'Pharaohs were considered living gods on Earth—the earthly embodiment of Horus, son of Osiris, tasked with maintaining Ma\'at (universal cosmic order).',
    detailedText: [
      'The word "Pharaoh" originally came from "per-aa", meaning "great house" or the royal palace, and later referred to the king himself.',
      'Rulers like Hatshepsut expanded trade networks to the land of Punt, while Ramesses II built monumental temples at Abu Simbel and signed history\'s first known peace treaty.',
      'Tutankhamun, who died around age 19, became world-famous when Howard Carter discovered his virtually intact tomb in the Valley of the Kings in 1922.'
    ],
    keyFacts: [
      'Over 170 distinct pharaohs ruled Egypt across more than 30 dynasties.',
      'Both men and women ruled as pharaoh; famous female rulers include Sobekneferu, Hatshepsut, and Cleopatra VII.',
      'The Pharaoh wore the Pschent (double crown) representing the unification of Upper (white) and Lower (red) Egypt.'
    ],
    artifactType: 'sarcophagus',
    audioTranscript: 'The Pharaoh of ancient Egypt was far more than a monarch. They were the religious and political leader, believed to be the living embodiment of the god Horus.',
    quiz: {
      question: 'What did the Egyptian word "Pharaoh" (per-aa) originally mean?',
      options: ['Golden Crown', 'Great House', 'Son of the Sun', 'Eternal Warrior'],
      correctIndex: 1,
      explanation: '"Per-aa" originally meant "Great House", referring to the royal palace before being used for the monarch.'
    }
  },
  {
    id: 'pyramids_engineering',
    title: 'Pyramid Construction & Engineering',
    category: 'Architecture & Mathematics',
    era: 'Old Kingdom (c. 2686 – 2181 BCE)',
    summary: 'The Great Pyramid of Giza was built with roughly 2.3 million stone blocks and remained the tallest human-made structure on Earth for over 3,800 years.',
    detailedText: [
      'Contrary to popular myths, the pyramids were built not by enslaved people, but by tens of thousands of skilled Egyptian stone-masons, engineers, and seasonal farmers who received rations of bread, beer, and medical care.',
      'Workers transported limestone blocks weighing 2 to 15 tons across the desert using wooden sleds lubricated by pouring water onto the sand, halving the required pulling force.',
      'The pyramid is aligned to true north with incredible precision—within just one-fifteenth of a single degree.'
    ],
    keyFacts: [
      'Original height of the Great Pyramid was 146.6 meters (481 feet).',
      'It was originally covered in polished Tura white limestone that gleamed like a mirror in the desert sun.',
      'Inside are three main chambers: the King\'s Chamber, Queen\'s Chamber, and Subterranean Chamber.'
    ],
    artifactType: 'pyramid',
    audioTranscript: 'The Great Pyramid of Giza is an architectural miracle of ancient engineering, built with 2.3 million precision-cut stones aligned nearly perfectly with true North.',
    quiz: {
      question: 'How did Egyptian workers significantly reduce friction when pulling heavy stone sledges?',
      options: ['They poured water on the sand in front of sledges', 'They used iron steam engines', 'They attached wheels to the stones', 'They pulled them across ice'],
      correctIndex: 0,
      explanation: 'Tomb wall paintings show a worker pouring water onto sand ahead of a sled, which creates capillary bridges that cut friction in half.'
    }
  },
  {
    id: 'mummification',
    title: 'Mummification & The Afterlife',
    category: 'Rituals & Spiritual Beliefs',
    era: 'c. 2600 BCE – Roman Period',
    summary: 'Ancient Egyptians believed death was merely a transition. Preserving the physical body was essential so the soul (Ka and Ba) could recognize its earthly vessel.',
    detailedText: [
      'The mummification process took 70 days. Embalmers used natron, a natural mineral salt gathered from dried lake beds, to thoroughly dehydrate the body over 40 days.',
      'Internal organs were removed and placed into four distinct Canopic jars, guarded by the four sons of Horus: Imsety (liver), Hapi (lungs), Duamutef (stomach), and Qebehsenuef (intestines).',
      'The heart was left inside the body because it would be weighed on the Scales of Ma\'at against the Feather of Truth in the Hall of Two Truths.'
    ],
    keyFacts: [
      'Natron is composed of sodium carbonate, sodium bicarbonate, sodium chloride, and sodium sulfate.',
      'The brain was considered unimportant and removed through the nostrils with hooked bronze tools.',
      'Hundreds of meters of fine linen bandages were wrapped around the body, with protective amulets tucked between layers.'
    ],
    artifactType: 'canopic',
    audioTranscript: 'To ancient Egyptians, the afterlife offered eternity in the Field of Reeds. Mummification took 70 days using natural natron salt to preserve the body.',
    quiz: {
      question: 'Which vital organ was intentionally left inside the mummy for the final judgment in the underworld?',
      options: ['The Brain', 'The Heart', 'The Liver', 'The Lungs'],
      correctIndex: 1,
      explanation: 'The heart (Ib) was left in the body because Anubis and Osiris would weigh it against the Feather of Ma\'at.'
    }
  },
  {
    id: 'gods_pantheon',
    title: 'Gods & The Sacred Pantheon',
    category: 'Religion & Mythology',
    era: 'Predynastic to Greco-Roman',
    summary: 'Egyptian religion was polytheistic, featuring hundreds of deities with human bodies and animal heads representing nature\'s qualities and divine principles.',
    detailedText: [
      'Ra was the sun god who traveled across the sky by day and through the underworld (Duat) by night, battling the serpent of chaos, Apep.',
      'Anubis, with the head of a jackal, guided souls through the underworld and watched over embalming rituals.',
      'Horus, the falcon-headed god of the sky and kingship, avenged his father Osiris after Set murdered him, establishing cosmic justice.'
    ],
    keyFacts: [
      'Osiris was the Lord of the Dead and king of the underworld.',
      'Thoth was the patron god of scribes, wisdom, writing, and the moon, depicted as an ibis or baboon.',
      'Bastet was the protector goddess of homes, fertility, and families, depicted as a cat or lioness.'
    ],
    artifactType: 'eye',
    audioTranscript: 'The Egyptian pantheon represented forces of nature and cosmic order. Gods were often depicted with animal heads symbolizing their divine attributes.',
    quiz: {
      question: 'Which Egyptian god had the head of a jackal and protected tombs and embalming?',
      options: ['Horus', 'Thoth', 'Anubis', 'Sobek'],
      correctIndex: 2,
      explanation: 'Anubis had the head of a jackal or wild dog, an animal often seen pacing around desert burial grounds.'
    }
  },
  {
    id: 'hieroglyphs_rosetta',
    title: 'Hieroglyphs & The Rosetta Stone',
    category: 'Language & Literature',
    era: 'c. 3200 BCE – 394 CE',
    summary: 'Egyptian hieroglyphs—meaning "sacred carvings"—combined ideograms (symbols representing ideas) and phonograms (symbols representing sounds).',
    detailedText: [
      'Hieroglyphs could be written from left to right, right to left, or top to bottom. You read into the faces of the animals and people depicted!',
      'The discovery of the Rosetta Stone in 1799 near the port of Rashid was the key to unlocking ancient Egyptian. It contained the same decree written in three scripts: Hieroglyphs, Demotic, and Ancient Greek.',
      'French linguist Jean-François Champollion cracked the code in 1822 by realizing hieroglyphs were both phonetic and symbolic.'
    ],
    keyFacts: [
      'Royal names were always enclosed in an oval loop with a tied knot called a cartouche.',
      'Scribes used crushed soot and red ochre mixed with gum water as ink, writing on papyrus with reed pens.',
      'The last known hieroglyphic inscription was carved on August 24, 394 CE, at Philae.'
    ],
    artifactType: 'rosetta',
    audioTranscript: 'The Rosetta Stone unlocked the mystery of hieroglyphs. It featured a decree written in Hieroglyphs, Demotic, and Ancient Greek.',
    quiz: {
      question: 'How do you determine which direction to read a line of ancient Egyptian hieroglyphs?',
      options: ['Always read from left to right', 'Read in the direction the animals and human figures are facing', 'Always read from bottom to top', 'Read in reverse alphabetical order'],
      correctIndex: 1,
      explanation: 'In hieroglyphs, you read towards the faces of the figures (if birds face left, you read from left to right).'
    }
  },
  {
    id: 'inventions',
    title: 'Ancient Egyptian Inventions',
    category: 'Science & Technology',
    era: '3000 BCE – 500 BCE',
    summary: 'From paper made of marsh reeds to 365-day solar calendars, Egyptian inventions shaped civilization for millennia.',
    detailedText: [
      'Papyrus: The world\'s first portable writing surface, made by layering strips of the Cyperus papyrus marsh plant and pressing them together.',
      'The 365-Day Solar Calendar: Divided into 12 months of 30 days each, plus 5 intercalary days celebrating the birthdays of gods.',
      'Surgical Instruments & Medicine: Edwin Smith Papyrus documents treatments for 48 surgical trauma cases, including stitching wounds and setting broken bones.'
    ],
    keyFacts: [
      'Egyptians invented water clocks (clepsydra) and shadow clocks (sundials) to track hours.',
      'They created black and colored inks that have preserved documents for over 4,000 years.',
      'Toothpaste made from crushed rock salt, mint, and dried iris petals was used by ancient Egyptians.'
    ],
    artifactType: 'khopesh',
    audioTranscript: 'Ancient Egyptians were brilliant inventors, giving the world papyrus paper, black ink, cosmetic kohl, surgical procedures, and a 365-day solar calendar.',
    quiz: {
      question: 'What plant was harvested from the Nile delta marshes to create the ancient world\'s paper?',
      options: ['Bamboo', 'Cyperus Papyrus', 'Flax', 'Cotton'],
      correctIndex: 1,
      explanation: 'Papyrus was made from the pith of the Cyperus papyrus reed plant that grew abundantly along the Nile riverbanks.'
    }
  },
  {
    id: 'nile_agriculture',
    title: 'The Nile River & The Three Seasons',
    category: 'Geography & Agriculture',
    era: 'All Dynastic Eras',
    summary: 'The Greek historian Herodotus called Egypt "the gift of the Nile." Without the river\'s annual flooding, Egypt would have been an uninhabitable desert.',
    detailedText: [
      'Every year, monsoon rains in the Ethiopian highlands caused the Nile to overflow its banks, depositing rich black silt called "Kemet" (the Black Land).',
      'The Egyptian year was divided into three natural farming seasons: Akhet (Inundation/Flooding from July to October), Peret (Planting/Emergence from November to February), and Shemu (Harvest/Drought from March to June).',
      'Farmers built complex irrigation networks using canals, dikes, and the shaduf—a counterweighted lever bucket used to lift water from canals into raised fields.'
    ],
    keyFacts: [
      'The Nile is the longest river in the world, stretching over 6,650 kilometers (4,130 miles).',
      'Primary crops were emmer wheat (for bread), two-row barley (for beer), and flax (for linen clothing).',
      'Nilometers were stone staircases used to measure flood height to predict taxes and harvest yields.'
    ],
    artifactType: 'boat',
    audioTranscript: 'The Nile was the lifeblood of Egypt. Its predictable annual flood brought rich black silt, enabling crops to flourish in the middle of the Sahara desert.',
    quiz: {
      question: 'What were the three seasons of the ancient Egyptian agricultural calendar?',
      options: ['Spring, Summer, Winter', 'Akhet, Peret, Shemu', 'Dawn, Noon, Dusk', 'Khufu, Khafre, Menkaure'],
      correctIndex: 1,
      explanation: 'The three seasons were Akhet (the Flooding), Peret (Planting and Emergence), and Shemu (Harvest and Low Water).'
    }
  },
  {
    id: 'daily_life',
    title: 'Daily Life, Fashion & Social Structure',
    category: 'Society & Culture',
    era: 'New Kingdom (c. 1550 – 1077 BCE)',
    summary: 'Ancient Egyptians enjoyed music, board games, elaborate banquets, and valued hygiene, wearing clean white linen and cosmetic eye paint.',
    detailedText: [
      'Kohl, made from powdered galena (lead sulfide) and malachite, was worn around the eyes by both men and women to protect against desert glare and insect bites.',
      'Senet was the favorite board game across all social classes, symbolizing the journey of the soul through the underworld.',
      'Egyptian society was organized in a pyramid: the Pharaoh at the apex, followed by viziers, nobles and priests, scribes, soldiers, craftsmen, and farmers.'
    ],
    keyFacts: [
      'Bread and beer were the dietary staples for everyone from pharaohs to laborers.',
      'Shaved heads and perfumed beeswax cones were worn at festivals to keep cool and fragrant.',
      'Ancient Egyptian women had remarkable legal rights compared to other ancient societies, owning property and initiating divorce.'
    ],
    artifactType: 'senet',
    audioTranscript: 'Daily life in Egypt was vibrant. People loved banquets, sweet beer, fresh figs, wearing linen tunics, and playing the strategic board game Senet.',
    quiz: {
      question: 'What popular ancient Egyptian board game represented the soul\'s journey through the afterlife?',
      options: ['Senet', 'Chess', 'Mancala', 'Backgammon'],
      correctIndex: 0,
      explanation: 'Senet, meaning "game of passing", was played for over 3,000 years and symbolized passing safely into the afterlife.'
    }
  },
  {
    id: 'symbols_amulets',
    title: 'Sacred Symbols & Magical Amulets',
    category: 'Artifacts & Magic',
    era: 'All Dynastic Eras',
    summary: 'Amulets were worn by the living and wrapped into mummies to protect against evil spirits, disease, and harm in the afterlife.',
    detailedText: [
      'The Ankh represented the breath of eternal life and was held in the hands of gods depicted on temple walls.',
      'The Eye of Horus (Wedjat) symbolized healing, protection, wholeness, and royal power after Horus lost and recovered his eye in battle against Set.',
      'The Scarab Beetle (Khepri) symbolized the morning sun, resurrection, and spontaneous creation, as the beetle was observed rolling balls of dung like the sun moving across the sky.'
    ],
    keyFacts: [
      'Heart scarabs were placed over the chest of mummies inscribed with Chapter 30B of the Book of the Dead.',
      'The Djed pillar represented the spine of Osiris and symbolized stability and endurance.',
      'The Tyet (Knot of Isis) represented protection, welfare, and divine blood.'
    ],
    artifactType: 'ankh',
    audioTranscript: 'Sacred symbols like the Ankh, the Eye of Horus, and the Scarab were potent amulets believed to bestow protection, health, and eternal life.',
    quiz: {
      question: 'Which sacred Egyptian symbol resembles a cross with a loop at the top and represents "life"?',
      options: ['The Djed Pillar', 'The Ankh', 'The Wedjat Eye', 'The Was Sceptre'],
      correctIndex: 1,
      explanation: 'The Ankh is the hieroglyphic symbol for life and eternal existence.'
    }
  },
  {
    id: 'archaeology_discoveries',
    title: 'Archaeology & The Discovery of King Tut',
    category: 'Modern Excavation',
    era: '19th Century – Modern Day',
    summary: 'Modern Egyptology began with Napoleon\'s expedition in 1798 and reached a global zenith with the discovery of Tutankhamun\'s tomb in November 1922.',
    detailedText: [
      'British archaeologist Howard Carter spent years searching the Valley of the Kings before his water boy, Hussein Abdel-Rassoul, uncovered the first stone step of tomb KV62.',
      'When asked by Lord Carnarvon if he could see anything as he peered through a hole by candlelight, Carter famously replied: "Yes, wonderful things!"',
      'Today, satellite archaeology and cosmic muon detectors (such as the ScanPyramids project) are discovering previously unknown voids inside the Great Pyramid.'
    ],
    keyFacts: [
      'Tutankhamun\'s tomb contained over 5,000 treasures, including his solid gold 110-kg coffin and funeral mask.',
      'Tomb KV62 was remarkably preserved because debris from later tomb constructions hid its entrance.',
      'Modern archaeologists use non-destructive scanning methods rather than explosives or invasive digging.'
    ],
    artifactType: 'sphinx',
    audioTranscript: 'In November 1922, Howard Carter uncovered the intact tomb of Tutankhamun in the Valley of the Kings, revealing over five thousand golden treasures.',
    quiz: {
      question: 'In what year was the virtually untouched tomb of King Tutankhamun uncovered by Howard Carter?',
      options: ['1822', '1922', '1952', '1982'],
      correctIndex: 1,
      explanation: 'Howard Carter discovered the entrance steps to Tutankhamun\'s tomb KV62 in November 1922.'
    }
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'History & Dynasties',
    question: 'Who was the first pharaoh traditionally credited with unifying Upper and Lower Egypt around 3100 BCE?',
    options: ['Khufu', 'Narmer (Menes)', 'Akhenaten', 'Tutankhamun'],
    correctIndex: 1,
    explanation: 'King Narmer (also known as Menes) unified the two lands and established Egypt\'s first dynasty, commemorated on the famous Narmer Palette.',
    difficulty: 'Apprentice',
  },
  {
    id: 2,
    category: 'Pyramids & Engineering',
    question: 'The Great Pyramid of Giza was built as the burial tomb for which pharaoh of the 4th Dynasty?',
    options: ['Khafre', 'Menkaure', 'Khufu (Cheops)', 'Sneferu'],
    correctIndex: 2,
    explanation: 'The largest of the three Giza pyramids was constructed for Pharaoh Khufu during the Old Kingdom period.',
    difficulty: 'Apprentice',
  },
  {
    id: 3,
    category: 'Gods & Religion',
    question: 'Which god weighed the deceased person\'s heart against the Feather of Truth (Ma\'at) in the Hall of Judgment?',
    options: ['Anubis', 'Seth', 'Sobek', 'Ptah'],
    correctIndex: 0,
    explanation: 'Anubis supervised the golden scales, weighing the heart against the ostrich feather of Ma\'at to determine entry to the afterlife.',
    difficulty: 'Apprentice',
  },
  {
    id: 4,
    category: 'Hieroglyphs & Daily Life',
    question: 'What is the name for the protective oval ring containing a pharaoh\'s royal name?',
    options: ['Obelisk', 'Cartouche', 'Sarcophagus', 'Pylon'],
    correctIndex: 1,
    explanation: 'A cartouche was a loop of sacred rope representing eternity that enclosed royal names to guard the monarch.',
    difficulty: 'Apprentice',
  },
  {
    id: 5,
    category: 'Hieroglyphs & Daily Life',
    question: 'Which language helped Jean-François Champollion decipher the hieroglyphs on the Rosetta Stone?',
    options: ['Latin', 'Ancient Greek', 'Hebrew', 'Sanskrit'],
    correctIndex: 1,
    explanation: 'The Rosetta Stone contained the same decree in Hieroglyphs, Demotic, and Ancient Greek, which scholars already knew how to read.',
    difficulty: 'Explorer',
  },
  {
    id: 6,
    category: 'Pyramids & Engineering',
    question: 'What is the oldest known pyramid in Egypt, designed by the master architect Imhotep?',
    options: ['The Bent Pyramid', 'The Step Pyramid of Djoser', 'The Red Pyramid', 'The Meidum Pyramid'],
    correctIndex: 1,
    explanation: 'The Step Pyramid at Saqqara was built for Pharaoh Djoser by the vizier and genius engineer Imhotep around 2670 BCE.',
    difficulty: 'Explorer',
  },
  {
    id: 7,
    category: 'History & Dynasties',
    question: 'Which famous female pharaoh led peaceful trade expeditions to the distant land of Punt and built Deir el-Bahari?',
    options: ['Nefertiti', 'Hatshepsut', 'Cleopatra VII', 'Merneith'],
    correctIndex: 1,
    explanation: 'Queen Hatshepsut ruled as pharaoh for over two decades, inaugurating major trade missions and grand building projects.',
    difficulty: 'Explorer',
  },
  {
    id: 8,
    category: 'Gods & Religion',
    question: 'Pharaoh Akhenaten instituted a religious revolution by declaring that worship should focus on which single deity?',
    options: ['The Aten (Sun Disk)', 'Amun-Ra', 'Osiris', 'Hathor'],
    correctIndex: 0,
    explanation: 'Akhenaten moved Egypt\'s capital to Amarna and promoted the worship of the Aten, represented by a golden sun disc with rays ending in hands.',
    difficulty: 'Explorer',
  },
  {
    id: 9,
    category: 'Hieroglyphs & Daily Life',
    question: 'What natural mineral salt compound was used for 40 days to dehydrate bodies during mummification?',
    options: ['Epsom Salt', 'Natron', 'Gypsum', 'Halite'],
    correctIndex: 1,
    explanation: 'Natron, harvested from dried desert lakebeds, absorbed moisture and fats while sterilizing the body during embalming.',
    difficulty: 'Apprentice',
  },
  {
    id: 10,
    category: 'Pyramids & Engineering',
    question: 'The Great Sphinx at Giza has the body of a lion and the head of which human figure?',
    options: ['Pharaoh Khafre', 'Queen Cleopatra', 'Pharaoh Tutankhamun', 'Anubis'],
    correctIndex: 0,
    explanation: 'Most Egyptologists agree the Sphinx was carved during the reign of Pharaoh Khafre, depicting his facial likeness on a lion\'s body.',
    difficulty: 'Explorer',
  },
  {
    id: 11,
    category: 'History & Dynasties',
    question: 'Which pharaoh reigned for 66 years, fathered over 100 children, and built the massive rock temples at Abu Simbel?',
    options: ['Ramesses II (The Great)', 'Thutmose III', 'Seti I', 'Sneferu'],
    correctIndex: 0,
    explanation: 'Ramesses II was one of Egypt\'s most formidable military and architectural leaders, reigning during the 19th Dynasty.',
    difficulty: 'Explorer',
  },
  {
    id: 12,
    category: 'Gods & Religion',
    question: 'The Eye of Horus is also known by which ancient Egyptian name meaning "whole" or "uninjured"?',
    options: ['Ba', 'Ka', 'Wedjat', 'Shen'],
    correctIndex: 2,
    explanation: 'The Wedjat eye symbolized physical wholeness, restoration, and royal health after Hathor or Thoth restored Horus\'s lost eye.',
    difficulty: 'High Priest',
  },
  {
    id: 13,
    category: 'Hieroglyphs & Daily Life',
    question: 'What were Canopic jars used for in ancient Egyptian burial rituals?',
    options: ['Storing food for the journey', 'Preserving removed internal organs', 'Holding sacred drinking wine', 'Burning temple frankincense'],
    correctIndex: 1,
    explanation: 'Four canopic jars stored the stomach, liver, lungs, and intestines, each guarded by one of the Four Sons of Horus.',
    difficulty: 'Apprentice',
  },
  {
    id: 14,
    category: 'Pyramids & Engineering',
    question: 'What device did Egyptian farmers use along irrigation canals to easily hoist river water into elevated fields?',
    options: ['Shaduf', 'Archimedes Screw', 'Waterwheel', 'Siphon'],
    correctIndex: 0,
    explanation: 'A shaduf is a long counterbalanced pole with a bucket on one end and a clay weight on the other, used to lift water efficiently.',
    difficulty: 'Explorer',
  },
  {
    id: 15,
    category: 'History & Dynasties',
    question: 'Who was the last active monarch of the Ptolemaic Kingdom of Egypt before it became a Roman province in 30 BCE?',
    options: ['Arsinoe IV', 'Cleopatra VII', 'Berenice IV', 'Nefertari'],
    correctIndex: 1,
    explanation: 'Cleopatra VII Philopator was the final ruler of Ptolemaic Egypt before the defeat by Octavian (Emperor Augustus).',
    difficulty: 'Apprentice',
  },
  {
    id: 16,
    category: 'Gods & Religion',
    question: 'Which deity was the goddess of justice, truth, harmony, and cosmic balance, represented by an ostrich feather?',
    options: ['Isis', 'Ma\'at', 'Sekhmet', 'Nephthys'],
    correctIndex: 1,
    explanation: 'Ma\'at personified the ethical and cosmic order that pharaohs and all citizens were sworn to maintain against chaos (Isfet).',
    difficulty: 'Explorer',
  },
  {
    id: 17,
    category: 'Hieroglyphs & Daily Life',
    question: 'What type of distinctive curved sword was widely used by New Kingdom Egyptian infantry and pharaohs?',
    options: ['Khopesh', 'Gladius', 'Scimitar', 'Katana'],
    correctIndex: 0,
    explanation: 'The sickle-shaped bronze or iron Khopesh was the iconic slashing and hook weapon of Egyptian warriors.',
    difficulty: 'High Priest',
  },
  {
    id: 18,
    category: 'History & Dynasties',
    question: 'In which remote rocky valley were Pharaohs of the New Kingdom buried in hidden rock-cut tombs instead of pyramids?',
    options: ['Valley of the Kings (Wadi el-Muluk)', 'Wadi Natrun', 'Siwa Oasis', 'Faiyum Basin'],
    correctIndex: 0,
    explanation: 'To deter grave robbers who had plundered the visible pyramids, New Kingdom rulers dug hidden subterranean tombs in the Valley of the Kings.',
    difficulty: 'Apprentice',
  },
  {
    id: 19,
    category: 'Pyramids & Engineering',
    question: 'Approximately how many limestone and granite blocks make up the Great Pyramid of Giza?',
    options: ['50,000', '500,000', '2.3 Million', '10 Million'],
    correctIndex: 2,
    explanation: 'The Great Pyramid comprises an estimated 2.3 million stone blocks averaging 2.5 tons each.',
    difficulty: 'Explorer',
  },
  {
    id: 20,
    category: 'Gods & Religion',
    question: 'Which god of chaos, storms, and the desert murdered his brother Osiris to usurp the throne of Egypt?',
    options: ['Seth', 'Apep', 'Sobek', 'Khnum'],
    correctIndex: 0,
    explanation: 'Seth murdered Osiris, whose body was collected by Isis and embalmed by Anubis, initiating the afterlife mythos.',
    difficulty: 'Apprentice',
  },
  {
    id: 21,
    category: 'Hieroglyphs & Daily Life',
    question: 'What cursive script did Egyptian scribes use for fast administrative writing and everyday letters?',
    options: ['Hieratic', 'Cuneiform', 'Linear A', 'Phoenician'],
    correctIndex: 0,
    explanation: 'Hieratic (and later Demotic) was the cursive, flowing script used by priests and scribes for paperwork and literature.',
    difficulty: 'High Priest',
  },
  {
    id: 22,
    category: 'History & Dynasties',
    question: 'Which famous pharaoh was known as the "Napoleon of Egypt" for conducting 17 military campaigns and expanding the empire to the Euphrates?',
    options: ['Thutmose III', 'Ahmose I', 'Darius I', 'Psamtik I'],
    correctIndex: 0,
    explanation: 'Thutmose III was an exceptional military strategist whose campaigns made Egypt a dominant superpower in the ancient Near East.',
    difficulty: 'High Priest',
  },
  {
    id: 23,
    category: 'Pyramids & Engineering',
    question: 'What is the capstone placed at the very peak of an Egyptian pyramid called?',
    options: ['Pyramidion', 'Benben Stone', 'Keystone', 'Lintel'],
    correctIndex: 0,
    explanation: 'A pyramidion (or benbenet) was the uppermost crowning stone of a pyramid or obelisk, often gilded in electrum to reflect sunlight.',
    difficulty: 'High Priest',
  },
  {
    id: 24,
    category: 'Gods & Religion',
    question: 'The crocodile god Sobek, associated with fertility and military prowess, was primarily worshipped at which temple site?',
    options: ['Kom Ombo', 'Karnak', 'Luxor', 'Philae'],
    correctIndex: 0,
    explanation: 'The double temple of Kom Ombo was dedicated jointly to the crocodile god Sobek and the falcon god Haroeris.',
    difficulty: 'High Priest',
  },
  {
    id: 25,
    category: 'Hieroglyphs & Daily Life',
    question: 'What was the primary alcoholic beverage enjoyed daily by ancient Egyptians of all social classes?',
    options: ['Beer (Heket)', 'Mead', 'Palm Wine', 'Cider'],
    correctIndex: 0,
    explanation: 'Beer (heket), brewed from barley and emmer loaves, was thick, nutritious, safer to drink than unboiled water, and paid as wages.',
    difficulty: 'Apprentice',
  },
  {
    id: 26,
    category: 'History & Dynasties',
    question: 'Which queen\'s tomb in the Valley of the Queens is famed as one of the most exquisitely painted in all of Egypt?',
    options: ['Nefertari (Wife of Ramesses II)', 'Ankhesenamun', 'Tiye', 'Mutnedjmet'],
    correctIndex: 0,
    explanation: 'Queen Nefertari\'s tomb (QV66) features breathtakingly vivid wall frescoes depicting her playing Senet and venerating the gods.',
    difficulty: 'Explorer',
  },
  {
    id: 27,
    category: 'Pyramids & Engineering',
    question: 'What astronomical star constellation was closely associated with Osiris and aligned with the Giza pyramid shafts?',
    options: ['Orion (Sah)', 'Ursa Major', 'Cassiopeia', 'Pleiades'],
    correctIndex: 0,
    explanation: 'The constellation Orion represented Sah, the astral form of Osiris, while Sirius (Sopdet) represented Isis.',
    difficulty: 'Explorer',
  },
  {
    id: 28,
    category: 'Hieroglyphs & Daily Life',
    question: 'What dark eye makeup was applied by Egyptians using a small stick for both aesthetic and antibacterial purposes?',
    options: ['Kohl', 'Henna', 'Rouge', 'Indigo'],
    correctIndex: 0,
    explanation: 'Kohl, made from crushed galena and almond shells, reduced the harsh glare of the desert sun and warded off eye infections.',
    difficulty: 'Apprentice',
  },
  {
    id: 29,
    category: 'Gods & Religion',
    question: 'In the Underworld trial, what monster—part crocodile, lion, and hippopotamus—devoured hearts heavier than the feather?',
    options: ['Ammit (The Devourer)', 'Apep', 'Sphinx', 'Bennu'],
    correctIndex: 0,
    explanation: 'Ammit the Devourer waited beside the scales to consume impure souls, denying them eternity in the Field of Reeds.',
    difficulty: 'Explorer',
  },
  {
    id: 30,
    category: 'History & Dynasties',
    question: 'What monumental temple complex in Thebes was the religious epicenter of the god Amun and the largest religious structure in history?',
    options: ['Karnak', 'Abu Simbel', 'Dendera', 'Edfu'],
    correctIndex: 0,
    explanation: 'The Karnak Temple complex spans over 200 acres and was expanded by over 30 successive pharaohs over 1,500 years.',
    difficulty: 'Explorer',
  }
];

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'eye_awoken',
    title: 'Eye of Ra Awakened',
    description: 'Found and calibrated the dormant Eye of Ra in the Desert of Discovery.',
    icon: 'Sun',
    unlocked: false,
    category: 'story'
  },
  {
    id: 'pyramid_architect',
    title: 'Master Mason of Giza',
    description: 'Solved the Great Pyramid geometry challenge and aligned the capstone.',
    icon: 'Pyramid',
    unlocked: false,
    category: 'puzzle'
  },
  {
    id: 'royal_scribe',
    title: 'Scribe of Thoth',
    description: 'Successfully decoded ancient hieroglyphs in the Temple of Sacred Symbols.',
    icon: 'Scroll',
    unlocked: false,
    category: 'puzzle'
  },
  {
    id: 'tomb_survivor',
    title: 'Trial of the Scales',
    description: 'Navigated traps in the Lost Tomb and balanced the heart against Ma\'at\'s feather.',
    icon: 'Scale',
    unlocked: false,
    category: 'puzzle'
  },
  {
    id: 'nile_governor',
    title: 'Governor of the Inundation',
    description: 'Balanced flood gates and harvested crops in the Nile Civilization Simulator.',
    icon: 'Waves',
    unlocked: false,
    category: 'simulation'
  },
  {
    id: 'pharaohs_heir',
    title: 'Bearer of the Crown',
    description: 'Unlocked the Pharaoh\'s Final Chamber and restored the full legacy of Egypt.',
    icon: 'Crown',
    unlocked: false,
    category: 'story'
  },
  {
    id: 'scholar_of_kemet',
    title: 'Scholar of Kemet',
    description: 'Scored 80% or higher in the Egyptian Knowledge Quiz Arena.',
    icon: 'Award',
    unlocked: false,
    category: 'knowledge'
  },
  {
    id: 'museum_curator',
    title: 'Museum Connoisseur',
    description: 'Inspected all 10 historical museum exhibits and 3D artifacts.',
    icon: 'Compass',
    unlocked: false,
    category: 'knowledge'
  }
];

export const EXPLORER_AVATARS = [
  { id: 'liam', name: 'Dr. Liam Vance', title: 'Archaeologist & Cryptographer', icon: 'UserCheck', bio: 'Specialist in ancient Old Kingdom masonry and cipher stone tablets.' },
  { id: 'maya', name: 'Maya Lin', title: 'Holo-Surveyor & Engineer', icon: 'Compass', bio: 'Equipped with next-gen subterranean lidar sensors and drone navigation.' },
  { id: 'tariq', name: 'Tariq Al-Mansoor', title: 'Historian of the Nile', icon: 'BookOpen', bio: 'Deep researcher of ancient Nilotic hydrology, papyri, and dynastic lineages.' },
  { id: 'nefertari_exp', name: 'Zara Nefertari', title: 'Relic Conservator', icon: 'Shield', bio: 'Expert in delicate tomb preservation and metaphysical talisman deciphering.' }
];

export const COMPANION_SKINS = [
  { id: 'gold', name: 'Khepri Prime', color: '#EAB308', glow: 'rgba(234, 179, 8, 0.6)', description: 'Ceremonial solar gold finish with luminous wings.' },
  { id: 'cyan', name: 'Horus Wing Blue', color: '#06B6D4', glow: 'rgba(6, 182, 212, 0.6)', description: 'High-tech lapis lazuli composite with electric scanning sensors.' },
  { id: 'obsidian', name: 'Anubis Shadow', color: '#A855F7', glow: 'rgba(168, 85, 247, 0.6)', description: 'Obsidian black alloy with ultraviolet luminescence.' }
];
