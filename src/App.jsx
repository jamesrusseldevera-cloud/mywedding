import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, 
  KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, 
  BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, 
  ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, 
  Github, Globe, Terminal, Cloud, AlertCircle, ExternalLink, 
  MapPin, Music, Play, Pause, MailOpen, Camera, GripVertical, Plus,
  BookHeart, Users, Church, Send, Sparkles, Flame, Wind, Infinity as InfinityIcon, BookOpen, Coins, Gem, Palette, Images
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : {
      apiKey: "AIzaSyBP9ZlZuTiFaYikz_xiT8_UqNFHEXhqPrk",
      authDomain: "de-vera---pinoy-wedding.firebaseapp.com",
      projectId: "de-vera---pinoy-wedding",
      storageBucket: "de-vera---pinoy-wedding.firebasestorage.app",
      messagingSenderId: "242655549897",
      appId: "1:242655549897:web:99956d754cb56fedaf7018"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'wedding-app-default';

// ==========================================
// 2. CONSTANTS & DEFAULTS
// ==========================================
const DEFAULT_DETAILS = {
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3843/3843028.png",
  invitationPages: [
    "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522026362372-50bdf612809b?auto=format&fit=crop&w=800&q=80"
  ],
  groomName: "James",
  brideName: "Cassie",
  weddingDate: "April 10, 2026",
  weddingLocation: "Muntinlupa, Philippines",
  backgroundMusicUrl: "https://www.mfiles.co.uk/mp3-downloads/debussy-clair-de-lune.mp3", 
  ourStory: "Love is patient, love is kind (1 Corinthians 13:4)—and their love proved to be brave, choosing each other every day in faith. What began as a quiet night at Ooma became a story God was already writing—told through shared meals from Jollibee to Din Tai Fung, sweet evenings at Amano, and journeys to Australia, Vigan, La Union, Baguio, and Thailand. In grand adventures and quiet Sundays at Mass, they discovered that home is not a place but a person, and that with God at the center, their love would not easily be broken. Two years later, they stand certain—ready to begin a forever rooted in faith, devotion, and a love that grows sweeter with time.",
  unpluggedText: "We invite you to be truly present with us during our nuptial mass. Please turn off your phones and cameras, and allow our brilliant photographer to capture the moments. We promise to share the beautiful photos with you afterwards!",
  remindersText: "• Please arrive 30 minutes before the ceremony begins.\n• Parking is available at the venue.\n• Don't forget to RSVP by the deadline to secure your seat.",
  contactPhone: "+63 912 345 6789",
  contactEmail: "weddings@example.com",
  ceremonyDate: "Friday, April 10th, 2026",
  ceremonyTime: "3:00 PM",
  ceremonyVenue: "Sacred Heart of Jesus Parish",
  ceremonyAddress: "Muntinlupa, Philippines",
  ceremonyMapUrl: "https://maps.app.goo.gl/aXMEUhYAbS7nEfv58",
  receptionDate: "Friday, April 10th, 2026",
  receptionTime: "6:00 PM onwards",
  receptionVenue: "Main Ballroom, Acacia Hotel",
  receptionAddress: "Alabang, San Jose",
  receptionMapUrl: "https://maps.app.goo.gl/8aSbQNbNAr31iXPT6",
  dressCodeText: "Filipiniana or Formal Attire. We kindly request our guests to dress elegantly in shades of Sage Green, Pastel Yellow, Beige, or neutral light tones. Please avoid wearing bright neon colors or pure white.",
  colorPalette: ['#b8c6a7', '#ffee8c', '#f5e2c5', '#F1CEBE', '#e2d5c3', '#d9e2d5'],
  giftText: "With all that we have, we’ve been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, a monetary gift is one we suggest.",
  
  qrCodeUrls: [
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
  ], 
  rsvpDeadline: "March 1st, 2026",
  bestMan: "Melvin B. De Vera",
  maidOfHonor: "Sofia Camille C. Pinoy",
  bibleBearer: "Kyler Timothy A. De Vera",
  ringBearer: "Dean Lukas A. De Vera",
  coinBearer: "Crisanto Joaquin C. De Vera",

  storyPhotos: [
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80"
  ],
  ceremonyPhotos: ["https://images.unsplash.com/photo-1548625361-ec85cb209210?auto=format&fit=crop&q=80&w=800"],
  receptionPhotos: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"],
  dressCodePhotos: [
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1516726855505-e5ed699fd49d?auto=format&fit=crop&q=80&w=800"
  ],
  groomParents: ["Manuel P. De Vera (+)", "Atty. Anthony Luigi B. De Vera", "& Lilia B. De Vera"],
  brideParents: ["Roberto M. Pinoy", "& Maria Rosario C. Pinoy"],
  entouragePrincipal: [
    "Ms. Shirly L. Fauni", "Ericson Barroquillo", "Dir. Diane Gail L. Maharjan", "Rolendes C. Fabi",
    "Nimfa Serafica", "Vitaliano Biala", "Elaine N. Villanueva", "Paolo Fresnoza",
    "Adorie B. Servito", "Mgen. Loreto Pasamonte", "Timmy Aquino", "Sen. Bam Aquino",
    "Diego \"Jigs\" Rombawa", "Lorenza M. Candela"
  ],
  candleSponsors: ["Janet Pinoy", "Antonio Pinoy"],
  veilSponsors: ["Liezl B. De Vera", "Mark Joedel B. De Vera"],
  cordSponsors: ["Carnation Flores", "Kristina C. Pinoy"],
  groomsmen: ["Christian Robert C. Pinoy", "John Paolo B. De Vera", "Mark Lester B. Biala", "Justin Servito", "John Lester Selga", "Jan Gabriel Pinoy", "Lester Luis Ramirez", "Ron Carlo C. Biala"],
  bridesmaids: ["Angela Cherish C. Pinoy", "Kristel Ann B. De Vera", "Mylene B. De Vera", "Bea Michaela B. De Vera", "Carmela Ella", "Natasha Coreos", "Kaye Marie Abelo", "Princess Jelian B. Almonte"],
  flowerGirls: ["Amara Faith A. De Vera", "Marthina D. Hernandez", "Amare Faith Fresnoza", "Maree Margaret S. Dela Peña"],

  // Custom Themes & Overlays 
  themeBgColor: "#faf9f6",
  themeBorder: "none",
  themeBorderColor: "#ceb878",
  themeTextureUrl: "", // Admin can apply watercolor overlays
  themeCornerTopLeft: "", 
  themeCornerBottomRight: ""
};

const SAMPLE_MESSAGES = [
  { id: 's1', message: "Wishing you a lifetime of love, laughter, and endless happiness. We cannot wait to witness your beautiful day!", submittedName: "The Smith Family", likes: 12 },
  { id: 's2', message: "So incredibly happy for you both! Cheers to the beautiful couple and the amazing journey ahead.", submittedName: "Aunt Sarah & Uncle Mike", likes: 8 },
  { id: 's3', message: "May your love continue to grow stronger with each passing day. See you at the wedding!", submittedName: "Cousin Mark", likes: 4 },
];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const HandpaintedFlower = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} filter drop-shadow-sm`}>
    <path d="M100 100C110 70 140 60 160 80C180 100 150 130 120 120" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C120 120 130 150 110 170C90 190 60 160 70 130" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C80 120 50 130 30 110C10 90 40 60 70 70" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C80 80 70 50 90 30C110 10 140 40 130 70" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <circle cx="100" cy="100" r="4" fill="#ffee8c" stroke="currentColor" strokeWidth="0.2" />
    <path d="M100 100L110 140M110 140C115 150 125 155 135 150" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const LineAccent = () => (
  <div className="flex items-center justify-center gap-4 sm:gap-6 my-4 opacity-40 w-full px-4">
    <div className="w-12 sm:w-20 h-px bg-weddingSage shadow-sm"></div>
    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-weddingAccent shadow-sm shrink-0"></div>
    <div className="w-12 sm:w-20 h-px bg-weddingSage shadow-sm"></div>
  </div>
);

const WreathIconWrapper = ({ children, isDark = false }) => {
  const strokeColor = isDark ? "text-weddingYellow" : "text-weddingAccent";
  return (
    <div className={`relative flex items-center justify-center mb-4 sm:mb-6 ${strokeColor}`}>
      <svg width="60" height="60" viewBox="0 0 100 100" className="absolute animate-[spin_60s_linear_infinite] opacity-60 sm:w-[70px] sm:h-[70px]">
         <path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4"/>
         <path d="M50 5 C55 15 65 15 50 25 C35 15 45 15 50 5" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M50 95 C55 85 65 85 50 75 C35 85 45 85 50 95" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M5 50 C15 45 15 35 25 50 C15 65 15 55 5 50" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M95 50 C85 45 85 35 75 50 C85 65 85 55 95 50" fill="none" stroke="currentColor" strokeWidth="1"/>
         <circle cx="20" cy="20" r="1.5" fill="currentColor" opacity="0.5"/>
         <circle cx="80" cy="20" r="1.5" fill="currentColor" opacity="0.5"/>
         <circle cx="20" cy="80" r="1.5" fill="currentColor" opacity="0.5"/>
         <circle cx="80" cy="80" r="1.5" fill="currentColor" opacity="0.5"/>
      </svg>
      <div className="z-10 bg-[#faf9f6] rounded-full p-2 m-1">
        {children}
      </div>
    </div>
  );
};

const SectionHeading = ({ title, subtitle, Icon, isDark = false }) => (
  <div className="flex flex-col items-center mb-8 sm:mb-10 md:mb-14 text-center px-4">
    {Icon && (
       <WreathIconWrapper isDark={isDark}>
         <Icon size={24} className="sm:w-[26px] sm:h-[26px]" strokeWidth={1.2} />
       </WreathIconWrapper>
    )}
    {subtitle && (
      <h2 className={`text-[9px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 opacity-90 border-b pb-1.5 sm:pb-2 inline-block max-w-full truncate px-2 ${isDark ? 'text-weddingYellow border-weddingYellow/30' : 'text-weddingAccent border-weddingSage/30'}`}>
        {subtitle}
      </h2>
    )}
    <h3 className={`text-3xl sm:text-4xl md:text-5xl font-serif italic drop-shadow-sm break-words max-w-full ${isDark ? 'text-white' : 'text-weddingDark'}`}>
      {title}
    </h3>
  </div>
);

const AnimatedLeaves = ({ count = 8 }) => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className={`absolute opacity-30 animate-float drop-shadow-md transform-gpu ${i % 2 === 0 ? 'text-weddingYellow' : 'text-weddingAccent'}`}
        style={{ left: `${Math.random() * 100}%`, top: `-10%`, animationDuration: `${10 + Math.random() * 15}s`, animationDelay: `${Math.random() * 5}s`, transform: `scale(${0.8 + Math.random() * 1.5})` }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-[30px] sm:h-[30px]"><path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" /></svg>
      </div>
    ))}
  </div>
);

const LandingPage = ({ onOpen, groom, bride, logoUrl, displayData }) => (
  <div className="fixed inset-0 z-[200] bg-[#faf9f6] flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-1000 overflow-hidden h-[100dvh]" style={{ backgroundColor: displayData.themeBgColor || '#faf9f6' }}>
    
    {/* Elegant Visual Background */}
    <div className="absolute inset-0 z-0 pointer-events-none transform-gpu">
      <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply transition-transform duration-[20s] ease-out scale-105" style={{ backgroundImage: `url('${displayData.themeTextureUrl || "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80"}')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-[var(--bg-color)]/80 to-[var(--bg-color)]/95" style={{ '--bg-color': displayData.themeBgColor || '#faf9f6' }}></div>
    </div>

    {displayData.themeCornerTopLeft && <img src={displayData.themeCornerTopLeft} alt="" className="fixed top-0 left-0 w-32 sm:w-48 md:w-80 object-contain z-10 pointer-events-none opacity-80 mix-blend-multiply" />}
    {displayData.themeCornerBottomRight && <img src={displayData.themeCornerBottomRight} alt="" className="fixed bottom-0 right-0 w-32 sm:w-48 md:w-80 object-contain z-10 pointer-events-none opacity-80 mix-blend-multiply" />}

    <AnimatedLeaves count={8} />
    <div className="w-[90vw] max-w-md border border-weddingSage/30 p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] aspect-[1/1.5] sm:aspect-[1/1.5] max-h-[85vh] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm z-20">
       <div className="absolute inset-3 sm:inset-4 border border-weddingSage/10 rounded-[1.5rem] sm:rounded-[2.5rem]"></div>
       <div className="z-20 flex flex-col items-center w-full overflow-y-auto no-scrollbar py-4">
         {logoUrl && <img src={logoUrl} alt="Wedding Logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 sm:mb-6 object-contain opacity-80" />}
         <p className="text-weddingAccent tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] uppercase text-[8px] sm:text-[9px] md:text-[10px] mb-4 sm:mb-6 font-bold px-2 text-center">You are invited to the wedding of</p>
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-script text-weddingDark mb-1 sm:mb-2 break-words max-w-full px-2 leading-tight py-1">{groom}</h1>
         <span className="text-lg sm:text-xl md:text-2xl font-serif italic text-weddingSage mb-1 sm:mb-2">&</span>
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-script text-weddingDark mb-6 sm:mb-8 break-words max-w-full px-2 leading-tight py-1">{bride}</h1>
         <button onClick={onOpen} className="mt-2 sm:mt-4 flex flex-col items-center gap-3 sm:gap-4 group focus:outline-none touch-manipulation">
           <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-weddingYellow rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-500 shrink-0">
             <MailOpen className="text-weddingDark w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
           </div>
           <span className="text-[9px] sm:text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] text-weddingDark animate-pulse">Open Invitation</span>
         </button>
       </div>
    </div>
  </div>
);

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) { clearInterval(interval); return; }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-6 backdrop-blur-md bg-white/40 px-4 sm:px-6 py-3 sm:py-4 rounded-3xl border border-white/60 shadow-sm w-full max-w-[90vw] sm:max-w-lg mx-auto relative z-20">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center flex-1 sm:min-w-[60px]">
          <span className="text-xl sm:text-2xl md:text-3xl font-serif text-weddingDark">{String(value).padStart(2, '0')}</span>
          <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-700 font-bold mt-1">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const ColorPaletteEditor = ({ colors = [], onChange }) => {
  const displayColors = [...colors];
  while(displayColors.length < 6) displayColors.push('#ffffff');

  const updateColor = (idx, val) => {
     const newColors = [...displayColors];
     newColors[idx] = val;
     onChange(newColors);
  };

  return (
    <div className="mb-5">
       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Theme Color Palette</label>
       <div className="flex gap-2 sm:gap-3 flex-wrap">
         {displayColors.slice(0, 6).map((c, idx) => (
           <div key={idx} className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:scale-110 transition-transform shrink-0">
             <input type="color" value={c} onChange={e => updateColor(idx, e.target.value)} className="absolute inset-[-10px] w-20 h-20 cursor-pointer" />
           </div>
         ))}
       </div>
    </div>
  )
};

const ImageSlider = ({ photos = [], altText, containerClass, imageClass, fitClass = "object-cover", slideInterval = 4500 }) => {
  const validPhotos = photos.filter(p => p && typeof p === 'string' && p.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validPhotos.length <= 1) return;
    const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % validPhotos.length); }, slideInterval);
    return () => clearInterval(interval);
  }, [validPhotos.length, slideInterval]);

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % validPhotos.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + validPhotos.length) % validPhotos.length);
  };

  if (validPhotos.length === 0) return (
    <div className={`bg-gray-100 flex items-center justify-center ${containerClass}`}>
      <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" alt="Fallback" className={`absolute inset-0 w-full h-full opacity-60 ${fitClass} ${imageClass || ''}`} />
    </div>
  );

  if (validPhotos.length === 1) return (
    <div className={`relative overflow-hidden ${containerClass}`}>
      <img src={validPhotos[0]} alt={altText} 
           onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" }} 
           className={`absolute inset-0 w-full h-full ${fitClass} ${imageClass || ''}`} />
    </div>
  );

  return (
    <div className={`relative overflow-hidden group ${containerClass}`}>
      {validPhotos.map((url, idx) => (
        <img key={idx} src={url} alt={`${altText} ${idx + 1}`} 
             onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" }} 
             className={`absolute inset-0 w-full h-full ${fitClass} transition-opacity duration-[1500ms] ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${imageClass || ''}`} />
      ))}
      {/* Slider Controls */}
      <button onClick={handlePrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 lg:group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95 touch-manipulation">
         <ChevronLeft size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      <button onClick={handleNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 lg:group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95 touch-manipulation">
         <ChevronRight size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
    </div>
  );
};

// --- Interactive Flipbook Component for the Invitation ---
const FlipInvitation = ({ pages = [], groom, bride }) => {
  const validPages = Array.isArray(pages) ? pages.filter(p => p) : [];
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = () => {
    if (!isOpen) {
       setIsOpen(true);
       setCurrentIndex(0);
    } else {
       if (currentIndex < validPages.length - 1) {
          setCurrentIndex(prev => prev + 1);
       } else {
          setIsOpen(false);
          // Wait for the closing animation before resetting the index
          setTimeout(() => setCurrentIndex(0), 500); 
       }
    }
  };

  if (validPages.length === 0) return null;

  return (
    <div 
       className="relative w-full max-w-[85vw] sm:max-w-md md:max-w-lg mx-auto aspect-[3/4] cursor-pointer group hover:scale-[1.02] transition-transform duration-500 z-20 touch-manipulation" 
       style={{ perspective: '2000px' }} 
       onClick={handleClick}
    >
       <div 
          className="w-full h-full relative transition-transform duration-1000 shadow-2xl rounded-md" 
          style={{ transformStyle: 'preserve-3d', transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)' }}
       >
          {/* Front Cover (Closed Book) */}
          <div 
             className="absolute inset-0 bg-[#faf9f6] flex flex-col items-center justify-center border-[6px] sm:border-[8px] md:border-[16px] border-white p-4 sm:p-6 md:p-8 text-center rounded-sm" 
             style={{ backfaceVisibility: 'hidden' }}
          >
             <WreathIconWrapper isDark={false}><MailOpen size={24} className="sm:w-[30px] sm:h-[30px]"/></WreathIconWrapper>
             <h3 className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-weddingDark mb-3 sm:mb-4 leading-tight truncate w-full px-2">
                {groom} <br/><span className="text-xl sm:text-2xl md:text-3xl font-serif italic text-weddingAccent">&amp;</span><br/> {bride}
             </h3>
             <div className="w-10 sm:w-12 md:w-16 h-px bg-weddingSage mx-auto mt-3 sm:mt-4 md:mt-6 mb-3 sm:mb-4"></div>
             <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-medium text-weddingAccent animate-pulse">Tap to open pages</p>
          </div>

          {/* Inside Page (The Content Images) */}
          <div 
             className="absolute inset-0 bg-white border-[6px] sm:border-[8px] border-white rounded-sm overflow-hidden" 
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
             <img src={validPages[currentIndex]} className="w-full h-full object-contain transition-opacity duration-300 bg-gray-50" alt={`Invitation Page ${currentIndex + 1}`} />
             <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[7px] sm:text-[8px] uppercase tracking-widest shadow-lg pointer-events-none text-gray-500 font-bold border border-gray-100 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                {currentIndex < validPages.length - 1 ? 'Tap for next page' : 'Tap to close'}
                {validPages.length > 1 && (
                   <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[6px] sm:text-[7px]">{currentIndex + 1}/{validPages.length}</span>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

// --- Horizontal Scroll Guestbook Carousel Component ---
const GuestbookCarousel = ({ messages, handleLike, localLikes }) => {
  const scrollRef = useRef(null);
  
  const scroll = (direction) => {
    if(scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -clientWidth : clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-14">
      <button onClick={()=>scroll('left')} className="hidden sm:flex absolute left-0 md:left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 p-2 md:p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-weddingDark hover:bg-weddingSage hover:text-white touch-manipulation">
        <ChevronLeft size={20} className="md:w-6 md:h-6"/>
      </button>
      
      <div ref={scrollRef} className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory py-4 sm:py-6 px-1 sm:px-2 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        {messages.map((m) => {
          const likesCount = localLikes[m.id] !== undefined ? localLikes[m.id] : (m.likes || 0);
          const isLiked = localStorage.getItem(`liked_${m.id}`);
          
          return (
            <div key={m.id} className="w-[85vw] min-w-[85vw] sm:w-[60vw] sm:min-w-[60vw] md:w-[45vw] md:min-w-[45vw] lg:w-[calc(33.333%-1rem)] lg:min-w-[calc(33.333%-1rem)] snap-center bg-white/95 p-4 sm:p-5 md:p-6 border border-white shadow-sm rounded-2xl flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative h-56 sm:h-64 shrink-0">
               <MessageSquareHeart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-weddingSage shrink-0 mb-2 sm:mb-3 md:mb-4" />
               <div className="flex-1 overflow-y-auto mb-2 sm:mb-3 md:mb-4 pr-1 sm:pr-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                  <p className="text-sm md:text-base font-serif italic leading-relaxed text-gray-800">"{String(m.message)}"</p>
               </div>
               <div className="border-t border-gray-100 pt-2 sm:pt-3 md:pt-4 flex justify-between items-end mt-auto gap-2">
                  <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-[0.1em] sm:tracking-[0.2em] font-bold text-weddingAccent break-words flex-1 leading-snug">- {String(m.submittedName)}</p>
                  
                  <button onClick={() => handleLike(m.id, m.likes)} className={`flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold transition-all px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-sm shrink-0 touch-manipulation ${isLiked ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-400 border border-gray-100 hover:text-red-500 hover:bg-red-50 hover:border-red-100 lg:hover:scale-105 active:scale-95'}`}>
                     <Heart size={10} className={`sm:w-3 sm:h-3 ${isLiked ? "fill-current" : ""}`} /> 
                     <span>{likesCount}</span>
                  </button>
               </div>
            </div>
          )
        })}
      </div>

      <button onClick={()=>scroll('right')} className="hidden sm:flex absolute right-0 md:right-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-100 p-2 md:p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-weddingDark hover:bg-weddingSage hover:text-white touch-manipulation">
        <ChevronRight size={20} className="md:w-6 md:h-6"/>
      </button>
    </div>
  );
};


// ==========================================
// 4. ADMIN EDITOR COMPONENTS
// ==========================================

const TextInput = ({ label, value, onChange, isTextArea = false }) => (
  <div className="mb-5 w-full">
    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
    {isTextArea ? (
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[16px] sm:text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" />
    ) : (
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[16px] sm:text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" />
    )}
  </div>
);

const SinglePhotoManager = ({ label, url, onChange, placeholder = "Paste image URL here..." }) => (
  <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3"><ImageIcon size={12} className="inline mr-1"/> {label}</label>
     {url && (
        <div className="relative aspect-video sm:aspect-square md:aspect-video mb-4 rounded overflow-hidden border border-gray-200 w-24 sm:w-32 bg-gray-50">
           <img src={url} className="w-full h-full object-contain" alt="Preview" />
           <button onClick={() => onChange('')} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full touch-manipulation"><X size={10} className="sm:w-3 sm:h-3"/></button>
        </div>
     )}
     <div className="flex gap-2 mb-2 w-full">
        <input value={url || ''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="flex-1 min-w-0 text-[16px] sm:text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
     </div>
  </div>
);

const AudioManager = ({ label, url, onChange, showToast, user, appId, storage }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleSetUrl = () => {
    if (inputUrl.trim()) { 
      let finalUrl = inputUrl.trim();
      
      const gdriveMatch = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
      
      if (gdriveMatch && gdriveMatch[1]) {
        finalUrl = `https://docs.google.com/uc?export=download&confirm=t&id=${gdriveMatch[1]}`;
      } else if (idMatch && idMatch[1]) {
        finalUrl = `https://docs.google.com/uc?export=download&confirm=t&id=${idMatch[1]}`;
      }
      
      onChange(finalUrl); 
      setInputUrl(''); 
      showToast("Music link updated!"); 
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!user) {
      showToast("Authentication required to upload.");
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `artifacts/${appId}/users/${user.uid}/uploads/audio_${Date.now()}.mp3`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      
      onChange(downloadUrl);
      showToast("Audio successfully uploaded & linked!");
    } catch (error) {
      console.error("Firebase Upload Error:", error);
      showToast("Upload failed. Permission denied or file too large.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><Music size={12} className="inline mr-1"/> {label}</label>
      <div className="text-xs text-gray-500 mb-4 truncate bg-gray-50 p-2 rounded border border-gray-100" title={url}>Current: {url && url.startsWith('http') ? 'Active Audio Link' : (url || 'None')}</div>
      
      <div className="mb-4">
         <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
         <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-weddingAccent/10 text-weddingDark border border-weddingAccent/30 px-3 py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent/20 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 touch-manipulation">
            <Upload size={14} /> {isUploading ? 'Uploading...' : 'Upload MP3 to Firebase'}
         </button>
      </div>

      <div className="relative flex items-center py-2 mb-2">
         <div className="flex-grow border-t border-gray-200"></div>
         <span className="flex-shrink-0 mx-2 text-[7px] sm:text-[8px] text-gray-400 uppercase font-bold tracking-widest">OR PASTE URL</span>
         <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="flex gap-2 w-full">
         <input type="text" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} placeholder="Paste MP3, or GDrive URL here..." className="flex-1 min-w-0 text-[16px] sm:text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
         <button onClick={handleSetUrl} className="bg-weddingDark text-white px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent transition-colors shrink-0 touch-manipulation">Link</button>
      </div>
    </div>
  );
};

const PhotoManager = ({ label, urls = [], onChange, showToast }) => {
  const [newUrl, setNewUrl] = useState('');
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => { setDraggedIdx(index); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...urls];
    const [draggedItem] = newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    onChange(newItems);
    setDraggedIdx(null);
  };

  const handleAddUrl = () => {
     if (!newUrl.trim()) return;
     onChange([...urls, newUrl.trim()]);
     setNewUrl('');
     showToast("Photo added!");
  };

  const handleRemove = (idx) => onChange(urls.filter((_, i) => i !== idx));

  return (
     <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3"><ImageIcon size={12} className="inline mr-1"/> {label}</label>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 w-full">
           {urls.map((url, idx) => (
              <div key={idx} draggable onDragStart={(e)=>handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e, idx)} className={`relative aspect-square rounded overflow-hidden group border cursor-move transition-all ${draggedIdx === idx ? 'opacity-30 border-dashed border-gray-500' : 'border-gray-200'}`}>
                 <img src={url} className="w-full h-full object-cover" alt="Preview" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80" }} />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={()=>handleRemove(idx)} className="text-white bg-red-500 p-1.5 rounded-full hover:scale-110 transition-transform touch-manipulation"><Trash2 size={12}/></button>
                 </div>
              </div>
           ))}
           {urls.length === 0 && <div className="col-span-2 sm:col-span-3 text-center p-4 border border-dashed rounded text-xs text-gray-400">No photos added.</div>}
        </div>

        <div className="flex gap-2 mb-2 w-full">
           <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="Paste image URL..." className="flex-1 min-w-0 text-[16px] sm:text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
           <button onClick={handleAddUrl} className="bg-weddingDark text-white px-3 py-1.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent transition-colors flex items-center gap-1 shrink-0 touch-manipulation"><Plus size={10} className="sm:w-3 sm:h-3"/> Add</button>
        </div>
     </div>
  );
};

const ListManager = ({ label, items = [], onChange, isPairs = false, subtitle }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => { setDraggedIdx(index); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    onChange(newItems);
    setDraggedIdx(null);
  };

  const updateItem = (val, idx) => {
    const newItems = [...items];
    newItems[idx] = val;
    onChange(newItems);
  };

  const removeItem = (idx) => onChange(items.filter((_, i) => i !== idx));
  const handleAdd = () => onChange([...items, ""]);

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full overflow-hidden">
       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</label>
       {subtitle && <p className="text-[8px] sm:text-[9px] text-gray-400 mb-3 uppercase tracking-widest leading-relaxed">{subtitle}</p>}
       
       <div className="space-y-2 mb-3">
         {items.map((item, idx) => (
            <div key={idx} draggable onDragStart={(e)=>handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e, idx)} className={`flex items-center gap-1.5 sm:gap-2 bg-gray-50 p-1.5 sm:p-2 rounded-lg border transition-all ${draggedIdx === idx ? 'opacity-30 border-dashed border-gray-500 shadow-inner bg-gray-100' : 'border-gray-200 hover:border-gray-300'}`}>
               <div className="cursor-move text-gray-400 hover:text-weddingDark p-1 shrink-0 touch-manipulation" title="Drag to reorder"><GripVertical size={12} className="sm:w-3.5 sm:h-3.5"/></div>
               {isPairs && <div className="text-[7px] sm:text-[9px] font-bold uppercase w-10 sm:w-14 text-weddingAccent tracking-widest shrink-0 truncate">{idx%2===0?'Male:':'Female:'}</div>}
               <input type="text" value={item} onChange={(e)=>updateItem(e.target.value, idx)} placeholder="Enter name..." className="flex-1 min-w-0 bg-transparent border-b border-transparent focus:border-weddingAccent focus:outline-none text-[16px] sm:text-sm px-1 py-1 font-serif text-gray-800" />
               <button onClick={()=>removeItem(idx)} className="text-gray-300 hover:text-red-500 p-1 transition-colors shrink-0 touch-manipulation"><X size={12} className="sm:w-3.5 sm:h-3.5"/></button>
            </div>
         ))}
         {items.length === 0 && <div className="text-[9px] sm:text-[10px] text-gray-400 italic p-3 text-center border border-dashed border-gray-200 rounded-lg">List is empty</div>}
       </div>
       
       <button onClick={handleAdd} className="w-full py-2 sm:py-2.5 border border-dashed border-weddingAccent/30 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent hover:bg-weddingAccent hover:text-white transition-colors flex justify-center items-center gap-1.5 sm:gap-2 touch-manipulation">
          <UserPlus size={12} className="sm:w-3.5 sm:h-3.5"/> Add Row
       </button>
    </div>
  );
};


// ==========================================
// 5. MAIN APPLICATION
// ==========================================

export default function App() {
  const [isLanding, setIsLanding] = useState(true);
  const [user, setUser] = useState(null);
  
  // Data States
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [editForm, setEditForm] = useState(null); 
  
  // App UI States
  const [invitees, setInvitees] = useState([]);
  const [rsvpForm, setRsvpForm] = useState({ name: '', attending: 'yes', enteredCode: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [localLikes, setLocalLikes] = useState({}); // Optimistic UI local likes
  
  // Admin UI States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminTab, setAdminTab] = useState('details'); 
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [adminError, setAdminError] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCode, setNewGuestCode] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const ADMIN_PASSWORD = "Eternity&Leaves2026!";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'QR_Code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.warn("Could not fetch image for download, opening in new tab instead.", e);
      window.open(url, '_blank');
    }
  };

  const normalizeData = (data) => {
    const toArr = (val, splitChar) => {
       if (Array.isArray(val)) return val;
       if (typeof val === 'string' && val.trim() !== '') return val.split(splitChar).map(s=>s.trim()).filter(Boolean);
       return [];
    };
    
    let palette = Array.isArray(data.colorPalette) ? data.colorPalette : DEFAULT_DETAILS.colorPalette;
    if (palette.length === 0) palette = DEFAULT_DETAILS.colorPalette;

    // Migrate from old single invitationImage to an array if needed
    let invPages = toArr(data.invitationPages, ',');
    if (invPages.length === 0 && data.invitationImage) invPages = [data.invitationImage];
    if (invPages.length === 0) invPages = DEFAULT_DETAILS.invitationPages;

    return {
       ...DEFAULT_DETAILS,
       ...data,
       colorPalette: palette,
       invitationPages: invPages,
       storyPhotos: toArr(data.storyPhotos || data.storyPhotoUrl, ','),
       ceremonyPhotos: toArr(data.ceremonyPhotos || data.ceremonyPhotoUrl, ','),
       receptionPhotos: toArr(data.receptionPhotos || data.receptionPhotoUrl, ','),
       dressCodePhotos: toArr(data.dressCodePhotos || data.dressCodePhotoUrl, ','),
       qrCodeUrls: toArr(data.qrCodeUrls, ','),
       groomParents: toArr(data.groomParents, '\n'),
       brideParents: toArr(data.brideParents, '\n'),
       entouragePrincipal: toArr(data.entouragePrincipal, '\n'),
       candleSponsors: toArr(data.candleSponsors, '\n'),
       veilSponsors: toArr(data.veilSponsors, '\n'),
       cordSponsors: toArr(data.cordSponsors, '\n'),
       groomsmen: toArr(data.groomsmen, '\n'),
       bridesmaids: toArr(data.bridesmaids, '\n'),
       flowerGirls: toArr(data.flowerGirls, '\n'),
    };
  };

  const displayData = (isAdminAuth && editForm) ? editForm : details;
  
  // Fallback to the reliable Piano MP3 if the field is corrupted
  const safeAudioUrl = displayData?.backgroundMusicUrl?.trim() || "https://www.mfiles.co.uk/mp3-downloads/debussy-clair-de-lune.mp3";
  const audioSrc = safeAudioUrl.startsWith('http') || safeAudioUrl.startsWith('data:') ? safeAudioUrl : encodeURI(safeAudioUrl);

  // --- AUDIO ACTIONS ---
  const handleOpenInvitation = async () => {
    setIsLanding(false);
    // Auto-play the audio when the guest opens the invitation
    if (audioRef.current) {
       try {
          await audioRef.current.play();
          setIsPlaying(true);
          setAudioError(false);
       } catch (e) {
          console.warn("Autoplay was blocked or failed:", e);
       }
    }
  };

  const toggleAudio = async () => {
    if (!audioRef.current) return;
    try {
       if (audioRef.current.paused) { 
         await audioRef.current.play();
         setIsPlaying(true);
         setAudioError(false);
       } else { 
         audioRef.current.pause(); 
         setIsPlaying(false);
       }
    } catch (e) {
       console.warn("Audio playback failed:", e);
       setIsPlaying(false);
    }
  };

  // --- STYLES INJECTION ---
  useEffect(() => {
    // Force viewport meta tag for mobile responsiveness in canvas/iframe
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover';
      document.head.appendChild(viewportMeta);
    } else {
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover';
    }

    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    tailwindScript.onload = () => {
      window.tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              serif: ['"Playfair Display"', 'serif'],
              sans: ['Montserrat', 'sans-serif'],
              script: ['"Great Vibes"', 'cursive'],
            },
            colors: {
              weddingSage: '#B8C6A7', weddingDark: '#2c3e2e', weddingYellow: '#ffee8c', weddingAccent: '#8B9B7A',
            },
            keyframes: { float: { '0%': { transform: 'translateY(-10vh) rotate(0deg)' }, '100%': { transform: 'translateY(110vh) rotate(360deg)' } } },
            animation: { float: 'float 20s linear infinite' }
          }
        }
      }
    };
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      html, body { overflow-x: hidden; max-width: 100%; }
      
      /* iOS Safari safe height fallback */
      @supports (-webkit-touch-callout: none) {
        .ios-h-safe { height: -webkit-fill-available; min-height: 100dvh; }
      }
    `;
    document.head.appendChild(styleSheet);
    const fontLink = document.createElement('link'); fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap'; fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(styleSheet)) document.head.removeChild(styleSheet);
    };
  }, []);

  // --- FIREBASE SYNC & LOCAL STORAGE FALLBACK ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) { await signInWithCustomToken(auth, __initial_auth_token); } 
        else { await signInAnonymously(auth); }
      } catch (error) { await signInAnonymously(auth); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    
    // Load local storage first as an immediate fallback
    const localData = localStorage.getItem(`wedding_config_${appId}`);
    if (localData) {
       const normalizedLocal = normalizeData(JSON.parse(localData));
       setDetails(normalizedLocal);
       if (!editForm) setEditForm(normalizedLocal);
    }

    const unsubConfig = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_config')), (snapshot) => {
      const mainDoc = snapshot.docs.find(doc => doc.id === 'main');
      if (mainDoc) {
        const normalized = normalizeData(mainDoc.data());
        setDetails(normalized);
        if (!editForm) setEditForm(normalized);
      } else if (!localData) {
        const normalized = normalizeData(DEFAULT_DETAILS);
        setDetails(normalized);
        if (!editForm) setEditForm(normalized);
      }
    }, (err) => {
        console.warn("Firebase Read Failed. Using LocalStorage fallback.", err);
    });

    const localGuests = localStorage.getItem(`wedding_guests_${appId}`);
    if (localGuests) setInvitees(JSON.parse(localGuests));

    const unsubGuests = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees')), (snapshot) => {
      const guests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvitees(guests);
      localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(guests));
    }, (err) => console.warn("Guest List Read Failed."));
    
    return () => { unsubConfig(); unsubGuests(); };
  }, [user]);

  // --- RSVP HANDLER ---
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const code = rsvpForm.enteredCode.trim().toLowerCase();
    const universalCodes = ['#jamesfoundhiscassie', '#cassiechosejames'];
    const isUniversal = universalCodes.includes(code);
    
    // Find guest by code, or by name if universal code is used
    let guest = invitees.find(i => String(i.code).toLowerCase() === code);
    if (!guest && isUniversal) {
      guest = invitees.find(i => String(i.name).toLowerCase() === rsvpForm.name.trim().toLowerCase());
    }
    
    setIsSubmitting(true);
    
    const status = rsvpForm.attending === 'yes' ? 'Attending' : 'Declined';
    const rsvpData = { 
       status: status, 
       submittedName: rsvpForm.name, 
       message: rsvpForm.message, 
       respondedAt: Date.now(),
       messageApproved: false
    };

    if (!guest && isUniversal) {
      // Add new guest automatically if using universal code
      const newGuestData = { 
        name: rsvpForm.name, 
        code: rsvpForm.enteredCode, 
        likes: 0,
        ...rsvpData,
        timestamp: Date.now() 
      };
      try {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), newGuestData);
        setSubmitSuccess(true);
      } catch (err) { 
        const localGuests = [...invitees, { id: `local_${Date.now()}`, ...newGuestData }];
        setInvitees(localGuests);
        localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(localGuests));
        setSubmitSuccess(true);
      }
      setIsSubmitting(false);
      return;
    } else if (!guest) {
      setSubmitError("Security code not found. Please check your invitation."); 
      setIsSubmitting(false);
      return; 
    }
    
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', guest.id), rsvpData);
      setSubmitSuccess(true);
    } catch (err) { 
      const localGuests = [...invitees];
      const idx = localGuests.findIndex(g => g.id === guest.id);
      if(idx > -1) {
         localGuests[idx] = { ...localGuests[idx], ...rsvpData };
         setInvitees(localGuests);
         localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(localGuests));
         setSubmitSuccess(true);
      } else {
         setSubmitError("System error. Try again later."); 
      }
    }
    setIsSubmitting(false);
  };

  // --- GUESTBOOK LIKES HANDLER ---
  const handleLikeMessage = async (id, currentLikes) => {
    const likedKey = `liked_${id}`;
    if (localStorage.getItem(likedKey)) return; // Prevent multiple likes

    // Optimistic UI update
    setLocalLikes(prev => ({ ...prev, [id]: (currentLikes || 0) + 1 }));
    localStorage.setItem(likedKey, 'true');

    // Skip database sync for sample messages
    if (String(id).startsWith('s')) return;

    try {
       await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id), {
          likes: (currentLikes || 0) + 1
       });
    } catch(e) {
       console.warn("Could not sync like to DB, but local state was updated.");
    }
  };

  // --- ADMIN ACTIONS ---
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setEditForm(JSON.parse(JSON.stringify(details)));
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else { setAdminError('Incorrect password'); }
  };

  const handlePublishChanges = async () => {
    if(!editForm) return;
    setIsSavingDetails(true);
    
    localStorage.setItem(`wedding_config_${appId}`, JSON.stringify(editForm));
    setDetails(editForm);
    
    try { 
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_config', 'main'), editForm); 
      showToast("Published Live!"); 
    } 
    catch(e) { 
      console.warn("Firebase Backend Denied. Using Local Frontend Save.");
      showToast("Saved to Frontend (Backend Sync Blocked)"); 
    }
    setIsSavingDetails(false);
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuestName) return;
    
    const finalCode = newGuestCode.trim() ? String(newGuestCode).trim() : '#JamesFoundHisCassie';
    const newGuest = { id: `local_${Date.now()}`, name: newGuestName, code: finalCode, status: 'Pending', message: '', messageApproved: false, timestamp: Date.now(), likes: 0 };
    
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), newGuest);
      showToast("Guest added successfully");
    } catch (error) { 
      const updatedList = [...invitees, newGuest];
      setInvitees(updatedList);
      localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(updatedList));
      showToast("Guest added (Locally)"); 
    }
    setNewGuestName(''); setNewGuestCode('');
  };

  const toggleMessageApproval = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id), { messageApproved: !currentStatus });
    } catch(e) {
      const updatedList = invitees.map(g => g.id === id ? { ...g, messageApproved: !currentStatus } : g);
      setInvitees(updatedList);
      localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(updatedList));
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Code', 'Status', 'Message'];
    const csvRows = invitees.map(i => `"${i.name}","${i.code}","${i.status}","${(i.message || '').replace(/"/g, '""')}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + csvRows.join('\n');
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "wedding_guest_list.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleBulkUploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const rows = event.target.result.split('\n');
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length >= 1) {
          const name = cols[0] ? cols[0].replace(/"/g, '').trim() : '';
          let code = cols[1] ? cols[1].replace(/"/g, '').trim() : '';
          
          if (name) { 
             if (!code) code = '#JamesFoundHisCassie';
             try { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), { name, code, status: 'Pending', timestamp: Date.now(), likes: 0 }); } catch(e){} 
          }
        }
      }
      showToast("Bulk upload complete.");
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleDeleteGuest = async (id) => {
    try { 
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id)); 
      showToast("Guest removed."); 
    } catch (error) { 
      const updatedList = invitees.filter(g => g.id !== id);
      setInvitees(updatedList);
      localStorage.setItem(`wedding_guests_${appId}`, JSON.stringify(updatedList));
      showToast("Guest removed (Locally)."); 
    }
  };

  const principalPairs = [];
  for (let i = 0; i < (displayData.entouragePrincipal || []).length; i += 2) {
    principalPairs.push({ male: displayData.entouragePrincipal[i] || '', female: displayData.entouragePrincipal[i+1] || '' });
  }

  const entouragePartners = Array.from({ length: Math.max((displayData.groomsmen||[]).length, (displayData.bridesmaids||[]).length) }).map((_, i) => ({
    groomSide: (displayData.groomsmen||[])[i] || '',
    brideSide: (displayData.bridesmaids||[])[i] || ''
  }));

  const dbApprovedMessages = invitees.filter(i => i.message && i.messageApproved && i.submittedName);
  const displayMessages = dbApprovedMessages.length > 0 ? dbApprovedMessages : SAMPLE_MESSAGES;

  // ==========================================
  // RENDER LOGIC
  // ==========================================

  return (
    <>
      {/* ALWAYS MOUNTED AUDIO TO PRESERVE CLICK GESTURE */}
      <audio 
         ref={audioRef} 
         loop 
         playsInline
         preload="auto" 
         src={audioSrc}
         onPlay={() => { setIsPlaying(true); setAudioError(false); }}
         onPause={() => setIsPlaying(false)}
         onError={(e) => { 
            console.warn("Audio source failed to load:", e); 
            setIsPlaying(false);
            if (audioSrc) setAudioError(true);
         }} 
      />

      {isLanding ? (
        <LandingPage 
          onOpen={handleOpenInvitation} 
          groom={String(displayData.groomName)} 
          bride={String(displayData.brideName)} 
          logoUrl={displayData.logoUrl}
          displayData={displayData}
        />
      ) : (
        <div className="ios-h-safe h-[100dvh] w-full flex overflow-hidden" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: displayData.themeBgColor || '#faf9f6' }}>
          
          {/* ========================================================= */}
          {/* LEFT: LIVE WEBSITE PREVIEW */}
          {/* ========================================================= */}
          <div className={`flex-1 relative h-full overflow-y-auto overflow-x-hidden transition-all duration-300 text-weddingDark selection:bg-weddingYellow/40 scroll-smooth shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]`}>
            
            {/* Global Design Border (Admin Editable) */}
            {displayData.themeBorder && displayData.themeBorder !== 'none' && (
               <div className="fixed inset-0 z-50 pointer-events-none" style={{ border: `12px ${displayData.themeBorder} ${displayData.themeBorderColor || '#ceb878'}` }}></div>
            )}

            {/* Background Layers */}
            <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
                {displayData.themeTextureUrl && (
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: `url('${displayData.themeTextureUrl}')` }}></div>
                )}
                {!displayData.themeTextureUrl && (
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)]/95 via-[var(--bg-color)]/90 to-[var(--bg-color)]/95" style={{ '--bg-color': displayData.themeBgColor || '#faf9f6' }}></div>
            </div>

            {/* Corner Decorative Assets */}
            {displayData.themeCornerTopLeft && <img src={displayData.themeCornerTopLeft} alt="" className="fixed top-0 left-0 w-32 sm:w-48 md:w-80 object-contain z-10 pointer-events-none opacity-80 mix-blend-multiply" />}
            {displayData.themeCornerBottomRight && <img src={displayData.themeCornerBottomRight} alt="" className="fixed bottom-0 right-0 w-32 sm:w-48 md:w-80 object-contain z-10 pointer-events-none opacity-80 mix-blend-multiply" />}

            <AnimatedLeaves count={8} />
            
            {/* Elegant Custom Music Control */}
            <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div onClick={toggleAudio} className="bg-white/80 backdrop-blur-xl p-2 sm:p-3 pr-3 sm:pr-5 rounded-[12px] sm:rounded-[16px] shadow-2xl border border-white/50 flex items-center gap-2 sm:gap-4 transition-all hover:bg-white/95 cursor-pointer group lg:hover:scale-105 active:scale-95 touch-manipulation">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${isPlaying ? 'bg-weddingSage text-white shadow-md' : 'bg-weddingYellow text-weddingDark animate-pulse'}`}>
                  {isPlaying ? <Music size={14} className="sm:w-4 sm:h-4"/> : <Play size={14} className="sm:w-4 sm:h-4 ml-0.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[7px] sm:text-[9px] uppercase tracking-widest font-bold text-weddingAccent flex items-center gap-1 sm:gap-1.5 truncate max-w-[80px] sm:max-w-none">
                     {audioError ? <span className="text-red-500">File Error</span> : (isPlaying ? 'Now Playing' : 'Paused')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-serif italic text-gray-700 max-w-[100px] sm:max-w-[160px] truncate" title="Background Music">
                    Piano Instrumental
                  </span>
                </div>
              </div>
            </div>

            {/* Quick RSVP Floating Icon */}
            <button 
               onClick={() => document.getElementById('rsvp')?.scrollIntoView({behavior: 'smooth'})}
               className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 bg-weddingDark text-weddingYellow p-3 sm:p-3 md:p-4 rounded-full shadow-2xl lg:hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group border border-weddingYellow/20 animate-in fade-in slide-in-from-bottom-8 duration-1000 touch-manipulation"
            >
               <Send size={16} className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
               <span className="hidden md:inline text-[9px] uppercase font-bold tracking-[0.2em] mr-1">RSVP</span>
            </button>

            {/* Navigation (Classy, Smaller Font, Mobile Scrollable) */}
            <nav className={`fixed top-0 left-0 right-0 z-40 py-2.5 sm:py-3 md:py-4 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all overflow-x-auto no-scrollbar w-full ${isAdminAuth ? 'md:right-[450px]' : ''}`}>
              <div className="w-max min-w-full mx-auto px-4 sm:px-6 flex justify-center gap-4 sm:gap-6 md:gap-8 text-[8px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] font-serif text-gray-600">
                {['Home', 'Invitation', 'Story', 'Entourage', 'Venues', 'Reminders', 'Gifts', 'RSVP'].map(t => (
                  <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className="hover:text-weddingDark transition-all active:scale-95 border-b-2 border-transparent hover:border-weddingAccent pb-1 shrink-0 touch-manipulation">{t}</button>
                ))}
              </div>
            </nav>

            <main className="w-full relative z-20 pt-16 overflow-x-hidden">
              
              {/* HERO */}
              <section id="home" className="min-h-[80dvh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden pb-8 w-full">
                <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] sm:w-[90vw] sm:h-[90vw] max-w-[900px] text-weddingSage opacity-20 pointer-events-none" />
                <p className="text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.6em] uppercase text-[9px] sm:text-[10px] md:text-[12px] mb-3 sm:mb-4 font-bold animate-pulse">Join us to celebrate</p>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-script font-bold leading-none mb-1 sm:mb-2 text-weddingDark drop-shadow-sm select-none transition-all break-words w-full max-w-full px-2 text-center py-2">
                  {String(displayData.groomName)} <br/>
                  <span className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif italic text-weddingAccent my-1 sm:my-2 block leading-none">&amp;</span> 
                  {String(displayData.brideName)}
                </h1>
                <LineAccent />
                <p className="text-base sm:text-xl md:text-3xl lg:text-4xl tracking-[0.1em] sm:tracking-[0.2em] lg:tracking-[0.3em] font-light text-gray-800 uppercase mb-2 transition-all">{String(displayData.weddingDate)}</p>
                <p className="text-[8px] sm:text-[10px] md:text-[11px] lg:text-[13px] tracking-[0.2em] sm:tracking-[0.4em] lg:tracking-[0.5em] text-gray-400 font-bold uppercase mb-4 transition-all px-4">{String(displayData.weddingLocation)}</p>
                <CountdownTimer targetDate={displayData.weddingDate} />
              </section>

              {/* INVITATION SPACE (Interactive Flipbook Layout) */}
              {displayData.invitationPages && displayData.invitationPages.length > 0 && (
                <section id="invitation" className="py-8 sm:py-10 md:py-14 px-4 max-w-screen-xl mx-auto flex flex-col items-center relative z-20 w-full overflow-hidden">
                   <SectionHeading title="The Invitation" subtitle="Formal Request" Icon={MailOpen} />
                   
                   <FlipInvitation 
                      pages={displayData.invitationPages} 
                      groom={String(displayData.groomName)} 
                      bride={String(displayData.brideName)} 
                   />
                </section>
              )}

              {/* STORY */}
              <section id="story" className="py-8 sm:py-10 md:py-14 px-4 max-w-screen-xl mx-auto relative z-20 w-full">
                 <SectionHeading title="Our Story" subtitle="The Beginning" Icon={BookHeart} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center relative w-full">
                  
                  {/* Story Text */}
                  <div className="w-full z-20 order-2 lg:order-1 px-2 sm:px-0">
                    <div className="bg-white/70 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-white shadow-xl w-full">
                      <div className="text-sm sm:text-base md:text-lg font-serif leading-relaxed text-gray-800 italic text-justify w-full">
                         <span className="text-3xl sm:text-4xl md:text-5xl text-weddingYellow block mb-1 sm:mb-2 opacity-50 font-serif leading-none select-none">"</span>
                         {String(displayData.ourStory)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Story Slider - Faster 3x Slide & Square format */}
                  <div className="w-full max-w-[85vw] sm:max-w-md mx-auto aspect-square rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl border-[4px] sm:border-[6px] md:border-[8px] border-white relative z-10 bg-white order-1 lg:order-2">
                     <ImageSlider photos={displayData.storyPhotos} altText="Our Story" containerClass="w-full h-full" fitClass="object-cover" slideInterval={1500} />
                  </div>
                  
                </div>
              </section>

              {/* ENTOURAGE */}
              <section id="entourage" className="py-8 sm:py-10 md:py-14 px-2 sm:px-4 bg-white/20 backdrop-blur-sm border-y border-white transition-all relative z-20 w-full">
                <div className="w-full max-w-screen-lg mx-auto text-center">
                  <SectionHeading title="The Entourage" subtitle="Our Loved Ones" Icon={Users} />
                  
                  {/* Parents */}
                  <div className="mb-8 flex flex-col items-center w-full px-2">
                    <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6 border-b-2 border-weddingYellow inline-block pb-1.5 sm:pb-2">Beloved Parents</h3>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-12 text-center w-full max-w-3xl mx-auto">
                      <div className="flex flex-col items-center flex-1 w-full overflow-hidden justify-center h-full">
                        <h4 className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3 border-b border-weddingSage/30 pb-1">Parents of the Groom</h4>
                        {(displayData.groomParents||[]).map((n,i)=><p key={i} className="text-sm sm:text-base md:text-xl lg:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{n}</p>)}
                      </div>
                      <div className="hidden md:block w-px bg-weddingSage/30 self-stretch min-h-[100px]"></div>
                      <div className="flex flex-col items-center flex-1 w-full overflow-hidden justify-center h-full mt-2 sm:mt-4 md:mt-0">
                        <h4 className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 sm:mb-3 border-b border-weddingSage/30 pb-1">Parents of the Bride</h4>
                        {(displayData.brideParents||[]).map((n,i)=><p key={i} className="text-sm sm:text-base md:text-xl lg:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{n}</p>)}
                      </div>
                    </div>
                  </div>

                  {/* Principal Sponsors */}
                  <div className="mb-6 sm:mb-8 bg-white/40 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-white shadow-sm overflow-hidden w-[95%] sm:w-full mx-auto">
                     <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-3 sm:mb-4 inline-block">Principal Sponsors</h3>
                     <div className="flex flex-col items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto w-full">
                       {principalPairs.map((pair, i) => (
                         <div key={i} className="flex items-center justify-between border-b border-weddingSage/10 pb-1.5 sm:pb-2 w-full last:border-0 group overflow-hidden">
                           <div className="flex-1 text-right break-words text-xs sm:text-sm md:text-lg font-serif text-gray-800 px-1 sm:px-2 md:px-4">{String(pair.male)}</div>
                           <div className="text-weddingSage opacity-40 italic text-sm sm:text-base md:text-xl font-serif text-center px-1 shrink-0">&amp;</div>
                           <div className="flex-1 text-left break-words text-xs sm:text-sm md:text-lg font-serif text-gray-800 px-1 sm:px-2 md:px-4">{String(pair.female)}</div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Best Man & Maid of Honor */}
                  <div className="w-[95%] sm:w-full max-w-3xl mx-auto flex flex-col items-center mb-6 sm:mb-8 bg-white/60 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-xl border border-white/80 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full text-center relative">
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                      <div className="flex flex-col items-center flex-1 md:pr-4 overflow-hidden">
                        <h4 className="text-[8px] sm:text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-1">Best Man</h4>
                        <p className="text-base sm:text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.bestMan)}</p>
                      </div>
                      <div className="flex flex-col items-center flex-1 mt-2 md:mt-0 md:pl-4 overflow-hidden">
                        <h4 className="text-[8px] sm:text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-1">Maid of Honor</h4>
                        <p className="text-base sm:text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.maidOfHonor)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Groomsmen & Bridesmaids */}
                  <div className="w-[95%] sm:w-full max-w-4xl mx-auto text-gray-800 flex flex-col items-center mb-6 sm:mb-8 relative overflow-hidden px-1 sm:px-2">
                     <div className="grid grid-cols-2 gap-x-2 sm:gap-x-4 mb-2 pb-2 border-b border-weddingAccent/30 w-full">
                       <div className="text-right text-[7px] sm:text-[8px] md:text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Groomsmen</div>
                       <div className="text-left text-[7px] sm:text-[8px] md:text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Bridesmaids</div>
                     </div>
                     <div className="absolute left-1/2 top-6 bottom-0 w-px bg-weddingSage/20 -translate-x-1/2"></div>
                     {entouragePartners.map((partner, i) => (
                       <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-x-1 sm:gap-x-2 mb-1 w-full items-center relative z-10">
                         <div className="text-right overflow-hidden"><p className="text-xs sm:text-sm md:text-lg font-serif leading-snug break-words">{String(partner.groomSide)}</p></div>
                         <div className="w-px h-full bg-transparent mx-0.5 sm:mx-1 md:mx-2"></div>
                         <div className="text-left overflow-hidden"><p className="text-xs sm:text-sm md:text-lg font-serif leading-snug break-words">{String(partner.brideSide)}</p></div>
                       </div>
                     ))}
                  </div>

                  {/* Secondary Sponsors */}
                  <div className="w-full max-w-5xl mx-auto my-6 sm:my-8 px-2">
                     <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-4 text-center">Secondary Sponsors</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <div className="text-center sm:text-right border-b sm:border-b-0 sm:border-r border-weddingSage/20 pb-3 sm:pb-0 sm:pr-4 md:pr-6 overflow-hidden flex flex-col items-center sm:items-end w-full">
                           <Flame size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Candle</h4>
                           {(displayData.candleSponsors||[]).map((n, i) => <p key={i} className="text-sm sm:text-base md:text-lg font-serif mb-0.5 sm:mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                        <div className="text-center border-b sm:border-b-0 border-weddingSage/20 pb-3 sm:pb-0 px-2 sm:px-4 md:px-6 overflow-hidden flex flex-col items-center w-full">
                           <Wind size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Veil</h4>
                           {(displayData.veilSponsors||[]).map((n, i) => <p key={i} className="text-sm sm:text-base md:text-lg font-serif mb-0.5 sm:mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                        <div className="text-center sm:text-left sm:border-l border-weddingSage/20 pt-1 sm:pt-0 sm:pl-4 md:pl-6 overflow-hidden flex flex-col items-center sm:items-start w-full">
                           <InfinityIcon size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cord</h4>
                           {(displayData.cordSponsors||[]).map((n, i) => <p key={i} className="text-sm sm:text-base md:text-lg font-serif mb-0.5 sm:mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                     </div>
                  </div>

                  {/* Bearers & Flower Girls */}
                  <div className="w-full max-w-4xl mx-auto mt-6 sm:mt-8 px-2">
                     <h3 className="text-[9px] sm:text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] uppercase mb-5 sm:mb-6 text-center">Little Entourage</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-center mb-6 w-full">
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <BookOpen size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Bible Bearer</h4>
                           <p className="text-sm sm:text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.bibleBearer)}</p>
                        </div>
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <Coins size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Coin Bearer</h4>
                           <p className="text-sm sm:text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.coinBearer)}</p>
                        </div>
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <Gem size={16} className="text-weddingAccent mb-1.5 opacity-70 sm:w-[18px] sm:h-[18px]" />
                           <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Ring Bearer</h4>
                           <p className="text-sm sm:text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.ringBearer)}</p>
                        </div>
                     </div>
                     <div className="pt-2 sm:pt-3 text-center max-w-4xl mx-auto w-full">
                        <h4 className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3 sm:mb-4 inline-block px-4 sm:px-5 py-1 sm:py-1.5 border border-gray-200 rounded-full">Flower Girls</h4>
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 px-2 sm:px-4 w-full">
                           {(displayData.flowerGirls||[]).map((n, i) => (
                              <p key={i} className="text-xs sm:text-base md:text-lg font-serif text-weddingDark italic break-words leading-snug text-center">{n}</p>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </section>

              {/* VENUES */}
              <section id="venues" className="py-8 sm:py-10 md:py-14 px-4 sm:px-6 max-w-screen-xl mx-auto transition-all relative z-20 w-full">
                <SectionHeading title="The Venues" subtitle="Where & When" Icon={Church} />
                <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-10 w-full">
                  <div className="bg-white p-1.5 sm:p-2 shadow-xl sm:shadow-2xl relative rounded w-full">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-sm">
                      <ImageSlider photos={displayData.ceremonyPhotos} altText="Ceremony" containerClass="w-full h-full" />
                    </div>
                    <div className="p-4 sm:p-6 text-center w-full">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-weddingDark mb-1 sm:mb-2 break-words">The Ceremony</h3>
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-weddingAccent mb-2">{String(displayData.ceremonyDate)} | {String(displayData.ceremonyTime)}</p>
                      <p className="text-sm sm:text-base md:text-lg font-serif mb-3 sm:mb-4 italic text-gray-700 break-words">{String(displayData.ceremonyVenue)}</p>
                      <a href={String(displayData.ceremonyMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-weddingDark text-white rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-lg active:scale-95 touch-manipulation">
                        <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" /> View Location
                      </a>
                    </div>
                  </div>
                  <div className="bg-white p-1.5 sm:p-2 shadow-xl sm:shadow-2xl relative rounded w-full mt-4 lg:mt-0">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-sm">
                      <ImageSlider photos={displayData.receptionPhotos} altText="Reception" containerClass="w-full h-full" />
                    </div>
                    <div className="p-4 sm:p-6 text-center w-full">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-serif text-weddingDark mb-1 sm:mb-2 break-words">The Reception</h3>
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-weddingAccent mb-2">{String(displayData.receptionTime)}</p>
                      <p className="text-sm sm:text-base md:text-lg font-serif mb-3 sm:mb-4 italic text-gray-700 break-words">{String(displayData.receptionVenue)}</p>
                      <a href={String(displayData.receptionMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 bg-weddingDark text-white rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-lg active:scale-95 touch-manipulation">
                        <MapPin size={12} className="sm:w-[14px] sm:h-[14px]" /> View Location
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* DETAILS & ATTIRE */}
              <section id="details" className="py-8 sm:py-10 md:py-14 px-4 bg-white/60 border-t border-white transition-all relative z-20 w-full overflow-hidden">
                <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center w-full">
                   <div className="text-center md:text-left w-full px-2 sm:px-4">
                      <SectionHeading title="Attire" subtitle="Dress Code & Details" Icon={Sparkles} />
                      <p className="text-sm sm:text-base font-serif leading-relaxed text-gray-800 mb-6 sm:mb-8 break-words">{String(displayData.dressCodeText)}</p>

                      {/* COLOR PALETTE */}
                      {displayData.colorPalette && displayData.colorPalette.length > 0 && (
                        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 w-full">
                           <h4 className="text-[8px] sm:text-[9px] font-bold tracking-[0.2em] sm:tracking-widest uppercase mb-3 sm:mb-4 text-weddingAccent border-b border-weddingSage/30 pb-1 inline-block">Color Palette</h4>
                           <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center md:justify-start">
                              {displayData.colorPalette.slice(0, 6).map((color, idx) => (
                                <div 
                                   key={idx} 
                                   className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-md border-[1.5px] sm:border-2 border-white transform lg:hover:scale-110 transition-transform cursor-pointer shrink-0" 
                                   style={{ backgroundColor: color }} 
                                   title={`Theme Color ${idx + 1}`} 
                                />
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="aspect-[4/5] bg-white p-1.5 sm:p-2 shadow-xl sm:shadow-2xl overflow-hidden rounded-t-[4rem] sm:rounded-t-full max-w-[85vw] sm:max-w-sm mx-auto w-full relative mt-4 lg:mt-0">
                      <ImageSlider photos={displayData.dressCodePhotos} altText="Dress Code" containerClass="w-full h-full rounded-t-[3.5rem] sm:rounded-t-full" imageClass="rounded-t-[3.5rem] sm:rounded-t-full" />
                   </div>
                </div>
              </section>

              {/* REMINDERS & UNPLUGGED CEREMONY */}
              <section id="reminders" className="py-8 sm:py-10 md:py-14 px-4 bg-white/60 backdrop-blur-sm border-y border-white relative z-20 w-full">
                 <div className="w-full max-w-screen-md mx-auto text-center">
                    <SectionHeading title="Important Details" subtitle="Please Note" Icon={Info} />
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-left w-full">
                       
                       <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-3xl shadow-lg border border-gray-100 flex flex-col w-full">
                          <h4 className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 text-weddingAccent flex items-center gap-1.5 sm:gap-2 truncate">
                             <Camera size={14} className="sm:w-4 sm:h-4 shrink-0"/> Unplugged Ceremony
                          </h4>
                          <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line flex-1 break-words">
                             {String(displayData.unpluggedText)}
                          </p>
                       </div>
                       
                       <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-3xl shadow-lg border border-gray-100 flex flex-col w-full">
                          <h4 className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 text-weddingAccent flex items-center gap-1.5 sm:gap-2 truncate">
                             <StickyNote size={14} className="sm:w-4 sm:h-4 shrink-0"/> Reminders
                          </h4>
                          <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line flex-1 break-words">
                             {String(displayData.remindersText)}
                          </p>
                       </div>

                    </div>
                 </div>
              </section>

              {/* GIFTS */}
              <section id="gifts" className="py-8 sm:py-10 md:py-14 px-4 relative bg-white/40 border-b border-white z-20 w-full">
                <div className="w-full max-w-screen-md mx-auto text-center">
                  <SectionHeading title="Send Some Love" subtitle="Gifts & Registry" Icon={Gift} />
                  <p className="text-sm sm:text-base font-serif leading-relaxed text-gray-800 mb-6 sm:mb-8 max-w-2xl mx-auto break-words">{String(displayData.giftText)}</p>

                  <div className="w-full max-w-4xl mx-auto">
                    {displayData.qrCodeUrls && displayData.qrCodeUrls.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 w-full">
                        {displayData.qrCodeUrls.map((qr, idx) => (
                           <div key={idx} className="w-[40vw] h-[40vw] max-w-[160px] max-h-[160px] sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white p-2.5 sm:p-3 md:p-4 shadow-xl rounded-xl sm:rounded-2xl border border-gray-200 transition-transform lg:hover:scale-105 group relative overflow-hidden flex flex-col items-center justify-center shrink-0">
                             <img src={qr} alt={`QR Code ${idx + 1}`} className="w-full h-full object-contain mb-1 transition-opacity" />
                             
                             <div className="absolute inset-0 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 touch-manipulation">
                                <span className="font-serif italic text-weddingDark font-bold text-xs sm:text-sm md:text-lg hidden sm:block">Scan or Save</span>
                                <button onClick={() => downloadImage(qr, `Wedding_QR_${idx+1}.png`)} className="bg-weddingDark text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[7px] sm:text-[8px] md:text-[10px] lg:text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-weddingAccent transition-colors shadow-lg active:scale-95">
                                   <Download size={12} className="sm:w-[14px] sm:h-[14px]" /> Save
                                </button>
                             </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* GUESTBOOK - HORIZONTAL CAROUSEL */}
              <section id="guestbook" className="py-8 sm:py-10 md:py-16 px-0 md:px-4 relative bg-white/40 backdrop-blur-md border-b z-20 w-full overflow-hidden">
                <div className="w-full text-center">
                  <SectionHeading title="Guestbook" subtitle="Wishes & Love" Icon={MessageSquareHeart} />
                  
                  {displayMessages.length > 0 ? (
                    <GuestbookCarousel messages={displayMessages} handleLike={handleLikeMessage} localLikes={localLikes} />
                  ) : (
                    <div className="text-center text-gray-400 font-serif italic py-6 sm:py-8 text-xs sm:text-sm md:text-base px-4">Be the first to leave a message...</div>
                  )}
                </div>
              </section>

              {/* RSVP */}
              <section id="rsvp" className="py-10 sm:py-14 md:py-16 px-4 bg-[#1f2b22] text-white transition-all relative z-20 w-full">
                <div className="w-full max-w-screen-md mx-auto">
                  
                  <SectionHeading title="Join the Celebration" subtitle="RSVP" Icon={Send} isDark />
                  <div className="text-center mb-8 sm:mb-10 -mt-4 sm:-mt-6">
                    <p className="text-weddingYellow font-serif italic text-sm sm:text-base md:text-lg border border-weddingYellow/20 px-4 sm:px-6 py-1.5 sm:py-2 inline-block bg-weddingYellow/5 rounded-full break-words max-w-full">Please respond by {String(displayData.rsvpDeadline)}</p>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-weddingSage text-weddingDark p-8 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2rem] text-center shadow-2xl animate-in zoom-in duration-500 mx-auto w-full">
                      <CheckCircle size={48} className="sm:w-[60px] sm:h-[60px] mx-auto mb-4 sm:mb-6 text-weddingDark animate-bounce" />
                      <h4 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-2 sm:mb-3">Thank You!</h4>
                      <p className="font-serif italic text-base sm:text-lg md:text-xl">We can't wait to see you there.</p>
                      <button onClick={() => setSubmitSuccess(false)} className="mt-6 sm:mt-8 text-[8px] sm:text-[9px] md:text-[10px] uppercase font-bold border-b-2 border-weddingDark pb-1 touch-manipulation">Edit RSVP</button>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
                      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full">
                        <div className="bg-weddingSage text-weddingDark p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1 w-full">
                          <label className="block text-[7px] sm:text-[8px] md:text-[9px] font-bold tracking-[0.2em] sm:tracking-widest uppercase mb-2 text-weddingDark/80 flex items-center justify-center gap-1.5">
                             <KeyRound size={10} className="sm:w-3 sm:h-3" /> Security Code
                          </label>
                          <input required value={rsvpForm.enteredCode} onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/40 py-1.5 sm:py-2 md:py-3 focus:outline-none focus:border-weddingDark tracking-[0.2em] sm:tracking-widest text-base sm:text-lg md:text-xl font-serif text-weddingDark placeholder:text-weddingDark/50 text-center" placeholder="Enter Code" />
                        </div>
                        <div className="bg-weddingSage text-weddingDark p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1 w-full">
                          <label className="block text-[7px] sm:text-[8px] md:text-[9px] font-bold tracking-[0.2em] sm:tracking-widest uppercase mb-2 text-weddingDark/80 flex items-center justify-center gap-1.5">
                             <Heart size={10} className="sm:w-3 sm:h-3" /> Full Name
                          </label>
                          <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/40 py-1.5 sm:py-2 md:py-3 focus:outline-none focus:border-weddingDark text-lg sm:text-xl md:text-2xl font-serif italic text-weddingDark placeholder:text-weddingDark/50 text-center" placeholder="Your Name" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                        {['yes', 'no'].map(v => (
                          <label key={v} className={`flex-1 py-4 sm:py-6 text-center rounded-[1.5rem] sm:rounded-3xl border-2 cursor-pointer transition-all touch-manipulation ${rsvpForm.attending === v ? 'bg-weddingYellow border-weddingYellow text-weddingDark shadow-xl sm:shadow-2xl scale-100 sm:scale-105' : 'border-white/30 hover:border-white/60 bg-white/10 text-white'}`}>
                            <input type="radio" className="hidden" value={v} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-widest">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                          </label>
                        ))}
                      </div>

                      <div className="bg-weddingSage text-weddingDark p-5 sm:p-6 md:p-8 rounded-[1.5rem] sm:rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1 w-full">
                        <label className="block text-[7px] sm:text-[8px] md:text-[9px] font-bold tracking-[0.2em] sm:tracking-widest uppercase mb-2 text-weddingDark/80 flex justify-center items-center gap-1.5 sm:gap-2">
                           <MessageSquareHeart size={10} className="sm:w-3 sm:h-3" /> Wishes for the Couple
                        </label>
                        <textarea value={rsvpForm.message} onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} className="w-full bg-transparent border-none focus:outline-none min-h-[80px] sm:min-h-[100px] md:min-h-[120px] text-base sm:text-lg md:text-xl font-serif italic text-weddingDark placeholder:text-weddingDark/50 resize-none text-center p-2" placeholder="Leave a message for our digital guestbook..." />
                        <div className="text-weddingDark/50 italic font-serif text-[10px] sm:text-xs mt-1 sm:mt-2 text-center">(Messages are reviewed before posting)</div>
                      </div>

                      {submitError && <div className="text-red-300 text-center p-3 sm:p-4 bg-red-900/40 rounded-xl sm:rounded-2xl border border-red-500/30 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-widest mx-4 sm:mx-0">{String(submitError)}</div>}
                      <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-5 sm:py-6 md:py-8 rounded-[1.5rem] sm:rounded-3xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] md:text-[11px] shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50 touch-manipulation">
                        {isSubmitting ? 'Processing RSVP...' : 'Confirm My Attendance'}
                      </button>
                    </form>
                  )}
                </div>
              </section>

              {/* FOOTER & LOGOUT */}
              <footer className="py-10 sm:py-12 md:py-16 text-center bg-white/80 border-t border-gray-200 relative z-20 transition-all w-full overflow-hidden">
                <p className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-weddingDark mb-2 sm:mb-3 select-none break-words px-4 leading-normal w-full">{String(displayData.groomName)} &amp; {String(displayData.brideName)}</p>
                <div className="w-12 sm:w-16 h-px bg-weddingSage mx-auto mb-4 sm:mb-6 opacity-50"></div>
                <p className="text-[7px] sm:text-[8px] md:text-[9px] uppercase font-bold tracking-[0.3em] sm:tracking-[0.5em] text-gray-500 mb-4 sm:mb-6 px-4">{String(displayData.weddingDate)} • {String(displayData.weddingLocation)}</p>
                
                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-xl mx-auto px-4">
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-5 text-[7px] sm:text-[8px] md:text-[9px] font-bold text-gray-700 uppercase tracking-widest bg-white/60 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[1rem] sm:rounded-full border border-gray-200 shadow-sm w-full sm:w-auto">
                     <span className="flex items-center justify-center gap-1.5 sm:gap-2"><Phone size={10} className="sm:w-3 sm:h-3 text-weddingSage shrink-0"/> <span className="truncate">{String(displayData.contactPhone)}</span></span>
                     <span className="hidden sm:block text-gray-300">|</span>
                     <span className="flex items-center justify-center gap-1.5 sm:gap-2"><Mail size={10} className="sm:w-3 sm:h-3 text-weddingSage shrink-0"/> <span className="truncate">{String(displayData.contactEmail)}</span></span>
                  </div>
                </div>

                {!isAdminAuth && <button onClick={() => setShowAdminLogin(true)} className="text-[7px] sm:text-[8px] md:text-[9px] uppercase tracking-widest text-gray-300 hover:text-weddingDark transition-colors flex items-center justify-center gap-1.5 sm:gap-2 mx-auto px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-100 rounded-full touch-manipulation"><Lock size={8} className="sm:w-[10px] sm:h-[10px]"/> Staff Login</button>}
              </footer>
            </main>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: ADMIN LIVE EDITOR SIDEBAR */}
          {/* ========================================================= */}
          {isAdminAuth && editForm && (
            <div className="ios-h-safe h-[100dvh] w-full md:w-[450px] bg-gray-100 fixed right-0 top-0 border-l border-gray-300 shadow-2xl z-[500] flex flex-col font-sans animate-in slide-in-from-right duration-300">
              
              {/* Sidebar Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
                 <div>
                   <h2 className="font-serif italic text-xl sm:text-2xl text-weddingDark font-bold flex items-center gap-2">
                     <Edit2 size={18} className="text-weddingAccent sm:w-5 sm:h-5"/> Live Editor
                   </h2>
                   <p className="text-[8px] sm:text-[9px] uppercase tracking-widest text-gray-400 mt-1 font-bold">Preview updates instantly</p>
                 </div>
                 <div className="flex gap-1.5 sm:gap-2">
                    <button onClick={handlePublishChanges} disabled={isSavingDetails} className="bg-weddingDark text-weddingYellow px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-1.5 sm:gap-2 hover:bg-black transition-colors disabled:opacity-50 touch-manipulation">
                       {isSavingDetails ? 'Saving...' : <><Save size={12} className="sm:w-3.5 sm:h-3.5"/> Publish</>}
                    </button>
                    <button onClick={()=>setIsAdminAuth(false)} className="text-red-400 p-1.5 sm:p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100 touch-manipulation"><X size={16} className="sm:w-[18px] sm:h-[18px]"/></button>
                 </div>
              </div>

              {/* Sidebar Tabs */}
              <div className="flex bg-white border-b border-gray-200 shrink-0 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest overflow-x-auto no-scrollbar">
                {['details', 'design', 'entourage', 'media', 'guests'].map(tab => (
                   <button key={tab} onClick={()=>setAdminTab(tab)} className={`flex-1 py-3 sm:py-4 px-2 text-center border-b-2 transition-colors shrink-0 touch-manipulation ${adminTab === tab ? 'border-weddingDark text-weddingDark bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                     {tab}
                   </button>
                ))}
              </div>

              {/* Sidebar Forms Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 pb-32">
                 
                 {adminTab === 'details' && (
                    <div className="animate-in fade-in duration-300 space-y-4 sm:space-y-6">
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Basic Details</h3>
                          <TextInput label="Groom's Name" value={editForm.groomName} onChange={val=>setEditForm({...editForm, groomName: val})} />
                          <TextInput label="Bride's Name" value={editForm.brideName} onChange={val=>setEditForm({...editForm, brideName: val})} />
                          <TextInput label="Wedding Date" value={editForm.weddingDate} onChange={val=>setEditForm({...editForm, weddingDate: val})} />
                          <TextInput label="Location Summary" value={editForm.weddingLocation} onChange={val=>setEditForm({...editForm, weddingLocation: val})} />
                          <TextInput label="Contact Phone" value={editForm.contactPhone} onChange={val=>setEditForm({...editForm, contactPhone: val})} />
                          <TextInput label="Contact Email" value={editForm.contactEmail} onChange={val=>setEditForm({...editForm, contactEmail: val})} />
                          <TextInput label="RSVP Deadline" value={editForm.rsvpDeadline} onChange={val=>setEditForm({...editForm, rsvpDeadline: val})} />
                       </div>
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Ceremony Info</h3>
                          <TextInput label="Date" value={editForm.ceremonyDate} onChange={val=>setEditForm({...editForm, ceremonyDate: val})} />
                          <TextInput label="Time" value={editForm.ceremonyTime} onChange={val=>setEditForm({...editForm, ceremonyTime: val})} />
                          <TextInput label="Venue Name" value={editForm.ceremonyVenue} onChange={val=>setEditForm({...editForm, ceremonyVenue: val})} />
                          <TextInput label="Map URL" value={editForm.ceremonyMapUrl} onChange={val=>setEditForm({...editForm, ceremonyMapUrl: val})} />
                       </div>
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Reception Info</h3>
                          <TextInput label="Date" value={editForm.receptionDate} onChange={val=>setEditForm({...editForm, receptionDate: val})} />
                          <TextInput label="Time" value={editForm.receptionTime} onChange={val=>setEditForm({...editForm, receptionTime: val})} />
                          <TextInput label="Venue Name" value={editForm.receptionVenue} onChange={val=>setEditForm({...editForm, receptionVenue: val})} />
                          <TextInput label="Map URL" value={editForm.receptionMapUrl} onChange={val=>setEditForm({...editForm, receptionMapUrl: val})} />
                       </div>
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Reminders & Content</h3>
                          <TextInput label="Our Story" isTextArea value={editForm.ourStory} onChange={val=>setEditForm({...editForm, ourStory: val})} />
                          <TextInput label="Dress Code Guidelines" isTextArea value={editForm.dressCodeText} onChange={val=>setEditForm({...editForm, dressCodeText: val})} />
                          <ColorPaletteEditor colors={editForm.colorPalette} onChange={val=>setEditForm({...editForm, colorPalette: val})} />
                          <TextInput label="Unplugged Ceremony" isTextArea value={editForm.unpluggedText} onChange={val=>setEditForm({...editForm, unpluggedText: val})} />
                          <TextInput label="Important Reminders" isTextArea value={editForm.remindersText} onChange={val=>setEditForm({...editForm, remindersText: val})} />
                          <TextInput label="Gift Message Intro" isTextArea value={editForm.giftText} onChange={val=>setEditForm({...editForm, giftText: val})} />
                       </div>
                    </div>
                 )}

                 {adminTab === 'design' && (
                    <div className="animate-in fade-in duration-300 space-y-4 sm:space-y-6">
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                             <Palette size={12} className="sm:w-3.5 sm:h-3.5"/> Aesthetics & Theme
                          </h3>

                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
                              <div className="flex-1 w-full">
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Base Bg Color</label>
                                  <input type="color" value={editForm.themeBgColor || '#faf9f6'} onChange={e => setEditForm({...editForm, themeBgColor: e.target.value})} className="w-full h-10 rounded cursor-pointer border-0"/>
                              </div>
                              <div className="flex-1 w-full">
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Border Color</label>
                                  <input type="color" value={editForm.themeBorderColor || '#ceb878'} onChange={e => setEditForm({...editForm, themeBorderColor: e.target.value})} className="w-full h-10 rounded cursor-pointer border-0"/>
                              </div>
                          </div>

                          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Outer Frame / Border Style</label>
                          <select value={editForm.themeBorder || 'none'} onChange={e => setEditForm({...editForm, themeBorder: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[16px] sm:text-sm mb-6 focus:outline-none focus:border-weddingAccent">
                             <option value="none">None</option>
                             <option value="solid">Solid Classic</option>
                             <option value="double">Elegant Double</option>
                             <option value="dashed">Dashed Outline</option>
                          </select>

                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4 sm:mb-6 w-full">
                              <h4 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 sm:mb-3">Optional Brushes / Background Overlays</h4>
                              <p className="text-[10px] sm:text-xs text-gray-400 mb-3 sm:mb-4 italic">Paste an image URL below to create a watercolor/splatter background texture over the base color.</p>
                              
                              <SinglePhotoManager 
                                label="Background Overlay Image" 
                                url={editForm.themeTextureUrl} 
                                onChange={val=>setEditForm({...editForm, themeTextureUrl: val})} 
                                placeholder="E.g. https://images.unsplash.com/photo-1579546929518-9e396f3cc809"
                              />
                              <div className="flex items-center gap-2 mt-[-10px] mb-4 sm:mb-6">
                                <button onClick={() => setEditForm({...editForm, themeTextureUrl: "https://images.unsplash.com/photo-1601662528567-526cd06f3598?auto=format&fit=crop&q=80"})} className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-weddingAccent underline hover:text-black touch-manipulation text-left">
                                   Load Example Watercolor Pink Texture
                                </button>
                              </div>

                              <SinglePhotoManager 
                                label="Top-Left Corner Decor" 
                                url={editForm.themeCornerTopLeft} 
                                onChange={val=>setEditForm({...editForm, themeCornerTopLeft: val})} 
                                placeholder="Paste transparent floral PNG..."
                              />
                              <SinglePhotoManager 
                                label="Bottom-Right Corner Decor" 
                                url={editForm.themeCornerBottomRight} 
                                onChange={val=>setEditForm({...editForm, themeCornerBottomRight: val})} 
                                placeholder="Paste transparent floral PNG..."
                              />
                          </div>
                       </div>
                    </div>
                 )}

                 {adminTab === 'entourage' && (
                    <div className="animate-in fade-in duration-300">
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-4 sm:mb-6 w-full">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 sm:mb-5 border-b border-gray-100 pb-2">Roles</h3>
                          <TextInput label="Best Man" value={editForm.bestMan} onChange={val=>setEditForm({...editForm, bestMan: val})} />
                          <TextInput label="Maid of Honor" value={editForm.maidOfHonor} onChange={val=>setEditForm({...editForm, maidOfHonor: val})} />
                          <TextInput label="Bible Bearer" value={editForm.bibleBearer} onChange={val=>setEditForm({...editForm, bibleBearer: val})} />
                          <TextInput label="Ring Bearer" value={editForm.ringBearer} onChange={val=>setEditForm({...editForm, ringBearer: val})} />
                          <TextInput label="Coin Bearer" value={editForm.coinBearer} onChange={val=>setEditForm({...editForm, coinBearer: val})} />
                       </div>
                       <ListManager label="Groom's Parents" items={editForm.groomParents} onChange={arr=>setEditForm({...editForm, groomParents: arr})} />
                       <ListManager label="Bride's Parents" items={editForm.brideParents} onChange={arr=>setEditForm({...editForm, brideParents: arr})} />
                       <ListManager label="Principal Sponsors" subtitle="Ordered dynamically. Evens are Male, Odds are Female." isPairs items={editForm.entouragePrincipal} onChange={arr=>setEditForm({...editForm, entouragePrincipal: arr})} />
                       <ListManager label="Groomsmen" items={editForm.groomsmen} onChange={arr=>setEditForm({...editForm, groomsmen: arr})} />
                       <ListManager label="Bridesmaids" items={editForm.bridesmaids} onChange={arr=>setEditForm({...editForm, bridesmaids: arr})} />
                       <ListManager label="Candle Sponsors" items={editForm.candleSponsors} onChange={arr=>setEditForm({...editForm, candleSponsors: arr})} />
                       <ListManager label="Veil Sponsors" items={editForm.veilSponsors} onChange={arr=>setEditForm({...editForm, veilSponsors: arr})} />
                       <ListManager label="Cord Sponsors" items={editForm.cordSponsors} onChange={arr=>setEditForm({...editForm, cordSponsors: arr})} />
                       <ListManager label="Flower Girls" items={editForm.flowerGirls} onChange={arr=>setEditForm({...editForm, flowerGirls: arr})} />
                    </div>
                 )}

                 {adminTab === 'media' && (
                    <div className="animate-in fade-in duration-300 w-full overflow-hidden">
                       <AudioManager label="Background Music" url={editForm.backgroundMusicUrl} onChange={val=>setEditForm({...editForm, backgroundMusicUrl: val})} showToast={showToast} user={user} appId={appId} storage={storage} />
                       
                       <SinglePhotoManager label="Landing Page Logo" url={editForm.logoUrl} onChange={val=>setEditForm({...editForm, logoUrl: val})} />
                       <PhotoManager label="Formal Invitation Pages" urls={editForm.invitationPages} onChange={arr=>setEditForm({...editForm, invitationPages: arr})} showToast={showToast} />

                       <PhotoManager label="Our Story Photos" urls={editForm.storyPhotos} onChange={arr=>setEditForm({...editForm, storyPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Ceremony Venues" urls={editForm.ceremonyPhotos} onChange={arr=>setEditForm({...editForm, ceremonyPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Reception Venues" urls={editForm.receptionPhotos} onChange={arr=>setEditForm({...editForm, receptionPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Dress Code Inspiration" urls={editForm.dressCodePhotos} onChange={arr=>setEditForm({...editForm, dressCodePhotos: arr})} showToast={showToast} />
                       <PhotoManager label="QR Codes (GCash, Maya, Bank)" urls={editForm.qrCodeUrls} onChange={arr=>setEditForm({...editForm, qrCodeUrls: arr})} showToast={showToast} />
                    </div>
                 )}

                 {adminTab === 'guests' && (
                    <div className="animate-in fade-in duration-300 w-full">
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm mb-4 sm:mb-6 w-full">
                         <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 sm:mb-5 border-b border-gray-100 pb-2">Add New Guest</h3>
                         <TextInput label="Guest Name" value={newGuestName} onChange={setNewGuestName} />
                         <div className="mb-4 sm:mb-5 w-full">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Unique Code (Leave blank for #JamesFoundHisCassie)</label>
                           <div className="flex gap-2 w-full">
                             <input type="text" value={newGuestCode} onChange={(e) => setNewGuestCode(e.target.value)} className="flex-1 w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[16px] sm:text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" placeholder="#JamesFoundHisCassie" />
                           </div>
                         </div>
                         <button onClick={handleAddGuest} className="w-full bg-weddingDark text-white py-2.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors touch-manipulation">Add Guest</button>
                       </div>
                       
                       <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm w-full">
                          <h3 className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 sm:mb-5 border-b border-gray-100 pb-2 flex justify-between items-center">
                            Guest List <span className="text-gray-400 font-normal">{invitees.length} total</span>
                          </h3>
                          <div className="flex gap-2 mb-4 w-full">
                             <input type="file" accept=".csv" ref={fileInputRef} onChange={handleBulkUploadCSV} className="hidden" />
                             <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-weddingAccent transition-colors touch-manipulation"><Upload size={10} className="sm:w-3 sm:h-3 inline mr-1"/> Import CSV</button>
                             <button onClick={handleDownloadCSV} className="flex-1 py-1.5 sm:py-2 bg-gray-50 border border-gray-200 rounded-lg text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-weddingAccent transition-colors touch-manipulation"><Download size={10} className="sm:w-3 sm:h-3 inline mr-1"/> Export</button>
                          </div>
                          <div className="space-y-2 sm:space-y-3 w-full">
                             {invitees.map(i => (
                                <div key={i.id} className="p-2.5 sm:p-3 bg-gray-50 border border-gray-200 rounded-lg relative group w-full overflow-hidden">
                                   <button onClick={() => handleDeleteGuest(i.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity p-1 touch-manipulation"><Trash2 size={12} className="sm:w-[14px] sm:h-[14px]"/></button>
                                   <div className="font-bold text-xs sm:text-sm text-gray-800 pr-6 truncate w-full">{String(i.name)}</div>
                                   <div className="text-[9px] sm:text-[10px] font-mono font-bold text-weddingAccent uppercase tracking-widest mt-1 mb-1.5 sm:mb-2 truncate w-full">Code: {String(i.code)}</div>
                                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-2 sm:gap-0 w-full">
                                     <span className={`px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase ${i.status === 'Attending' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{String(i.status)}</span>
                                     {i.message && (
                                       <button onClick={() => toggleMessageApproval(i.id, i.messageApproved)} className={`flex items-center gap-1 text-[8px] sm:text-[9px] font-bold uppercase touch-manipulation ${i.messageApproved ? 'text-pink-500' : 'text-gray-400'}`}>
                                         <Heart size={10} className="sm:w-3 sm:h-3" fill={i.messageApproved ? "currentColor" : "none"}/> {i.messageApproved ? 'Visible' : 'Hidden'}
                                       </button>
                                     )}
                                   </div>
                                </div>
                             ))}
                             {invitees.length === 0 && <div className="text-center text-xs text-gray-400 italic py-4">No guests added yet.</div>}
                          </div>
                       </div>
                    </div>
                 )}
              </div>
            </div>
          )}

          {/* ADMIN LOGIN MODAL */}
          {showAdminLogin && (
            <div className="fixed inset-0 z-[1000] bg-[#faf9f6]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-weddingDark">
              <div className="max-w-sm w-full text-center animate-in zoom-in duration-300">
                <button onClick={() => setShowAdminLogin(false)} className="mb-8 sm:mb-12 text-gray-300 hover:text-black transition-transform hover:rotate-90 focus:outline-none touch-manipulation"><X size={32} className="sm:w-10 sm:h-10 mx-auto" /></button>
                <h3 className="text-2xl sm:text-3xl font-serif mb-8 sm:mb-10 italic">Secure Access</h3>
                <form onSubmit={handleAdminLogin} className="w-full">
                  <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b-2 border-weddingDark text-center py-4 sm:py-6 mb-8 sm:mb-12 tracking-[0.5em] sm:tracking-[0.8em] text-2xl sm:text-3xl focus:outline-none bg-transparent rounded-none" placeholder="••••••••" />
                  {adminError && <p className="text-red-500 text-[9px] sm:text-[10px] font-bold mb-6 sm:mb-8 uppercase tracking-[0.2em]">{String(adminError)}</p>}
                  <button className="w-full bg-weddingDark text-white py-4 sm:py-5 rounded-2xl font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-[11px] shadow-2xl active:scale-95 transition-all hover:bg-black touch-manipulation">Verify Credentials</button>
                </form>
              </div>
            </div>
          )}

          {toastMessage && (
            <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 bg-weddingDark text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full text-[9px] sm:text-[11px] uppercase font-bold tracking-widest z-[1000] shadow-2xl animate-bounce whitespace-nowrap max-w-[90vw] truncate">
              {toastMessage}
            </div>
          )}
        </div>
      )}
    </>
  );
}
