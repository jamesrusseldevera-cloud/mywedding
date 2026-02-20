import React, { useState, useEffect, useRef } from 'react';
import { Heart, Lock, CheckCircle, X, Gift, Save, Image as ImageIcon, KeyRound, UserPlus, Trash2, Upload, Download, FileSpreadsheet, BarChart, Phone, Mail, Edit2, Check, MessageSquareHeart, ChevronLeft, ChevronRight, LayoutGrid, StickyNote, Info } from 'lucide-react';
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
  groomName: "Jhomel",
  brideName: "Bernadette",
  weddingDate: "DECEMBER 12, 2026",
  weddingLocation: "Manila, Philippines",
  ourStory: "We first met in 2018 at a local coffee shop. What started as a chance encounter over a spilled iced latte quickly blossomed into a beautiful friendship and, eventually, a lifelong love. Seven years, countless adventures, and one perfect proposal later, we are so excited to say 'I do' and celebrate the beginning of our forever with all of our favorite people.",
  storyPhotoUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
  contactPhone: "+63 912 345 6789",
  contactEmail: "weddings@example.com",
  groomParents: "Mr. Juan Dela Cruz & Mrs. Maria Dela Cruz",
  brideParents: "Mr. Pedro Santos & Mrs. Ana Santos",
  entouragePrincipal: "Mr. Juan Reyes\nMrs. Maria Reyes\nDr. Jose Garcia\nDr. Ana Garcia\nEngr. Luis Villanueva\nMrs. Elena Villanueva",
  candleSponsors: "Mark Doe, Mary Jane",
  veilSponsors: "Luke Smith, Lucy Mae",
  cordSponsors: "Paul Jones, Peter Cruz",
  bestMan: "Mark Anthony Dela Cruz",
  maidOfHonor: "Sarah Jane Santos",
  groomsmen: "Paul Fernandez\nJohn Ocampo\nLuke Bautista",
  bridesmaids: "Mary Rivera\nMartha Cruz\nRuth Gomez",
  ceremonyDate: "Saturday, December 12th, 2026",
  ceremonyTime: "3:00 in the afternoon",
  ceremonyVenue: "Manila Cathedral",
  ceremonyAddress: "Cabildo, 132 Beaterio St, Intramuros",
  ceremonyPhotoUrl: "https://images.unsplash.com/photo-1548625361-ec85cb209210?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800",
  ceremonyMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.1895744955146!2d120.9706788758832!3d14.588267477372225!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca2316e1d2c7%3A0xc3c94f58c42b07e!2sManila%20Cathedral!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph",
  receptionDate: "Saturday, December 12th, 2026",
  receptionTime: "6:00 in the evening",
  receptionVenue: "Palacio de Maynila",
  receptionAddress: "Roxas Boulevard, Malate",
  receptionPhotoUrl: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&q=80&w=800",
  receptionMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.425974648719!2d120.98064037588302!3d14.574768377708518!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x3397cc26cc355555%3A0x80856edc673d3284!2sPalacio%20de%20Maynila!5e0!3m2!1sen!2sph!4v1700000000000!5m2!1sen!2sph",
  dressCodeText: "Formal Attire. We kindly request our guests to dress elegantly in shades of Sage Green, Beige, or neutral earth tones. Please avoid wearing bright neon colors or pure white.",
  dressCodeColors: "#B8C6A7, #E5E7D1, #8B9B7A, #ffff8f, #D2B48C, #F4A460, #BC8F8F, #FFE4E1",
  dressCodePhotoUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1516726855505-e5ed699fd49d?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1623086961453-33306db3645c?auto=format&fit=crop&q=80&w=800",
  galleryPhotos: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800, https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800",
  giftText: "With all that we have, we’ve been truly blessed. Your presence and prayers are all that we request. But if you desire to give nonetheless, a monetary gift is one we suggest.",
  rsvpDeadline: "November 1st, 2026"
};

const SAMPLE_MESSAGES = [
  { id: 's1', message: "Wishing you a lifetime of love, laughter, and endless happiness. We cannot wait to witness your beautiful day!", submittedName: "The Smith Family" },
  { id: 's2', message: "So incredibly happy for you both! Cheers to the beautiful couple and the amazing journey ahead.", submittedName: "Aunt Sarah & Uncle Mike" },
  { id: 's3', message: "May your love grow stronger with each passing year. Counting down the days until we celebrate!", submittedName: "Mark & Jessica" },
  { id: 's4', message: "Welcome to the adventure of a lifetime! We love you both so much.", submittedName: "The Garcia Crew" },
  { id: 's5', message: "To the most beautiful couple, inside and out. Best wishes on your wedding day!", submittedName: "Elena & Luis" },
  { id: 's6', message: "Cheers to a love that lasts forever!", submittedName: "Jameson Family" }
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
  const [saveMessage, setSaveMessage] = useState('');
  
  const [currentGbSlide, setCurrentGbSlide] = useState(0);
  const [gbVisualMode, setGbVisualMode] = useState('elegant');

  const ADMIN_PASSWORD = "Eternity&Leaves2026!";

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
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Montserrat:wght@200;300;400;500;600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(fontLink)) document.head.removeChild(fontLink);
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
        setDetails(mainDoc.data());
        setEditForm(mainDoc.data()); 
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
      setSubmitError("Invalid Security Code. Please check your invitation.");
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
    } catch (error) { console.error(error); }
  };

  const toggleMessageApproval = async (id, currentStatus) => {
    if(!user || !db) return;
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id), { messageApproved: !currentStatus });
  };

  const handleDeleteGuest = async (id) => {
    if(!user || !db) return;
    if(window.confirm("Remove this guest?")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_invitees', id));
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsSavingDetails(true);
    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'wedding_config', 'main'), editForm);
      setSaveMessage('Saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) { setSaveMessage('Failed.'); }
    setIsSavingDetails(false);
  };

  // --- Derived Data ---
  const colorArray = (details.dressCodeColors || '').split(',').map(s => s.trim()).filter(Boolean);
  const principalArray = (details.entouragePrincipal || '').split('\n').map(s => s.trim()).filter(Boolean);
  const groomsmenArray = (details.groomsmen || '').split('\n').map(s => s.trim()).filter(Boolean);
  const bridesmaidsArray = (details.bridesmaids || '').split('\n').map(s => s.trim()).filter(Boolean);
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
      <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-weddingDark">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-3xl font-serif text-weddingSage">Admin Dashboard</h1>
            <div className="flex gap-4">
              <button onClick={() => setAdminTab('guests')} className={`px-4 py-2 rounded ${adminTab === 'guests' ? 'bg-weddingSage text-white' : 'bg-gray-100'}`}>Guests</button>
              <button onClick={() => setAdminTab('details')} className={`px-4 py-2 rounded ${adminTab === 'details' ? 'bg-weddingSage text-white' : 'bg-gray-100'}`}>Content</button>
              <button onClick={() => setIsAdminAuth(false)} className="px-4 py-2 bg-gray-800 text-white rounded">Exit</button>
            </div>
          </div>
          {adminTab === 'guests' ? (
            <div>
              <div className="bg-gray-50 p-6 rounded-xl mb-8 flex gap-4 items-end">
                <input value={newGuestName} onChange={e=>setNewGuestName(e.target.value)} placeholder="Name" className="flex-1 p-2 border-b bg-transparent focus:outline-none" />
                <input value={newGuestCode} onChange={e=>setNewGuestCode(e.target.value)} placeholder="Code" className="flex-1 p-2 border-b bg-transparent uppercase font-mono focus:outline-none" />
                <button onClick={handleAddGuest} className="bg-weddingDark text-white px-6 py-2 rounded">Add</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      <th className="p-4">Guest</th>
                      <th className="p-4">RSVP</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitees.map(i => (
                      <tr key={i.id} className="border-b group hover:bg-gray-50">
                        <td className="p-4"><div className="font-bold">{String(i.name)}</div><div className="text-[10px] text-weddingSage font-mono uppercase">{String(i.code)}</div></td>
                        <td className="p-4"><span className={`text-xs font-bold ${i.status === 'Attending' ? 'text-green-600' : 'text-gray-500'}`}>{String(i.status)}</span></td>
                        <td className="p-4 text-xs italic">
                          {i.message && (
                            <button onClick={() => toggleMessageApproval(i.id, i.messageApproved)} className={`flex items-center gap-1 ${i.messageApproved ? 'text-pink-500' : 'text-gray-400'}`}>
                              <Heart className="w-3 h-3" fill={i.messageApproved ? "currentColor" : "none"} /> {i.messageApproved ? 'Approved' : 'Approve'}
                            </button>
                          )}
                        </td>
                        <td className="p-4"><button onClick={() => handleDeleteGuest(i.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveDetails} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input name="groomName" value={editForm.groomName} onChange={e => setEditForm({...editForm, groomName: e.target.value})} placeholder="Groom" className="p-2 border-b focus:outline-none" />
                <input name="brideName" value={editForm.brideName} onChange={e => setEditForm({...editForm, brideName: e.target.value})} placeholder="Bride" className="p-2 border-b focus:outline-none" />
              </div>
              <textarea value={editForm.ourStory} onChange={e => setEditForm({...editForm, ourStory: e.target.value})} className="w-full p-4 border rounded focus:outline-none" rows="4"></textarea>
              <input value={editForm.storyPhotoUrl} onChange={e => setEditForm({...editForm, storyPhotoUrl: e.target.value})} placeholder="Story Photo URLs" className="w-full p-2 border-b focus:outline-none" />
              <button type="submit" className="bg-weddingSage text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs">Save Changes</button>
              {saveMessage && <span className="ml-4 text-green-600 font-bold">{saveMessage}</span>}
            </form>
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
      <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="fixed right-6 bottom-6 md:right-10 md:bottom-10 z-50 bg-weddingYellow text-weddingDark p-5 rounded-full shadow-2xl border border-white/50 hover:scale-110 active:scale-95 transition-all group ring-1 ring-weddingAccent/20">
        <Mail className="w-7 h-7" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-weddingDark text-white px-4 py-2 rounded-lg shadow-xl text-[11px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">RSVP Now</span>
      </button>

      {/* Navigation - Wide & Centered */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-6 bg-gradient-to-b from-[#faf9f6]/95 to-transparent backdrop-blur-[4px]">
        <div className="max-w-screen-2xl mx-auto px-10 flex flex-wrap justify-center gap-8 md:gap-14 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">
          {['Home', 'Story', 'Entourage', 'Venues', 'Guestbook', 'Details', 'RSVP'].map(t => (
            <button key={t} onClick={() => document.getElementById(t.toLowerCase()).scrollIntoView({behavior: 'smooth'})} className={`hover:text-weddingDark transition-all hover:tracking-[0.4em] border-b-2 ${t === 'RSVP' ? 'text-weddingAccent border-weddingYellow' : 'border-transparent'}`}>{t}</button>
          ))}
        </div>
      </nav>

      <main className="flex-grow w-full">
        {/* HERO SECTION - Full Viewport */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-10 relative w-full overflow-hidden">
          <OrganicLeaf className="absolute top-1/4 right-[10%] w-48 h-48 text-weddingSage opacity-10 rotate-45" />
          <OrganicLeaf className="absolute bottom-1/4 left-[10%] w-40 h-40 text-weddingSage opacity-10 -rotate-45" />
          <HandpaintedFlower className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] text-weddingSage opacity-[0.06] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
          
          <p className="text-weddingAccent tracking-[0.6em] uppercase text-xs md:text-sm mb-12 font-bold">Join us to celebrate</p>
          <h1 className="text-7xl md:text-9xl lg:text-[12rem] font-serif leading-[0.8] mb-12 drop-shadow-sm">
            {String(details.groomName)} <br/><span className="text-5xl md:text-7xl italic text-weddingAccent my-6 block">&amp;</span> {String(details.brideName)}
          </h1>
          <LineAccent />
          <button onClick={() => document.getElementById('rsvp').scrollIntoView({behavior: 'smooth'})} className="mb-14 px-20 py-6 bg-weddingYellow text-weddingDark text-xs font-bold uppercase tracking-[0.5em] rounded-full shadow-[0_15px_40px_rgba(255,255,143,0.3)] border border-white hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all">RSVP Now</button>
          <p className="text-3xl md:text-5xl tracking-[0.3em] font-light text-gray-800 mb-4 uppercase">{String(details.weddingDate)}</p>
          <p className="text-[11px] md:text-sm tracking-[0.6em] text-gray-500 font-bold uppercase">{String(details.weddingLocation)}</p>
        </section>

        {/* STORY SECTION - Expanded Layout */}
        <section id="story" className="py-40 px-10 max-w-screen-2xl mx-auto relative">
          <OrganicLeaf className="absolute -left-40 top-1/2 -translate-y-1/2 w-[35vw] h-[35vw] text-weddingSage opacity-[0.08] -z-10 rotate-[20deg]" />
          <div className="flex flex-col lg:flex-row items-center gap-24 xl:gap-40">
            <div className="w-full lg:w-1/2 aspect-[4/5] rounded-t-[400px] border-[15px] border-white shadow-3xl p-4 relative bg-white ring-1 ring-gray-100 flex-shrink-0">
              <ImageSlider photoString={details.storyPhotoUrl} altText="Story" containerClass="absolute inset-4" imageClass="rounded-t-[380px] rounded-b-2xl" />
            </div>
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.6em] text-weddingAccent mb-12 uppercase">The Beginning</h2>
              <div className="relative">
                <span className="absolute -left-16 -top-16 text-[12rem] text-weddingYellow opacity-20 font-serif leading-none">"</span>
                <p className="text-3xl md:text-4xl xl:text-6xl font-serif leading-[1.6] text-gray-800 italic relative z-10">
                  {String(details.ourStory)}
                </p>
              </div>
              <OrganicLeaf className="w-32 h-32 text-weddingSage opacity-30 mt-16 mx-auto lg:ml-0" />
            </div>
          </div>
        </section>

        {/* ENTOURAGE SECTION - Centered Line & Full Spread */}
        <section id="entourage" className="py-40 px-10 text-center relative overflow-hidden bg-white/30 w-full">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex justify-center items-center gap-14 mb-32">
              <OrganicLeaf className="w-24 h-24 text-weddingSage opacity-40 rotate-12 hidden md:block" />
              <h2 className="text-7xl md:text-9xl font-serif text-weddingDark drop-shadow-sm">The Entourage</h2>
              <OrganicLeaf className="w-24 h-24 text-weddingSage opacity-40 -rotate-12 hidden md:block" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 lg:gap-40 mb-32 max-w-screen-xl mx-auto">
              <div className="p-14 bg-white/60 rounded-[4rem] shadow-sm border border-white/80 backdrop-blur-sm group hover:bg-white transition-all">
                <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.5em] uppercase mb-12">Parents of the Groom</h3>
                <p className="text-4xl md:text-6xl font-serif whitespace-pre-line leading-relaxed">{String(details.groomParents)}</p>
              </div>
              <div className="p-14 bg-white/60 rounded-[4rem] shadow-sm border border-white/80 backdrop-blur-sm group hover:bg-white transition-all">
                <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.5em] uppercase mb-12">Parents of the Bride</h3>
                <p className="text-4xl md:text-6xl font-serif whitespace-pre-line leading-relaxed">{String(details.brideParents)}</p>
              </div>
            </div>

            <LineAccent />

            {/* Principal Sponsors - Perfectly Centered Grid Line */}
            <div className="max-w-screen-xl mx-auto my-32 p-16 md:p-32 bg-white rounded-[5rem] shadow-2xl border border-gray-100 ring-1 ring-gray-50 flex flex-col items-center relative">
               <OrganicLeaf className="absolute -top-12 -left-12 w-48 h-48 text-weddingSage opacity-20" />
               <OrganicLeaf className="absolute -bottom-12 -right-12 w-48 h-48 text-weddingSage opacity-20 rotate-180" />
               
               <h3 className="text-xs md:text-sm font-bold text-weddingAccent tracking-[0.7em] uppercase mb-24 underline decoration-weddingYellow decoration-8 underline-offset-[20px]">Principal Sponsors</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 text-3xl md:text-5xl font-serif italic text-gray-800 w-full relative">
                 <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/40 -translate-x-1/2"></div>
                 {principalArray.map((n, i) => (
                   <div key={i} className={`flex items-center w-full py-6 justify-center ${i % 2 === 0 ? "md:justify-end md:pr-20" : "md:justify-start md:pl-20"}`}>
                     {String(n)}
                   </div>
                 ))}
               </div>
            </div>

            {/* Best Man & Maid of Honor - Symmetric Grid */}
            <div className="max-w-screen-xl mx-auto flex flex-col items-center w-full mb-20">
              <div className="grid grid-cols-2 gap-x-0 w-full items-center border-y border-weddingSage/20 py-20 relative">
                <div className="absolute left-1/2 top-10 bottom-10 w-px bg-weddingSage/40 -translate-x-1/2"></div>
                <div className="text-right pr-20 flex flex-col items-end flex-1 overflow-hidden">
                  <h4 className="text-[14px] font-bold text-weddingAccent uppercase tracking-[0.6em] mb-8">Best Man</h4>
                  <p className="text-3xl md:text-5xl font-serif text-weddingDark whitespace-nowrap overflow-hidden text-ellipsis w-full">{String(details.bestMan)}</p>
                </div>
                <div className="text-left pl-20 flex flex-col items-start flex-1 overflow-hidden">
                  <h4 className="text-[14px] font-bold text-weddingAccent uppercase tracking-[0.6em] mb-8">Maid of Honor</h4>
                  <p className="text-3xl md:text-5xl font-serif text-weddingDark whitespace-nowrap overflow-hidden text-ellipsis w-full">{String(details.maidOfHonor)}</p>
                </div>
              </div>
            </div>

            {/* Groomsmen & Bridesmaids List */}
            <div className="max-w-screen-xl mx-auto text-gray-800 flex flex-col items-center w-full">
               <div className="grid grid-cols-2 gap-x-0 mb-16 pb-10 border-b border-weddingAccent/30 w-full relative">
                 <div className="absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/40 -translate-x-1/2"></div>
                 <div className="text-right pr-20 text-[14px] font-bold text-weddingAccent uppercase tracking-[0.6em]">Groomsmen</div>
                 <div className="text-left pl-20 text-[14px] font-bold text-weddingAccent uppercase tracking-[0.6em]">Bridesmaids</div>
               </div>
               {entouragePartners.map((partner, i) => (
                 <div key={i} className="grid grid-cols-2 gap-x-0 mb-12 group w-full items-center relative">
                   <div className="absolute left-1/2 top-0 bottom-0 w-px bg-weddingSage/30 -translate-x-1/2"></div>
                   <div className="text-right pr-20 transition-all group-hover:text-weddingAccent overflow-hidden">
                      <p className="text-2xl md:text-4xl font-serif whitespace-nowrap overflow-hidden text-ellipsis tracking-wide">{String(partner.groomSide)}</p>
                   </div>
                   <div className="text-left pl-20 transition-all group-hover:text-weddingAccent overflow-hidden">
                      <p className="text-2xl md:text-4xl font-serif whitespace-nowrap overflow-hidden text-ellipsis tracking-wide">{String(partner.brideSide)}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* VENUES SECTION */}
        <section id="venues" className="py-40 px-10 bg-white shadow-[inset_0_0_200px_rgba(0,0,0,0.04)] border-y border-white">
           <div className="max-w-screen-2xl mx-auto">
             <h2 className="text-xs md:text-sm font-bold tracking-[0.7em] text-center text-weddingAccent uppercase mb-32 w-full">When &amp; Where</h2>
             
             {/* Ceremony - Expanded Layout */}
             <div className="grid lg:grid-cols-12 gap-20 items-center mb-48 relative">
                <div className="lg:col-span-7 aspect-[16/10] rounded-t-[400px] border-[15px] border-white p-5 bg-white shadow-3xl overflow-hidden relative ring-1 ring-gray-100">
                   <OrganicLeaf className="absolute -top-8 -left-8 w-24 h-24 text-weddingSage opacity-40 z-20" />
                   <ImageSlider photoString={details.ceremonyPhotoUrl} altText="Ceremony" containerClass="absolute inset-5" imageClass="rounded-t-[375px] rounded-b-3xl" />
                </div>
                <div className="lg:col-span-5 p-8 lg:p-20 text-center lg:text-left">
                   <h3 className="text-6xl md:text-8xl font-serif mb-12 text-weddingDark">The Ceremony</h3>
                   <div className="w-28 h-2 bg-weddingAccent mb-14 mx-auto lg:mx-0 shadow-sm"></div>
                   <p className="text-gray-900 font-bold tracking-[0.5em] text-sm uppercase mb-6">{String(details.ceremonyDate)}</p>
                   <p className="text-4xl md:text-6xl font-serif text-weddingAccent mb-16 italic leading-snug">{String(details.ceremonyVenue)}</p>
                   {details.ceremonyMapUrl && (
                     <div className="w-full h-80 rounded-[4rem] overflow-hidden shadow-2xl grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 border-8 border-white ring-1 ring-gray-100">
                       <iframe src={details.ceremonyMapUrl} width="100%" height="100%" style={{border:0}} loading="lazy" title="Ceremony Map"></iframe>
                     </div>
                   )}
                </div>
             </div>

             {/* Reception - Expanded Reversed Row */}
             <div className="grid lg:grid-cols-12 gap-20 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 p-8 lg:p-20 text-center lg:text-right">
                   <h3 className="text-6xl md:text-8xl font-serif mb-12 text-weddingDark">The Reception</h3>
                   <div className="w-28 h-2 bg-weddingAccent mb-14 mx-auto lg:ml-auto shadow-sm"></div>
                   <p className="text-gray-900 font-bold tracking-[0.5em] text-sm uppercase mb-6">{String(details.receptionDate)}</p>
                   <p className="text-4xl md:text-6xl font-serif text-weddingAccent mb-16 italic leading-snug">{String(details.receptionVenue)}</p>
                   {details.receptionMapUrl && (
                     <div className="w-full h-80 rounded-[4rem] overflow-hidden shadow-2xl grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 border-8 border-white ring-1 ring-gray-100">
                       <iframe src={details.receptionMapUrl} width="100%" height="100%" style={{border:0}} loading="lazy" title="Reception Map"></iframe>
                     </div>
                   )}
                </div>
                <div className="lg:col-span-7 order-1 lg:order-2 aspect-[16/10] rounded-t-[400px] border-[15px] border-white p-5 bg-white shadow-3xl overflow-hidden relative ring-1 ring-gray-100">
                   <OrganicLeaf className="absolute -top-8 -right-8 w-24 h-24 text-weddingSage opacity-40 z-20" />
                   <ImageSlider photoString={details.receptionPhotoUrl} altText="Reception" containerClass="absolute inset-5" imageClass="rounded-t-[375px] rounded-b-3xl" />
                </div>
             </div>
           </div>
        </section>

        {/* GUESTBOOK SECTION - Full Width Swiper */}
        <section id="guestbook" className="py-40 px-10 relative overflow-hidden bg-weddingSage/5">
          <OrganicLeaf className="absolute -top-32 -right-32 w-[45vw] h-[45vw] text-weddingSage opacity-[0.08] rotate-[60deg]" />
          <div className="max-w-screen-2xl mx-auto relative">
            <div className="text-center mb-24">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.6em] text-weddingAccent uppercase mb-8">Wishes &amp; Love</h2>
              <h3 className="text-7xl md:text-9xl font-serif text-weddingDark mb-16">Our Guestbook</h3>
              <div className="flex justify-center items-center gap-8 mb-20">
                <button onClick={() => setGbVisualMode('elegant')} className={`flex items-center gap-4 px-10 py-4 rounded-full border-2 transition-all ${gbVisualMode === 'elegant' ? 'bg-weddingDark text-white border-weddingDark shadow-2xl scale-110' : 'bg-white text-weddingDark border-gray-200 hover:border-weddingSage'}`}><LayoutGrid size={22} /> <span className="text-[12px] font-bold uppercase tracking-widest">Elegant Cards</span></button>
                <button onClick={() => setGbVisualMode('sticky')} className={`flex items-center gap-4 px-10 py-4 rounded-full border-2 transition-all ${gbVisualMode === 'sticky' ? 'bg-weddingDark text-white border-weddingDark shadow-2xl scale-110' : 'bg-white text-weddingDark border-gray-200 hover:border-weddingSage'}`}><StickyNote size={22} /> <span className="text-[12px] font-bold uppercase tracking-widest">Sticky Notes</span></button>
              </div>
            </div>
            <div className="relative min-h-[600px] px-6">
              {gbSlides.length > 0 && gbSlides.map((slide, slideIdx) => (
                <div key={slideIdx} className={`absolute inset-0 grid md:grid-cols-3 gap-16 transition-all duration-[1200ms] ease-out transform ${slideIdx === currentGbSlide ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-full scale-95 pointer-events-none'}`}>
                  {slide.map((m, i) => (
                    <div key={m.id} className={`${PASTEL_MOTIF_COLORS[i % PASTEL_MOTIF_COLORS.length]} p-14 xl:p-20 shadow-3xl relative transition-all duration-700 flex flex-col justify-between ${gbVisualMode === 'elegant' ? 'rounded-[4rem] border border-white hover:scale-105 hover:-rotate-1' : `rounded-lg border-t-4 border-weddingSage/30 transform ${i % 2 === 0 ? 'rotate-3' : '-rotate-3'} hover:rotate-0 hover:scale-110 shadow-4xl`}`}>
                      {gbVisualMode === 'sticky' && <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-12 bg-white/40 shadow-sm border border-white/60 z-20 backdrop-blur-sm"></div>}
                      <div className="relative">
                        <MessageSquareHeart className="w-14 h-14 text-weddingAccent/20 mb-10" />
                        <p className="text-3xl md:text-4xl xl:text-5xl font-serif italic leading-relaxed text-gray-800">"{String(m.message)}"</p>
                      </div>
                      <div className={`text-right text-[13px] font-bold uppercase tracking-[0.4em] text-gray-500 border-t border-gray-200/20 mt-12 pt-8`}>- {String(m.submittedName)}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {gbSlides.length > 1 && (
              <div className="flex justify-center gap-5 mt-24">
                {gbSlides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentGbSlide(i)} className={`h-2.5 rounded-full transition-all duration-500 ${i === currentGbSlide ? 'bg-weddingAccent w-24' : 'bg-gray-300 w-6'}`}></button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* DETAILS & DRESS CODE SECTION */}
        <section id="details" className="py-40 px-10 bg-white border-y border-white relative overflow-hidden">
           <div className="max-w-screen-2xl mx-auto flex flex-col gap-40 relative">
              <div className="flex flex-col lg:flex-row gap-32 items-center text-weddingDark">
                <div className="flex-1 order-2 lg:order-1">
                   <h3 className="text-6xl md:text-8xl font-serif mb-12 text-center lg:text-left">Dress Code</h3>
                   <div className="w-32 h-3 bg-weddingAccent mb-14 shadow-sm mx-auto lg:mx-0"></div>
                   <p className="text-2xl xl:text-3xl mb-16 leading-relaxed font-medium text-center lg:text-left">{String(details.dressCodeText)}</p>
                   <div className="flex gap-8 flex-wrap justify-center lg:justify-start">
                      {colorArray.map((c, i) => (
                        <div key={i} className="group relative">
                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-3xl transition-transform group-hover:scale-125 ring-1 ring-gray-100" style={{ backgroundColor: String(c) }}></div>
                          <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap z-10">{String(c)}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="flex-1 order-1 lg:order-2 flex flex-col gap-14 relative w-full">
                  <OrganicLeaf className="absolute -top-24 -right-24 w-80 h-80 text-weddingSage opacity-[0.2] -z-10 animate-spin-slow" />
                  <h4 className="text-[12px] uppercase font-bold tracking-[0.5em] text-weddingAccent text-center lg:text-left">Style Inspiration</h4>
                  <div className="grid grid-cols-2 gap-10">
                    {String(details.dressCodePhotoUrl).split(',').map((url, idx) => (
                      <div key={idx} className={`rounded-[3rem] overflow-hidden border-8 border-white shadow-3xl aspect-[4/5] ${idx === 2 ? 'col-span-2 aspect-[18/9]' : ''}`}>
                        <img src={url.trim()} alt="Style inspiration" className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gift Protocol - FIXED CLIPPING */}
              <div className="bg-[#faf9f6] p-24 md:p-40 border-4 border-white rounded-[5rem] text-center shadow-4xl relative ring-1 ring-gray-100 max-w-screen-xl mx-auto w-full">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-weddingYellow p-8 rounded-full shadow-4xl border-[10px] border-white z-50">
                    <Gift className="w-16 h-16 text-weddingDark" />
                 </div>
                 <HandpaintedFlower className="absolute -bottom-20 -left-20 w-80 h-80 text-weddingSage opacity-15" />
                 <OrganicLeaf className="absolute top-12 right-12 w-32 h-32 text-weddingSage opacity-20" />
                 <h3 className="text-5xl md:text-7xl font-serif mb-16 italic mt-8 text-weddingDark">Wedding Gift</h3>
                 <p className="text-gray-700 font-serif text-3xl md:text-4xl leading-relaxed italic max-w-4xl mx-auto">"{String(details.giftText)}"</p>
              </div>
           </div>
        </section>

        {/* RSVP SECTION - Consistent Botanical & Color Design */}
        <section id="rsvp" className="py-48 px-10 bg-weddingDark text-white relative shadow-[inset_0_20px_150px_rgba(0,0,0,0.6)] w-full">
           {/* Line Accents */}
           <div className="absolute top-0 left-1/4 bottom-0 w-px bg-white/5"></div>
           <div className="absolute top-0 right-1/4 bottom-0 w-px bg-white/5"></div>
           <OrganicLeaf className="absolute bottom-[5%] right-[5%] w-[25vw] h-[25vw] text-weddingSage opacity-10 pointer-events-none" />
           <OrganicLeaf className="absolute top-[5%] left-[5%] w-[18vw] h-[18vw] text-weddingSage opacity-10 pointer-events-none -rotate-[30deg]" />
           
           <div className="max-w-screen-lg mx-auto relative z-10">
              <div className="text-center mb-32">
                 <h2 className="text-xs md:text-sm font-bold tracking-[0.7em] uppercase text-weddingYellow mb-12 w-full">RSVP</h2>
                 <h3 className="text-7xl md:text-9xl font-serif mb-12 drop-shadow-3xl w-full">We hope to see you</h3>
                 <div className="w-24 h-px bg-white/30 mx-auto mb-12"></div>
                 <p className="text-[14px] uppercase font-bold tracking-[0.5em] text-weddingYellow border-2 border-weddingYellow/30 px-14 py-5 rounded-full inline-block">Please Reply by {String(details.rsvpDeadline)}</p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-32 bg-white/5 rounded-[5rem] border border-white/10 shadow-4xl backdrop-blur-2xl">
                   <CheckCircle className="w-28 h-28 text-weddingYellow mx-auto mb-12 animate-bounce" />
                   <p className="text-5xl font-serif italic mb-16">We can't wait to celebrate!</p>
                   <button onClick={() => setSubmitSuccess(false)} className="text-[13px] uppercase tracking-[0.5em] font-bold bg-weddingYellow text-weddingDark px-14 py-6 rounded-full hover:opacity-90 transition-all shadow-3xl">Change my RSVP</button>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-20">
                   {/* Invitation Code - Sage Green Block */}
                   <div className="bg-weddingSage p-16 rounded-[4.5rem] shadow-4xl group focus-within:ring-12 focus-within:ring-weddingYellow/20 transition-all">
                      <label className="block text-[14px] font-bold tracking-[0.6em] uppercase mb-10 text-weddingDark text-center">Your Invitation Code</label>
                      <input 
                        required
                        value={rsvpForm.enteredCode} 
                        onChange={e=>setRsvpForm({...rsvpForm, enteredCode: e.target.value})} 
                        className="w-full bg-transparent border-b-4 border-weddingDark/30 py-8 focus:outline-none focus:border-weddingDark text-center uppercase tracking-[1em] text-5xl md:text-7xl font-serif text-weddingDark placeholder:text-weddingDark/20 transition-all" 
                        placeholder="----" 
                      />
                      <p className="text-[12px] text-center text-weddingDark/70 mt-12 tracking-[0.4em] italic uppercase font-bold">Secure code required from your physical invite</p>
                   </div>
                   
                   {/* Full Name - Sage Green Block */}
                   <div className="bg-weddingSage p-14 rounded-[4rem] shadow-4xl group focus-within:ring-8 focus-within:ring-weddingYellow/20 transition-all">
                      <label className="block text-[14px] font-bold tracking-[0.6em] uppercase mb-10 text-weddingDark text-center">Guest Name</label>
                      <input 
                        required 
                        value={rsvpForm.name} 
                        onChange={e=>setRsvpForm({...rsvpForm, name: e.target.value})} 
                        className="w-full bg-transparent border-b-2 border-weddingDark/20 py-8 focus:outline-none focus:border-weddingDark transition-all placeholder:text-weddingDark/30 font-medium text-center text-3xl md:text-5xl font-serif italic" 
                        placeholder="Type Your Full Name" 
                      />
                   </div>
                   
                   <div className="flex flex-col md:flex-row gap-10">
                      {['yes', 'no'].map(v => (
                         <label key={v} className={`flex-1 py-10 text-center border-2 rounded-[3rem] cursor-pointer transition-all ${rsvpForm.attending === v ? 'bg-weddingYellow text-weddingDark border-weddingYellow shadow-[0_25px_60px_rgba(255,255,143,0.5)] scale-105' : 'border-white/10 hover:border-white/40 hover:bg-white/5'}`}>
                            <input type="radio" className="hidden" value={String(v)} checked={rsvpForm.attending === v} onChange={e=>setRsvpForm({...rsvpForm, attending: e.target.value})} />
                            <span className="text-base font-bold uppercase tracking-[0.5em]">{v === 'yes' ? 'Happily Accepting' : 'Regretfully Declining'}</span>
                         </label>
                      ))}
                   </div>
                   
                   {/* Wishes/Guestbook - Sage Green Block */}
                   <div className="bg-weddingSage rounded-[3.5rem] shadow-inner p-10 lg:p-14">
                      <label className="block text-[14px] font-bold tracking-[0.6em] uppercase mb-8 text-weddingDark text-center">Message for the Couple</label>
                      <textarea 
                        value={rsvpForm.message} 
                        onChange={e=>setRsvpForm({...rsvpForm, message: e.target.value})} 
                        placeholder="Write your wishes for our guestbook here..." 
                        className="w-full bg-transparent border-t border-weddingDark/10 pt-8 focus:outline-none transition-all placeholder:text-weddingDark/40 min-h-[220px] text-2xl font-serif italic text-weddingDark leading-relaxed" 
                      ></textarea>
                   </div>
                   
                   {submitError && <div className="text-red-400 text-center text-base font-bold bg-red-900/40 py-6 rounded-3xl border-2 border-red-900/60 w-full">{String(submitError)}</div>}
                   
                   <button type="submit" disabled={isSubmitting} className="w-full bg-weddingYellow text-weddingDark py-10 rounded-[3.5rem] font-bold uppercase tracking-[0.6em] text-base shadow-[0_30px_80px_rgba(255,255,143,0.4)] hover:shadow-[0_40px_100px_rgba(255,255,143,0.6)] hover:-translate-y-3 active:translate-y-0 transition-all disabled:opacity-50">
                      {isSubmitting ? 'Processing...' : 'Confirm My Attendance'}
                   </button>
                </form>
              )}
           </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-40 text-center bg-[#faf9f6] relative overflow-hidden border-t border-gray-100 w-full text-weddingDark">
         <div className="max-w-screen-2xl mx-auto relative px-10">
           <OrganicLeaf className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 text-weddingSage opacity-10 pointer-events-none" />
           <OrganicLeaf className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 text-weddingSage opacity-10 pointer-events-none rotate-180" />
           
           <p className="font-serif text-6xl md:text-8xl mb-10 italic">{String(details.groomName)} &amp; {String(details.brideName)}</p>
           <div className="w-32 h-px bg-weddingSage mx-auto mb-12"></div>
           <p className="text-[14px] uppercase font-bold tracking-[1em] text-gray-400 mb-20">December 12 • 2026 • Manila</p>
           
           <div className="flex flex-col items-center gap-10 opacity-70 mb-28 bg-white/50 py-16 rounded-[4rem] max-w-4xl mx-auto shadow-sm border border-white/80">
              <p className="text-[11px] uppercase font-bold tracking-[0.6em] text-gray-500 mb-4">For Concerns & Inquiries</p>
              <div className="flex flex-col md:flex-row gap-14 text-[14px] font-bold text-gray-700">
                 <span className="flex items-center gap-4 transition-colors hover:text-weddingAccent"><Phone size={18} className="text-weddingAccent"/> {details.contactPhone}</span>
                 <span className="flex items-center gap-4 transition-colors hover:text-weddingAccent"><Mail size={18} className="text-weddingAccent"/> {details.contactEmail}</span>
              </div>
           </div>

           <button onClick={() => setShowAdminLogin(true)} className="px-14 py-5 border-2 border-gray-200 rounded-full text-[11px] uppercase tracking-[0.6em] text-gray-400 hover:text-weddingDark hover:border-weddingDark transition-all bg-white/50 backdrop-blur-sm"><Lock className="w-5 h-5 inline mr-4 opacity-50"/> Staff Access</button>
         </div>
      </footer>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-3xl z-[100] flex items-center justify-center p-10 text-weddingDark">
          <div className="max-w-xl w-full text-center">
             <button onClick={() => setShowAdminLogin(false)} className="mb-20 hover:rotate-90 transition-all hover:scale-125"><X size={64} className="text-gray-300 hover:text-weddingDark" /></button>
             <h3 className="text-6xl font-serif mb-16 italic">Secure Access</h3>
             <form onSubmit={handleAdminLogin}>
                <input type="password" autoFocus value={adminPassword} onChange={e=>setAdminPassword(e.target.value)} className="w-full border-b-4 border-weddingDark text-center py-10 mb-16 tracking-[1.2em] text-5xl focus:outline-none bg-transparent placeholder:opacity-10" placeholder="••••••••" />
                {adminError && <p className="text-red-500 text-sm font-bold mb-10 w-full text-center uppercase tracking-widest">{String(adminError)}</p>}
                <button className="w-full bg-weddingDark text-white py-8 rounded-[2.5rem] font-bold uppercase tracking-[0.5em] text-xs shadow-4xl hover:bg-black transition-all hover:-translate-y-2">Verify Credentials</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}