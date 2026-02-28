import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, 
  KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, 
  BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, 
  ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, 
  Github, Globe, Terminal, Cloud, AlertCircle, ExternalLink, 
  MapPin, Music, Play, Pause, MailOpen, Camera, GripVertical, Plus,
  BookHeart, Users, Church, Send, Sparkles, Flame, Wind, Infinity as InfinityIcon, BookOpen, Coins, Gem
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
  groomName: "James",
  brideName: "Cassie",
  weddingDate: "April 10, 2026",
  weddingLocation: "Muntinlupa, Philippines",
  backgroundMusicUrl: "https://www.mfiles.co.uk/mp3-downloads/debussy-clair-de-lune.mp3", // Highly reliable public domain classical piano MP3
  ourStory: "Love is patient, love is kind (1 Corinthians 13:4)—and their love proved to be brave, choosing each other every day in faith. What began as a quiet night at Ooma became a story God was already writing—told through shared meals from Jollibee to Din Tai Fung, sweet evenings at Amano, and journeys to Australia, Vigan, La Union, Baguio, and Thailand. In grand adventures and quiet Sundays at Mass, they discovered that home is not a place but a person, and that with God at the center, their love would not easily be broken. Two years later, they stand certain—ready to begin a forever rooted in faith, devotion, and a love that grows sweeter with time.",
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
  
  giftOption1Title: "Bank Transfer",
  giftOption1Details: "Bank: BDO\nAccount Name: James & Cassie\nAccount Number: 1234 5678 9000",
  giftOption2Title: "Digital Wallet",
  giftOption2Details: "GCash / Maya\nName: James De Vera\nNumber: 0912 345 6789",
  
  qrCodeUrls: [], 
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
  flowerGirls: ["Amara Faith A. De Vera", "Marthina D. Hernandez", "Amare Faith Fresnoza", "Maree Margaret S. Dela Peña"]
};

const SAMPLE_MESSAGES = [
  { id: 's1', message: "Wishing you a lifetime of love, laughter, and endless happiness. We cannot wait to witness your beautiful day!", submittedName: "The Smith Family" },
  { id: 's2', message: "So incredibly happy for you both! Cheers to the beautiful couple and the amazing journey ahead.", submittedName: "Aunt Sarah & Uncle Mike" },
  { id: 's3', message: "May your love continue to grow stronger with each passing day. See you at the wedding!", submittedName: "Cousin Mark" },
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
  <div className="flex items-center justify-center gap-6 my-4 opacity-40 w-full">
    <div className="w-20 h-px bg-weddingSage shadow-sm"></div>
    <div className="w-2 h-2 rotate-45 bg-weddingAccent shadow-sm"></div>
    <div className="w-20 h-px bg-weddingSage shadow-sm"></div>
  </div>
);

// Elegant Canva-inspired Floral Wreath for section headers
const WreathIconWrapper = ({ children, isDark = false }) => {
  const strokeColor = isDark ? "text-weddingYellow" : "text-weddingAccent";
  return (
    <div className={`relative flex items-center justify-center mb-6 ${strokeColor}`}>
      <svg width="70" height="70" viewBox="0 0 100 100" className="absolute animate-[spin_60s_linear_infinite] opacity-60">
         {/* Subtle dashed inner ring */}
         <path d="M50 10 A40 40 0 1 1 49.9 10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 4"/>
         {/* Four delicate leaf accents */}
         <path d="M50 5 C55 15 65 15 50 25 C35 15 45 15 50 5" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M50 95 C55 85 65 85 50 75 C35 85 45 85 50 95" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M5 50 C15 45 15 35 25 50 C15 65 15 55 5 50" fill="none" stroke="currentColor" strokeWidth="1"/>
         <path d="M95 50 C85 45 85 35 75 50 C85 65 85 55 95 50" fill="none" stroke="currentColor" strokeWidth="1"/>
         {/* Corner dots */}
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
  <div className="flex flex-col items-center mb-10 md:mb-14 text-center">
    {Icon && (
       <WreathIconWrapper isDark={isDark}>
         <Icon size={26} strokeWidth={1.2} />
       </WreathIconWrapper>
    )}
    {subtitle && (
      <h2 className={`text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase mb-4 opacity-90 border-b pb-2 inline-block ${isDark ? 'text-weddingYellow border-weddingYellow/30' : 'text-weddingAccent border-weddingSage/30'}`}>
        {subtitle}
      </h2>
    )}
    <h3 className={`text-3xl sm:text-4xl md:text-5xl font-serif italic drop-shadow-sm ${isDark ? 'text-white' : 'text-weddingDark'}`}>
      {title}
    </h3>
  </div>
);

const AnimatedLeaves = ({ count = 8 }) => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className={`absolute opacity-30 animate-float drop-shadow-md ${i % 2 === 0 ? 'text-weddingYellow' : 'text-weddingAccent'}`}
        style={{ left: `${Math.random() * 100}%`, top: `-10%`, animationDuration: `${10 + Math.random() * 15}s`, animationDelay: `${Math.random() * 5}s`, transform: `scale(${0.8 + Math.random() * 1.5})` }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" /></svg>
      </div>
    ))}
  </div>
);

const LandingPage = ({ onOpen, groom, bride }) => (
  <div className="fixed inset-0 z-[200] bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000 overflow-hidden">
    
    {/* Elegant Visual Background */}
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-[20s] ease-out scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-[#faf9f6]/80 to-[#faf9f6]/95 backdrop-blur-[3px]"></div>
    </div>

    <AnimatedLeaves count={8} />
    <div className="max-w-md w-full border border-weddingSage/30 p-8 sm:p-12 rounded-[3rem] aspect-[1/1.5] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm z-10 scale-95 md:scale-100">
       <div className="absolute inset-4 border border-weddingSage/10 rounded-[2.5rem]"></div>
       <div className="z-20 flex flex-col items-center w-full">
         <p className="text-weddingAccent tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[9px] sm:text-[10px] mb-6 font-bold">You are invited to the wedding of</p>
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-script text-weddingDark mb-2 break-words max-w-full px-2 leading-tight py-1">{groom}</h1>
         <span className="text-xl sm:text-2xl font-serif italic text-weddingSage mb-2">&</span>
         <h1 className="text-4xl sm:text-5xl md:text-6xl font-script text-weddingDark mb-8 break-words max-w-full px-2 leading-tight py-1">{bride}</h1>
         <button onClick={onOpen} className="mt-4 flex flex-col items-center gap-4 group focus:outline-none">
           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-weddingYellow rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-500">
             <MailOpen className="text-weddingDark w-6 h-6 sm:w-8 sm:h-8" />
           </div>
           <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] text-weddingDark animate-pulse">Open Invitation</span>
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
    <div className="flex justify-center gap-4 sm:gap-6 mt-6 backdrop-blur-md bg-white/40 px-6 py-4 rounded-3xl border border-white/60 shadow-sm max-w-lg mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center min-w-[50px] sm:min-w-[60px]">
          <span className="text-2xl sm:text-3xl font-serif text-weddingDark">{String(value).padStart(2, '0')}</span>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mt-1">{unit}</span>
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
       <div className="flex gap-2 sm:gap-3">
         {displayColors.slice(0, 6).map((c, idx) => (
           <div key={idx} className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-sm border border-gray-300 overflow-hidden cursor-pointer hover:scale-110 transition-transform">
             <input type="color" value={c} onChange={e => updateColor(idx, e.target.value)} className="absolute inset-[-10px] w-20 h-20 cursor-pointer" />
           </div>
         ))}
       </div>
    </div>
  )
};

// Auto-scrolling seamless collage component specifically designed for multi-orientation mixed photos
const StoryCollage = ({ photos = [] }) => {
  const scrollRef = useRef(null);
  const isPaused = useRef(false);
  const validPhotos = photos.filter(p => p && typeof p === 'string' && p.trim() !== '');
  
  // Ensure we have enough photos to create a seamless infinite scrolling loop
  let displayPhotos = [...validPhotos];
  if (displayPhotos.length > 0) {
    while (displayPhotos.length < 6) {
      displayPhotos = [...displayPhotos, ...validPhotos];
    }
    // Duplicate the final set once more so the scroll width perfectly cuts in half
    displayPhotos = [...displayPhotos, ...displayPhotos];
  }

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || validPhotos.length === 0) return;
    
    let animationFrameId;
    let scrollPos = 0;
    
    const scroll = () => {
      if (!isPaused.current) {
        // Reduced scroll speed for a more elegant, cinematic pace
        scrollPos += 0.3; 
        // Reset when we've scrolled exactly halfway (the duplicate array threshold)
        if (scrollPos >= el.scrollWidth / 2) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [validPhotos]);

  if (validPhotos.length === 0) return null;

  return (
    <div className="w-full max-w-6xl bg-[#faf9f6] rounded-[2rem] border-[6px] md:border-[8px] border-white shadow-2xl relative overflow-hidden z-10 mx-auto group">
       <div 
         ref={scrollRef}
         className="flex h-[320px] sm:h-[450px] md:h-[550px] gap-2 sm:gap-3 p-2 sm:p-3 overflow-hidden flex-nowrap"
         onMouseEnter={() => isPaused.current = true}
         onMouseLeave={() => isPaused.current = false}
         onTouchStart={() => isPaused.current = true}
         onTouchEnd={() => isPaused.current = false}
       >
          {displayPhotos.map((url, idx) => (
             <img 
                key={idx} 
                src={url} 
                alt={`Story Detail ${idx}`} 
                // w-auto and h-full ensures NO spaces and accommodates both landscape and portrait seamlessly!
                className="h-full w-auto object-cover rounded-xl shadow-md shrink-0 transition-transform duration-700 hover:scale-[1.02] cursor-pointer"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" }} 
             />
          ))}
       </div>
    </div>
  );
};

const ImageSlider = ({ photos = [], altText, containerClass, imageClass, fitClass = "object-cover" }) => {
  const validPhotos = photos.filter(p => p && typeof p === 'string' && p.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validPhotos.length <= 1) return;
    const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % validPhotos.length); }, 4500);
    return () => clearInterval(interval);
  }, [validPhotos.length]);

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
             className={`absolute inset-0 w-full h-full ${fitClass} transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${imageClass || ''}`} />
      ))}
      {/* Slider Controls */}
      <button onClick={handlePrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95">
         <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>
      <button onClick={handleNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95">
         <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

// ==========================================
// 4. ADMIN EDITOR COMPONENTS
// ==========================================

const TextInput = ({ label, value, onChange, isTextArea = false }) => (
  <div className="mb-5">
    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
    {isTextArea ? (
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={4} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" />
    ) : (
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" />
    )}
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
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><Music size={12} className="inline mr-1"/> {label}</label>
      <div className="text-xs text-gray-500 mb-4 truncate bg-gray-50 p-2 rounded border border-gray-100" title={url}>Current: {url && url.startsWith('http') ? 'Active Audio Link' : (url || 'None')}</div>
      
      <div className="mb-4">
         <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
         <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full bg-weddingAccent/10 text-weddingDark border border-weddingAccent/30 px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent/20 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
            <Upload size={14} /> {isUploading ? 'Uploading to Firebase...' : 'Upload MP3 to Firebase'}
         </button>
      </div>

      <div className="relative flex items-center py-2 mb-2">
         <div className="flex-grow border-t border-gray-200"></div>
         <span className="flex-shrink-0 mx-2 text-[8px] text-gray-400 uppercase font-bold tracking-widest">OR PASTE URL</span>
         <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="flex gap-2">
         <input type="text" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} placeholder="Paste MP3, or GDrive URL here..." className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
         <button onClick={handleSetUrl} className="bg-weddingDark text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent transition-colors">Link</button>
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
     <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3"><ImageIcon size={12} className="inline mr-1"/> {label}</label>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
           {urls.map((url, idx) => (
              <div key={idx} draggable onDragStart={(e)=>handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e, idx)} className={`relative aspect-square rounded overflow-hidden group border cursor-move transition-all ${draggedIdx === idx ? 'opacity-30 border-dashed border-gray-500' : 'border-gray-200'}`}>
                 <img src={url} className="w-full h-full object-cover" alt="Preview" onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&q=80" }} />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={()=>handleRemove(idx)} className="text-white bg-red-500 p-1.5 rounded-full hover:scale-110 transition-transform"><Trash2 size={12}/></button>
                 </div>
              </div>
           ))}
           {urls.length === 0 && <div className="col-span-3 text-center p-4 border border-dashed rounded text-xs text-gray-400">No photos added.</div>}
        </div>

        <div className="flex gap-2 mb-2">
           <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="Paste image URL here..." className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
           <button onClick={handleAddUrl} className="bg-weddingDark text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent transition-colors flex items-center gap-1"><Plus size={12}/> Add</button>
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
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
       <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</label>
       {subtitle && <p className="text-[9px] text-gray-400 mb-3 uppercase tracking-widest leading-relaxed">{subtitle}</p>}
       
       <div className="space-y-2 mb-3">
         {items.map((item, idx) => (
            <div key={idx} draggable onDragStart={(e)=>handleDragStart(e, idx)} onDragOver={handleDragOver} onDrop={(e)=>handleDrop(e, idx)} className={`flex items-center gap-2 bg-gray-50 p-2 rounded-lg border transition-all ${draggedIdx === idx ? 'opacity-30 border-dashed border-gray-500 shadow-inner bg-gray-100' : 'border-gray-200 hover:border-gray-300'}`}>
               <div className="cursor-move text-gray-400 hover:text-weddingDark p-1" title="Drag to reorder"><GripVertical size={14}/></div>
               {isPairs && <div className="text-[9px] font-bold uppercase w-14 text-weddingAccent tracking-widest shrink-0">{idx%2===0?'Male:':'Female:'}</div>}
               <input type="text" value={item} onChange={(e)=>updateItem(e.target.value, idx)} placeholder="Enter name..." className="flex-1 bg-transparent border-b border-transparent focus:border-weddingAccent focus:outline-none text-sm px-1 py-1 font-serif text-gray-800" />
               <button onClick={()=>removeItem(idx)} className="text-gray-300 hover:text-red-500 p-1 transition-colors"><X size={14}/></button>
            </div>
         ))}
         {items.length === 0 && <div className="text-[10px] text-gray-400 italic p-3 text-center border border-dashed border-gray-200 rounded-lg">List is empty</div>}
       </div>
       
       <button onClick={handleAdd} className="w-full py-2.5 border border-dashed border-weddingAccent/30 rounded-lg text-[10px] font-bold uppercase tracking-widest text-weddingAccent hover:bg-weddingAccent hover:text-white transition-colors flex justify-center items-center gap-2">
          <UserPlus size={14}/> Add Row
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

  const normalizeData = (data) => {
    const toArr = (val, splitChar) => {
       if (Array.isArray(val)) return val;
       if (typeof val === 'string' && val.trim() !== '') return val.split(splitChar).map(s=>s.trim()).filter(Boolean);
       return [];
    };
    
    let palette = Array.isArray(data.colorPalette) ? data.colorPalette : DEFAULT_DETAILS.colorPalette;
    if (palette.length === 0) palette = DEFAULT_DETAILS.colorPalette;

    return {
       ...DEFAULT_DETAILS,
       ...data,
       colorPalette: palette,
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
  const handleOpenInvitation = () => {
    // Removed audio auto-play so it is completely opt-in for the guest
    setIsLanding(false);
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
    const fontLink = document.createElement('link'); fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&display=swap'; fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
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
    const newGuest = { id: `local_${Date.now()}`, name: newGuestName, code: finalCode, status: 'Pending', message: '', messageApproved: false, timestamp: Date.now() };
    
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
             try { await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), { name, code, status: 'Pending', timestamp: Date.now() }); } catch(e){} 
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
        <LandingPage onOpen={handleOpenInvitation} groom={String(displayData.groomName)} bride={String(displayData.brideName)} />
      ) : (
        <div className="h-screen w-full flex overflow-hidden bg-[#faf9f6]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          
          {/* ========================================================= */}
          {/* LEFT: LIVE WEBSITE PREVIEW */}
          {/* ========================================================= */}
          <div className={`flex-1 relative h-full overflow-y-auto transition-all duration-300 text-weddingDark selection:bg-weddingYellow/40 shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]`}>
            
            {/* Background Layers */}
            <div className="fixed inset-0 z-0 bg-cover bg-center opacity-50 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}></div>
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/90 to-[#faf9f6]/95 backdrop-blur-[2px] pointer-events-none"></div>
            <AnimatedLeaves count={8} />
            
            {/* Elegant Custom Music Control (Opt-In) */}
            <div className="fixed left-6 bottom-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div onClick={toggleAudio} className="bg-white/80 backdrop-blur-xl p-3 pr-5 rounded-[16px] shadow-2xl border border-white/50 flex items-center gap-4 transition-all hover:bg-white/95 cursor-pointer group hover:scale-105 active:scale-95">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-weddingSage text-white shadow-md' : 'bg-weddingYellow text-weddingDark animate-pulse'}`}>
                  {isPlaying ? <Music size={16} /> : <Play size={16} className="ml-0.5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-widest font-bold text-weddingAccent flex items-center gap-1.5">
                     {audioError ? <span className="text-red-500">File Error</span> : (isPlaying ? 'Now Playing' : 'Paused')}
                  </span>
                  <span className="text-xs font-serif italic text-gray-700 max-w-[160px] truncate" title="Background Music">
                    Piano Instrumental
                  </span>
                </div>
              </div>
            </div>

            {/* Quick RSVP Floating Icon */}
            <button 
               onClick={() => document.getElementById('rsvp')?.scrollIntoView({behavior: 'smooth'})}
               className="fixed bottom-6 right-6 z-50 bg-weddingDark text-weddingYellow p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group border border-weddingYellow/20 animate-in fade-in slide-in-from-bottom-8 duration-1000"
            >
               <Send size={18} className="md:w-5 md:h-5" />
               <span className="hidden md:inline text-[9px] uppercase font-bold tracking-[0.2em] mr-1">RSVP</span>
            </button>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-40 py-4 bg-[#faf9f6]/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all ${isAdminAuth ? 'md:right-[450px]' : ''}`}>
              <div className="max-w-screen-xl mx-auto px-4 flex justify-center gap-4 sm:gap-8 md:gap-10 text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-gray-500 flex-wrap">
                {['Home', 'Story', 'Entourage', 'Venues', 'Gifts', 'RSVP'].map(t => (
                  <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className="hover:text-weddingDark transition-all active:scale-95 border-b-2 border-transparent hover:border-weddingAccent pb-1">{t}</button>
                ))}
              </div>
            </nav>

            <main className="w-full relative z-10 pt-16">
              
              {/* HERO */}
              <section id="home" className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden pb-8">
                <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] text-weddingSage opacity-20 pointer-events-none" />
                <p className="text-weddingAccent tracking-[0.6em] uppercase text-[12px] mb-4 font-bold animate-pulse">Join us to celebrate</p>
                <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[9rem] font-script font-bold leading-none mb-2 text-weddingDark drop-shadow-sm select-none transition-all break-words max-w-full px-4 text-center py-2">
                  {String(displayData.groomName)} <br/>
                  <span className="text-3xl sm:text-4xl md:text-7xl font-serif italic text-weddingAccent my-2 block leading-none">&amp;</span> 
                  {String(displayData.brideName)}
                </h1>
                <LineAccent />
                <p className="text-xl sm:text-2xl md:text-4xl tracking-[0.3em] font-light text-gray-800 uppercase mb-2 transition-all">{String(displayData.weddingDate)}</p>
                <p className="text-[10px] sm:text-[11px] md:text-[13px] tracking-[0.5em] text-gray-400 font-bold uppercase mb-4 transition-all">{String(displayData.weddingLocation)}</p>
                <CountdownTimer targetDate={displayData.weddingDate} />
              </section>

              {/* STORY */}
              <section id="story" className="py-10 md:py-14 px-4 max-w-screen-xl mx-auto">
                 <SectionHeading title="Our Story" subtitle="The Beginning" Icon={BookHeart} />
                <div className="flex flex-col items-center gap-10 relative">
                  <div className="w-full text-center z-20">
                    <div className="bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-2xl border border-white shadow-xl max-w-4xl mx-auto">
                      <div className="text-base sm:text-lg md:text-xl font-serif leading-relaxed text-gray-800 italic text-justify md:text-center">
                         <span className="text-4xl md:text-5xl text-weddingYellow block mb-2 opacity-50 font-serif leading-none select-none">"</span>
                         {String(displayData.ourStory)}
                      </div>
                    </div>
                  </div>
                  
                  <StoryCollage photos={displayData.storyPhotos} />
                  
                </div>
              </section>

              {/* ENTOURAGE */}
              <section id="entourage" className="py-10 md:py-14 px-4 bg-white/20 backdrop-blur-sm border-y border-white transition-all">
                <div className="max-w-screen-lg mx-auto text-center">
                  <SectionHeading title="The Entourage" subtitle="Our Loved Ones" Icon={Users} />
                  
                  {/* Parents */}
                  <div className="mb-8 flex flex-col items-center">
                    <h3 className="text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-6 border-b-2 border-weddingYellow inline-block pb-2">Beloved Parents</h3>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 text-center w-full max-w-3xl mx-auto">
                      <div className="flex flex-col items-center flex-1 w-full overflow-hidden justify-center h-full">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-weddingSage/30 pb-1">Parents of the Groom</h4>
                        {(displayData.groomParents||[]).map((n,i)=><p key={i} className="text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{n}</p>)}
                      </div>
                      <div className="hidden md:block w-px bg-weddingSage/30 self-stretch min-h-[100px]"></div>
                      <div className="flex flex-col items-center flex-1 w-full overflow-hidden justify-center h-full">
                        <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-weddingSage/30 pb-1">Parents of the Bride</h4>
                        {(displayData.brideParents||[]).map((n,i)=><p key={i} className="text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{n}</p>)}
                      </div>
                    </div>
                  </div>

                  {/* Principal Sponsors */}
                  <div className="mb-8 bg-white/40 p-4 md:p-6 rounded-2xl border border-white shadow-sm overflow-hidden">
                     <h3 className="text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-4 inline-block">Principal Sponsors</h3>
                     <div className="flex flex-col items-center gap-2 max-w-4xl mx-auto w-full">
                       {principalPairs.map((pair, i) => (
                         <div key={i} className="flex items-center justify-between border-b border-weddingSage/10 pb-2 w-full last:border-0 group overflow-hidden">
                           <div className="flex-1 text-right break-words text-base md:text-lg font-serif text-gray-800 px-2 md:px-4">{String(pair.male)}</div>
                           <div className="text-weddingSage opacity-40 italic text-lg md:text-xl font-serif text-center px-1 shrink-0">&amp;</div>
                           <div className="flex-1 text-left break-words text-base md:text-lg font-serif text-gray-800 px-2 md:px-4">{String(pair.female)}</div>
                         </div>
                       ))}
                     </div>
                  </div>

                  {/* Best Man & Maid of Honor */}
                  <div className="max-w-3xl mx-auto flex flex-col items-center w-full mb-8 bg-white/60 backdrop-blur-md p-4 md:p-6 rounded-xl border border-white/80 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-center relative">
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                      <div className="flex flex-col items-center flex-1 md:pr-4 overflow-hidden">
                        <h4 className="text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-1">Best Man</h4>
                        <p className="text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.bestMan)}</p>
                      </div>
                      <div className="flex flex-col items-center flex-1 md:pl-4 overflow-hidden">
                        <h4 className="text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-1">Maid of Honor</h4>
                        <p className="text-lg md:text-2xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.maidOfHonor)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Groomsmen & Bridesmaids */}
                  <div className="max-w-4xl mx-auto text-gray-800 flex flex-col items-center w-full mb-8 relative overflow-hidden px-2">
                     <div className="grid grid-cols-2 gap-x-4 mb-2 pb-2 border-b border-weddingAccent/30 w-full">
                       <div className="text-right text-[8px] sm:text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Groomsmen</div>
                       <div className="text-left text-[8px] sm:text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Bridesmaids</div>
                     </div>
                     <div className="absolute left-1/2 top-6 bottom-0 w-px bg-weddingSage/20 -translate-x-1/2"></div>
                     {entouragePartners.map((partner, i) => (
                       <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-x-2 mb-1 w-full items-center relative z-10">
                         <div className="text-right overflow-hidden"><p className="text-base md:text-lg font-serif leading-snug break-words">{String(partner.groomSide)}</p></div>
                         <div className="w-px h-full bg-transparent mx-2"></div>
                         <div className="text-left overflow-hidden"><p className="text-base md:text-lg font-serif leading-snug break-words">{String(partner.brideSide)}</p></div>
                       </div>
                     ))}
                  </div>

                  {/* Secondary Sponsors */}
                  <div className="max-w-5xl mx-auto my-8">
                     <h3 className="text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-4 text-center">Secondary Sponsors</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center md:text-right border-b md:border-b-0 md:border-r border-weddingSage/20 pb-4 md:pb-0 md:pr-6 overflow-hidden flex flex-col items-center md:items-end">
                           <Flame size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Candle</h4>
                           {(displayData.candleSponsors||[]).map((n, i) => <p key={i} className="text-base md:text-lg font-serif mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                        <div className="text-center border-b md:border-b-0 border-weddingSage/20 pb-4 md:pb-0 px-6 overflow-hidden flex flex-col items-center">
                           <Wind size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Veil</h4>
                           {(displayData.veilSponsors||[]).map((n, i) => <p key={i} className="text-base md:text-lg font-serif mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                        <div className="text-center md:text-left md:border-l border-weddingSage/20 pt-4 md:pt-0 md:pl-6 overflow-hidden flex flex-col items-center md:items-start">
                           <InfinityIcon size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Cord</h4>
                           {(displayData.cordSponsors||[]).map((n, i) => <p key={i} className="text-base md:text-lg font-serif mb-1 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                        </div>
                     </div>
                  </div>

                  {/* Bearers & Flower Girls */}
                  <div className="max-w-4xl mx-auto mt-8 px-2">
                     <h3 className="text-[10px] md:text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-6 text-center">Little Entourage</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <BookOpen size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Bible Bearer</h4>
                           <p className="text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.bibleBearer)}</p>
                        </div>
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <Coins size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Coin Bearer</h4>
                           <p className="text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.coinBearer)}</p>
                        </div>
                        <div className="overflow-hidden w-full px-2 flex flex-col items-center">
                           <Gem size={18} className="text-weddingAccent mb-1.5 opacity-70" />
                           <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 border-b border-weddingSage/30 pb-1 inline-block px-4">Ring Bearer</h4>
                           <p className="text-base md:text-lg font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.ringBearer)}</p>
                        </div>
                     </div>
                     <div className="pt-3 text-center max-w-4xl mx-auto w-full">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-4 inline-block px-5 py-1.5 border border-gray-200 rounded-full">Flower Girls</h4>
                        {/* Replaced fixed grid with flex wrap to neatly center any number of flower girls */}
                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-4 w-full">
                           {(displayData.flowerGirls||[]).map((n, i) => (
                              <p key={i} className="text-base md:text-lg font-serif text-weddingDark italic break-words leading-snug text-center">{n}</p>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </section>

              {/* VENUES */}
              <section id="venues" className="py-10 md:py-14 px-4 max-w-screen-xl mx-auto transition-all">
                <SectionHeading title="The Venues" subtitle="Where & When" Icon={Church} />
                <div className="grid lg:grid-cols-2 gap-6 md:gap-10">
                  <div className="bg-white p-2 shadow-2xl relative rounded">
                    <div className="aspect-[16/10] overflow-hidden rounded-sm">
                      <ImageSlider photos={displayData.ceremonyPhotos} altText="Ceremony" containerClass="w-full h-full" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl md:text-3xl font-serif text-weddingDark mb-2">The Ceremony</h3>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-2">{String(displayData.ceremonyDate)} | {String(displayData.ceremonyTime)}</p>
                      <p className="text-base md:text-lg font-serif mb-4 italic text-gray-700">{String(displayData.ceremonyVenue)}</p>
                      <a href={String(displayData.ceremonyMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-weddingDark text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                        <MapPin size={14} /> View Location
                      </a>
                    </div>
                  </div>
                  <div className="bg-white p-2 shadow-2xl relative rounded">
                    <div className="aspect-[16/10] overflow-hidden rounded-sm">
                      <ImageSlider photos={displayData.receptionPhotos} altText="Reception" containerClass="w-full h-full" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-2xl md:text-3xl font-serif text-weddingDark mb-2">The Reception</h3>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-2">{String(displayData.receptionTime)}</p>
                      <p className="text-base md:text-lg font-serif mb-4 italic text-gray-700">{String(displayData.receptionVenue)}</p>
                      <a href={String(displayData.receptionMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2 bg-weddingDark text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                        <MapPin size={14} /> View Location
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* DETAILS */}
              <section id="details" className="py-10 md:py-14 px-4 bg-white/60 border-y border-white transition-all">
                <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                   <div className="text-center md:text-left">
                      <SectionHeading title="Attire" subtitle="Dress Code & Details" Icon={Sparkles} />
                      <p className="text-base font-serif leading-relaxed text-gray-800 mb-8">{String(displayData.dressCodeText)}</p>

                      {/* COLOR PALETTE */}
                      {displayData.colorPalette && displayData.colorPalette.length > 0 && (
                        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                           <h4 className="text-[9px] font-bold tracking-widest uppercase mb-4 text-weddingAccent border-b border-weddingSage/30 pb-1">Color Palette</h4>
                           <div className="flex gap-3 sm:gap-4 flex-wrap justify-center md:justify-start">
                              {displayData.colorPalette.slice(0, 6).map((color, idx) => (
                                <div 
                                   key={idx} 
                                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md border-2 border-white transform hover:scale-110 transition-transform cursor-pointer" 
                                   style={{ backgroundColor: color }} 
                                   title={`Theme Color ${idx + 1}`} 
                                />
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                   <div className="aspect-[4/5] bg-white p-2 shadow-2xl overflow-hidden rounded-t-full max-w-sm mx-auto w-full relative">
                      <ImageSlider photos={displayData.dressCodePhotos} altText="Dress Code" containerClass="w-full h-full rounded-t-full" imageClass="rounded-t-full" />
                   </div>
                </div>
              </section>

              {/* GIFTS */}
              <section id="gifts" className="py-10 md:py-14 px-4 relative bg-[#faf9f6]/80 backdrop-blur-sm border-b border-white">
                <div className="max-w-screen-md mx-auto text-center">
                  <SectionHeading title="Send Some Love" subtitle="Gifts & Registry" Icon={Gift} />
                  <p className="text-base font-serif leading-relaxed text-gray-800 mb-6">{String(displayData.giftText)}</p>

                  <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
                    {/* TWO EDITABLE SPACES */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6 mt-4">
                       {(displayData.giftOption1Title || displayData.giftOption1Details) && (
                         <div className="bg-[#faf9f6] p-4 rounded-2xl border border-weddingSage/30 shadow-inner text-left">
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-weddingAccent mb-2">{String(displayData.giftOption1Title)}</h4>
                            <div className="text-gray-700 font-sans text-sm whitespace-pre-line leading-relaxed">{String(displayData.giftOption1Details)}</div>
                         </div>
                       )}
                       {(displayData.giftOption2Title || displayData.giftOption2Details) && (
                         <div className="bg-[#faf9f6] p-4 rounded-2xl border border-weddingSage/30 shadow-inner text-left">
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-weddingAccent mb-2">{String(displayData.giftOption2Title)}</h4>
                            <div className="text-gray-700 font-sans text-sm whitespace-pre-line leading-relaxed">{String(displayData.giftOption2Details)}</div>
                         </div>
                       )}
                    </div>
                    
                    {/* QR CODES */}
                    {displayData.qrCodeUrls && displayData.qrCodeUrls.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-4">
                        {displayData.qrCodeUrls.map((qr, idx) => (
                           <div key={idx} className="w-24 h-24 sm:w-32 sm:h-32 bg-white p-2 shadow-lg rounded-xl border border-gray-100 transition-transform hover:scale-105">
                             <img src={qr} alt={`QR Code ${idx + 1}`} className="w-full h-full object-contain" />
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* GUESTBOOK - NEW SCROLLING TIMELINE FORMAT */}
              <section id="guestbook" className="py-10 md:py-14 px-4 relative bg-white/40 backdrop-blur-md border-b">
                <div className="max-w-screen-md mx-auto text-center">
                  <SectionHeading title="Guestbook" subtitle="Wishes & Love" Icon={MessageSquareHeart} />
                  
                  {displayMessages.length > 0 ? (
                    <div className="relative w-full max-w-2xl mx-auto h-[350px] md:h-[450px] bg-white/50 backdrop-blur-xl border border-white p-4 md:p-6 rounded-[2rem] shadow-inner overflow-y-auto space-y-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
                      
                      {displayMessages.map((m) => (
                        <div key={m.id} className="bg-[#faf9f6]/95 p-5 md:p-6 border border-white shadow-sm rounded-2xl flex flex-col md:flex-row gap-4 items-start text-left group transition-all duration-300 hover:shadow-md">
                          <MessageSquareHeart className="w-5 h-5 md:w-6 md:h-6 text-weddingSage/80 shrink-0 mt-1" />
                          <div className="flex-1">
                             <p className="text-sm md:text-base font-serif italic leading-relaxed text-gray-800 mb-3">"{String(m.message)}"</p>
                             <p className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold text-weddingAccent border-t border-gray-100 pt-2">- {String(m.submittedName)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 font-serif italic py-8 text-sm md:text-base">Be the first to leave a message...</div>
                  )}
                </div>
              </section>

              {/* RSVP */}
              <section id="rsvp" className="py-14 md:py-16 px-4 bg-[#1f2b22] text-white transition-all">
                <div className="max-w-screen-md mx-auto">
                  
                  <SectionHeading title="Join the Celebration" subtitle="RSVP" Icon={Send} isDark />
                  <div className="text-center mb-10 -mt-6">
                    <p className="text-weddingYellow font-serif italic text-base md:text-lg border border-weddingYellow/20 px-6 py-2 inline-block bg-weddingYellow/5 rounded-full">Please respond by {String(displayData.rsvpDeadline)}</p>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-weddingSage text-weddingDark p-10 md:p-14 rounded-[2rem] text-center shadow-2xl animate-in zoom-in duration-500">
                      <CheckCircle size={60} className="mx-auto mb-6 text-weddingDark animate-bounce" />
                      <h4 className="text-3xl md:text-4xl font-serif mb-3">Thank You!</h4>
                      <p className="font-serif italic text-lg md:text-xl">We can't wait to see you there.</p>
                      <button onClick={() => setSubmitSuccess(false)} className="mt-8 text-[9px] md:text-[10px] uppercase font-bold border-b-2 border-weddingDark pb-1">Edit RSVP</button>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-6 md:space-y-8">
                      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-weddingSage text-weddingDark p-6 md:p-8 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                          <label className="block text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-2 text-weddingDark/80 flex items-center justify-center gap-1.5">
                             <KeyRound size={12} /> Security Code
                          </label>
                          <input required value={rsvpForm.enteredCode} onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/40 py-2 md:py-3 focus:outline-none focus:border-weddingDark tracking-widest text-lg md:text-xl font-serif text-weddingDark placeholder:text-weddingDark/50 text-center" placeholder="Enter Code" />
                        </div>
                        <div className="bg-weddingSage text-weddingDark p-6 md:p-8 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                          <label className="block text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-2 text-weddingDark/80 flex items-center justify-center gap-1.5">
                             <Heart size={12} /> Full Name
                          </label>
                          <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/40 py-2 md:py-3 focus:outline-none focus:border-weddingDark text-xl md:text-2xl font-serif italic text-weddingDark placeholder:text-weddingDark/50 text-center" placeholder="Your Name" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                        {['yes', 'no'].map(v => (
                          <label key={v} className={`flex-1 py-6 text-center rounded-3xl border-2 cursor-pointer transition-all ${rsvpForm.attending === v ? 'bg-weddingYellow border-weddingYellow text-weddingDark shadow-2xl scale-105' : 'border-white/30 hover:border-white/60 bg-white/10 text-white'}`}>
                            <input type="radio" className="hidden" value={v} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                          </label>
                        ))}
                      </div>

                      <div className="bg-weddingSage text-weddingDark p-6 md:p-8 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                        <label className="block text-[8px] md:text-[9px] font-bold tracking-widest uppercase mb-2 text-weddingDark/80 flex justify-center items-center gap-2">
                           <MessageSquareHeart size={12} /> Wishes for the Couple
                        </label>
                        <textarea value={rsvpForm.message} onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} className="w-full bg-transparent border-none focus:outline-none min-h-[100px] md:min-h-[120px] text-lg md:text-xl font-serif italic text-weddingDark placeholder:text-weddingDark/50 resize-none text-center" placeholder="Leave a message for our digital guestbook..." />
                        <div className="text-weddingDark/50 italic font-serif text-xs mt-2 text-center">(Messages are reviewed before posting)</div>
                      </div>

                      {submitError && <div className="text-red-300 text-center p-3 md:p-4 bg-red-900/40 rounded-2xl border border-red-500/30 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{String(submitError)}</div>}
                      <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-6 md:py-8 rounded-3xl font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50">
                        {isSubmitting ? 'Processing RSVP...' : 'Confirm My Attendance'}
                      </button>
                    </form>
                  )}
                </div>
              </section>

              {/* FOOTER & LOGOUT */}
              <footer className="py-12 md:py-16 text-center bg-[#faf9f6] border-t border-gray-200 relative z-10 transition-all">
                <p className="font-script text-4xl sm:text-5xl md:text-6xl text-weddingDark mb-3 select-none break-words px-4 leading-normal">{String(displayData.groomName)} &amp; {String(displayData.brideName)}</p>
                <div className="w-16 h-px bg-weddingSage mx-auto mb-6 opacity-50"></div>
                <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.5em] text-gray-500 mb-6">{String(displayData.weddingDate)} • {String(displayData.weddingLocation)}</p>
                
                <div className="flex flex-col items-center gap-4 mb-8 max-w-xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-5 text-[8px] md:text-[9px] font-bold text-gray-700 uppercase tracking-widest bg-white/60 px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                     <span className="flex items-center gap-2"><Phone size={12} className="text-weddingSage"/> {String(displayData.contactPhone)}</span>
                     <span className="hidden md:block text-gray-300">|</span>
                     <span className="flex items-center gap-2"><Mail size={12} className="text-weddingSage"/> {String(displayData.contactEmail)}</span>
                  </div>
                </div>

                {!isAdminAuth && <button onClick={() => setShowAdminLogin(true)} className="text-[8px] md:text-[9px] uppercase tracking-widest text-gray-300 hover:text-weddingDark transition-colors flex items-center gap-2 mx-auto px-4 py-2 border border-gray-100 rounded-full"><Lock size={10}/> Staff Login</button>}
              </footer>
            </main>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: ADMIN LIVE EDITOR SIDEBAR */}
          {/* ========================================================= */}
          {isAdminAuth && editForm && (
            <div className="w-full md:w-[450px] h-screen bg-gray-100 fixed right-0 top-0 border-l border-gray-300 shadow-2xl z-[500] flex flex-col font-sans animate-in slide-in-from-right duration-300">
              
              {/* Sidebar Header */}
              <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0 shadow-sm z-10">
                 <div>
                   <h2 className="font-serif italic text-2xl text-weddingDark font-bold flex items-center gap-2">
                     <Edit2 size={20} className="text-weddingAccent"/> Live Editor
                   </h2>
                   <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1 font-bold">Preview updates instantly</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={handlePublishChanges} disabled={isSavingDetails} className="bg-weddingDark text-weddingYellow px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-lg flex items-center gap-2 hover:bg-black transition-colors disabled:opacity-50">
                       {isSavingDetails ? 'Saving...' : <><Save size={14}/> Publish</>}
                    </button>
                    <button onClick={()=>setIsAdminAuth(false)} className="text-red-400 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-transparent hover:border-red-100"><X size={18}/></button>
                 </div>
              </div>

              {/* Sidebar Tabs */}
              <div className="flex bg-white border-b border-gray-200 shrink-0 text-[10px] font-bold uppercase tracking-widest">
                {['details', 'entourage', 'media', 'guests'].map(tab => (
                   <button key={tab} onClick={()=>setAdminTab(tab)} className={`flex-1 py-4 text-center border-b-2 transition-colors ${adminTab === tab ? 'border-weddingDark text-weddingDark bg-gray-50/50' : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                     {tab}
                   </button>
                ))}
              </div>

              {/* Sidebar Forms Area */}
              <div className="flex-1 overflow-y-auto p-5 pb-32">
                 {adminTab === 'details' && (
                    <div className="animate-in fade-in duration-300 space-y-6">
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Basic Details</h3>
                          <TextInput label="Groom's Name" value={editForm.groomName} onChange={val=>setEditForm({...editForm, groomName: val})} />
                          <TextInput label="Bride's Name" value={editForm.brideName} onChange={val=>setEditForm({...editForm, brideName: val})} />
                          <TextInput label="Wedding Date" value={editForm.weddingDate} onChange={val=>setEditForm({...editForm, weddingDate: val})} />
                          <TextInput label="Location Summary" value={editForm.weddingLocation} onChange={val=>setEditForm({...editForm, weddingLocation: val})} />
                          <TextInput label="Contact Phone" value={editForm.contactPhone} onChange={val=>setEditForm({...editForm, contactPhone: val})} />
                          <TextInput label="Contact Email" value={editForm.contactEmail} onChange={val=>setEditForm({...editForm, contactEmail: val})} />
                          <TextInput label="RSVP Deadline" value={editForm.rsvpDeadline} onChange={val=>setEditForm({...editForm, rsvpDeadline: val})} />
                       </div>
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Ceremony Info</h3>
                          <TextInput label="Date" value={editForm.ceremonyDate} onChange={val=>setEditForm({...editForm, ceremonyDate: val})} />
                          <TextInput label="Time" value={editForm.ceremonyTime} onChange={val=>setEditForm({...editForm, ceremonyTime: val})} />
                          <TextInput label="Venue Name" value={editForm.ceremonyVenue} onChange={val=>setEditForm({...editForm, ceremonyVenue: val})} />
                          <TextInput label="Map URL" value={editForm.ceremonyMapUrl} onChange={val=>setEditForm({...editForm, ceremonyMapUrl: val})} />
                       </div>
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Reception Info</h3>
                          <TextInput label="Date" value={editForm.receptionDate} onChange={val=>setEditForm({...editForm, receptionDate: val})} />
                          <TextInput label="Time" value={editForm.receptionTime} onChange={val=>setEditForm({...editForm, receptionTime: val})} />
                          <TextInput label="Venue Name" value={editForm.receptionVenue} onChange={val=>setEditForm({...editForm, receptionVenue: val})} />
                          <TextInput label="Map URL" value={editForm.receptionMapUrl} onChange={val=>setEditForm({...editForm, receptionMapUrl: val})} />
                       </div>
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Paragraphs</h3>
                          <TextInput label="Our Story" isTextArea value={editForm.ourStory} onChange={val=>setEditForm({...editForm, ourStory: val})} />
                          <TextInput label="Dress Code Guidelines" isTextArea value={editForm.dressCodeText} onChange={val=>setEditForm({...editForm, dressCodeText: val})} />
                          <ColorPaletteEditor colors={editForm.colorPalette} onChange={val=>setEditForm({...editForm, colorPalette: val})} />
                          <TextInput label="Gift Message Intro" isTextArea value={editForm.giftText} onChange={val=>setEditForm({...editForm, giftText: val})} />
                       </div>
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-4 border-b border-gray-100 pb-2">Gift Registries & Options</h3>
                          <TextInput label="Gift Option 1 - Title" value={editForm.giftOption1Title} onChange={val=>setEditForm({...editForm, giftOption1Title: val})} />
                          <TextInput label="Gift Option 1 - Details" isTextArea value={editForm.giftOption1Details} onChange={val=>setEditForm({...editForm, giftOption1Details: val})} />
                          <TextInput label="Gift Option 2 - Title" value={editForm.giftOption2Title} onChange={val=>setEditForm({...editForm, giftOption2Title: val})} />
                          <TextInput label="Gift Option 2 - Details" isTextArea value={editForm.giftOption2Details} onChange={val=>setEditForm({...editForm, giftOption2Details: val})} />
                       </div>
                    </div>
                 )}

                 {adminTab === 'entourage' && (
                    <div className="animate-in fade-in duration-300">
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Roles</h3>
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
                    <div className="animate-in fade-in duration-300">
                       <AudioManager label="Background Music" url={editForm.backgroundMusicUrl} onChange={val=>setEditForm({...editForm, backgroundMusicUrl: val})} showToast={showToast} user={user} appId={appId} storage={storage} />
                       <PhotoManager label="Our Story Photos" urls={editForm.storyPhotos} onChange={arr=>setEditForm({...editForm, storyPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Ceremony Venues" urls={editForm.ceremonyPhotos} onChange={arr=>setEditForm({...editForm, ceremonyPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Reception Venues" urls={editForm.receptionPhotos} onChange={arr=>setEditForm({...editForm, receptionPhotos: arr})} showToast={showToast} />
                       <PhotoManager label="Dress Code Inspiration" urls={editForm.dressCodePhotos} onChange={arr=>setEditForm({...editForm, dressCodePhotos: arr})} showToast={showToast} />
                       <PhotoManager label="QR Codes (GCash, Maya, Bank)" urls={editForm.qrCodeUrls} onChange={arr=>setEditForm({...editForm, qrCodeUrls: arr})} showToast={showToast} />
                    </div>
                 )}

                 {adminTab === 'guests' && (
                    <div className="animate-in fade-in duration-300">
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
                         <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Add New Guest</h3>
                         <TextInput label="Guest Name" value={newGuestName} onChange={setNewGuestName} />
                         <div className="mb-5">
                           <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Unique Code (Leave blank for #JamesFoundHisCassie)</label>
                           <div className="flex gap-2">
                             <input type="text" value={newGuestCode} onChange={(e) => setNewGuestCode(e.target.value)} className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-weddingAccent focus:bg-white transition-colors" placeholder="#JamesFoundHisCassie" />
                           </div>
                         </div>
                         <button onClick={handleAddGuest} className="w-full bg-weddingDark text-white py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors">Add Guest</button>
                       </div>
                       
                       <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                          <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2 flex justify-between items-center">
                            Guest List <span className="text-gray-400 font-normal">{invitees.length} total</span>
                          </h3>
                          <div className="flex gap-2 mb-4">
                             <input type="file" accept=".csv" ref={fileInputRef} onChange={handleBulkUploadCSV} className="hidden" />
                             <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-weddingAccent transition-colors"><Upload size={12} className="inline mr-1"/> Import CSV</button>
                             <button onClick={handleDownloadCSV} className="flex-1 py-2 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 hover:text-weddingAccent transition-colors"><Download size={12} className="inline mr-1"/> Export</button>
                          </div>
                          <div className="space-y-3">
                             {invitees.map(i => (
                                <div key={i.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
                                   <button onClick={() => handleDeleteGuest(i.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                   <div className="font-bold text-sm text-gray-800 pr-6">{String(i.name)}</div>
                                   <div className="text-[10px] font-mono font-bold text-weddingAccent uppercase tracking-widest mt-1 mb-2">Code: {String(i.code)}</div>
                                   <div className="flex justify-between items-center text-xs">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${i.status === 'Attending' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>{String(i.status)}</span>
                                     {i.message && (
                                       <button onClick={() => toggleMessageApproval(i.id, i.messageApproved)} className={`flex items-center gap-1 text-[9px] font-bold uppercase ${i.messageApproved ? 'text-pink-500' : 'text-gray-400'}`}>
                                         <Heart size={12} fill={i.messageApproved ? "currentColor" : "none"}/> {i.messageApproved ? 'Visible in Guestbook' : 'Hidden'}
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
            <div className="fixed inset-0 z-[1000] bg-[#faf9f6]/95 backdrop-blur-md flex items-center justify-center p-6 text-weddingDark">
              <div className="max-w-sm w-full text-center animate-in zoom-in duration-300">
                <button onClick={() => setShowAdminLogin(false)} className="mb-12 text-gray-300 hover:text-black transition-transform hover:rotate-90 focus:outline-none"><X size={40} className="mx-auto" /></button>
                <h3 className="text-3xl font-serif mb-10 italic">Secure Access</h3>
                <form onSubmit={handleAdminLogin}>
                  <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b-2 border-weddingDark text-center py-6 mb-12 tracking-[0.8em] text-3xl focus:outline-none bg-transparent" placeholder="••••••••" />
                  {adminError && <p className="text-red-500 text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">{String(adminError)}</p>}
                  <button className="w-full bg-weddingDark text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all hover:bg-black">Verify Credentials</button>
                </form>
              </div>
            </div>
          )}

          {toastMessage && (
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-weddingDark text-white px-10 py-4 rounded-full text-[11px] uppercase font-bold tracking-widest z-[1000] shadow-2xl animate-bounce whitespace-nowrap">
              {toastMessage}
            </div>
          )}
        </div>
      )}
    </>
  );
}
