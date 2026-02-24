import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, 
  KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, 
  BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, 
  ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, 
  Github, Globe, Terminal, Cloud, AlertCircle, ExternalLink, 
  MapPin, Music, Play, Pause, MailOpen, Volume2
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  backgroundMusicUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Chopin_-_Nocturne_op._9_no._2.ogg",
  ourStory: "Love is patient, love is kind (1 Corinthians 13:4)—and their love proved to be brave, choosing each other every day in faith. What began as a quiet night at Ooma became a story God was already writing—told through shared meals from Jollibee to Din Tai Fung, sweet evenings at Amano, and journeys to Australia, Vigan, La Union, Baguio, and Thailand. In grand adventures and quiet Sundays at Mass, they discovered that home is not a place but a person, and that with God at the center, their love would not easily be broken. Two years later, they stand certain—ready to begin a forever rooted in faith, devotion, and a love that grows sweeter with time.",
  storyPhotoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800",
  contactPhone: "+63 912 345 6789",
  contactEmail: "weddings@example.com",
  groomParents: "Manuel P. De Vera (+)\nAtty. Anthony Luigi B. De Vera\n& Lilia B. De Vera",
  brideParents: "Roberto M. Pinoy\n& Maria Rosario C. Pinoy",
  entouragePrincipal: "Ms. Shirly L. Fauni\nEricson Barroquillo\nDir. Diane Gail L. Maharjan\nRolendes C. Fabi\nNimfa Serafica\nVitaliano Biala\nElaine N. Villanueva\nPaolo Fresnoza\nAdorie B. Servito\nMgen. Loreto Pasamonte\nTimmy Aquino\nSen. Bam Aquino\nDiego \"Jigs\" Rombawa\nLorenza M. Candela",
  candleSponsors: "Janet Pinoy\nAntonio Pinoy",
  veilSponsors: "Liezl B. De Vera\nMark Joedel B. De Vera",
  cordSponsors: "Carnation Flores\nKristina C. Pinoy",
  bestMan: "Melvin B. De Vera",
  maidOfHonor: "Sofia Camille C. Pinoy",
  groomsmen: "Christian Robert C. Pinoy\nJohn Paolo B. De Vera\nMark Lester B. Biala\nJustin Servito\nJohn Lester Selga\nJan Gabriel Pinoy\nLester Luis Ramirez\nRon Carlo C. Biala",
  bridesmaids: "Angela Cherish C. Pinoy\nKristel Ann B. De Vera\nMylene B. De Vera\nBea Michaela B. De Vera\nCarmela Ella\nNatasha Coreos\nKaye Marie Abelo\nPrincess Jelian B. Almonte",
  bibleBearer: "Kyler Timothy A. De Vera",
  ringBearer: "Dean Lukas A. De Vera",
  coinBearer: "Gabriel Santos",
  flowerGirls: "Amara Faith A. De Vera\nMarthina D. Hernandez\nAmare Faith Fresnoza\nMaree Margaret S. Dela Peña",
  ceremonyDate: "Friday, April 10th, 2026",
  ceremonyTime: "3:00 PM",
  ceremonyVenue: "Sacred Heart of Jesus Parish",
  ceremonyAddress: "Muntinlupa, Philippines",
  ceremonyPhotoUrl: "https://images.unsplash.com/photo-1548625361-ec85cb209210?auto=format&fit=crop&q=80&w=800",
  ceremonyMapUrl: "https://maps.app.goo.gl/aXMEUhYAbS7nEfv58",
  receptionDate: "Friday, April 10th, 2026",
  receptionTime: "6:00 PM onwards",
  receptionVenue: "Main Ballroom, Acacia Hotel",
  receptionAddress: "Alabang, Muntinlupa",
  receptionPhotoUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800",
  receptionMapUrl: "https://maps.app.goo.gl/8aSbQNbNAr31iXPT6",
  dressCodeText: "Filipiniana or Formal Attire. We kindly request our guests to dress elegantly in shades of Sage Green, Pastel Yellow, Beige, or neutral light tones. Please avoid wearing bright neon colors or pure white.",
  dressCodeColors: "#B8C6A7, #FDFD96, #F5F5DC, #FAF9F6, #D2B48C, #E5E7D1",
  dressCodePhotoUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1516726855505-e5ed699fd49d?auto=format&fit=crop&q=80&w=800",
  giftText: "With all that we have, we’ve been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, a monetary gift is one we suggest.",
  rsvpDeadline: "March 1st, 2026"
};

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
  </svg>
);

const AnimatedLeaves = ({ count = 10 }) => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className="absolute text-weddingSage opacity-30 animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `-10%`,
          animationDuration: `${15 + Math.random() * 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `scale(${0.5 + Math.random() * 1})`
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
        </svg>
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
         <h1 className="text-6xl font-script text-weddingDark mb-2">{groom}</h1>
         <span className="text-2xl font-serif italic text-weddingSage mb-2">&</span>
         <h1 className="text-6xl font-script text-weddingDark mb-8">{bride}</h1>
         <button 
           onClick={onOpen}
           className="mt-6 flex flex-col items-center gap-4 group focus:outline-none"
         >
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
    <div className="flex justify-center gap-6 mt-12 backdrop-blur-md bg-white/40 px-8 py-6 rounded-3xl border border-white/60 shadow-sm max-w-lg mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center min-w-[60px]">
          <span className="text-3xl md:text-4xl font-serif text-weddingDark">{String(value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold mt-2">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const ImageSlider = ({ photoString, altText, containerClass, imageClass }) => {
  const photos = photoString ? String(photoString).split(',').map(s => s.trim()).filter(Boolean) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4500);
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
        <img
          key={idx}
          src={url}
          alt={`${altText} ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-in-out ${idx === currentIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'} ${imageClass || ''}`}
        />
      ))}
    </div>
  );
};

// ==========================================
// 4. MAIN APPLICATION
// ==========================================

export default function App() {
  const [isLanding, setIsLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [invitees, setInvitees] = useState([]);
  const [rsvpForm, setRsvpForm] = useState({ name: '', attending: 'yes', enteredCode: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminTab, setAdminTab] = useState('guests'); 
  const [editForm, setEditForm] = useState(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const ADMIN_PASSWORD = "Eternity&Leaves2026!";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // --- AUDIO ACTIONS ---
  const handleOpenInvitation = () => {
    setIsLanding(false);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
              weddingSage: '#B8C6A7',
              weddingDark: '#2c3e2e',
              weddingYellow: '#ffff8f',
              weddingAccent: '#8B9B7A',
            },
            keyframes: {
              float: {
                '0%': { transform: 'translateY(-10vh) rotate(0deg)' },
                '100%': { transform: 'translateY(110vh) rotate(360deg)' }
              }
            },
            animation: {
              float: 'float 20s linear infinite',
            }
          }
        }
      }
    };

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
    };
  }, []);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) { await signInAnonymously(auth); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubConfig = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_config')), (snapshot) => {
      const mainDoc = snapshot.docs.find(doc => doc.id === 'main');
      if (mainDoc) {
        const data = { ...DEFAULT_DETAILS, ...mainDoc.data() };
        setDetails(data);
        if (!editForm) setEditForm(data);
      } else {
        setDetails(DEFAULT_DETAILS);
        if (!editForm) setEditForm(DEFAULT_DETAILS);
      }
    });
    const unsubGuests = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees')), (snapshot) => {
      setInvitees(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubConfig(); unsubGuests(); };
  }, [user]);

  // --- RSVP HANDLER ---
  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const code = rsvpForm.enteredCode.trim().toUpperCase();
    const guest = invitees.find(i => String(i.code) === code);
    if (!guest) { setSubmitError("Security code not found. Please check your invitation."); return; }
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', guest.id), {
        status: rsvpForm.attending === 'yes' ? 'Attending' : 'Declined',
        submittedName: rsvpForm.name,
        message: rsvpForm.message,
        respondedAt: Date.now()
      });
      setSubmitSuccess(true);
    } catch (err) { setSubmitError("System error. Try again later."); }
    setIsSubmitting(false);
  };

  // --- DATA PROCESSING (PRINCIPAL SPONSORS) ---
  const principalArray = (details.entouragePrincipal || '').split('\n').map(s => s.trim()).filter(Boolean);
  const principalPairs = [];
  for (let i = 0; i < principalArray.length; i += 2) {
    principalPairs.push({ male: principalArray[i] || '', female: principalArray[i+1] || '' });
  }

  // ==========================================
  // 5. ADMIN FIELD COMPONENT
  // ==========================================

  const Field = ({ label, name, isTextArea = false, isAudio = false }) => {
    const [uploading, setUploading] = useState(false);
    const audioInputRef = useRef(null);

    if (!editForm) return null;

    const handleAudioUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setUploading(true);
      try {
        const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
        const storageRef = ref(storage, `artifacts/${appId}/public/audio/${Date.now()}_${safeName}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setEditForm({ ...editForm, [name]: url });
        showToast("Audio uploaded successfully!");
      } catch (err) {
        showToast("Failed to upload audio.");
      }
      setUploading(false);
    };

    return (
      <div className="mb-6">
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
        {isAudio ? (
          <div className="flex flex-col gap-3">
            <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleAudioUpload} className="hidden" />
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => audioInputRef.current?.click()} 
                disabled={uploading}
                className="bg-weddingSage text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Music'}
              </button>
              <input 
                type="text" 
                value={editForm[name] || ''} 
                onChange={e => setEditForm({...editForm, [name]: e.target.value})} 
                className="flex-1 p-2.5 bg-weddingSage/10 border border-weddingSage/30 rounded-lg text-xs" 
                placeholder="Or paste Audio URL"
              />
            </div>
            {editForm[name] && <audio controls className="w-full h-8 scale-90" src={editForm[name]} />}
          </div>
        ) : isTextArea ? (
          <textarea 
            value={editForm[name] || ''} 
            onChange={e => setEditForm({...editForm, [name]: e.target.value})} 
            className="w-full p-3 bg-weddingSage/10 border border-weddingSage/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-weddingSage" rows="4" 
          />
        ) : (
          <input 
            type="text" 
            value={editForm[name] || ''} 
            onChange={e => setEditForm({...editForm, [name]: e.target.value})} 
            className="w-full p-3 bg-weddingSage/10 border border-weddingSage/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-weddingSage" 
          />
        )}
      </div>
    );
  };

  // ==========================================
  // 6. RENDER LOGIC
  // ==========================================

  if (isLanding) {
    return <LandingPage onOpen={handleOpenInvitation} groom={String(details.groomName)} bride={String(details.brideName)} />;
  }

  if (isAdminAuth) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-12 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-serif text-weddingDark italic">Admin Portal</h1>
            <div className="flex gap-4">
              <button onClick={() => setAdminTab('guests')} className={`px-6 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${adminTab === 'guests' ? 'bg-weddingDark text-white' : 'bg-white border'}`}>Guests</button>
              <button onClick={() => setAdminTab('details')} className={`px-6 py-2.5 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all ${adminTab === 'details' ? 'bg-weddingDark text-white' : 'bg-white border'}`}>Content</button>
              <button onClick={() => setIsAdminAuth(false)} className="px-6 py-2.5 text-[10px] uppercase font-bold text-red-500 hover:bg-red-50 rounded-full">Logout</button>
            </div>
          </div>
          
          {adminTab === 'guests' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    <tr><th className="p-6">Guest Name</th><th className="p-6">Invite Code</th><th className="p-6">Status</th><th className="p-6">Message</th></tr>
                 </thead>
                 <tbody>
                    {invitees.map(i => (
                      <tr key={i.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                        <td className="p-6 font-bold text-gray-800">{String(i.name)}</td>
                        <td className="p-6 font-mono text-xs text-gray-400">{String(i.code)}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${i.status === 'Attending' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{String(i.status)}</span>
                        </td>
                        <td className="p-6 italic text-gray-400 truncate max-w-xs">{i.message ? String(i.message) : '-'}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
            </div>
          ) : (
            <form className="space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              setIsSavingDetails(true);
              try { 
                await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_config', 'main'), editForm); 
                showToast("Invitation Published!"); 
              } catch(e) { showToast("Save failed."); }
              setIsSavingDetails(false);
            }}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center sticky top-4 z-50">
                 <h2 className="text-xl font-serif italic">Wedding Details</h2>
                 <button type="submit" disabled={isSavingDetails} className="bg-weddingYellow text-weddingDark px-10 py-3 rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-md hover:shadow-lg disabled:opacity-50">
                   {isSavingDetails ? 'Publishing...' : 'Publish Changes'}
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-weddingAccent mb-6 border-b pb-2">Primary Info</h3>
                  <Field label="Groom Name" name="groomName" />
                  <Field label="Bride Name" name="brideName" />
                  <Field label="Background Music" name="backgroundMusicUrl" isAudio />
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-weddingAccent mb-6 border-b pb-2">Entourage</h3>
                  <Field label="Principal Sponsors (List names line by line)" name="entouragePrincipal" isTextArea />
                  <Field label="Groom's Parents" name="groomParents" isTextArea />
                  <Field label="Bride's Parents" name="brideParents" isTextArea />
                </div>
              </div>
            </form>
          )}
        </div>
        {toastMessage && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-weddingDark text-white px-10 py-4 rounded-full text-[11px] uppercase font-bold tracking-widest z-[300] shadow-2xl animate-bounce">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-weddingDark flex flex-col relative w-full overflow-x-hidden selection:bg-weddingYellow/40" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-50] bg-cover bg-center opacity-50" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}></div>
      <div className="fixed inset-0 z-[-49] bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/90 to-[#faf9f6]/95 backdrop-blur-[2px]"></div>
      
      <AnimatedLeaves count={12} />
      <audio ref={audioRef} loop src={details.backgroundMusicUrl || "https://upload.wikimedia.org/wikipedia/commons/4/4b/Chopin_-_Nocturne_op._9_no._2.ogg"} />

      {/* Music Control */}
      <button 
        onClick={toggleAudio} 
        className={`fixed left-8 bottom-8 z-50 p-6 rounded-full shadow-2xl transition-all border-2 active:scale-90 ${isPlaying ? 'bg-weddingSage border-weddingSage' : 'bg-weddingYellow border-weddingYellow animate-pulse'}`}
      >
        {isPlaying ? <Music size={24} className="text-weddingDark" /> : <Play size={24} className="text-weddingDark" />}
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-6 bg-[#faf9f6]/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 flex justify-center gap-8 md:gap-14 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
          {['Home', 'Story', 'Entourage', 'Venues', 'RSVP'].map(t => (
            <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className="hover:text-weddingDark transition-all active:scale-95 border-b-2 border-transparent hover:border-weddingAccent pb-1">{t}</button>
          ))}
        </div>
      </nav>

      <main className="flex-grow w-full relative z-10 pt-20">
        
        {/* HERO - Massive Font Sizes */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden pb-20">
          <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] text-weddingSage opacity-5 pointer-events-none" />
          <p className="text-weddingAccent tracking-[0.6em] uppercase text-[12px] mb-12 font-bold animate-pulse">Join us to celebrate</p>
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-script font-bold leading-[0.75] mb-10 text-weddingDark drop-shadow-sm select-none">
            {String(details.groomName)} <br/>
            <span className="text-4xl md:text-7xl font-serif italic text-weddingAccent my-4 block">&amp;</span> 
            {String(details.brideName)}
          </h1>
          <div className="flex items-center justify-center gap-6 my-10 opacity-40 w-full">
            <div className="w-24 h-px bg-weddingSage"></div>
            <div className="w-3 h-3 rotate-45 bg-weddingAccent"></div>
            <div className="w-24 h-px bg-weddingSage"></div>
          </div>
          <p className="text-3xl md:text-5xl tracking-[0.3em] font-light text-gray-800 uppercase mb-4">{String(details.weddingDate)}</p>
          <p className="text-[13px] tracking-[0.5em] text-gray-400 font-bold uppercase mb-12">{String(details.weddingLocation)}</p>
          <CountdownTimer targetDate={details.weddingDate} />
        </section>

        {/* STORY */}
        <section id="story" className="py-32 px-6 max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-20 relative">
            <div className="w-full md:w-5/12 aspect-[4/5] rounded-t-full border-[16px] border-white shadow-2xl relative overflow-hidden z-10 p-1 bg-white">
              <ImageSlider photoString={details.storyPhotoUrl} altText="Story" containerClass="absolute inset-0" imageClass="rounded-t-full" />
            </div>
            <div className="w-full md:w-7/12 text-center md:text-left z-20">
              <div className="bg-white/70 backdrop-blur-xl p-12 md:p-16 rounded-sm border border-white shadow-xl">
                <h2 className="text-[12px] font-bold tracking-[0.4em] text-weddingAccent mb-10 uppercase border-b border-weddingSage/30 pb-4 inline-block">The Journey</h2>
                <div className="text-xl md:text-3xl font-serif leading-relaxed text-gray-800 italic text-justify md:text-left">
                   <span className="text-5xl text-weddingYellow block mb-4 opacity-50">"</span>
                   {String(details.ourStory)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENTOURAGE - Reordered: Parents First, Two Column Sponsors */}
        <section id="entourage" className="py-32 px-4 bg-white/20 backdrop-blur-sm border-y border-white">
          <div className="max-w-screen-lg mx-auto text-center">
            <h2 className="text-6xl md:text-8xl font-serif text-weddingDark mb-24 drop-shadow-sm italic">The Entourage</h2>
            
            {/* 1. Parents (Centered & Elevated) */}
            <div className="mb-32">
              <h3 className="text-[12px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-12 border-b-2 border-weddingYellow inline-block pb-2">Beloved Parents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-center items-start">
                <div className="flex flex-col items-center md:items-end md:pr-12 md:border-r border-weddingSage/20">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Parents of the Groom</h4>
                  <p className="text-2xl md:text-4xl font-serif whitespace-pre-line text-gray-800 leading-snug">{String(details.groomParents)}</p>
                </div>
                <div className="flex flex-col items-center md:items-start md:pl-12">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Parents of the Bride</h4>
                  <p className="text-2xl md:text-4xl font-serif whitespace-pre-line text-gray-800 leading-snug">{String(details.brideParents)}</p>
                </div>
              </div>
            </div>

            {/* 2. Principal Sponsors (Two-Column Pairs) */}
            <div className="mb-32 bg-white/40 p-10 md:p-20 rounded-3xl border border-white shadow-sm">
               <h3 className="text-[12px] font-bold text-weddingAccent tracking-[0.4em] uppercase mb-16 inline-block">Principal Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 max-w-5xl mx-auto px-6">
                 {principalPairs.map((pair, i) => (
                   <div key={i} className="flex flex-col md:flex-row justify-between items-center border-b border-weddingSage/10 pb-6 gap-4 group hover:bg-white/20 transition-all rounded-lg px-4">
                     <span className="text-xl md:text-2xl font-serif text-gray-800">{String(pair.male)}</span>
                     <span className="text-weddingSage opacity-40 font-serif md:px-4 text-3xl">&</span>
                     <span className="text-xl md:text-2xl font-serif text-gray-800">{String(pair.female)}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Rest of Entourage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
              <div className="flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-weddingAccent uppercase tracking-widest mb-4">Best Man</h4>
                <p className="text-2xl font-serif">{String(details.bestMan)}</p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-weddingAccent uppercase tracking-widest mb-4">Maid of Honor</h4>
                <p className="text-2xl font-serif">{String(details.maidOfHonor)}</p>
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-[10px] font-bold text-weddingAccent uppercase tracking-widest mb-4">Bible Bearer</h4>
                <p className="text-2xl font-serif">{String(details.bibleBearer)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* VENUES */}
        <section id="venues" className="py-32 px-4 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Ceremony */}
            <div className="bg-white p-3 shadow-2xl relative">
              <div className="aspect-[16/10] overflow-hidden">
                <ImageSlider photoString={details.ceremonyPhotoUrl} altText="Ceremony" containerClass="w-full h-full" />
              </div>
              <div className="p-12 text-center">
                <h3 className="text-5xl font-serif text-weddingDark mb-6">The Ceremony</h3>
                <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-3">{String(details.ceremonyDate)} | {String(details.ceremonyTime)}</p>
                <p className="text-2xl font-serif mb-10 italic text-gray-700">{String(details.ceremonyVenue)}</p>
                <a href={String(details.ceremonyMapUrl)} target="_blank" className="inline-flex items-center gap-3 px-10 py-4 bg-weddingDark text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                  <MapPin size={18} /> View Location
                </a>
              </div>
            </div>
            {/* Reception */}
            <div className="bg-white p-3 shadow-2xl relative">
              <div className="aspect-[16/10] overflow-hidden">
                <ImageSlider photoString={details.receptionPhotoUrl} altText="Reception" containerClass="w-full h-full" />
              </div>
              <div className="p-12 text-center">
                <h3 className="text-5xl font-serif text-weddingDark mb-6">The Reception</h3>
                <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-weddingAccent mb-3">{String(details.receptionTime)}</p>
                <p className="text-2xl font-serif mb-10 italic text-gray-700">{String(details.receptionVenue)}</p>
                <a href={String(details.receptionMapUrl)} target="_blank" className="inline-flex items-center gap-3 px-10 py-4 bg-weddingDark text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-weddingAccent transition-all shadow-xl">
                  <MapPin size={18} /> View Location
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* RSVP - Sage Green Inputs */}
        <section id="rsvp" className="py-32 px-4 bg-[#1f2b22] text-white">
          <div className="max-w-screen-md mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-[12px] font-bold tracking-[0.5em] text-weddingYellow uppercase mb-6">RSVP</h2>
              <h3 className="text-5xl md:text-7xl font-serif mb-10">Join the Celebration</h3>
              <p className="text-weddingYellow font-serif italic text-xl border border-weddingYellow/20 px-10 py-3 inline-block bg-weddingYellow/5 rounded-full">Please respond by {String(details.rsvpDeadline)}</p>
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
                  <div className="bg-weddingSage/10 p-10 rounded-3xl border border-weddingSage/30 focus-within:border-weddingYellow/50 transition-all">
                    <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-weddingYellow/60">Security Code</label>
                    <input required value={rsvpForm.enteredCode} onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} className="w-full bg-weddingSage/20 rounded-xl px-4 py-4 focus:outline-none focus:bg-weddingSage/40 text-3xl font-serif uppercase tracking-[0.5em] text-white placeholder:text-white/20" placeholder="----" />
                  </div>
                  <div className="bg-weddingSage/10 p-10 rounded-3xl border border-weddingSage/30 focus-within:border-weddingYellow/50 transition-all">
                    <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-weddingYellow/60">Full Name</label>
                    <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-weddingSage/20 rounded-xl px-4 py-4 focus:outline-none focus:bg-weddingSage/40 text-3xl font-serif italic text-white placeholder:text-white/20" placeholder="Name" />
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

                <div className="bg-weddingSage/10 p-10 rounded-3xl border border-weddingSage/30">
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-6 text-weddingYellow/60">Wishes for the Couple</label>
                  <textarea value={rsvpForm.message} onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} className="w-full bg-weddingSage/20 rounded-xl p-6 focus:outline-none focus:bg-weddingSage/40 text-xl font-serif italic text-white resize-none h-40" placeholder="Leave a message..." />
                </div>

                {submitError && <div className="text-red-300 text-center p-6 bg-red-900/40 rounded-2xl border border-red-500/30 text-xs font-bold uppercase tracking-widest">{String(submitError)}</div>}
                <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-10 rounded-3xl font-bold uppercase tracking-[0.3em] text-[13px] shadow-2xl hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50">
                  {isSubmitting ? 'Processing RSVP...' : 'Confirm My Attendance'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-24 text-center bg-[#faf9f6] border-t border-gray-200 relative z-10">
        <p className="font-script text-7xl md:text-[8rem] text-weddingDark mb-8 select-none">{String(details.groomName)} & {String(details.brideName)}</p>
        <div className="w-24 h-px bg-weddingSage mx-auto mb-12 opacity-50"></div>
        <p className="text-[11px] uppercase font-bold tracking-[0.5em] text-gray-500 mb-20">{String(details.weddingDate)} • {String(details.weddingLocation)}</p>
        <button onClick={() => setShowAdminLogin(true)} className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-weddingDark transition-colors flex items-center gap-3 mx-auto px-6 py-3 border border-gray-100 rounded-full"><Lock size={14}/> Staff Login</button>
      </footer>

      {/* ADMIN LOGIN */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-[300] bg-[#faf9f6]/95 backdrop-blur-2xl flex items-center justify-center p-6 text-weddingDark">
          <div className="max-w-sm w-full text-center animate-in zoom-in duration-500">
            <button onClick={() => setShowAdminLogin(false)} className="mb-12 text-gray-300 hover:text-black transition-transform hover:rotate-90 focus:outline-none"><X size={40} className="mx-auto" /></button>
            <h3 className="text-3xl font-serif mb-10 italic">Secure Access</h3>
            <form onSubmit={handleAdminLogin}>
              <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b-2 border-weddingDark text-center py-6 mb-12 tracking-[0.8em] text-3xl focus:outline-none bg-transparent" placeholder="••••••••" />
              {adminError && <p className="text-red-500 text-[10px] font-bold mb-8 uppercase tracking-[0.2em]">{String(adminError)}</p>}
              <button className="w-full bg-weddingDark text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all">Verify Credentials</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
