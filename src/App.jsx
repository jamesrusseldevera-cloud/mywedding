import React, { useState, useEffect, useRef } from 'react';
import { Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info, Github, Globe, Terminal, Cloud, AlertCircle } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

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
const appId = typeof __app_id !== 'undefined' ? __app_id : 'wedding-app-default';

// --- Decorative Components ---

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
  <div className="flex items-center justify-center gap-4 my-8 opacity-80 w-full">
    <div className="w-16 h-px bg-weddingSage"></div>
    <div className="w-3 h-3 rotate-45 bg-weddingAccent shadow-sm"></div>
    <div className="w-16 h-px bg-weddingSage"></div>
  </div>
);

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
    <div className={`bg-gray-100 flex items-center justify-center ${containerClass}`}>
      <ImageIcon className="w-8 h-8 opacity-30"/>
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
  weddingDate: "APRIL 10, 2026",
  weddingLocation: "Muntinlupa, Philippines",
  ourStory: "Love is patient, love is kind (1 Corinthians 13:4)—and their love proved to be brave, choosing each other every day in faith. What began as a quiet night at Ooma became a story God was already writing—told through shared meals from Jollibee to Din Tai Fung, sweet evenings at Amano, and journeys to Australia, Vigan, La Union, Baguio, and Thailand. In grand adventures and quiet Sundays at Mass, they discovered that home is not a place but a person, and that with God at the center, their love would not easily be broken. Two years later, they stand certain—ready to begin a forever rooted in faith, devotion, and a love that grows sweeter with time.",
  storyPhotoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
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
  groomsmen: "Christian Robert C. Pinoy\nJohn Paolo B. De Vera\nJan Gabriel Pinoy\nJohn Lester Selga\nLester Luis Ramirez\nMark Lester B. Biala\nLance Viendell G. Biala\nRon Carlo C. Biala",
  bridesmaids: "Angela Cherish C. Pinoy\nCarmela Ella\nNatasha Correos\nKaye Marie Abelo\nBea Michaela B. De Vera\nPrincess Jelian B. Almonte\nKristel Ann B. De Vera\nMylene B. De Vera",
  bibleBearer: "Kyler Timothy A. De Vera",
  ringBearer: "Dean Lukas A. De Vera",
  flowerGirls: "Amara Faith A. De Vera\nMarthina D. Hernandez\nAmare Faith Fresnoza\nMaree Margaret S. Dela Peña",
  ceremonyDate: "Friday, April 10th, 2026",
  ceremonyTime: "3:00 PM",
  ceremonyVenue: "Sacred Heart of Jesus Parish",
  ceremonyAddress: "Muntinlupa, Philippines",
  ceremonyPhotoUrl: "https://images.unsplash.com/photo-1548625361-ec85cb209210?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800",
  ceremonyMapUrl: "",
  receptionDate: "Friday, April 10th, 2026",
  receptionTime: "6:00 PM onwards",
  receptionVenue: "Main Ballroom, Acacia Hotel",
  receptionAddress: "Alabang, Muntinlupa",
  receptionPhotoUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&q=80&w=800",
  receptionMapUrl: "",
  dressCodeText: "Filipiniana or Formal Attire. We kindly request our guests to dress elegantly in shades of Sage Green, Pastel Yellow, Beige, or neutral light tones. Please avoid wearing bright neon colors or pure white.",
  dressCodeColors: "#B8C6A7, #FDFD96, #F5F5DC, #FAF9F6, #D2B48C, #E5E7D1",
  dressCodePhotoUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1516726855505-e5ed699fd49d?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1623086961453-33306db3645c?auto=format&fit=crop&q=80&w=800",
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
  const [editForm, setEditForm] = useState(DEFAULT_DETAILS);
  const [isSavingDetails, setIsSavingDetails] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [currentGbSlide, setCurrentGbSlide] = useState(0);
  const [gbVisualMode, setGbVisualMode] = useState('elegant');
  
  const fileInputRef = useRef(null);

  const ADMIN_PASSWORD = "Eternity&Leaves2026!";

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
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
            }
          }
        }
      }
    };

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@200;300;400;500;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Setup custom font face for Bodega Script
    const customFont = document.createElement('style');
    customFont.innerHTML = `
      @font-face {
        font-family: 'Bodega Script';
        src: local('Bodega Script'), local('BodegaScript');
        /* NOTE FOR DEPLOYMENT: Uncomment the line below and change the URL to where you save your font file */
        /* src: url('./BodegaScript.ttf') format('truetype'); */
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
        setDetails({ ...DEFAULT_DETAILS, ...mainDoc.data() });
        setEditForm({ ...DEFAULT_DETAILS, ...mainDoc.data() }); 
      }
    });
    const unsubscribeInvitees = onSnapshot(query(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees')), (snapshot) => {
      const inviteesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      inviteesData.sort((a, b) => b.timestamp - a.timestamp);
      setInvitees(inviteesData);
    });
    return () => { unsubscribeConfig(); unsubscribeInvitees(); };
  }, [user]);

  // --- RSVP logic ---
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
      setAdminError('');
    } else { setAdminError('Incorrect password'); }
  };

  // --- ADMIN: Guests Management ---
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
    } catch (error) { console.error(error); showToast("Error adding guest"); }
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
    } catch (error) {
      showToast("Failed to remove guest");
    }
  };

  // --- ADMIN: Bulk CSV Tools ---
  const handleDownloadCSV = () => {
    const headers = ['Name', 'Code', 'RSVP Status', 'Submitted Name', 'Message', 'Message Approved'];
    const csvRows = invitees.map(i => {
      const msg = i.message ? i.message.replace(/"/g, '""') : '';
      return `"${i.name || ''}","${i.code || ''}","${i.status || ''}","${i.submittedName || ''}","${msg}","${i.messageApproved ? 'Yes' : 'No'}"`;
    });
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wedding_guest_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Download started!");
  };

  const handleBulkUploadCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n');
      let addedCount = 0;
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        const cols = row.split(',');
        if (cols.length >= 2) {
          const name = cols[0].replace(/^"|"$/g, '').trim();
          const code = cols[1].replace(/^"|"$/g, '').trim().toUpperCase();
          if (name && code) {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees'), {
              name, code, status: 'Pending', submittedName: '', email: '', message: '', messageApproved: false, timestamp: Date.now()
            });
            addedCount++;
          }
        }
      }
      showToast(`Bulk upload complete: ${addedCount} guests added.`);
    };
    reader.readAsText(file);
    e.target.value = null; // reset input
  };

  // --- ADMIN: Content Management ---
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsSavingDetails(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_config', 'main'), editForm);
      showToast("Website Content Saved!");
    } catch (error) { 
      showToast("Failed to save changes."); 
    }
    setIsSavingDetails(false);
  };

  const Field = ({ label, name, type = "text", isTextArea = false }) => {
    const inputClasses = "w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-weddingSage focus:border-transparent transition-all text-sm bg-white/50";
    const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3";
    return (
      <div className="mb-6 w-full">
        <label className={labelClasses}>{label}</label>
        {isTextArea ? (
          <textarea value={editForm[name] || ''} onChange={e => setEditForm({...editForm, [name]: e.target.value})} className={inputClasses} rows="4" />
        ) : (
          <input type={type} value={editForm[name] || ''} onChange={e => setEditForm({...editForm, [name]: e.target.value})} className={inputClasses} />
        )}
      </div>
    );
  };

  // --- Derived Data ---
  const colorArray = (details.dressCodeColors || '').split(',').map(s => s.trim()).filter(Boolean);
  const principalArray = (details.entouragePrincipal || '').split('\n').map(s => s.trim()).filter(Boolean);
  const groomsmenArray = (details.groomsmen || '').split('\n').map(s => s.trim()).filter(Boolean);
  const bridesmaidsArray = (details.bridesmaids || '').split('\n').map(s => s.trim()).filter(Boolean);
  
  // New parsed arrays for extended entourage
  const candleArray = (details.candleSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const veilArray = (details.veilSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const cordArray = (details.cordSponsors || '').split('\n').map(s => s.trim()).filter(Boolean);
  const flowerGirlsArray = (details.flowerGirls || '').split('\n').map(s => s.trim()).filter(Boolean);

  const dbApprovedMessages = invitees.filter(i => i.message && i.messageApproved && i.submittedName);
  const displayMessages = dbApprovedMessages.length > 0 ? dbApprovedMessages : SAMPLE_MESSAGES;
  
  const MESSAGES_PER_SLIDE = 3;
  const gbSlides = [];
  for (let i = 0; i < displayMessages.length; i += MESSAGES_PER_SLIDE) {
    gbSlides.push(displayMessages.slice(i, i + MESSAGES_PER_SLIDE));
  }

  useEffect(() => {
    if (gbSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentGbSlide((prev) => (prev + 1) % gbSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gbSlides.length]);

  const PASTEL_MOTIF_COLORS = [
    'bg-[#E5E7D1]', 'bg-[#FAF9F6]', 'bg-[#F3E9DC]', 'bg-[#D1D9CF]', 'bg-[#FDFBF7]'
  ];

  const entouragePartners = Array.from({ 
    length: Math.max(groomsmenArray.length, bridesmaidsArray.length) 
  }).map((_, i) => ({
    groomSide: groomsmenArray[i] || '',
    brideSide: bridesmaidsArray[i] || ''
  }));

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
              <button onClick={() => setAdminTab('guests')} className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${adminTab === 'guests' ? 'bg-weddingSage text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-weddingSage'}`}>Guests Manager</button>
              <button onClick={() => setAdminTab('details')} className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${adminTab === 'details' ? 'bg-weddingSage text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-weddingSage'}`}>Website Content</button>
              <button onClick={() => setAdminTab('deploy')} className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${adminTab === 'deploy' ? 'bg-weddingDark text-white shadow-lg' : 'bg-white border border-gray-200 hover:border-weddingSage'}`}>Deployment</button>
              <button onClick={() => setIsAdminAuth(false)} className="px-6 py-3 bg-red-50 text-red-600 rounded-full text-[11px] font-bold uppercase tracking-widest border border-red-100 hover:bg-red-100">Exit Admin</button>
            </div>
          </div>

          {adminTab === 'guests' && (
            <div className="animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex gap-4 items-end flex-1 w-full">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Guest Name</label>
                    <input value={newGuestName} onChange={e=>setNewGuestName(e.target.value)} placeholder="e.g. John Doe" className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-weddingSage" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Invite Code</label>
                    <input value={newGuestCode} onChange={e=>setNewGuestCode(e.target.value)} placeholder="e.g. JD2026" className="w-full p-3 border border-gray-200 rounded-xl uppercase font-mono focus:outline-none focus:ring-2 focus:ring-weddingSage" />
                  </div>
                  <button onClick={handleAddGuest} className="bg-weddingDark text-white px-8 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black transition-colors">Add</button>
                </div>
                
                <div className="flex gap-4">
                  <input type="file" accept=".csv" ref={fileInputRef} onChange={handleBulkUploadCSV} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 shadow-sm"><Upload size={16} className="text-weddingSage"/> Bulk CSV</button>
                  <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 shadow-sm"><Download size={16} className="text-weddingSage"/> Export</button>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500">Guest Roster ({invitees.length})</h3>
                   <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{invitees.filter(i => i.status === 'Attending').length} Attending</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white text-[10px] uppercase tracking-widest text-gray-400 font-bold border-b border-gray-100">
                        <th className="p-5">Guest Information</th>
                        <th className="p-5">RSVP Status</th>
                        <th className="p-5">Guestbook Message</th>
                        <th className="p-5">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitees.map(i => (
                        <tr key={i.id} className="border-b border-gray-50 group hover:bg-gray-50/50 transition-colors">
                          <td className="p-5">
                            <div className="font-bold text-sm mb-1">{String(i.name)}</div>
                            <div className="text-[11px] bg-gray-100 inline-block px-2 py-1 rounded font-mono uppercase tracking-widest text-gray-500">{String(i.code)}</div>
                          </td>
                          <td className="p-5">
                            <span className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${i.status === 'Attending' ? 'bg-green-100 text-green-700' : i.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>{String(i.status)}</span>
                            {i.submittedName && i.submittedName !== i.name && <div className="text-[10px] mt-2 text-gray-400">RSVP'd as: {i.submittedName}</div>}
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
                            <button onClick={() => handleDeleteGuest(i.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Guest"><Trash2 className="w-5 h-5"/></button>
                          </td>
                        </tr>
                      ))}
                      {invitees.length === 0 && (
                        <tr><td colSpan="4" className="p-12 text-center text-gray-400 italic">No guests added yet. Add guests above or use Bulk CSV.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="space-y-12 animate-in fade-in duration-500">
              
              {/* Top Bar for Save */}
              <div className="sticky top-6 z-50 bg-white/80 backdrop-blur-xl p-4 rounded-full shadow-lg border border-white/20 flex justify-between items-center px-8">
                <span className="text-sm font-bold tracking-widest uppercase text-weddingSage flex items-center gap-2"><Edit2 size={16}/> Edit Mode Live</span>
                <button type="submit" disabled={isSavingDetails} className="bg-weddingYellow text-weddingDark px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-md hover:shadow-xl transition-all disabled:opacity-50">
                   {isSavingDetails ? 'Saving...' : 'Publish Changes'}
                </button>
              </div>

              {/* 1. General & Hero */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark flex items-center gap-3"><Heart className="text-weddingSage"/> General Information</h3>
                 <div className="grid md:grid-cols-2 gap-x-8">
                    <Field label="Groom's Name" name="groomName" />
                    <Field label="Bride's Name" name="brideName" />
                    <Field label="Wedding Date (Header Display)" name="weddingDate" />
                    <Field label="Wedding Location (Header Display)" name="weddingLocation" />
                    <Field label="RSVP Deadline Date" name="rsvpDeadline" />
                    <Field label="Contact Phone" name="contactPhone" />
                    <Field label="Contact Email" name="contactEmail" />
                 </div>
              </div>

              {/* 2. Our Story */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark flex items-center gap-3"><ImageIcon className="text-weddingSage"/> Our Story</h3>
                 <Field label="The Story Text" name="ourStory" isTextArea={true} />
                 <Field label="Story Photos (Comma separated URLs)" name="storyPhotoUrl" />
              </div>

              {/* 3. Parents & Entourage */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark flex items-center gap-3"><UserPlus className="text-weddingSage"/> Family & Entourage</h3>
                 <div className="grid md:grid-cols-2 gap-x-8">
                    <Field label="Groom's Parents (Line break for multiple)" name="groomParents" isTextArea={true} />
                    <Field label="Bride's Parents (Line break for multiple)" name="brideParents" isTextArea={true} />
                    <Field label="Principal Sponsors (Line break for multiple)" name="entouragePrincipal" isTextArea={true} />
                    <div className="space-y-6">
                       <Field label="Best Man" name="bestMan" />
                       <Field label="Maid of Honor" name="maidOfHonor" />
                    </div>
                    <Field label="Groomsmen (Line break for multiple)" name="groomsmen" isTextArea={true} />
                    <Field label="Bridesmaids (Line break for multiple)" name="bridesmaids" isTextArea={true} />
                    <Field label="Candle Sponsors (Line break for multiple)" name="candleSponsors" isTextArea={true} />
                    <Field label="Veil Sponsors (Line break for multiple)" name="veilSponsors" isTextArea={true} />
                    <Field label="Cord Sponsors (Line break for multiple)" name="cordSponsors" isTextArea={true} />
                    <div className="space-y-6">
                       <Field label="Bible Bearer" name="bibleBearer" />
                       <Field label="Ring Bearer" name="ringBearer" />
                    </div>
                    <Field label="Flower Girls (Line break for multiple)" name="flowerGirls" isTextArea={true} />
                 </div>
              </div>

              {/* 4. Venues */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark flex items-center gap-3"><LayoutGrid className="text-weddingSage"/> Venues & Schedule</h3>
                 <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-2">
                       <h4 className="font-bold text-xs uppercase tracking-widest text-weddingSage mb-4">Ceremony Details</h4>
                       <Field label="Date" name="ceremonyDate" />
                       <Field label="Time" name="ceremonyTime" />
                       <Field label="Venue Name" name="ceremonyVenue" />
                       <Field label="Address" name="ceremonyAddress" />
                       <Field label="Photo URLs (Comma separated)" name="ceremonyPhotoUrl" />
                       <Field label="Google Maps Embed URL" name="ceremonyMapUrl" />
                    </div>
                    <div className="space-y-2">
                       <h4 className="font-bold text-xs uppercase tracking-widest text-weddingSage mb-4">Reception Details</h4>
                       <Field label="Date" name="receptionDate" />
                       <Field label="Time" name="receptionTime" />
                       <Field label="Venue Name" name="receptionVenue" />
                       <Field label="Address" name="receptionAddress" />
                       <Field label="Photo URLs (Comma separated)" name="receptionPhotoUrl" />
                       <Field label="Google Maps Embed URL" name="receptionMapUrl" />
                    </div>
                 </div>
              </div>

              {/* 5. Style & Registry */}
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                 <h3 className="text-xl font-serif mb-8 border-b pb-4 text-weddingDark flex items-center gap-3"><Gift className="text-weddingSage"/> Style & Registry</h3>
                 <Field label="Dress Code Guidelines" name="dressCodeText" isTextArea={true} />
                 <Field label="Dress Code Palette Colors (Hex codes, comma separated)" name="dressCodeColors" />
                 <Field label="Dress Code Inspiration Photos (Comma separated URLs)" name="dressCodePhotoUrl" />
                 <Field label="Gift / Registry Message" name="giftText" isTextArea={true} />
              </div>
              
              <div className="flex justify-end pt-6">
                 <button type="submit" disabled={isSavingDetails} className="bg-weddingYellow text-weddingDark px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50">
                   {isSavingDetails ? 'Saving...' : 'Publish All Changes'}
                 </button>
              </div>
            </form>
          )}

          {adminTab === 'deploy' && (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-10 animate-in fade-in duration-500">
              <div className="flex items-center gap-6 mb-8">
                <div className="p-5 bg-weddingDark text-white rounded-3xl shadow-xl">
                  <Globe size={36} />
                </div>
                <div>
                  <h2 className="text-4xl font-serif">Go Live Checklist</h2>
                  <p className="text-gray-500 text-base mt-2">Follow these steps to host your invitation securely on GitHub and Vercel.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-200 space-y-6">
                  <h3 className="flex items-center gap-3 font-bold text-weddingDark uppercase tracking-widest text-sm">
                    <Terminal size={20} className="text-weddingSage"/> Phase 1: Local Setup
                  </h3>
                  <ol className="space-y-5 text-sm text-gray-600 list-decimal pl-5">
                    <li>Install <strong>Node.js</strong> from nodejs.org.</li>
                    <li>Open your computer's terminal and run: <br/><code className="bg-white border border-gray-200 block px-3 py-2 mt-2 rounded-lg font-mono text-xs text-pink-600">npm create vite@latest wedding-app -- --template react</code></li>
                    <li>Enter folder and install libraries: <br/><code className="bg-white border border-gray-200 block px-3 py-2 mt-2 rounded-lg font-mono text-xs text-pink-600">cd wedding-app && npm install lucide-react firebase tailwindcss postcss autoprefixer</code></li>
                    <li>Initialize Tailwind CSS: <br/><code className="bg-white border border-gray-200 block px-3 py-2 mt-2 rounded-lg font-mono text-xs text-pink-600">npx tailwindcss init -p</code></li>
                  </ol>
                </div>

                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-200 space-y-6">
                  <h3 className="flex items-center gap-3 font-bold text-weddingDark uppercase tracking-widest text-sm">
                    <Github size={20} className="text-weddingSage"/> Phase 2: GitHub
                  </h3>
                  <ol className="space-y-5 text-sm text-gray-600 list-decimal pl-5">
                    <li>Create a free account and new repository on <strong>GitHub.com</strong>.</li>
                    <li>Copy all the code from this current window into your local <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> file.</li>
                    <li>In your terminal, run standard git commands: <br/><code className="bg-white border border-gray-200 block px-3 py-2 mt-2 rounded-lg font-mono text-xs text-pink-600">git init<br/>git add .<br/>git commit -m "Wedding App Ready"<br/>git remote add origin [YOUR_REPO_URL]<br/>git push -u origin main</code></li>
                  </ol>
                </div>

                <div className="bg-weddingDark text-white p-10 rounded-[2.5rem] shadow-xl space-y-6 md:col-span-2 relative overflow-hidden">
                  <Cloud className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
                  <h3 className="flex items-center gap-3 font-bold uppercase tracking-widest text-sm text-weddingYellow">
                    <Cloud size={20} /> Phase 3: Vercel Deployment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-10 relative z-10">
                    <ul className="space-y-4 text-base text-gray-300 list-disc pl-5">
                      <li>Create a free account at <strong>Vercel.com</strong>.</li>
                      <li>Click <strong>"Add New Project"</strong>.</li>
                      <li>Import your newly created GitHub Repository.</li>
                      <li>Leave all default settings (Vercel auto-detects Vite) and click <strong>Deploy</strong>.</li>
                    </ul>
                    <div className="bg-white/10 p-8 rounded-3xl border border-white/20 backdrop-blur-md">
                      <p className="text-sm font-bold text-weddingYellow mb-3 uppercase tracking-widest flex items-center gap-2"><AlertCircle size={16}/> Pro Tip</p>
                      <p className="text-sm text-white/80 leading-relaxed mb-4">Once deployed, Vercel gives you a free secure link (e.g. <span className="text-weddingYellow">your-wedding.vercel.app</span>).</p>
                      <p className="text-sm text-white/80 leading-relaxed">If you want a custom name like <span className="text-weddingYellow">jhomelandbernadette.com</span>, you can purchase the domain directly inside your Vercel project settings under "Domains".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- MAIN PUBLIC UI ---
  return (
    <div className="min-h-screen bg-[#faf9f6] text-weddingDark flex flex-col relative w-full overflow-x-hidden" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      
      {/* Expanded Background Accents */}
      <div className="fixed top-0 right-0 w-[50vw] h-[50vw] bg-weddingYellow/5 rounded-full blur-[150px] -z-30 transform translate-x-1/4 -translate-y-1/4"></div>
      <div className="fixed bottom-0 left-0 w-[40vw] h-[40vw] bg-weddingSage/5 rounded-full blur-[150px] -z-30 transform -translate-x-1/4 translate-y-1/4"></div>
      
      {/* Floating Action Button */}
      <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="fixed right-6 bottom-6 md:right-10 md:bottom-10 z-50 bg-weddingYellow text-weddingDark p-4 md:p-5 rounded-full shadow-2xl border border-white/50 hover:scale-110 active:scale-95 transition-all group ring-1 ring-weddingAccent/20">
        <Mail className="w-6 h-6 md:w-7 md:h-7" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-weddingDark text-white px-4 py-2 rounded-lg shadow-xl text-[11px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">RSVP Now</span>
      </button>

      {/* Navigation - Wide & Centered */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-6 bg-gradient-to-b from-[#faf9f6]/95 to-transparent backdrop-blur-[4px]">
        <div className="max-w-screen-2xl mx-auto px-6 md:px-10 flex flex-wrap justify-center gap-6 md:gap-14 text-[9px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">
          {['Home', 'Story', 'Entourage', 'Venues', 'Guestbook', 'Details', 'RSVP'].map(t => (
            <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className={`hover:text-weddingDark transition-all hover:tracking-[0.4em] border-b-2 ${t === 'RSVP' ? 'text-weddingAccent border-weddingYellow' : 'border-transparent'}`}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="flex-grow w-full">
        {/* HERO SECTION - Full Viewport */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-10 relative w-full overflow-hidden">
          <OrganicLeaf className="absolute top-1/4 right-[10%] w-48 h-48 text-weddingSage opacity-10 rotate-45" />
          <OrganicLeaf className="absolute bottom-1/4 left-[10%] w-40 h-40 text-weddingSage opacity-10 -rotate-45" />
          <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] text-weddingSage opacity-[0.06] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
          
          <p className="text-weddingAccent tracking-[0.6em] uppercase text-xs md:text-sm mb-8 mt-10 font-bold">Join us to celebrate</p>
          <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-script font-bold leading-[0.9] mb-8 drop-shadow-lg pr-4">
            {String(details.groomName)} <br/><span className="text-5xl md:text-7xl font-serif italic text-weddingAccent my-4 block">&amp;</span> {String(details.brideName)}
          </h1>
          <LineAccent />
          <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="mb-10 px-16 py-5 bg-weddingYellow text-weddingDark text-xs font-bold uppercase tracking-[0.5em] rounded-full shadow-[0_15px_40px_rgba(255,255,143,0.3)] border border-white hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all">RSVP Now</button>
          <p className="text-2xl md:text-4xl tracking-[0.3em] font-light text-gray-800 mb-3 uppercase">{String(details.weddingDate)}</p>
          <p className="text-[10px] md:text-xs tracking-[0.6em] text-gray-500 font-bold uppercase">{String(details.weddingLocation)}</p>
        </section>

        {/* STORY SECTION */}
        <section id="story" className="py-20 md:py-28 px-6 md:px-10 max-w-screen-2xl mx-auto relative">
          <OrganicLeaf className="absolute -left-20 top-1/2 -translate-y-1/2 w-[35vw] h-[35vw] text-weddingSage opacity-[0.05] -z-10 rotate-[20deg]" />
          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            <div className="w-full lg:w-1/2 aspect-[4/5] rounded-t-[400px] border-[10px] border-white/60 shadow-xl p-3 relative bg-white/40 ring-1 ring-gray-100 flex-shrink-0 max-w-lg mx-auto">
              <ImageSlider photoString={details.storyPhotoUrl} altText="Story" containerClass="absolute inset-3" imageClass="rounded-t-[380px] rounded-b-xl" />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left pt-6">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.6em] text-weddingAccent mb-8 uppercase">The Beginning</h2>
              <div className="relative">
                <span className="absolute -left-6 -top-10 md:-left-12 md:-top-14 text-[6rem] md:text-[8rem] text-weddingYellow opacity-30 font-serif leading-none">"</span>
                <p className="text-lg md:text-xl xl:text-2xl font-serif leading-[1.8] text-gray-800 relative z-10 text-justify md:text-left px-2 md:px-0">
                  {String(details.ourStory)}
                </p>
              </div>
              <OrganicLeaf className="w-24 h-24 text-weddingSage opacity-20 mt-12 mx-auto lg:ml-0" />
            </div>
          </div>
        </section>

        {/* ENTOURAGE SECTION */}
        <section id="entourage" className="py-20 md:py-28 px-6 md:px-10 text-center relative overflow-hidden w-full">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-center items-center gap-8 md:gap-14 mb-20">
              <OrganicLeaf className="w-16 h-16 md:w-24 md:h-24 text-weddingSage opacity-30 rotate-12 hidden md:block" />
              <h2 className="text-5xl md:text-8xl font-serif text-weddingDark drop-shadow-sm">The Entourage</h2>
              <OrganicLeaf className="w-16 h-16 md:w-24 md:h-24 text-weddingSage opacity-30 -rotate-12 hidden md:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-20 max-w-screen-xl mx-auto">
              <div className="p-10 md:p-14 bg-white/40 rounded-[3rem] shadow-sm border border-white/60 backdrop-blur-sm transition-all hover:bg-white/60">
                <h3 className="text-[10px] md:text-xs font-bold text-weddingAccent tracking-[0.5em] uppercase mb-8">Parents of the Groom</h3>
                <p className="text-2xl md:text-4xl font-serif whitespace-pre-line leading-relaxed text-gray-800">{String(details.groomParents)}</p>
              </div>
              <div className="p-10 md:p-14 bg-white/40 rounded-[3rem] shadow-sm border border-white/60 backdrop-blur-sm transition-all hover:bg-white/60">
                <h3 className="text-[10px] md:text-xs font-bold text-weddingAccent tracking-[0.5em] uppercase mb-8">Parents of the Bride</h3>
                <p className="text-2xl md:text-4xl font-serif whitespace-pre-line leading-relaxed text-gray-800">{String(details.brideParents)}</p>
              </div>
            </div>

            <LineAccent />

            {/* Principal Sponsors */}
            <div className="max-w-screen-xl mx-auto my-20 p-10 md:p-20 bg-white/60 rounded-[4rem] shadow-xl border border-white/80 ring-1 ring-gray-100/50 flex flex-col items-center relative backdrop-blur-sm">
               <OrganicLeaf className="absolute -top-10 -left-10 w-32 h-32 text-weddingSage opacity-20" />
               <OrganicLeaf className="absolute -bottom-10 -right-10 w-32 h-32 text-weddingSage opacity-20 rotate-180" />
               
               <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.7em] uppercase mb-16 underline decoration-weddingYellow decoration-4 md:decoration-8 underline-offset-[16px]">Principal Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 text-xl md:text-3xl font-serif italic text-gray-800 w-full relative">
                 <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                 {principalArray.map((n, i) => (
                   <div key={i} className={`flex items-center w-full py-4 justify-center ${i % 2 === 0 ? "md:justify-end md:pr-16" : "md:justify-start md:pl-16"}`}>
                     {String(n)}
                   </div>
                 ))}
               </div>
            </div>

            {/* Best Man & Maid of Honor */}
            <div className="max-w-screen-xl mx-auto flex flex-col items-center w-full mb-16">
              <div className="grid grid-cols-2 gap-x-0 w-full items-center border-t border-weddingSage/20 py-16 relative">
                <div className="absolute left-1/2 top-8 bottom-8 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                <div className="text-right pr-6 md:pr-16 flex flex-col items-end flex-1 overflow-hidden">
                  <h4 className="text-[10px] md:text-xs font-bold text-weddingAccent uppercase tracking-[0.6em] mb-6">Best Man</h4>
                  <p className="text-xl md:text-4xl font-serif text-weddingDark">{String(details.bestMan)}</p>
                </div>
                <div className="text-left pl-6 md:pl-16 flex flex-col items-start flex-1 overflow-hidden">
                  <h4 className="text-[10px] md:text-xs font-bold text-weddingAccent uppercase tracking-[0.6em] mb-6">Maid of Honor</h4>
                  <p className="text-xl md:text-4xl font-serif text-weddingDark">{String(details.maidOfHonor)}</p>
                </div>
              </div>
            </div>

            {/* Groomsmen & Bridesmaids List */}
            <div className="max-w-screen-xl mx-auto text-gray-800 flex flex-col items-center w-full mb-24">
               <div className="grid grid-cols-2 gap-x-0 mb-12 pb-8 border-b border-weddingAccent/20 w-full relative">
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                 <div className="text-right pr-6 md:pr-16 text-[10px] md:text-xs font-bold text-weddingAccent uppercase tracking-[0.6em]">Groomsmen</div>
                 <div className="text-left pl-6 md:pl-16 text-[10px] md:text-xs font-bold text-weddingAccent uppercase tracking-[0.6em]">Bridesmaids</div>
               </div>
               {entouragePartners.map((partner, i) => (
                 <div key={i} className="grid grid-cols-2 gap-x-0 mb-8 group w-full items-center relative">
                   <div className="absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/20 -translate-x-1/2"></div>
                   <div className="text-right pr-6 md:pr-16 transition-all group-hover:text-weddingAccent overflow-hidden">
                      <p className="text-lg md:text-2xl font-serif tracking-wide">{String(partner.groomSide)}</p>
                   </div>
                   <div className="text-left pl-6 md:pl-16 transition-all group-hover:text-weddingAccent overflow-hidden">
                      <p className="text-lg md:text-2xl font-serif tracking-wide">{String(partner.brideSide)}</p>
                   </div>
                 </div>
               ))}
            </div>

            <LineAccent />

            {/* Secondary Sponsors Grid */}
            <div className="max-w-screen-xl mx-auto my-24">
               <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.7em] uppercase mb-16 text-center">Secondary Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                  <div className="bg-white/40 p-8 md:p-10 rounded-[3rem] shadow-sm border border-white/60">
                     <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-weddingAccent mb-6 border-b border-weddingSage/20 pb-4">Candle</h4>
                     {candleArray.map((n, i) => <p key={i} className="text-xl md:text-2xl font-serif mb-3 text-gray-800">{n}</p>)}
                  </div>
                  <div className="bg-white/40 p-8 md:p-10 rounded-[3rem] shadow-sm border border-white/60">
                     <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-weddingAccent mb-6 border-b border-weddingSage/20 pb-4">Veil</h4>
                     {veilArray.map((n, i) => <p key={i} className="text-xl md:text-2xl font-serif mb-3 text-gray-800">{n}</p>)}
                  </div>
                  <div className="bg-white/40 p-8 md:p-10 rounded-[3rem] shadow-sm border border-white/60">
                     <h4 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.5em] text-weddingAccent mb-6 border-b border-weddingSage/20 pb-4">Cord</h4>
                     {cordArray.map((n, i) => <p key={i} className="text-xl md:text-2xl font-serif mb-3 text-gray-800">{n}</p>)}
                  </div>
               </div>
            </div>

            {/* Little Entourage (Bearers & Flower Girls) */}
            <div className="max-w-screen-lg mx-auto bg-weddingSage/10 p-10 md:p-16 rounded-[4rem] border border-weddingSage/20 relative">
               <OrganicLeaf className="absolute -top-8 -right-8 w-24 h-24 text-weddingSage opacity-20" />
               <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.7em] uppercase mb-12 text-center">Little Entourage</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-center">
                  <div>
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-4">Bible Bearer</h4>
                     <p className="text-2xl md:text-3xl font-serif text-weddingDark">{String(details.bibleBearer)}</p>
                  </div>
                  <div>
                     <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-4">Ring Bearer</h4>
                     <p className="text-2xl md:text-3xl font-serif text-weddingDark">{String(details.ringBearer)}</p>
                  </div>
               </div>
               <div className="mt-12 md:mt-16 pt-12 md:pt-16 border-t border-weddingSage/20">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500 mb-8 text-center">Flower Girls</h4>
                  <div className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6">
                     {flowerGirlsArray.map((n, i) => (
                        <p key={i} className="text-xl md:text-2xl font-serif text-weddingDark">{n}</p>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        </section>

        {/* VENUES SECTION */}
        <section id="venues" className="py-20 md:py-28 px-6 md:px-10 relative">
           <div className="max-w-screen-2xl mx-auto">
             <h2 className="text-xs md:text-sm font-bold tracking-[0.7em] text-center text-weddingAccent uppercase mb-20 w-full">When &amp; Where</h2>
             
             {/* Ceremony - Expanded Layout */}
             <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24 lg:mb-32 relative">
                <div className="lg:col-span-7 aspect-[16/10] rounded-t-[300px] border-[10px] md:border-[15px] border-white/80 p-3 bg-white/50 shadow-2xl overflow-hidden relative ring-1 ring-gray-100/50 backdrop-blur-sm">
                   <OrganicLeaf className="absolute -top-6 -left-6 w-20 h-20 text-weddingSage opacity-40 z-20" />
                   <ImageSlider photoString={details.ceremonyPhotoUrl} altText="Ceremony" containerClass="absolute inset-3" imageClass="rounded-t-[280px] rounded-b-2xl" />
                </div>
                <div className="lg:col-span-5 p-6 md:p-10 lg:p-16 text-center lg:text-left">
                   <h3 className="text-5xl md:text-7xl font-serif mb-8 text-weddingDark">The Ceremony</h3>
                   <div className="w-20 h-1 md:h-2 bg-weddingAccent mb-10 mx-auto lg:mx-0 shadow-sm opacity-80"></div>
                   <p className="text-gray-800 font-bold tracking-[0.4em] md:tracking-[0.5em] text-xs md:text-sm uppercase mb-6 leading-loose">{String(details.ceremonyDate)} <br/> {String(details.ceremonyTime)}</p>
                   <p className="text-3xl md:text-5xl font-serif text-weddingAccent mb-10 italic leading-snug">{String(details.ceremonyVenue)}</p>
                   <p className="text-xs md:text-sm tracking-widest uppercase text-gray-500">{String(details.ceremonyAddress)}</p>
                </div>
             </div>

             {/* Reception - Expanded Reversed Row */}
             <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 p-6 md:p-10 lg:p-16 text-center lg:text-right">
                   <h3 className="text-5xl md:text-7xl font-serif mb-8 text-weddingDark">The Reception</h3>
                   <div className="w-20 h-1 md:h-2 bg-weddingAccent mb-10 mx-auto lg:ml-auto shadow-sm opacity-80"></div>
                   <p className="text-gray-800 font-bold tracking-[0.4em] md:tracking-[0.5em] text-xs md:text-sm uppercase mb-6 leading-loose">{String(details.receptionDate)} <br/> {String(details.receptionTime)}</p>
                   <p className="text-3xl md:text-5xl font-serif text-weddingAccent mb-10 italic leading-snug">{String(details.receptionVenue)}</p>
                   <p className="text-xs md:text-sm tracking-widest uppercase text-gray-500">{String(details.receptionAddress)}</p>
                </div>
                <div className="lg:col-span-7 order-1 lg:order-2 aspect-[16/10] rounded-t-[300px] border-[10px] md:border-[15px] border-white/80 p-3 bg-white/50 shadow-2xl overflow-hidden relative ring-1 ring-gray-100/50 backdrop-blur-sm">
                   <OrganicLeaf className="absolute -top-6 -right-6 w-20 h-20 text-weddingSage opacity-40 z-20" />
                   <ImageSlider photoString={details.receptionPhotoUrl} altText="Reception" containerClass="absolute inset-3" imageClass="rounded-t-[280px] rounded-b-2xl" />
                </div>
             </div>
           </div>
        </section>

        {/* GUESTBOOK SECTION */}
        <section id="guestbook" className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden bg-weddingSage/5">
          <OrganicLeaf className="absolute -top-20 -right-20 w-[40vw] h-[40vw] text-weddingSage opacity-[0.06] rotate-[60deg]" />
          <div className="max-w-screen-2xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.6em] text-weddingAccent uppercase mb-6">Wishes &amp; Love</h2>
              <h3 className="text-5xl md:text-8xl font-serif text-weddingDark mb-12">Our Guestbook</h3>
              <div className="flex justify-center items-center gap-4 md:gap-8 mb-16">
                <button onClick={() => setGbVisualMode('elegant')} className={`flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 rounded-full border-2 transition-all ${gbVisualMode === 'elegant' ? 'bg-weddingDark text-white border-weddingDark shadow-xl scale-105' : 'bg-white/60 text-weddingDark border-gray-200 hover:border-weddingSage backdrop-blur-sm'}`}><LayoutGrid size={18} className="hidden md:block" /> <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest">Elegant Cards</span></button>
                <button onClick={() => setGbVisualMode('sticky')} className={`flex items-center gap-3 px-6 md:px-10 py-3 md:py-4 rounded-full border-2 transition-all ${gbVisualMode === 'sticky' ? 'bg-weddingDark text-white border-weddingDark shadow-xl scale-105' : 'bg-white/60 text-weddingDark border-gray-200 hover:border-weddingSage backdrop-blur-sm'}`}><StickyNote size={18} className="hidden md:block" /> <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest">Sticky Notes</span></button>
              </div>
            </div>
            <div className="relative min-h-[500px] md:min-h-[600px] px-2 md:px-6">
              {gbSlides.length > 0 && gbSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className={`absolute inset-0 grid md:grid-cols-3 gap-10 md:gap-16 transition-all duration-[1200ms] ease-out transform ${slideIdx === currentGbSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95 pointer-events-none'}`}>
                  {slide.map((m, i) => (
                    <div key={m.id} className={`${PASTEL_MOTIF_COLORS[i % PASTEL_MOTIF_COLORS.length]} p-10 xl:p-16 shadow-2xl relative transition-all duration-700 flex flex-col justify-between ${gbVisualMode === 'elegant' ? 'rounded-[3rem] border border-white/60 hover:-rotate-1' : `rounded-lg border-t-4 border-weddingSage/30 transform ${i % 2 === 0 ? 'rotate-2 md:rotate-3' : '-rotate-2 md:-rotate-3'} hover:rotate-0 hover:scale-105 shadow-3xl`}`}>
                      {gbVisualMode === 'sticky' && <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 shadow-sm border border-white/60 z-20 backdrop-blur-sm"></div>}
                      <div className="relative">
                        <MessageSquareHeart className="w-10 h-10 text-weddingAccent/20 mb-8" />
                        <p className="text-xl md:text-2xl xl:text-3xl font-serif italic leading-relaxed text-gray-800">"{String(m.message)}"</p>
                      </div>
                      <div className={`text-right text-[11px] md:text-[13px] font-bold uppercase tracking-[0.4em] text-gray-500 border-t border-gray-200/30 mt-10 pt-6`}>- {String(m.submittedName)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {gbSlides.length > 1 && (
              <div className="flex justify-center gap-4 mt-16 md:mt-20">
                {gbSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentGbSlide(i)} className={`h-2 rounded-full transition-all duration-500 ${i === currentGbSlide ? 'bg-weddingAccent w-16 md:w-20' : 'bg-gray-300 w-4 md:w-6'}`}></button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DETAILS & DRESS CODE SECTION */}
        <section id="details" className="py-20 md:py-28 px-6 md:px-10 relative overflow-hidden">
           <div className="max-w-screen-2xl mx-auto flex flex-col gap-24 md:gap-32 relative">
              <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center text-weddingDark">
                <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
                   <h3 className="text-5xl md:text-7xl font-serif mb-8 text-center lg:text-left">Dress Code</h3>
                   <div className="w-24 h-2 bg-weddingAccent mb-10 shadow-sm mx-auto lg:mx-0 opacity-80"></div>
                   <p className="text-lg md:text-xl xl:text-2xl mb-12 leading-relaxed font-medium text-gray-700">{String(details.dressCodeText)}</p>
                   <div className="flex gap-4 md:gap-6 flex-wrap justify-center lg:justify-start">
                      {colorArray.map((c, i) => (
                        <div key={i} className="group relative">
                          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-white shadow-xl transition-transform group-hover:scale-110 ring-1 ring-gray-100/50" style={{ backgroundColor: String(c) }}></div>
                          <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[9px] md:text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10 border border-gray-100 uppercase tracking-widest text-gray-600">{String(c)}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex-1 order-1 lg:order-2 flex flex-col gap-10 relative w-full">
                  <OrganicLeaf className="absolute -top-16 -right-16 w-64 h-64 text-weddingSage opacity-[0.15] -z-10 animate-spin-slow" />
                  <h4 className="text-[10px] md:text-[12px] uppercase font-bold tracking-[0.5em] text-weddingAccent text-center lg:text-left">Style Inspiration</h4>
                  <div className="grid grid-cols-2 gap-6 md:gap-10">
                    {String(details.dressCodePhotoUrl).split(',').map((url, idx) => (
                      <div key={idx} className={`rounded-[2rem] overflow-hidden border-4 md:border-8 border-white/60 shadow-2xl aspect-[4/5] ${idx === 2 ? 'col-span-2 aspect-[18/9]' : ''}`}>
                        <img src={url.trim()} alt="Style inspiration" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gift Protocol */}
              <div className="bg-white/40 p-12 md:p-24 border border-white/60 rounded-[4rem] text-center shadow-2xl relative ring-1 ring-gray-100/50 max-w-screen-xl mx-auto w-full backdrop-blur-sm">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-weddingYellow p-6 md:p-8 rounded-full shadow-2xl border-[6px] md:border-[10px] border-[#faf9f6] z-50">
                    <Gift className="w-10 h-10 md:w-14 md:h-14 text-weddingDark" />
                 </div>
                 <HandpaintedFlower className="absolute -bottom-16 -left-16 w-64 h-64 text-weddingSage opacity-10" />
                 <OrganicLeaf className="absolute top-10 right-10 w-24 h-24 text-weddingSage opacity-15" />
                 <h3 className="text-4xl md:text-6xl font-serif mb-10 italic mt-6 text-weddingDark">Wedding Gift</h3>
                 <p className="text-gray-700 font-serif text-xl md:text-3xl leading-relaxed italic max-w-3xl mx-auto px-4">"{String(details.giftText)}"</p>
              </div>
           </div>
        </section>

        {/* RSVP SECTION */}
        <section id="rsvp" className="py-24 md:py-32 px-6 md:px-10 bg-weddingDark text-white relative shadow-[inset_0_20px_100px_rgba(0,0,0,0.4)] w-full">
           <div className="absolute top-0 left-1/4 bottom-0 w-px bg-white/5"></div>
           <div className="absolute top-0 right-1/4 bottom-0 w-px bg-white/5"></div>
           <OrganicLeaf className="absolute bottom-[5%] right-[5%] w-[30vw] h-[30vw] text-weddingSage opacity-[0.05] pointer-events-none" />
           <OrganicLeaf className="absolute top-[5%] left-[5%] w-[20vw] h-[20vw] text-weddingSage opacity-[0.05] pointer-events-none -rotate-[30deg]" />
           
           <div className="max-w-screen-lg mx-auto relative z-10">
              <div className="text-center mb-24">
                 <h2 className="text-xs md:text-sm font-bold tracking-[0.7em] uppercase text-weddingYellow mb-8 w-full">RSVP</h2>
                 <h3 className="text-6xl md:text-8xl font-serif mb-10 drop-shadow-2xl w-full">We hope to see you</h3>
                 <div className="w-20 h-px bg-white/30 mx-auto mb-10"></div>
                 <p className="text-[10px] md:text-[12px] uppercase font-bold tracking-[0.5em] text-weddingYellow border border-weddingYellow/30 px-10 py-4 rounded-full inline-block">Please Reply by {String(details.rsvpDeadline)}</p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-24 bg-white/5 rounded-[4rem] border border-white/10 shadow-2xl backdrop-blur-xl mx-4">
                   <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-weddingYellow mx-auto mb-10 animate-bounce" />
                   <p className="text-3xl md:text-5xl font-serif italic mb-12">We can't wait to celebrate!</p>
                   <button onClick={() => setSubmitSuccess(false)} className="text-[11px] md:text-[13px] uppercase tracking-[0.5em] font-bold bg-weddingYellow text-weddingDark px-10 py-5 rounded-full hover:opacity-90 transition-all shadow-xl">Change my RSVP</button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-12 md:space-y-16">
                   <div className="bg-weddingSage p-10 md:p-14 rounded-[3rem] shadow-2xl group focus-within:ring-8 focus-within:ring-weddingYellow/20 transition-all">
                      <label className="block text-[11px] md:text-[13px] font-bold tracking-[0.6em] uppercase mb-8 text-weddingDark text-center">Your Invitation Code</label>
                      <input 
                        required
                        value={rsvpForm.enteredCode} 
                        onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} 
                        className="w-full bg-transparent border-b-2 border-weddingDark/30 py-4 md:py-6 focus:outline-none focus:border-weddingDark text-center uppercase tracking-[0.8em] md:tracking-[1em] text-4xl md:text-6xl font-serif text-weddingDark placeholder:text-weddingDark/20 transition-all" 
                        placeholder="----" 
                      />
                      <p className="text-[10px] md:text-[11px] text-center text-weddingDark/60 mt-8 tracking-[0.3em] italic uppercase font-bold">Secure code required from your physical invite</p>
                   </div>
                   
                   <div className="bg-weddingSage p-10 md:p-14 rounded-[3rem] shadow-2xl group focus-within:ring-8 focus-within:ring-weddingYellow/20 transition-all">
                      <label className="block text-[11px] md:text-[13px] font-bold tracking-[0.6em] uppercase mb-8 text-weddingDark text-center">Guest Name</label>
                      <input 
                        required 
                        value={rsvpForm.name} 
                        onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} 
                        className="w-full bg-transparent border-b-2 border-weddingDark/20 py-4 md:py-6 focus:outline-none focus:border-weddingDark transition-all placeholder:text-weddingDark/30 font-medium text-center text-2xl md:text-4xl font-serif italic" 
                        placeholder="Type Your Full Name" 
                      />
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                      {['yes', 'no'].map(v => (
                         <label key={v} className={`flex-1 py-8 text-center border-2 rounded-[2.5rem] cursor-pointer transition-all ${rsvpForm.attending === v ? 'bg-weddingYellow text-weddingDark border-weddingYellow shadow-[0_20px_50px_rgba(255,255,143,0.3)] scale-105' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}`}>
                            <input type="radio" className="hidden" value={String(v)} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                            <span className="text-sm font-bold uppercase tracking-[0.4em]">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                         </label>
                      ))}
                   </div>
                   
                   <div className="bg-weddingSage rounded-[3rem] shadow-inner p-8 md:p-12">
                      <label className="block text-[11px] md:text-[13px] font-bold tracking-[0.6em] uppercase mb-6 text-weddingDark text-center">Message for the Couple</label>
                      <textarea 
                        value={rsvpForm.message} 
                        onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} 
                        placeholder="Write your wishes for our guestbook here..." 
                        className="w-full bg-transparent border-t border-weddingDark/10 pt-6 focus:outline-none transition-all placeholder:text-weddingDark/40 min-h-[160px] md:min-h-[200px] text-xl md:text-2xl font-serif italic text-weddingDark leading-relaxed" 
                      ></textarea>
                   </div>
                   
                   {submitError && <div className="text-red-300 text-center text-sm font-bold bg-red-900/40 py-4 rounded-2xl border border-red-900/60 w-full">{String(submitError)}</div>}
                   
                   <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-8 rounded-[3rem] font-bold uppercase tracking-[0.5em] text-sm shadow-[0_20px_50px_rgba(255,255,143,0.3)] hover:shadow-[0_30px_80px_rgba(255,255,143,0.4)] hover:-translate-y-2 active:translate-y-0 transition-all disabled:opacity-50">
                      {isSubmitting ? 'Processing...' : 'Confirm My Attendance'}
                   </button>
                </form>
              )}
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-24 text-center bg-[#faf9f6] relative overflow-hidden border-t border-gray-100/50 w-full text-weddingDark">
         <div className="max-w-screen-2xl mx-auto relative px-6 md:px-10">
           <OrganicLeaf className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 text-weddingSage opacity-10 pointer-events-none" />
           <OrganicLeaf className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 text-weddingSage opacity-10 pointer-events-none rotate-180" />
           
           <p className="font-script font-bold text-5xl md:text-7xl mb-8 drop-shadow-sm pr-2 md:pr-4">{String(details.groomName)} <span className="font-serif italic text-4xl md:text-5xl">&amp;</span> {String(details.brideName)}</p>
           <div className="w-24 h-px bg-weddingSage mx-auto mb-10 opacity-60"></div>
           <p className="text-[10px] md:text-[12px] uppercase font-bold tracking-[0.8em] text-gray-400 mb-16">{String(details.ceremonyDate)} • {String(details.ceremonyAddress)}</p>
           
           <div className="flex flex-col items-center gap-8 opacity-80 mb-20 bg-white/40 backdrop-blur-sm py-12 rounded-[3rem] max-w-3xl mx-auto shadow-sm border border-white/60">
              <p className="text-[9px] md:text-[10px] uppercase font-bold tracking-[0.6em] text-gray-500 mb-2">For Concerns & Inquiries</p>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 text-[12px] md:text-[13px] font-bold text-gray-700">
                 <span className="flex items-center gap-3 transition-colors hover:text-weddingAccent"><Phone size={16} className="text-weddingAccent"/> {details.contactPhone}</span>
                 <span className="flex items-center gap-3 transition-colors hover:text-weddingAccent"><Mail size={16} className="text-weddingAccent"/> {details.contactEmail}</span>
              </div>
           </div>

           <button onClick={() => setShowAdminLogin(true)} className="px-10 py-4 border border-gray-200 rounded-full text-[9px] uppercase tracking-[0.6em] text-gray-400 hover:text-weddingDark hover:border-weddingDark transition-all bg-white/40 backdrop-blur-sm shadow-sm hover:shadow-md"><Lock className="w-4 h-4 inline mr-3 opacity-50"/> Staff Access</button>
         </div>
      </footer>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-6 text-weddingDark">
          <div className="max-w-xl w-full text-center">
             <button onClick={() => setShowAdminLogin(false)} className="mb-16 hover:rotate-90 transition-all hover:scale-110"><X size={48} className="text-gray-300 hover:text-weddingDark" /></button>
             <h3 className="text-4xl md:text-5xl font-serif mb-12 italic">Secure Access</h3>
             <form onSubmit={handleAdminLogin}>
                <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b-2 border-weddingDark text-center py-6 mb-12 tracking-[1em] text-3xl md:text-4xl focus:outline-none bg-transparent placeholder:opacity-10" placeholder="••••••••" />
                {adminError && <p className="text-red-500 text-xs font-bold mb-8 w-full text-center uppercase tracking-widest">{String(adminError)}</p>}
                <button className="w-full bg-weddingDark text-white py-6 rounded-[2rem] font-bold uppercase tracking-[0.5em] text-[10px] md:text-xs shadow-2xl hover:bg-black transition-all hover:-translate-y-1">Verify Credentials</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}