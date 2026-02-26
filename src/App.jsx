import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, 
  KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, 
  BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, 
  ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, 
  Github, Globe, Terminal, Cloud, AlertCircle, ExternalLink, 
  MapPin, Music, Play, Pause, MailOpen, Camera, GripVertical, Plus
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
  backgroundMusicUrl: "WHEN I MET YOU APO Hiking Society Violin Cover by Justerini.mp3", // Integrated local uploaded track
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
  giftText: "With all that we have, we’ve been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, a monetary gift is one we suggest.",
  rsvpDeadline: "March 1st, 2026",
  bestMan: "Melvin B. De Vera",
  maidOfHonor: "Sofia Camille C. Pinoy",
  bibleBearer: "Kyler Timothy A. De Vera",
  ringBearer: "Dean Lukas A. De Vera",
  coinBearer: "Crisanto Joaquin C. De Vera",

  storyPhotos: ["https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800"],
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
    <circle cx="100" cy="100" r="4" fill="#f4f0d3" stroke="currentColor" strokeWidth="0.2" />
    <path d="M100 100L110 140M110 140C115 150 125 155 135 150" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const LineAccent = () => (
  <div className="flex items-center justify-center gap-6 my-8 opacity-40 w-full">
    <div className="w-24 h-px bg-weddingSage shadow-sm"></div>
    <div className="w-3 h-3 rotate-45 bg-weddingAccent shadow-sm"></div>
    <div className="w-24 h-px bg-weddingSage shadow-sm"></div>
  </div>
);

const AnimatedLeaves = ({ count = 10 }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className="absolute text-weddingSage opacity-30 animate-float"
        style={{ left: `${Math.random() * 100}%`, top: `-10%`, animationDuration: `${15 + Math.random() * 10}s`, animationDelay: `${Math.random() * 5}s`, transform: `scale(${0.5 + Math.random() * 1.2})` }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" /></svg>
      </div>
    ))}
  </div>
);

const LandingPage = ({ onOpen, groom, bride }) => (
  <div className="fixed inset-0 z-[200] bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000 overflow-hidden">
    <AnimatedLeaves count={15} />
    <div className="max-w-md w-full border border-weddingSage/30 p-12 rounded-full aspect-[1/1.5] flex flex-col items-center justify-center relative overflow-hidden shadow-2xl bg-white/80 backdrop-blur-sm z-10 scale-90 md:scale-100">
       <div className="absolute inset-4 border border-weddingSage/10 rounded-full"></div>
       <div className="z-20 flex flex-col items-center">
         <p className="text-weddingAccent tracking-[0.4em] uppercase text-[10px] mb-8 font-bold">You are invited to the wedding of</p>
         <h1 className="text-5xl md:text-6xl font-script text-weddingDark mb-2 break-words max-w-full px-4 leading-normal py-2">{groom}</h1>
         <span className="text-2xl font-serif italic text-weddingSage mb-2">&</span>
         <h1 className="text-5xl md:text-6xl font-script text-weddingDark mb-8 break-words max-w-full px-4 leading-normal py-2">{bride}</h1>
         <button onClick={onOpen} className="mt-6 flex flex-col items-center gap-4 group focus:outline-none">
           <div className="w-20 h-20 bg-weddingYellow rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-500">
             <MailOpen className="text-weddingDark w-8 h-8" />
           </div>
           <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-weddingDark animate-pulse">Open Invitation</span>
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
    <div className="flex justify-center gap-6 mt-8 backdrop-blur-md bg-white/40 px-8 py-6 rounded-3xl border border-white/60 shadow-sm max-w-lg mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center min-w-[60px]">
          <span className="text-3xl md:text-4xl font-serif text-weddingDark">{String(value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mt-2">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const ImageSlider = ({ photos = [], altText, containerClass, imageClass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % photos.length); }, 4500);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (photos.length === 0) return (
    <div className={`bg-gray-100/50 flex items-center justify-center ${containerClass}`}>
      <ImageIcon className="w-8 h-8 opacity-20"/>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${containerClass}`}>
      {photos.map((url, idx) => (
        <img key={idx} src={url} alt={`${altText} ${idx + 1}`} 
             onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" }} // Robust fallback
             className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${idx === currentIndex ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-100 z-0'} ${imageClass || ''}`} />
      ))}
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

const AudioManager = ({ label, url, onChange, showToast }) => {
  const [inputUrl, setInputUrl] = useState('');
  
  const handleSetUrl = () => {
    if (inputUrl.trim()) { 
      let finalUrl = inputUrl.trim();
      
      // Google Drive Auto-Conversion Logic (Docs proxy bypasses strict Drive CORS)
      const gdriveMatch = finalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const idMatch = finalUrl.match(/id=([a-zA-Z0-9_-]+)/);
      
      if (gdriveMatch && gdriveMatch[1]) {
        finalUrl = `https://docs.google.com/uc?export=download&confirm=t&id=${gdriveMatch[1]}`;
      } else if (idMatch && idMatch[1]) {
        finalUrl = `https://docs.google.com/uc?export=download&confirm=t&id=${idMatch[1]}`;
      } else if (finalUrl.includes('spotify.com')) {
        // Standardize Spotify URLs to clean track URLs
        const trackMatch = finalUrl.match(/track\/([a-zA-Z0-9]+)/);
        if (trackMatch) {
            finalUrl = `https://open.spotify.com/track/${trackMatch[1]}`;
        }
      }
      
      onChange(finalUrl); 
      setInputUrl(''); 
      showToast("Music updated!"); 
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2"><Music size={12} className="inline mr-1"/> {label}</label>
      <div className="text-xs text-gray-500 mb-3 truncate bg-gray-50 p-2 rounded border border-gray-100" title={url}>Current: {url || 'None'}</div>
      <div className="flex gap-2">
         <input type="text" value={inputUrl} onChange={e=>setInputUrl(e.target.value)} placeholder="Paste Spotify, MP3 or GDrive link..." className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-weddingAccent" />
         <button onClick={handleSetUrl} className="bg-weddingDark text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-weddingAccent transition-colors">Update</button>
      </div>
      <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest leading-relaxed">Supports local files, direct .mp3, Spotify, or Google Drive Share Links.</p>
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
        <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">Drag thumbnails to reorder.</p>
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
  const [currentGbSlide, setCurrentGbSlide] = useState(0);

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
    return {
       ...DEFAULT_DETAILS,
       ...data,
       storyPhotos: toArr(data.storyPhotos || data.storyPhotoUrl, ','),
       ceremonyPhotos: toArr(data.ceremonyPhotos || data.ceremonyPhotoUrl, ','),
       receptionPhotos: toArr(data.receptionPhotos || data.receptionPhotoUrl, ','),
       dressCodePhotos: toArr(data.dressCodePhotos || data.dressCodePhotoUrl, ','),
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
  const safeAudioUrl = displayData?.backgroundMusicUrl?.trim() || "";
  const isSpotify = safeAudioUrl.includes('spotify.com');

  // Helper to generate the correct Spotify Embed URL for autoplay
  const getSpotifyEmbedUrl = (url) => {
     if (!url) return '';
     if (url.includes('/embed/')) {
         const separator = url.includes('?') ? '&' : '?';
         return url.includes('autoplay=1') ? url : `${url}${separator}autoplay=1`;
     }
     const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
     if (trackMatch) {
         return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&autoplay=1&theme=0`;
     }
     return url;
  };

  // --- AUDIO ACTIONS ---
  const handleOpenInvitation = () => {
    setIsLanding(false);
    if (!isSpotify && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => { 
           console.log("Autoplay blocked. User must interact.", e); 
           setIsPlaying(false); 
        });
    }
  };

  const toggleAudio = () => {
    if (isSpotify) return; // Spotify is controlled via iframe
    if (!audioRef.current) return;
    if (isPlaying) { 
      audioRef.current.pause(); 
      setIsPlaying(false);
    } else { 
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
           console.warn("Audio playback failed:", e);
           setIsPlaying(false);
        }); 
    }
  };

  useEffect(() => {
    if (!isSpotify && audioRef.current && safeAudioUrl && !isLanding) {
      const isCurrentlyPlaying = !audioRef.current.paused;
      if (audioRef.current.src !== safeAudioUrl) {
         audioRef.current.src = safeAudioUrl;
         if (isCurrentlyPlaying) {
             audioRef.current.play().catch(e => console.warn("Playback failed after src change", e));
         }
      }
    }
  }, [safeAudioUrl, isLanding, isSpotify]);

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
              weddingSage: '#B8C6A7', weddingDark: '#2c3e2e', weddingYellow: '#ffff8f', weddingAccent: '#8B9B7A',
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
    const code = rsvpForm.enteredCode.trim().toLowerCase(); // Make matching case-insensitive
    const guest = invitees.find(i => String(i.code).toLowerCase() === code);
    
    if (!guest) { setSubmitError("Security code not found. Please check your invitation."); return; }
    setIsSubmitting(true);
    
    const updatedGuest = { status: rsvpForm.attending === 'yes' ? 'Attending' : 'Declined', submittedName: rsvpForm.name, message: rsvpForm.message, respondedAt: Date.now() };
    
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', guest.id), updatedGuest);
      setSubmitSuccess(true);
    } catch (err) { 
      // Fallback local RSVP save
      const localGuests = [...invitees];
      const idx = localGuests.findIndex(g => g.id === guest.id);
      if(idx > -1) {
         localGuests[idx] = { ...localGuests[idx], ...updatedGuest };
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
    
    // 1. Always save locally first (GUARANTEED FRONTEND EDITING)
    localStorage.setItem(`wedding_config_${appId}`, JSON.stringify(editForm));
    setDetails(editForm);
    
    // 2. Try Firebase (Might block based on Preview restrictions)
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
    
    // Apply Default Code if left blank
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
          let code = cols[1] ? cols[1].replace(/"/g, '').trim() : ''; // Case preserved
          
          if (name) { 
             // Bulk Generation Default
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

  // --- DATA PROCESSING (PRINCIPAL SPONSORS) ---
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
  const gbSlides = [];
  for (let i = 0; i < displayMessages.length; i += 3) { gbSlides.push(displayMessages.slice(i, i + 3)); }

  // ==========================================
  // RENDER LOGIC
  // ==========================================

  if (isLanding) { return <LandingPage onOpen={handleOpenInvitation} groom={String(displayData.groomName)} bride={String(displayData.brideName)} />; }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#faf9f6]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* ========================================================= */}
      {/* LEFT: LIVE WEBSITE PREVIEW */}
      {/* ========================================================= */}
      <div className={`flex-1 relative h-full overflow-y-auto transition-all duration-300 text-weddingDark selection:bg-weddingYellow/40 shadow-[inset_0_0_50px_rgba(0,0,0,0.05)]`}>
        
        {/* Background Layers */}
        <div className="fixed inset-0 z-0 bg-cover bg-center opacity-50 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}></div>
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/90 to-[#faf9f6]/95 backdrop-blur-[2px] pointer-events-none"></div>
        <AnimatedLeaves count={12} />
        
        {/* AUDIO ELEMENTS */}
        {!isSpotify && (
          <>
            <audio 
               ref={audioRef} 
               loop 
               preload="auto" 
               src={safeAudioUrl} 
               onError={(e) => { 
                  console.warn("Audio source failed to load.", e); 
                  setIsPlaying(false); 
               }} 
            />
            {/* Elegant Custom Music Control */}
            {!isLanding && (
              <div className="fixed left-6 bottom-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div onClick={toggleAudio} className="bg-white/80 backdrop-blur-xl p-3 pr-5 rounded-[16px] shadow-2xl border border-white/50 flex items-center gap-4 transition-all hover:bg-white/95 cursor-pointer group hover:scale-105 active:scale-95">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-weddingSage text-white shadow-md' : 'bg-weddingYellow text-weddingDark animate-pulse'}`}>
                    {isPlaying ? <Music size={16} /> : <Play size={16} className="ml-0.5" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-weddingAccent flex items-center gap-1.5">
                       {isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                    <span className="text-xs font-serif italic text-gray-700 max-w-[160px] truncate" title="When I Met You - Violin Cover">
                      When I Met You (Cover)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* SPOTIFY EMBED (Fallback if user adds a Spotify URL later) */}
        {isSpotify && !isLanding && (
          <div className="fixed left-6 bottom-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[16px] shadow-2xl border border-white/50 w-[280px] md:w-[320px] transition-all hover:bg-white/95">
              <div className="mb-2 px-2 flex justify-between items-center">
                <span className="text-[9px] uppercase tracking-widest font-bold text-weddingAccent flex items-center gap-1.5"><Music size={10} className="animate-pulse" /> Spotify Music</span>
              </div>
              <iframe 
                style={{ borderRadius: '12px', background: 'transparent' }} 
                src={getSpotifyEmbedUrl(safeAudioUrl)} 
                width="100%" 
                height="80" 
                frameBorder="0" 
                allowFullScreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-40 py-6 bg-[#faf9f6]/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm transition-all ${isAdminAuth ? 'md:right-[450px]' : ''}`}>
          <div className="max-w-screen-xl mx-auto px-6 flex justify-center gap-6 md:gap-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 flex-wrap">
            {['Home', 'Story', 'Entourage', 'Venues', 'Details', 'Guestbook', 'RSVP'].map(t => (
              <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className="hover:text-weddingDark transition-all active:scale-95 border-b-2 border-transparent hover:border-weddingAccent pb-1">{t}</button>
            ))}
          </div>
        </nav>

        <main className="w-full relative z-10 pt-20">
          
          {/* HERO */}
          <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden pb-12">
            <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] text-weddingSage opacity-5 pointer-events-none" />
            <p className="text-weddingAccent tracking-[0.6em] uppercase text-[12px] mb-8 font-bold animate-pulse">Join us to celebrate</p>
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-script font-bold leading-tight mb-6 text-weddingDark drop-shadow-sm select-none transition-all break-words max-w-full px-4 text-center py-4">
              {String(displayData.groomName)} <br/>
              <span className="text-4xl md:text-7xl font-serif italic text-weddingAccent my-4 block leading-normal">&amp;</span> 
              {String(displayData.brideName)}
            </h1>
            <LineAccent />
            <p className="text-2xl md:text-4xl tracking-[0.3em] font-light text-gray-800 uppercase mb-4 transition-all">{String(displayData.weddingDate)}</p>
            <p className="text-[11px] md:text-[13px] tracking-[0.5em] text-gray-400 font-bold uppercase mb-8 transition-all">{String(displayData.weddingLocation)}</p>
            <CountdownTimer targetDate={displayData.weddingDate} />
          </section>

          {/* STORY */}
          <section id="story" className="py-20 md:py-24 px-6 max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 relative">
              <div className="w-full md:w-5/12 aspect-[4/5] rounded-t-full border-[16px] border-white shadow-2xl relative overflow-hidden z-10 p-1 bg-white">
                <ImageSlider photos={displayData.storyPhotos} altText="Story" containerClass="absolute inset-0" imageClass="rounded-t-full" />
              </div>
              <div className="w-full md:w-7/12 text-center md:text-left z-20">
                <div className="bg-white/70 backdrop-blur-xl p-10 md:p-14 rounded-sm border border-white shadow-xl">
                  <h2 className="text-[12px] font-bold tracking-[0.4em] text-weddingAccent mb-8 uppercase border-b border-weddingSage/30 pb-4 inline-block">The Beginning</h2>
                  <div className="text-lg md:text-2xl font-serif leading-relaxed text-gray-800 italic text-justify md:text-left">
                     <span className="text-5xl text-weddingYellow block mb-2 opacity-50 font-serif leading-none select-none">"</span>
                     {String(displayData.ourStory)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ENTOURAGE */}
          <section id="entourage" className="py-16 md:py-20 px-4 bg-white/20 backdrop-blur-sm border-y border-white transition-all">
            <div className="max-w-screen-lg mx-auto text-center">
              <h2 className="text-5xl md:text-7xl font-serif text-weddingDark mb-12 drop-shadow-sm italic">The Entourage</h2>
              
              {/* Parents */}
              <div className="mb-12">
                <h3 className="text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-8 border-b-2 border-weddingYellow inline-block pb-2">Beloved Parents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center items-start">
                  <div className="flex flex-col items-center md:items-end md:pr-10 md:border-r border-weddingSage/20 overflow-hidden w-full">
                    <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Parents of the Groom</h4>
                    {(displayData.groomParents||[]).map((n,i)=><p key={i} className="text-xl md:text-2xl font-serif text-gray-800 break-words w-full">{n}</p>)}
                  </div>
                  <div className="flex flex-col items-center md:items-start md:pl-10 overflow-hidden w-full">
                    <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Parents of the Bride</h4>
                    {(displayData.brideParents||[]).map((n,i)=><p key={i} className="text-xl md:text-2xl font-serif text-gray-800 break-words w-full">{n}</p>)}
                  </div>
                </div>
              </div>

              {/* Principal Sponsors */}
              <div className="mb-12 bg-white/40 p-6 md:p-10 rounded-2xl border border-white shadow-sm overflow-hidden">
                 <h3 className="text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-6 inline-block">Principal Sponsors</h3>
                 <div className="flex flex-col items-center gap-3 max-w-4xl mx-auto w-full">
                   {principalPairs.map((pair, i) => (
                     <div key={i} className="flex items-center justify-between border-b border-weddingSage/10 pb-3 w-full last:border-0 group overflow-hidden">
                       <div className="flex-1 text-right break-words text-lg md:text-xl font-serif text-gray-800 px-2 md:px-4">{String(pair.male)}</div>
                       <div className="text-weddingSage opacity-40 italic text-xl font-serif text-center px-1 shrink-0">&amp;</div>
                       <div className="flex-1 text-left break-words text-lg md:text-xl font-serif text-gray-800 px-2 md:px-4">{String(pair.female)}</div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Best Man & Maid of Honor */}
              <div className="max-w-3xl mx-auto flex flex-col items-center w-full mb-12 bg-white/60 backdrop-blur-md p-8 rounded-xl border border-white/80 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-center relative">
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                  <div className="flex flex-col items-center flex-1 md:pr-6 overflow-hidden">
                    <h4 className="text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-3">Best Man</h4>
                    <p className="text-xl md:text-3xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.bestMan)}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 md:pl-6 overflow-hidden">
                    <h4 className="text-[9px] font-bold text-weddingAccent uppercase tracking-widest mb-3">Maid of Honor</h4>
                    <p className="text-xl md:text-3xl font-serif text-weddingDark break-words w-full leading-snug">{String(displayData.maidOfHonor)}</p>
                  </div>
                </div>
              </div>

              {/* Groomsmen & Bridesmaids */}
              <div className="max-w-4xl mx-auto text-gray-800 flex flex-col items-center w-full mb-12 relative overflow-hidden px-2">
                 <div className="grid grid-cols-2 gap-x-4 mb-4 pb-3 border-b border-weddingAccent/30 w-full">
                   <div className="text-right text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Groomsmen</div>
                   <div className="text-left text-[9px] font-bold text-weddingAccent uppercase tracking-widest">Bridesmaids</div>
                 </div>
                 <div className="absolute left-1/2 top-10 bottom-0 w-px bg-weddingSage/20 -translate-x-1/2"></div>
                 {entouragePartners.map((partner, i) => (
                   <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-x-2 mb-3 w-full items-center relative z-10">
                     <div className="text-right overflow-hidden"><p className="text-lg md:text-xl font-serif leading-snug break-words">{String(partner.groomSide)}</p></div>
                     <div className="w-px h-full bg-transparent mx-2"></div>
                     <div className="text-left overflow-hidden"><p className="text-lg md:text-xl font-serif leading-snug break-words">{String(partner.brideSide)}</p></div>
                   </div>
                 ))}
              </div>

              {/* Secondary Sponsors */}
              <div className="max-w-5xl mx-auto my-12">
                 <h3 className="text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-8 text-center">Secondary Sponsors</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center md:text-right border-b md:border-b-0 md:border-r border-weddingSage/20 pb-6 md:pb-0 md:pr-6 overflow-hidden">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-4">Candle</h4>
                       {(displayData.candleSponsors||[]).map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-2 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                    </div>
                    <div className="text-center border-b md:border-b-0 border-weddingSage/20 pb-6 md:pb-0 px-4 overflow-hidden">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-4">Veil</h4>
                       {(displayData.veilSponsors||[]).map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-2 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                    </div>
                    <div className="text-center md:text-left md:border-l border-weddingSage/20 pt-6 md:pt-0 md:pl-6 overflow-hidden">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-4">Cord</h4>
                       {(displayData.cordSponsors||[]).map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-2 text-gray-800 break-words w-full leading-snug">{n}</p>)}
                    </div>
                 </div>
              </div>

              {/* Bearers & Flower Girls */}
              <div className="max-w-4xl mx-auto mt-12 px-2">
                 <h3 className="text-[11px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-8 text-center">Little Entourage</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                    <div className="overflow-hidden w-full px-2">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b pb-2 inline-block px-4">Bible Bearer</h4>
                       <p className="text-lg md:text-xl font-serif text-weddingDark mt-1 break-words w-full leading-snug">{String(displayData.bibleBearer)}</p>
                    </div>
                    <div className="overflow-hidden w-full px-2">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b pb-2 inline-block px-4">Coin Bearer</h4>
                       <p className="text-lg md:text-xl font-serif text-weddingDark mt-1 break-words w-full leading-snug">{String(displayData.coinBearer)}</p>
                    </div>
                    <div className="overflow-hidden w-full px-2">
                       <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-3 border-b pb-2 inline-block px-4">Ring Bearer</h4>
                       <p className="text-lg md:text-xl font-serif text-weddingDark mt-1 break-words w-full leading-snug">{String(displayData.ringBearer)}</p>
                    </div>
                 </div>
                 <div className="pt-6 text-center max-w-3xl mx-auto">
                    <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-4 inline-block px-5 py-2 border border-gray-200 rounded-full">Flower Girls</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                       {(displayData.flowerGirls||[]).map((n, i) => (
                          <p key={i} className="text-lg md:text-xl font-serif text-weddingDark italic break-words max-w-[200px] leading-snug">{n}</p>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* VENUES */}
          <section id="venues" className="py-20 md:py-24 px-4 max-w-screen-xl mx-auto transition-all">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-white p-2 shadow-2xl relative rounded">
                <div className="aspect-[16/10] overflow-hidden rounded-sm">
                  <ImageSlider photos={displayData.ceremonyPhotos} altText="Ceremony" containerClass="w-full h-full" />
                </div>
                <div className="p-10 text-center">
                  <h3 className="text-4xl font-serif text-weddingDark mb-4">The Ceremony</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-3">{String(displayData.ceremonyDate)} | {String(displayData.ceremonyTime)}</p>
                  <p className="text-xl font-serif mb-8 italic text-gray-700">{String(displayData.ceremonyVenue)}</p>
                  <a href={String(displayData.ceremonyMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-weddingDark text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                    <MapPin size={16} /> View Location
                  </a>
                </div>
              </div>
              <div className="bg-white p-2 shadow-2xl relative rounded">
                <div className="aspect-[16/10] overflow-hidden rounded-sm">
                  <ImageSlider photos={displayData.receptionPhotos} altText="Reception" containerClass="w-full h-full" />
                </div>
                <div className="p-10 text-center">
                  <h3 className="text-4xl font-serif text-weddingDark mb-4">The Reception</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-3">{String(displayData.receptionTime)}</p>
                  <p className="text-xl font-serif mb-8 italic text-gray-700">{String(displayData.receptionVenue)}</p>
                  <a href={String(displayData.receptionMapUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-weddingDark text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                    <MapPin size={16} /> View Location
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* DETAILS */}
          <section id="details" className="py-20 md:py-24 px-4 bg-white/60 border-y border-white transition-all">
            <div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
               <div className="text-center md:text-left">
                  <h2 className="text-[11px] font-bold tracking-[0.4em] text-weddingAccent uppercase mb-4 opacity-80 border-b border-weddingSage/30 pb-3 inline-block">Dress Code &amp; Details</h2>
                  <h3 className="text-4xl font-serif text-weddingDark mb-6 italic mt-2">Attire</h3>
                  <p className="text-lg md:text-xl font-serif leading-relaxed text-gray-800 mb-10">{String(displayData.dressCodeText)}</p>
                  <h3 className="text-4xl font-serif text-weddingDark mb-6 italic mt-2">Gifts</h3>
                  <p className="text-lg md:text-xl font-serif leading-relaxed text-gray-800">{String(displayData.giftText)}</p>
               </div>
               <div className="aspect-[4/5] bg-white p-2 shadow-2xl overflow-hidden rounded-t-full">
                  <ImageSlider photos={displayData.dressCodePhotos} altText="Dress Code" containerClass="w-full h-full" imageClass="rounded-t-full" />
               </div>
            </div>
          </section>

          {/* GUESTBOOK */}
          <section id="guestbook" className="py-20 md:py-24 px-4 relative bg-white/40 backdrop-blur-md border-b">
            <div className="max-w-screen-xl mx-auto text-center">
              <h2 className="text-[11px] font-bold tracking-[0.4em] text-weddingAccent uppercase mb-4 opacity-80">Wishes &amp; Love</h2>
              <h3 className="text-4xl md:text-6xl font-serif text-weddingDark mb-16 italic">Guestbook</h3>
              
              <div className="relative w-full overflow-hidden min-h-[300px]">
                {gbSlides.length > 0 ? gbSlides.map((slide, slideIdx) => (
                  <div key={slideIdx} className={`w-full grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-[1000ms] ease-in-out ${slideIdx === currentGbSlide ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-12 absolute top-0 left-0 pointer-events-none z-0'}`}>
                    {slide.map((m) => (
                      <div key={m.id} className="bg-[#faf9f6]/95 p-8 border border-white shadow-lg rounded flex flex-col justify-between text-left group hover:-translate-y-1 transition-transform duration-300">
                        <MessageSquareHeart className="w-6 h-6 text-weddingSage/60 mb-6 group-hover:text-weddingAccent transition-colors" />
                        <p className="text-lg md:text-xl font-serif italic leading-relaxed text-gray-800 mb-8">"{String(m.message)}"</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold text-gray-500 border-t pt-4">- {String(m.submittedName)}</p>
                      </div>
                    ))}
                  </div>
                )) : (
                  <div className="text-center text-gray-400 font-serif italic py-16 text-lg">Be the first to leave a message...</div>
                )}
              </div>
              
              {gbSlides.length > 1 && (
                <div className="flex justify-center gap-3 mt-12">
                  {gbSlides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentGbSlide(i)} className={`h-1.5 transition-all duration-300 rounded-full ${i === currentGbSlide ? 'w-12 bg-weddingAccent shadow-sm' : 'w-3 bg-gray-300'}`}></button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* RSVP */}
          <section id="rsvp" className="py-24 md:py-32 px-4 bg-[#1f2b22] text-white transition-all">
            <div className="max-w-screen-md mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-[12px] font-bold tracking-[0.5em] text-weddingYellow uppercase mb-6">RSVP</h2>
                <h3 className="text-5xl md:text-7xl font-serif mb-10">Join the Celebration</h3>
                <p className="text-weddingYellow font-serif italic text-xl border border-weddingYellow/20 px-10 py-3 inline-block bg-weddingYellow/5 rounded-full">Please respond by {String(displayData.rsvpDeadline)}</p>
              </div>

              {submitSuccess ? (
                <div className="bg-weddingSage text-weddingDark p-20 rounded-[3rem] text-center shadow-2xl animate-in zoom-in duration-500">
                  <CheckCircle size={100} className="mx-auto mb-10 text-weddingDark animate-bounce" />
                  <h4 className="text-5xl font-serif mb-6">Thank You!</h4>
                  <p className="font-serif italic text-2xl">We can't wait to see you there.</p>
                  <button onClick={() => setSubmitSuccess(false)} className="mt-12 text-[11px] uppercase font-bold border-b-2 border-weddingDark pb-1">Edit RSVP</button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-weddingSage text-weddingDark p-10 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                      <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-weddingDark/80">Security Code</label>
                      <input required value={rsvpForm.enteredCode} onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/20 py-4 focus:outline-none focus:border-weddingDark tracking-widest text-2xl font-serif text-weddingDark placeholder:text-weddingDark/30" placeholder="Enter Code" />
                    </div>
                    <div className="bg-weddingSage text-weddingDark p-10 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                      <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-weddingDark/80">Full Name</label>
                      <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-transparent border-b-2 border-weddingDark/20 py-4 focus:outline-none focus:border-weddingDark text-3xl font-serif italic text-weddingDark placeholder:text-weddingDark/30" placeholder="Name" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {['yes', 'no'].map(v => (
                      <label key={v} className={`flex-1 py-10 text-center rounded-3xl border-2 cursor-pointer transition-all ${rsvpForm.attending === v ? 'bg-weddingYellow border-weddingYellow text-weddingDark shadow-2xl scale-105' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                        <input type="radio" className="hidden" value={v} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                        <span className="text-[12px] font-bold uppercase tracking-widest">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                      </label>
                    ))}
                  </div>

                  <div className="bg-weddingSage text-weddingDark p-10 rounded-3xl shadow-xl transition-transform focus-within:-translate-y-1">
                    <label className="block text-[10px] font-bold tracking-widest uppercase mb-6 text-weddingDark/80">Wishes for the Couple</label>
                    <textarea value={rsvpForm.message} onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} className="w-full bg-transparent border-none focus:outline-none min-h-[160px] text-2xl font-serif italic text-weddingDark placeholder:text-weddingDark/40 resize-none" placeholder="Leave a message for our digital guestbook..." />
                  </div>

                  {submitError && <div className="text-red-300 text-center p-6 bg-red-900/40 rounded-2xl border border-red-500/30 text-xs font-bold uppercase tracking-widest">{String(submitError)}</div>}
                  <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-10 rounded-3xl font-bold uppercase tracking-[0.3em] text-[13px] shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50">
                    {isSubmitting ? 'Processing RSVP...' : 'Confirm My Attendance'}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* FOOTER & LOGOUT */}
          <footer className="py-20 text-center bg-[#faf9f6] border-t border-gray-200 relative z-10 transition-all">
            <p className="font-script text-6xl md:text-[7rem] text-weddingDark mb-6 select-none break-words px-4 leading-normal">{String(displayData.groomName)} &amp; {String(displayData.brideName)}</p>
            <div className="w-24 h-px bg-weddingSage mx-auto mb-10 opacity-50"></div>
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-gray-500 mb-10">{String(displayData.weddingDate)} • {String(displayData.weddingLocation)}</p>
            
            <div className="flex flex-col items-center gap-6 mb-12 max-w-xl mx-auto">
              <div className="flex flex-col md:flex-row justify-center gap-6 text-[9px] font-bold text-gray-700 uppercase tracking-widest bg-white/60 px-8 py-4 rounded-full border border-gray-200 shadow-sm">
                 <span className="flex items-center gap-2"><Phone size={14} className="text-weddingSage"/> {String(displayData.contactPhone)}</span>
                 <span className="hidden md:block text-gray-300">|</span>
                 <span className="flex items-center gap-2"><Mail size={14} className="text-weddingSage"/> {String(displayData.contactEmail)}</span>
              </div>
            </div>

            {!isAdminAuth && <button onClick={() => setShowAdminLogin(true)} className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-weddingDark transition-colors flex items-center gap-2 mx-auto px-5 py-2.5 border border-gray-100 rounded-full"><Lock size={12}/> Staff Login</button>}
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
                <div className="animate-in fade-in duration-300 space-y-8">
                   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Basic Details</h3>
                      <TextInput label="Groom's Name" value={editForm.groomName} onChange={val=>setEditForm({...editForm, groomName: val})} />
                      <TextInput label="Bride's Name" value={editForm.brideName} onChange={val=>setEditForm({...editForm, brideName: val})} />
                      <TextInput label="Wedding Date" value={editForm.weddingDate} onChange={val=>setEditForm({...editForm, weddingDate: val})} />
                      <TextInput label="Location Summary" value={editForm.weddingLocation} onChange={val=>setEditForm({...editForm, weddingLocation: val})} />
                      <TextInput label="Contact Phone" value={editForm.contactPhone} onChange={val=>setEditForm({...editForm, contactPhone: val})} />
                      <TextInput label="Contact Email" value={editForm.contactEmail} onChange={val=>setEditForm({...editForm, contactEmail: val})} />
                      <TextInput label="RSVP Deadline" value={editForm.rsvpDeadline} onChange={val=>setEditForm({...editForm, rsvpDeadline: val})} />
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Ceremony Info</h3>
                      <TextInput label="Date" value={editForm.ceremonyDate} onChange={val=>setEditForm({...editForm, ceremonyDate: val})} />
                      <TextInput label="Time" value={editForm.ceremonyTime} onChange={val=>setEditForm({...editForm, ceremonyTime: val})} />
                      <TextInput label="Venue Name" value={editForm.ceremonyVenue} onChange={val=>setEditForm({...editForm, ceremonyVenue: val})} />
                      <TextInput label="Map URL" value={editForm.ceremonyMapUrl} onChange={val=>setEditForm({...editForm, ceremonyMapUrl: val})} />
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Reception Info</h3>
                      <TextInput label="Date" value={editForm.receptionDate} onChange={val=>setEditForm({...editForm, receptionDate: val})} />
                      <TextInput label="Time" value={editForm.receptionTime} onChange={val=>setEditForm({...editForm, receptionTime: val})} />
                      <TextInput label="Venue Name" value={editForm.receptionVenue} onChange={val=>setEditForm({...editForm, receptionVenue: val})} />
                      <TextInput label="Map URL" value={editForm.receptionMapUrl} onChange={val=>setEditForm({...editForm, receptionMapUrl: val})} />
                   </div>
                   <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-weddingAccent mb-5 border-b border-gray-100 pb-2">Paragraphs</h3>
                      <TextInput label="Our Story" isTextArea value={editForm.ourStory} onChange={val=>setEditForm({...editForm, ourStory: val})} />
                      <TextInput label="Dress Code Guidelines" isTextArea value={editForm.dressCodeText} onChange={val=>setEditForm({...editForm, dressCodeText: val})} />
                      <TextInput label="Gift / Registry" isTextArea value={editForm.giftText} onChange={val=>setEditForm({...editForm, giftText: val})} />
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
                   <AudioManager label="Background Music" url={editForm.backgroundMusicUrl} onChange={val=>setEditForm({...editForm, backgroundMusicUrl: val})} showToast={showToast} />
                   <PhotoManager label="Our Story Photos" urls={editForm.storyPhotos} onChange={arr=>setEditForm({...editForm, storyPhotos: arr})} showToast={showToast} />
                   <PhotoManager label="Ceremony Venues" urls={editForm.ceremonyPhotos} onChange={arr=>setEditForm({...editForm, ceremonyPhotos: arr})} showToast={showToast} />
                   <PhotoManager label="Reception Venues" urls={editForm.receptionPhotos} onChange={arr=>setEditForm({...editForm, receptionPhotos: arr})} showToast={showToast} />
                   <PhotoManager label="Dress Code Inspiration" urls={editForm.dressCodePhotos} onChange={arr=>setEditForm({...editForm, dressCodePhotos: arr})} showToast={showToast} />
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
  );
}
