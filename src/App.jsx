import React, { useState, useEffect, useRef } from 'react';
import { Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, Github, Globe, Terminal, Cloud, AlertCircle, ExternalLink, MapPin, Music, Play, Pause } from 'lucide-react';
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

// --- Decorative & Feature Components ---

const HandpaintedFlower = ({ className }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} filter drop-shadow-sm`}>
    <path d="M100 100C110 70 140 60 160 80C180 100 150 130 120 120" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C120 120 130 150 110 170C90 190 60 160 70 130" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C80 120 50 130 30 110C10 90 40 60 70 70" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M100 100C80 80 70 50 90 30C110 10 140 40 130 70" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"/>
    <circle cx="100" cy="100" r="4" fill="#ffff8f" stroke="currentColor" strokeWidth="0.2" />
    <path d="M100 100L110 140M110 140C115 150 125 155 135 150" stroke="currentColor" strokeWidth="0.8" opacity="0.4"/>
  </svg>
);

const OrganicLeaf = ({ className, color = "#B8C6A7" }) => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill="none" stroke={color} strokeWidth="1.2" d="M100,200 C100,100 20,80 50,20 C80,-40 180,20 180,80 C180,140 100,100 100,200 Z" opacity="0.8"/>
    <path fill={color} opacity="0.15" d="M100,200 C100,100 20,80 50,20 C80,-40 180,20 180,80 C180,140 100,100 100,200 Z" />
  </svg>
);

const LineAccent = () => (
  <div className="flex items-center justify-center gap-6 my-10 opacity-40 w-full">
    <div className="w-20 h-px bg-weddingSage"></div>
    <div className="w-2.5 h-2.5 rotate-45 bg-weddingAccent shadow-sm"></div>
    <div className="w-20 h-px bg-weddingSage"></div>
  </div>
);

const AnimatedLeaves = () => (
  <div className="fixed inset-0 pointer-events-none z-[-20] overflow-hidden">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={`absolute text-weddingSage opacity-[0.08] animate-float`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `-10%`,
          animationDuration: `${15 + Math.random() * 15}s`,
          animationDelay: `${Math.random() * 10}s`,
          transform: `scale(${0.5 + Math.random() * 1})`
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" />
        </svg>
      </div>
    ))}
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

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

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
    <div className="flex justify-center gap-8 mt-16 backdrop-blur-sm bg-white/20 px-10 py-8 rounded-[2.5rem] border border-white/50 shadow-sm max-w-xl mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center min-w-[70px]">
          <span className="text-4xl md:text-5xl font-serif text-weddingDark">{String(value).padStart(2, '0')}</span>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mt-3">{unit}</span>
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
      <ImageIcon className="w-10 h-10 opacity-20"/>
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

const DEFAULT_DETAILS = {
  groomName: "James",
  brideName: "Cassie",
  weddingDate: "April 10, 2026",
  weddingLocation: "Muntinlupa, Philippines",
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
  bridesmaids: "Angela Cherish C. Pinoy\nKristel Ann B. De Vera\nMylene B. De Vera\nBea Michaela B. De Vera\nCarmela Ella\nNatasha Correos\nKaye Marie Abelo\nPrincess Jelian B. Almonte",
  bibleBearer: "Kyler Timothy A. De Vera",
  ringBearer: "Dean Lukas A. De Vera",
  coinBearer: "Insert Name Here",
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

const SAMPLE_MESSAGES = [
  { id: 's1', message: "Wishing you a lifetime of love, laughter, and endless happiness. We cannot wait to witness your beautiful day!", submittedName: "The Smith Family" },
  { id: 's2', message: "So incredibly happy for you both! Cheers to the beautiful couple and the amazing journey ahead.", submittedName: "Aunt Sarah & Uncle Mike" },
  { id: 's3', message: "May your love grow stronger with each passing year. Counting down the days until we celebrate!", submittedName: "Mark & Jessica" },
  { id: 's4', message: "Welcome to the adventure of a lifetime! We love you both so much.", submittedName: "The Garcia Crew" },
  { id: 's5', message: "To the most beautiful couple, inside and out. Best wishes on your wedding day!", submittedName: "Elena & Luis" }
];

export default function App() {
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
  const [adminError, setAdminError] = useState('');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestCode, setNewGuestCode] = useState('');
  const [editForm, setEditForm] = useState(null);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [currentGbSlide, setCurrentGbSlide] = useState(0);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  const fileInputRef = useRef(null);

  const ADMIN_PASSWORD = "Eternity&Leaves2026!";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // --- Layout Fix: SELF-HEALING CDN INJECTION ---
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
              script: ['"Bodega Script"', '"Great Vibes"', 'cursive'],
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
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@200;300;400;500;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    const customFont = document.createElement('style');
    customFont.innerHTML = `
      @font-face {
        font-family: 'Bodega Script';
        src: local('Bodega Script'), local('BodegaScript');
      }
    `;
    document.head.appendChild(customFont);

    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
      if (document.head.contains(customFont)) document.head.removeChild(customFont);
    };
  }, []);

  // --- Auth & Data Listeners ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        try { await signInAnonymously(auth); } catch(e) {}
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const unsubscribeConfig = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_config')), (snapshot) => {
      const mainDoc = snapshot.docs.find(doc => doc.id === 'main');
      if (mainDoc) {
        const remoteData = { ...DEFAULT_DETAILS, ...mainDoc.data() };
        setDetails(remoteData);
        setEditForm(prev => prev === null ? remoteData : prev);
      } else {
        setDetails(DEFAULT_DETAILS);
        setEditForm(prev => prev === null ? DEFAULT_DETAILS : prev);
      }
    });
    const unsubscribeInvitees = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees')), (snapshot) => {
      const inviteesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      inviteesData.sort((a, b) => b.timestamp - a.timestamp);
      setInvitees(inviteesData);
    });
    return () => { unsubscribeConfig(); unsubscribeInvitees(); };
  }, [user]);

  const handleRsvpSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!user || !db) return;
    const enteredCode = rsvpForm.enteredCode.trim().toUpperCase();
    const matchedInvitee = invitees.find(invitee => String(invitee.code) === enteredCode);
    
    if (!matchedInvitee) {
      setSubmitError("Invalid Security Code. Please check your physical invitation.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', matchedInvitee.id), {
        status: rsvpForm.attending === 'yes' ? 'Attending' : 'Declined',
        submittedName: rsvpForm.name,
        message: rsvpForm.message,
        respondedAt: Date.now()
      });
      setSubmitSuccess(true);
    } catch (error) { setSubmitError("Error updating RSVP. Please try again."); }
    setIsSubmitting(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuth(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else { setAdminError('Incorrect password'); }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!user || !db || !newGuestName || !newGuestCode) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), {
        name: newGuestName, code: String(newGuestCode).trim().toUpperCase(),
        status: 'Pending', submittedName: '', email: '', message: '',
        messageApproved: false, timestamp: Date.now()
      });
      setNewGuestName(''); setNewGuestCode('');
      showToast("Guest added successfully");
    } catch (error) { showToast("Error adding guest"); }
  };

  const toggleMessageApproval = async (id, currentStatus) => {
    if(!user || !db) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id), { messageApproved: !currentStatus });
  };

  const handleDeleteGuest = async (id) => {
    if(!user || !db) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id));
      showToast("Guest removed");
    } catch (error) { showToast("Failed to remove guest"); }
  };

  const handleDownloadCSV = () => {
    const headers = ['Name', 'Code', 'RSVP Status', 'Submitted Name', 'Message'];
    const csvRows = invitees.map(i => `"${i.name}","${i.code}","${i.status}","${i.submittedName}","${(i.message || '').replace(/"/g, '""')}"`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_guest_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(',');
        if (cols.length >= 2) {
          const name = cols[0].replace(/"/g, '').trim();
          const code = cols[1].replace(/"/g, '').trim().toUpperCase();
          if (name && code) {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), {
              name, code, status: 'Pending', submittedName: '', message: '', messageApproved: false, timestamp: Date.now()
            });
          }
        }
      }
      showToast("Bulk upload complete.");
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!user || !db || !editForm) return;
    setIsSavingDetails(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_config', 'main'), editForm);
      showToast("Published Successfully!");
    } catch (error) { showToast("Error saving changes."); }
    setIsSavingDetails(false);
  };

  // --- Derived Data ---
  const colorArray = (details.dressCodeColors || '').split(',').map(s => s.trim()).filter(Boolean);
  const principalArray = (details.entouragePrincipal || '').split('\n').map(s => s.trim()).filter(Boolean);
  const groomsmenArray = (details.groomsmen || '').split('\n').map(s => s.trim()).filter(Boolean);
  const bridesmaidsArray = (details.bridesmaids || '').split('\n').map(s => s.trim()).filter(Boolean);
  const candleArray = (details.candleSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const veilArray = (details.veilSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const cordArray = (details.cordSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const flowerGirlsArray = (details.flowerGirls || '').split('\n').map(s => s.trim()).filter(Boolean);

  const dbApprovedMessages = invitees.filter(i => i.message && i.messageApproved && i.submittedName);
  const displayMessages = dbApprovedMessages.length > 0 ? dbApprovedMessages : SAMPLE_MESSAGES;
  
  const gbSlides = [];
  for (let i = 0; i < displayMessages.length; i += 3) {
    gbSlides.push(displayMessages.slice(i, i + 3));
  }

  const entouragePartners = Array.from({ length: Math.max(groomsmenArray.length, bridesmaidsArray.length) }).map((_, i) => ({
    groomSide: groomsmenArray[i] || '',
    brideSide: bridesmaidsArray[i] || ''
  }));

  const Field = ({ label, name, isTextArea = false, isImageUrl = false }) => {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    if (!editForm) return null;
    const value = editForm[name] || '';
    const images = isImageUrl ? value.split(',').map(s => s.trim()).filter(Boolean) : [];

    const handleUpload = async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        const uploadedUrls = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
          const storageRef = ref(storage, `artifacts/${appId}/public/images/${Date.now()}_${safeName}`);
          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          uploadedUrls.push(url);
        }
        
        const existing = editForm[name] ? editForm[name].trim() : '';
        const newVal = existing ? `${existing}, ${uploadedUrls.join(', ')}` : uploadedUrls.join(', ');
        
        setEditForm({ ...editForm, [name]: newVal });
        showToast("Image(s) uploaded successfully!");
      } catch (err) {
        console.error("Upload failed", err);
        showToast("Failed to upload image.");
      }
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
      <div className="mb-8 w-full">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</label>
        
        {isImageUrl && (
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleUpload} />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading} 
              className="bg-weddingSage/20 text-weddingDark px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-weddingSage/40 transition-colors flex items-center gap-2"
            >
              <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload Image(s)'}
            </button>
            <span className="text-[10px] text-gray-400 italic">Or paste URL(s) below</span>
          </div>
        )}

        {isTextArea ? (
          <textarea value={value} onChange={e => setEditForm({...editForm, [name]: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-weddingSage bg-white/50 text-sm leading-relaxed" rows="4" />
        ) : (
          <input type="text" value={value} onChange={e => setEditForm({...editForm, [name]: e.target.value})} className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-weddingSage bg-white/50 text-sm" placeholder={isImageUrl ? "https://..." : ""} />
        )}
        
        {isImageUrl && images.length > 0 && (
          <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 group">
                <img src={img} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'} />
                <button 
                  type="button" 
                  onClick={() => {
                    const newImages = [...images];
                    newImages.splice(i, 1);
                    setEditForm({...editForm, [name]: newImages.join(', ')});
                  }} 
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- ADMIN VIEW ---
  if (isAdminAuth) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-weddingDark pb-32">
        {toastMessage && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-weddingDark text-white px-8 py-4 rounded-full shadow-2xl z-[200] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle size={18} className="text-weddingSage" />
            <p className="font-bold tracking-widest text-xs uppercase">{toastMessage}</p>
          </div>
        )}
        
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-gray-200 pb-8 gap-6">
            <h1 className="text-4xl font-serif text-weddingDark italic flex items-center gap-4"><Lock className="w-8 h-8 text-weddingSage"/> Admin Portal</h1>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setAdminTab('guests')} className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${adminTab === 'guests' ? 'bg-weddingSage text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-weddingSage'}`}>Guests</button>
              <button onClick={() => setAdminTab('details')} className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${adminTab === 'details' ? 'bg-weddingSage text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-weddingSage'}`}>Content</button>
              <button onClick={() => setIsAdminAuth(false)} className="px-6 py-3 bg-red-50 text-red-600 rounded-full text-[11px] font-bold uppercase tracking-widest border border-red-100">Exit</button>
            </div>
          </div>

          {adminTab === 'guests' && (
            <div className="animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4 items-end flex-1 w-full">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Guest Name</label>
                    <input value={newGuestName} onChange={e=>setNewGuestName(e.target.value)} placeholder="e.g. John Doe" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Invite Code</label>
                    <input value={newGuestCode} onChange={e=>setNewGuestCode(e.target.value)} placeholder="e.g. JD2026" className="w-full p-3 border border-gray-200 rounded-xl uppercase font-mono" />
                  </div>
                  <button onClick={handleAddGuest} className="bg-weddingDark text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Add</button>
                </div>
                <div className="flex gap-4">
                  <input type="file" accept=".csv" ref={fileInputRef} onChange={handleBulkUploadCSV} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Upload size={16}/> Import</button>
                  <button onClick={handleDownloadCSV} className="px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2"><Download size={16}/> Export</button>
                </div>
              </div>
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100">
                      <th className="p-5">Guest</th>
                      <th className="p-5">Status</th>
                      <th className="p-5">Guestbook Message</th>
                      <th className="p-5">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitees.map(i => (
                      <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-5">
                          <div className="font-bold text-sm">{String(i.name)}</div>
                          <div className="text-[10px] font-mono text-gray-400 uppercase">{String(i.code)}</div>
                        </td>
                        <td className="p-5">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase ${i.status === 'Attending' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>{String(i.status)}</span>
                        </td>
                        <td className="p-5 text-sm italic text-gray-600 max-w-xs truncate">
                          {i.message ? (
                            <div className="flex flex-col gap-2 items-start">
                              <span>"{i.message}"</span>
                              <button onClick={() => toggleMessageApproval(i.id, i.messageApproved)} className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${i.messageApproved ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                                <Heart className="w-3 h-3" fill={i.messageApproved ? "currentColor" : "none"} /> {i.messageApproved ? 'Public' : 'Hidden'}
                              </button>
                            </div>
                          ) : <span className="text-gray-300">No message</span>}
                        </td>
                        <td className="p-5">
                          <button onClick={() => handleDeleteGuest(i.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="space-y-10 animate-in fade-in duration-500">
              <div className="sticky top-6 z-50 bg-white/80 backdrop-blur-xl p-4 rounded-full shadow-lg border border-white/20 flex justify-between items-center px-8">
                <span className="text-sm font-bold tracking-widest uppercase text-weddingSage flex items-center gap-2"><Edit2 size={16}/> Edit Mode</span>
                <button type="submit" disabled={isSavingDetails} className="bg-weddingYellow text-weddingDark px-10 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-md disabled:opacity-50 hover:shadow-xl transition-shadow">
                   {isSavingDetails ? 'Publishing...' : 'Publish Changes'}
                </button>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark">Hero & Story</h3>
                 <div className="grid md:grid-cols-2 gap-x-8">
                    <Field label="Groom's Name" name="groomName" />
                    <Field label="Bride's Name" name="brideName" />
                    <Field label="Wedding Date (Top)" name="weddingDate" />
                    <Field label="Location (Top)" name="weddingLocation" />
                 </div>
                 <Field label="Our Story Text" name="ourStory" isTextArea={true} />
                 <Field label="Story Image URL" name="storyPhotoUrl" isImageUrl={true} />
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark">Family & Entourage</h3>
                 <div className="grid md:grid-cols-2 gap-x-8">
                    <Field label="Groom's Parents" name="groomParents" isTextArea={true} />
                    <Field label="Bride's Parents" name="brideParents" isTextArea={true} />
                    <Field label="Principal Sponsors (List)" name="entouragePrincipal" isTextArea={true} />
                    <div className="space-y-4">
                       <Field label="Best Man" name="bestMan" />
                       <Field label="Maid of Honor" name="maidOfHonor" />
                    </div>
                    <Field label="Groomsmen" name="groomsmen" isTextArea={true} />
                    <Field label="Bridesmaids" name="bridesmaids" isTextArea={true} />
                    <Field label="Candle" name="candleSponsors" isTextArea={true} />
                    <Field label="Veil" name="veilSponsors" isTextArea={true} />
                    <Field label="Cord" name="cordSponsors" isTextArea={true} />
                    <div className="space-y-4">
                       <Field label="Bible Bearer" name="bibleBearer" />
                       <Field label="Ring Bearer" name="ringBearer" />
                       <Field label="Coin Bearer" name="coinBearer" />
                    </div>
                    <Field label="Flower Girls" name="flowerGirls" isTextArea={true} />
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark">Venues</h3>
                 <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-bold uppercase tracking-tighter text-weddingSage">Ceremony</h4>
                       <Field label="Venue Name" name="ceremonyVenue" />
                       <Field label="Address" name="ceremonyAddress" />
                       <Field label="Time" name="ceremonyTime" />
                       <Field label="Image URL" name="ceremonyPhotoUrl" isImageUrl={true} />
                       <Field label="Google Maps Link" name="ceremonyMapUrl" />
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-[10px] font-bold uppercase tracking-tighter text-weddingSage">Reception</h4>
                       <Field label="Venue Name" name="receptionVenue" />
                       <Field label="Address" name="receptionAddress" />
                       <Field label="Time" name="receptionTime" />
                       <Field label="Image URL" name="receptionPhotoUrl" isImageUrl={true} />
                       <Field label="Google Maps Link" name="receptionMapUrl" />
                    </div>
                 </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark">Registry & Style</h3>
                 <Field label="Dress Code Guidelines" name="dressCodeText" isTextArea={true} />
                 <Field label="Color Palette (Hex codes, comma separated)" name="dressCodeColors" />
                 <Field label="Inspiration Photos (URLs)" name="dressCodePhotoUrl" isImageUrl={true} />
                 <Field label="Registry Message" name="giftText" isTextArea={true} />
                 <Field label="RSVP Deadline" name="rsvpDeadline" />
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- MAIN PUBLIC UI ---
  return (
    <div className="min-h-screen text-weddingDark flex flex-col relative w-full overflow-x-hidden selection:bg-weddingYellow/30" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* 1. EDITORIAL BACKGROUND WITH OVERLAY WASH */}
      <div 
        className="fixed inset-0 z-[-50] bg-cover bg-center bg-no-repeat opacity-60" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80')" }}
      ></div>
      <div className="fixed inset-0 z-[-49] bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/85 to-[#faf9f6]/95 backdrop-blur-[2px]"></div>
      
      {/* 2. THEME FEATURE: Animated Leaves */}
      <AnimatedLeaves />
      
      {/* Interactive Music Player Feature */}
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/02/07/audio_4a8eb2a868.mp3?filename=romantic-piano-101435.mp3" />
      <button 
        onClick={toggleAudio} 
        className={`fixed left-6 bottom-6 md:left-10 md:bottom-10 z-50 p-4 md:p-5 rounded-full shadow-2xl transition-all group border border-white/50 backdrop-blur-md hover:scale-110 active:scale-95 ${isPlaying ? 'bg-weddingSage text-white' : 'bg-white/60 text-weddingSage hover:bg-white/90'}`}
        aria-label="Toggle Background Music"
      >
        {isPlaying ? <Music className="w-5 h-5 md:w-6 md:h-6 animate-pulse" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-1" />}
        <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-weddingDark text-white px-4 py-2 rounded-lg shadow-xl text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </span>
      </button>

      {/* Floating Action Button for RSVP */}
      <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="fixed right-6 bottom-6 md:right-10 md:bottom-10 z-50 bg-weddingYellow text-weddingDark p-4 md:p-5 rounded-full shadow-2xl border border-white hover:scale-110 active:scale-95 transition-all group ring-1 ring-weddingAccent/10">
        <Mail className="w-5 h-5 md:w-6 md:h-6" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-weddingDark text-white px-4 py-2 rounded-lg shadow-xl text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">RSVP</span>
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-6 bg-[#faf9f6]/70 backdrop-blur-xl border-b border-white/50 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 flex flex-wrap justify-center gap-6 md:gap-14 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">
          {['Home', 'Story', 'Entourage', 'Venues', 'Guestbook', 'Details', 'RSVP'].map(t => (
            <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className={`hover:text-weddingDark transition-all border-b-2 py-1 ${t === 'RSVP' ? 'text-weddingAccent border-weddingYellow' : 'border-transparent'}`}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="flex-grow w-full relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative w-full overflow-hidden pt-24">
          <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] text-weddingSage opacity-[0.05] pointer-events-none" />
          
          <p className="text-weddingAccent tracking-[0.6em] uppercase text-[10px] md:text-xs mb-10 font-bold animate-pulse">Join us to celebrate</p>
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-script font-bold leading-[0.9] mb-10 pr-4 drop-shadow-sm text-weddingDark">
            {String(details.groomName)} <br/><span className="text-5xl md:text-7xl font-serif italic text-weddingAccent my-4 block">&amp;</span> {String(details.brideName)}
          </h1>
          <LineAccent />
          <p className="text-2xl md:text-4xl tracking-[0.3em] font-light text-gray-800 mb-3 uppercase">{String(details.weddingDate)}</p>
          <p className="text-[10px] md:text-xs tracking-[0.5em] text-gray-400 font-bold uppercase">{String(details.weddingLocation)}</p>
          
          {/* THEME FEATURE: Live Countdown */}
          <CountdownTimer targetDate={details.weddingDate} />
          
          <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="mt-16 px-16 py-5 bg-weddingYellow text-weddingDark text-[10px] font-bold uppercase tracking-[0.4em] rounded-full shadow-xl border border-white hover:shadow-2xl hover:-translate-y-1 transition-all">RSVP Now</button>
        </section>

        {/* STORY SECTION - Fine Art Magazine Layout */}
        <section id="story" className="py-24 md:py-40 px-6 md:px-10 max-w-screen-xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 relative">
            <div className="w-full lg:w-5/12 aspect-[4/5] rounded-t-full rounded-b-sm border-t-[20px] border-b-8 border-x-[20px] border-white/60 shadow-2xl p-1 relative bg-white/40 flex-shrink-0 z-10">
              <ImageSlider photoString={details.storyPhotoUrl} altText="Story" containerClass="absolute inset-1" imageClass="rounded-t-full rounded-b-sm" />
            </div>
            <div className="w-full lg:w-6/12 text-center lg:text-left relative z-20 lg:-ml-16">
              <div className="bg-white/70 backdrop-blur-xl p-12 md:p-16 lg:p-20 border border-white shadow-xl rounded-sm">
                <h2 className="text-[10px] md:text-xs font-bold tracking-[0.6em] text-weddingAccent mb-10 uppercase opacity-80 border-b border-weddingSage/30 pb-4 inline-block">The Beginning</h2>
                <div className="relative">
                  <span className="absolute -left-6 -top-10 text-[5rem] text-weddingYellow opacity-40 font-serif leading-none select-none">"</span>
                  <p className="text-base md:text-lg xl:text-xl font-serif leading-loose text-gray-700 relative z-10 text-justify md:text-left tracking-wide drop-shadow-sm">
                    {String(details.ourStory)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ENTOURAGE SECTION - Editorial Typography Layout */}
        <section id="entourage" className="py-24 md:py-32 px-6 md:px-10 text-center relative w-full">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-serif text-weddingDark mb-32 drop-shadow-sm">The Entourage</h2>
            
            {/* Parents Typography Grid */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-20 mb-32 border-y border-weddingSage/20 py-20">
              <div className="flex-1 text-center md:text-right md:border-r border-weddingSage/20 md:pr-20">
                <h3 className="text-[10px] font-bold text-weddingAccent tracking-[0.5em] uppercase mb-10">Parents of the Groom</h3>
                <p className="text-xl md:text-3xl font-serif whitespace-pre-line leading-relaxed text-gray-700">{String(details.groomParents)}</p>
              </div>
              <div className="flex-1 text-center md:text-left md:pl-20">
                <h3 className="text-[10px] font-bold text-weddingAccent tracking-[0.5em] uppercase mb-10">Parents of the Bride</h3>
                <p className="text-xl md:text-3xl font-serif whitespace-pre-line leading-relaxed text-gray-700">{String(details.brideParents)}</p>
              </div>
            </div>

            {/* Principal Sponsors Grid */}
            <div className="mb-32">
               <h3 className="text-[10px] md:text-xs font-bold text-weddingAccent tracking-[0.7em] uppercase mb-20 underline decoration-weddingYellow decoration-4 underline-offset-[16px]">Principal Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-16 text-lg md:text-xl font-serif italic text-gray-700 w-full px-4">
                 {principalArray.map((n, i) => (
                   <div key={i} className="py-3 border-b border-weddingSage/10 flex items-center justify-center">
                     {String(n)}
                   </div>
                 ))}
               </div>
            </div>

            {/* Best Man & Maid of Honor - Floating Text */}
            <div className="max-w-screen-lg mx-auto flex flex-col items-center w-full mb-32 bg-white/40 backdrop-blur-md p-14 rounded-sm border border-white/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full text-center">
                <div className="flex flex-col items-center flex-1">
                  <h4 className="text-[9px] md:text-[10px] font-bold text-weddingAccent uppercase tracking-[0.6em] mb-6 opacity-70">Best Man</h4>
                  <p className="text-2xl md:text-4xl font-serif text-weddingDark">{String(details.bestMan)}</p>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <h4 className="text-[9px] md:text-[10px] font-bold text-weddingAccent uppercase tracking-[0.6em] mb-6 opacity-70">Maid of Honor</h4>
                  <p className="text-2xl md:text-4xl font-serif text-weddingDark">{String(details.maidOfHonor)}</p>
                </div>
              </div>
            </div>

            {/* Groomsmen & Bridesmaids List - Clean Lines */}
            <div className="max-w-screen-lg mx-auto text-gray-700 flex flex-col items-center w-full mb-32">
               <div className="grid grid-cols-2 gap-x-12 md:gap-x-24 mb-16 pb-8 border-b border-weddingAccent/30 w-full">
                 <div className="text-right text-[9px] md:text-[10px] font-bold text-weddingAccent uppercase tracking-[0.5em]">Groomsmen</div>
                 <div className="text-left text-[9px] md:text-[10px] font-bold text-weddingAccent uppercase tracking-[0.5em]">Bridesmaids</div>
               </div>
               {entouragePartners.map((partner, i) => (
                 <div key={i} className="grid grid-cols-2 gap-x-12 md:gap-x-24 mb-10 w-full items-center">
                   <div className="text-right"><p className="text-base md:text-xl font-serif tracking-wide">{String(partner.groomSide)}</p></div>
                   <div className="text-left"><p className="text-base md:text-xl font-serif tracking-wide">{String(partner.brideSide)}</p></div>
                 </div>
               ))}
            </div>

            <LineAccent />

            {/* Secondary Sponsors Grid - Typography Only */}
            <div className="max-w-screen-lg mx-auto my-32">
               <h3 className="text-[10px] md:text-xs font-bold text-weddingAccent tracking-[0.7em] uppercase mb-20 text-center">Secondary Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
                  <div className="text-center md:text-right border-b md:border-b-0 md:border-r border-weddingSage/20 pb-12 md:pb-0 md:pr-12">
                     <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-8">Candle</h4>
                     {candleArray.map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-3 text-weddingDark">{n}</p>)}
                  </div>
                  <div className="text-center border-b md:border-b-0 border-weddingSage/20 pb-12 md:pb-0 px-6">
                     <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-8">Veil</h4>
                     {veilArray.map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-3 text-weddingDark">{n}</p>)}
                  </div>
                  <div className="text-center md:text-left md:border-l border-weddingSage/20 pt-12 md:pt-0 md:pl-12">
                     <h4 className="text-[9px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-8">Cord</h4>
                     {cordArray.map((n, i) => <p key={i} className="text-lg md:text-xl font-serif mb-3 text-weddingDark">{n}</p>)}
                  </div>
               </div>
            </div>

            {/* Little Entourage (Bearers & Flower Girls) */}
            <div className="max-w-screen-lg mx-auto mt-32">
               <h3 className="text-[10px] font-bold text-weddingAccent tracking-[0.7em] uppercase mb-20 text-center">Little Entourage</h3>
               <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-16 md:gap-24 text-center mb-24">
                  <div>
                     <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b border-gray-200 pb-3 inline-block px-4">Bible Bearer</h4>
                     <p className="text-xl md:text-2xl font-serif text-weddingDark mt-4">{String(details.bibleBearer)}</p>
                  </div>
                  <div>
                     <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b border-gray-200 pb-3 inline-block px-4">Coin Bearer</h4>
                     <p className="text-xl md:text-2xl font-serif text-weddingDark mt-4">{String(details.coinBearer)}</p>
                  </div>
                  <div>
                     <h4 className="text-[8px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b border-gray-200 pb-3 inline-block px-4">Ring Bearer</h4>
                     <p className="text-xl md:text-2xl font-serif text-weddingDark mt-4">{String(details.ringBearer)}</p>
                  </div>
               </div>
               
               <div className="pt-16 text-center max-w-3xl mx-auto">
                  <h4 className="text-[8px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-10 inline-block px-6 py-3 border border-gray-200 rounded-full">Flower Girls</h4>
                  <div className="flex flex-wrap justify-center gap-x-12 md:gap-x-16 gap-y-6 md:gap-y-8">
                     {flowerGirlsArray.map((n, i) => (
                        <p key={i} className="text-lg md:text-2xl font-serif text-weddingDark italic">{n}</p>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </section>

        {/* VENUES SECTION - Editorial Overlapping Cards */}
        <section id="venues" className="py-24 md:py-40 px-6 md:px-10 relative bg-white/10 backdrop-blur-md border-y border-white/40">
           <div className="max-w-screen-xl mx-auto">
             <h2 className="text-[10px] md:text-xs font-bold tracking-[0.7em] text-center text-weddingDark uppercase mb-32 w-full">The Celebration</h2>
             
             {/* Ceremony - Overlapping Design */}
             <div className="flex flex-col lg:flex-row items-center justify-center mb-40 relative">
                <div className="w-full lg:w-7/12 aspect-[16/10] bg-white p-3 shadow-2xl relative z-10">
                   <ImageSlider photoString={details.ceremonyPhotoUrl} altText="Ceremony" containerClass="absolute inset-3" imageClass="" />
                </div>
                <div className="w-[90%] lg:w-5/12 bg-[#faf9f6]/95 backdrop-blur-xl p-12 md:p-20 shadow-2xl relative z-20 -mt-24 lg:mt-0 lg:-ml-32 border border-white">
                   <h3 className="text-4xl md:text-6xl font-serif mb-8 text-weddingDark">Ceremony</h3>
                   <div className="w-16 h-1 bg-weddingSage mb-10 opacity-60"></div>
                   <p className="text-gray-700 font-bold tracking-[0.3em] text-[9px] uppercase mb-6 leading-loose">{String(details.ceremonyDate)} <br/> {String(details.ceremonyTime)}</p>
                   <p className="text-2xl md:text-3xl font-serif text-weddingAccent mb-8 italic">{String(details.ceremonyVenue)}</p>
                   <p className="text-[9px] tracking-widest uppercase text-gray-500 mb-10 leading-relaxed">{String(details.ceremonyAddress)}</p>
                   {details.ceremonyMapUrl && (
                     <a href={details.ceremonyMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-weddingDark text-white hover:bg-black rounded-sm text-[8px] font-bold uppercase tracking-widest transition-all">
                       <MapPin size={14} /> View Map
                     </a>
                   )}
                </div>
             </div>

             {/* Reception - Reversed Overlapping */}
             <div className="flex flex-col lg:flex-row-reverse items-center justify-center relative">
                <div className="w-full lg:w-7/12 aspect-[16/10] bg-white p-3 shadow-2xl relative z-10">
                   <ImageSlider photoString={details.receptionPhotoUrl} altText="Reception" containerClass="absolute inset-3" imageClass="" />
                </div>
                <div className="w-[90%] lg:w-5/12 bg-[#faf9f6]/95 backdrop-blur-xl p-12 md:p-20 shadow-2xl relative z-20 -mt-24 lg:mt-0 lg:-mr-32 border border-white text-left lg:text-right flex flex-col items-start lg:items-end">
                   <h3 className="text-4xl md:text-6xl font-serif mb-8 text-weddingDark">Reception</h3>
                   <div className="w-16 h-1 bg-weddingSage mb-10 opacity-60"></div>
                   <p className="text-gray-700 font-bold tracking-[0.3em] text-[9px] uppercase mb-6 leading-loose">{String(details.receptionDate)} <br/> {String(details.receptionTime)}</p>
                   <p className="text-2xl md:text-3xl font-serif text-weddingAccent mb-8 italic">{String(details.receptionVenue)}</p>
                   <p className="text-[9px] tracking-widest uppercase text-gray-500 mb-10 leading-relaxed text-left lg:text-right">{String(details.receptionAddress)}</p>
                   {details.receptionMapUrl && (
                     <a href={details.receptionMapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-weddingDark text-white hover:bg-black rounded-sm text-[8px] font-bold uppercase tracking-widest transition-all">
                       <MapPin size={14} /> View Map
                     </a>
                   )}
                </div>
             </div>
           </div>
        </section>

        {/* GUESTBOOK SECTION - Editorial Style Restored */}
        <section id="guestbook" className="py-24 md:py-32 px-6 md:px-10 relative bg-white/40 backdrop-blur-md border-b border-white/60">
          <div className="max-w-screen-xl mx-auto text-center">
            <h2 className="text-[10px] md:text-xs font-bold tracking-[0.7em] text-weddingAccent uppercase mb-6 opacity-80">Wishes & Love</h2>
            <h3 className="text-4xl md:text-6xl font-serif text-weddingDark mb-24 drop-shadow-sm">Guestbook</h3>
            
            <div className="relative w-full overflow-hidden min-h-[400px]">
              {gbSlides.length > 0 ? gbSlides.map((slide, slideIdx) => (
                <div 
                  key={slideIdx} 
                  className={`w-full grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 transition-all duration-[1200ms] ease-in-out ${slideIdx === currentGbSlide ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-20 absolute top-0 left-0 pointer-events-none z-0'}`}
                >
                  {slide.map((m, i) => (
                    <div key={m.id} className="bg-[#faf9f6]/95 p-12 md:p-16 border border-white shadow-xl rounded-sm flex flex-col justify-between text-left group hover:-translate-y-2 transition-transform duration-500">
                      <MessageSquareHeart className="w-8 h-8 text-weddingSage/50 mb-10 group-hover:text-weddingAccent transition-colors" />
                      <p className="text-lg md:text-xl font-serif italic leading-relaxed text-gray-700 mb-12 drop-shadow-sm">"{String(m.message)}"</p>
                      <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 border-t border-gray-200/50 pt-8">- {String(m.submittedName)}</p>
                    </div>
                  ))}
                </div>
              )) : (
                <div className="text-center text-gray-400 font-serif italic py-20 text-xl md:text-2xl">Be the first to leave a beautiful message...</div>
              )}
            </div>
            
            {gbSlides.length > 1 && (
              <div className="flex justify-center gap-6 mt-20">
                {gbSlides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentGbSlide(i)} 
                    className={`h-1.5 transition-all duration-500 rounded-full ${i === currentGbSlide ? 'w-16 bg-weddingAccent shadow-md' : 'w-6 bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DETAILS & STYLE */}
        <section id="details" className="py-24 md:py-40 px-6 md:px-10 relative">
           <div className="max-w-screen-xl mx-auto flex flex-col gap-40 items-center">
              
              {/* Dress Code - Minimal Side-by-Side */}
              <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center w-full">
                <div className="flex-1 text-center lg:text-left">
                   <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-weddingAccent mb-6">Attire Guidelines</h3>
                   <h2 className="text-5xl font-serif mb-10 text-weddingDark">Dress Code</h2>
                   <p className="text-base md:text-lg xl:text-xl mb-16 leading-relaxed text-gray-700 drop-shadow-sm">{String(details.dressCodeText)}</p>
                   <div className="flex gap-6 flex-wrap justify-center lg:justify-start">
                      {colorArray.map((c, i) => (
                        <div key={i} className="group relative">
                          <div className="w-14 h-14 md:w-20 md:h-20 rounded-full border-[6px] border-white shadow-xl transition-all group-hover:-translate-y-2" style={{ backgroundColor: String(c) }}></div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-6 md:gap-8 w-full relative">
                   <div className="absolute inset-0 bg-weddingSage/5 rounded-sm transform rotate-3 scale-105 z-[-1]"></div>
                   {String(details.dressCodePhotoUrl).split(',').map((url, idx) => (
                     <div key={idx} className={`bg-white p-3 shadow-2xl aspect-[4/5] ${idx === 2 ? 'col-span-2 aspect-[21/9]' : ''}`}>
                       <img src={url.trim()} alt="Style" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
              </div>

              {/* Gift Protocol - Paper Style */}
              <div className="bg-[#faf9f6] p-20 md:p-32 border border-gray-200 text-center shadow-2xl relative max-w-4xl w-full">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-weddingYellow p-6 rounded-full shadow-xl">
                    <Gift className="w-10 h-10 text-weddingDark" />
                 </div>
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-10 mt-6">Registry</h3>
                 <p className="text-gray-800 font-serif text-2xl md:text-4xl leading-relaxed italic border-y border-weddingSage/20 py-16 px-6 md:px-16 drop-shadow-sm">"{String(details.giftText)}"</p>
              </div>
           </div>
        </section>

        {/* RSVP SECTION */}
        <section id="rsvp" className="py-24 md:py-40 px-6 bg-weddingDark text-white relative w-full overflow-hidden">
           {/* Dark Overlay over the global image just for this section to maintain contrast */}
           <div className="absolute inset-0 bg-[#1a261c]/95 backdrop-blur-2xl z-0"></div>
           
           <div className="max-w-screen-md mx-auto relative z-10">
              <div className="text-center mb-20">
                 <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase text-weddingYellow mb-8">RSVP</h2>
                 <h3 className="text-5xl md:text-7xl font-serif mb-12 w-full">Join the Celebration</h3>
                 <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-weddingYellow border border-weddingYellow/30 px-10 py-4 inline-block bg-weddingYellow/5">Please Reply by {String(details.rsvpDeadline)}</p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-24 bg-white/5 border border-white/10 backdrop-blur-md p-10 shadow-2xl rounded-sm">
                   <CheckCircle className="w-20 h-20 text-weddingYellow mx-auto mb-10 animate-bounce" />
                   <p className="text-3xl md:text-5xl font-serif italic mb-12 text-white">We can't wait to see you!</p>
                   <button onClick={() => setSubmitSuccess(false)} className="text-[10px] uppercase font-bold text-weddingYellow border-b border-weddingYellow pb-1 hover:opacity-70 transition-all">Edit My RSVP</button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-16">
                   <div className="border-b border-white/20 pb-6 group focus-within:border-weddingYellow transition-all">
                      <label className="block text-[9px] font-bold tracking-[0.5em] uppercase mb-6 text-weddingYellow/80">Security Code</label>
                      <input required value={rsvpForm.enteredCode} onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} className="w-full bg-transparent border-none py-3 focus:outline-none uppercase tracking-[1em] text-3xl md:text-5xl font-serif text-white placeholder:text-white/20" placeholder="----" />
                   </div>
                   
                   <div className="border-b border-white/20 pb-6 group focus-within:border-weddingYellow transition-all">
                      <label className="block text-[9px] font-bold tracking-[0.5em] uppercase mb-6 text-weddingYellow/80">Your Name</label>
                      <input required value={rsvpForm.name} onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} className="w-full bg-transparent border-none py-3 focus:outline-none text-2xl md:text-4xl font-serif italic text-white placeholder:text-white/20" placeholder="Full Name" />
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-8 pt-6">
                      {['yes', 'no'].map(v => (
                         <label key={v} className={`flex-1 py-8 text-center border-2 cursor-pointer transition-all ${rsvpForm.attending === v ? 'bg-weddingYellow text-weddingDark border-weddingYellow shadow-xl scale-105' : 'border-white/20 hover:border-white/40 bg-white/5'}`}>
                            <input type="radio" className="hidden" value={String(v)} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                         </label>
                      ))}
                   </div>
                   
                   <div className="border border-white/20 bg-white/5 p-10 group focus-within:border-weddingYellow transition-all">
                      <label className="block text-[9px] font-bold tracking-[0.5em] uppercase mb-8 text-weddingYellow/80">Wishes for the Couple</label>
                      <textarea value={rsvpForm.message} onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} placeholder="Write a message for our digital guestbook..." className="w-full bg-transparent border-none focus:outline-none min-h-[160px] text-xl font-serif italic text-white placeholder:text-white/20 resize-none" ></textarea>
                   </div>
                   
                   {submitError && <div className="text-red-300 text-center text-xs font-bold bg-red-900/40 py-6 border border-red-900/40">{String(submitError)}</div>}
                   
                   <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-8 font-bold uppercase tracking-[0.4em] text-xs shadow-xl disabled:opacity-50 hover:bg-white transition-colors">
                      {isSubmitting ? 'Processing...' : 'Confirm RSVP'}
                   </button>
                </form>
              )}
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-24 text-center bg-[#faf9f6] relative border-t border-gray-200 z-10">
         <div className="max-w-screen-2xl mx-auto px-6 relative">
           <p className="font-script font-bold text-6xl md:text-8xl mb-10 pr-2 drop-shadow-sm text-weddingDark">{String(details.groomName)} <span className="font-serif italic text-4xl md:text-5xl">&amp;</span> {String(details.brideName)}</p>
           <div className="w-20 h-px bg-weddingSage mx-auto mb-10 opacity-40"></div>
           <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.5em] text-gray-500 mb-16">{String(details.ceremonyDate)} • {String(details.weddingLocation)}</p>
           
           <div className="flex flex-col items-center gap-8 opacity-80 mb-20 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row justify-center gap-10 text-[10px] font-bold text-gray-600 uppercase tracking-widest bg-white/50 px-10 py-5 rounded-full border border-gray-200 shadow-sm">
                 <span className="flex items-center gap-3"><Phone size={14} className="text-weddingSage"/> {details.contactPhone}</span>
                 <span className="hidden md:block text-gray-300">|</span>
                 <span className="flex items-center gap-3"><Mail size={14} className="text-weddingSage"/> {details.contactEmail}</span>
              </div>
           </div>

           <button onClick={() => setShowAdminLogin(true)} className="px-10 py-4 text-[8px] uppercase tracking-[0.5em] text-gray-400 hover:text-weddingDark transition-all"><Lock className="w-3 h-3 inline mr-2 opacity-50"/> Staff Access</button>
         </div>
      </footer>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-[#faf9f6]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 text-weddingDark">
          <div className="max-w-md w-full text-center">
             <button onClick={() => setShowAdminLogin(false)} className="mb-12 hover:scale-110 transition-all"><X size={40} className="text-gray-400 hover:text-weddingDark" /></button>
             <h3 className="text-3xl font-serif mb-10 italic">Secure Access</h3>
             <form onSubmit={handleAdminLogin}>
                <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b border-weddingDark text-center py-4 mb-10 tracking-[1em] text-2xl focus:outline-none bg-transparent" placeholder="••••••••" />
                {adminError && <p className="text-red-500 text-[10px] font-bold mb-6 uppercase tracking-widest">{String(adminError)}</p>}
                <button className="w-full bg-weddingDark text-white py-4 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-black transition-colors">Login</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
