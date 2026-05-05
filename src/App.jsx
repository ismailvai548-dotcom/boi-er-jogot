import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Search, Bell, User, Heart, MessageCircle, Share2, 
  Bookmark, MoreVertical, Quote, Menu, Home, Feather, FileText, 
  Moon, Sun, TrendingUp, PlusCircle, BadgeCheck, Folder, 
  MessageSquare, Phone, Video, Send, ArrowLeft, 
  Crown, Lock, Download, ExternalLink, X, Image, Link, CheckCircle, 
  ShieldCheck, Trash2, Users, DollarSign, Activity, Ban, Mic, LogIn, Check,
  Mail, ArrowRight
} from 'lucide-react';

// Firebase imports
import { auth, db } from './firebase'; 
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, deleteDoc, updateDoc, arrayUnion, arrayRemove, increment, setDoc, where, getDocs } from 'firebase/firestore';

// --- MOCK DB ---
const DB = {
  currentUser: {
    id: 'u_1', name: 'রাফসান আহমেদ', role: 'admin', isAuthor: true, isPremium: false, 
    followers: '1.2k', following: '120',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
  },
  trendingBooks: [
    { id: 'tb1', title: 'নূরজাহান', author: 'ইমদাদুল হক মিলন', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
    { id: 'tb2', title: 'দেয়াল', author: 'হুমায়ূন আহমেদ', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100' },
  ],
  chatList: [
    { id: 'u_2', name: 'সাদিয়া ইসলাম', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', lastMsg: 'নতুন লেখা কবে আসবে?' },
    { id: 'u_3', name: 'তানভীর হাসান', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150', lastMsg: 'ধন্যবাদ ভাইয়া।' },
  ]
};

// ==========================================
// 1. PREMIUM AUTHENTICATION MODAL (English, OTP only on Signup)
// ==========================================
const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [step, setStep] = useState(1); // For signup steps
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', password: '', otp: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  if (!isOpen) return null;

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.phone || !formData.password) return setErrorMsg('Please enter both phone and password.');

    setIsLoading(true);
    try {
      const formattedPhone = `+880${formData.phone.replace(/^0+/, '')}`; 
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", formattedPhone), where("password", "==", formData.password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMsg('Invalid phone number or password!');
      } else {
        const userData = querySnapshot.docs[0].data();
        onLoginSuccess(userData);
        onClose();
      }
    } catch (error) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNext = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.password) return setErrorMsg('Please fill in all fields.');
      if (formData.password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
      setStep(2);
    } 
    else if (step === 2) {
      if (!formData.phone || formData.phone.length < 10) return setErrorMsg('Please enter a valid phone number.');
      
      setIsLoading(true);
      try {
        setupRecaptcha();
        const formattedPhone = `+880${formData.phone.replace(/^0+/, '')}`;
        const q = query(collection(db, "users"), where("phone", "==", formattedPhone));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setIsLoading(false);
          return setErrorMsg('This phone number is already registered!');
        }

        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
        setConfirmationResult(confirmation);
        setStep(3); 
      } catch (error) {
        console.error(error);
        setErrorMsg('Failed to send OTP. Please check the number.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.otp.length < 6) return setErrorMsg('Please enter the 6-digit OTP.');

    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(formData.otp);
      const user = result.user;

      const userData = {
        id: user.uid,
        name: `${formData.firstName} ${formData.lastName}`,
        phone: user.phoneNumber,
        password: formData.password, 
        role: 'user',
        isAuthor: false,
        isPremium: false,
        avatar: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "users", user.uid), userData);
      onLoginSuccess(userData);
      onClose();
    } catch (error) {
      setErrorMsg('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setStep(1); setErrorMsg(''); };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-[#1C1C1E] w-full max-w-4xl rounded-2xl shadow-2xl flex overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 rounded-full text-gray-500 dark:text-gray-300 hover:bg-black/20 z-50 transition-colors"><X className="w-5 h-5" /></button>
        <div id="recaptcha-container"></div>

        <div className="hidden md:block md:w-1/2 relative bg-[#1c1917]">
          <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Library" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
            <h2 className="text-4xl font-serif font-bold text-white mb-3">Boi Er Jogot</h2>
            <p className="text-gray-300 text-sm leading-relaxed">Step into a world of endless stories. Read, write, and share your imagination with thousands of readers.</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#1C1C1E]">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{authMode === 'login' ? 'Please enter your details to sign in.' : 'Join our community of readers and writers.'}</p>
          </div>

          {errorMsg && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 rounded text-sm font-medium animate-in slide-in-from-top-2">{errorMsg}</div>}

          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                <div className="flex bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#C2410C] focus-within:ring-1 focus-within:ring-[#C2410C] transition-all">
                  <span className="px-4 py-3.5 bg-gray-100 dark:bg-[#3A3A3C] text-gray-500 font-medium border-r border-gray-200 dark:border-gray-700 flex items-center gap-2"><Phone className="w-4 h-4" /> +880</span>
                  <input type="tel" required placeholder="1XXXXXXXXX" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent px-4 py-3 outline-none dark:text-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Password</label>
                <div className="flex bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#C2410C] focus-within:ring-1 focus-within:ring-[#C2410C] transition-all">
                  <span className="px-4 py-3.5 text-gray-400 flex items-center"><Lock className="w-4 h-4" /></span>
                  <input type="password" required placeholder="••••••••" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full bg-transparent px-2 py-3 outline-none dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end"><span className="text-xs font-semibold text-[#C2410C] cursor-pointer hover:underline">Forgot password?</span></div>
              <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#1C1917] dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#C2410C] transition-colors shadow-lg disabled:opacity-70 mt-2">
                {isLoading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={step === 3 ? handleVerifyOTP : handleSignupNext} className="space-y-5 animate-in fade-in">
              <div className="flex gap-2 mb-4">{[1, 2, 3].map(i => <div key={i} className={`h-1.5 flex-1 rounded-full ${step >= i ? 'bg-[#C2410C]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>)}</div>
              {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-4">
                  <div className="flex gap-4">
                    <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">First Name</label><input type="text" placeholder="John" value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 outline-none focus:border-[#C2410C] dark:text-white transition-colors" /></div>
                    <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Last Name</label><input type="text" placeholder="Doe" value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3.5 outline-none focus:border-[#C2410C] dark:text-white transition-colors" /></div>
                  </div>
                  <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Create Password</label><div className="flex bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#C2410C] transition-all"><span className="px-4 py-3.5 text-gray-400 flex items-center"><Lock className="w-4 h-4" /></span><input type="password" placeholder="At least 6 characters" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} className="w-full bg-transparent px-2 py-3 outline-none dark:text-white" /></div></div>
                  <button type="submit" className="w-full py-4 bg-[#1C1917] dark:bg-white text-white dark:text-black rounded-xl font-bold mt-4 hover:opacity-90">Continue</button>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-5 animate-in slide-in-from-right-4">
                  <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Phone Number</label><p className="text-xs text-gray-400 mb-3 block">We'll send a 6-digit OTP to verify your number.</p><div className="flex bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:border-[#C2410C] transition-all"><span className="px-4 py-3.5 bg-gray-100 dark:bg-[#3A3A3C] text-gray-500 font-medium border-r border-gray-200 dark:border-gray-700 flex items-center gap-2"><Phone className="w-4 h-4" /> +880</span><input type="tel" placeholder="1XXXXXXXXX" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} className="w-full bg-transparent px-4 py-3 outline-none dark:text-white" /></div></div>
                  <div className="flex gap-3"><button type="button" onClick={() => setStep(1)} className="py-4 px-6 bg-gray-100 dark:bg-[#3A3A3C] text-gray-600 dark:text-gray-300 rounded-xl font-bold">Back</button><button type="submit" disabled={isLoading} className="flex-1 py-4 bg-[#C2410C] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#9A3412] disabled:opacity-70 shadow-md">{isLoading ? 'Sending OTP...' : 'Send Verification Code'}</button></div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-5 animate-in slide-in-from-right-4">
                  <div className="text-center mb-6"><div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-8 h-8" /></div><p className="text-sm text-gray-600 dark:text-gray-300">Enter the 6-digit code sent to <br/><span className="font-bold text-black dark:text-white">+880 {formData.phone}</span></p></div>
                  <div><input type="number" placeholder="• • • • • •" value={formData.otp} onChange={e=>setFormData({...formData, otp: e.target.value.substring(0, 6)})} className="w-full bg-gray-50 dark:bg-[#2C2C2E] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 outline-none text-center text-2xl tracking-[0.75em] focus:border-emerald-500 font-bold dark:text-white transition-colors" /></div>
                  <button type="submit" disabled={isLoading} className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 shadow-md disabled:opacity-70 mt-2">{isLoading ? 'Verifying...' : 'Complete Registration'} <CheckCircle className="w-5 h-5" /></button>
                </div>
              )}
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{authMode === 'login' ? "Don't have an account? " : "Already have an account? "} <button type="button" onClick={resetForm} className="font-bold text-[#C2410C] hover:underline hover:text-[#9A3412] transition-colors">{authMode === 'login' ? 'Create an account' : 'Sign in instead'}</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 2. SUBSCRIPTION MODAL
// ==========================================
const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  if (!isOpen) return null;
  const handlePayment = () => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); onSubscribe(); }, 2000); };
  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full"><X className="w-5 h-5" /></button>
        <div className="flex justify-center mb-4"><Crown className="w-12 h-12 text-amber-500" /></div>
        <h2 className="text-2xl font-bold text-center mb-2 dark:text-white">প্রিমিয়াম আনলক করুন</h2>
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 rounded-2xl p-4 mb-6"><div className="flex justify-between items-center"><span className="font-bold text-amber-800 dark:text-amber-500">মাসিক প্যাক</span><span className="font-bold text-2xl dark:text-white">৳৫০</span></div></div>
        <button onClick={handlePayment} disabled={isProcessing} className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold">{isProcessing ? 'প্রসেস হচ্ছে...' : 'পেমেন্ট করুন'}</button>
      </div>
    </div>
  );
};

// ==========================================
// 3. CREATE POST MODAL
// ==========================================
const CreatePostModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('short');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!postContent.trim()) return alert('কিছু লিখুন!');
    setIsPublishing(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorId: DB.currentUser.id, authorName: DB.currentUser.name, isAuthor: DB.currentUser.isAuthor, isPremium: false, avatar: DB.currentUser.avatar,
        type: selectedCategory, title: postTitle, content: postContent, likes: 0, likedBy: [], comments: 0, commentsList: [], createdAt: serverTimestamp()
      });
      setPostTitle(''); setPostContent(''); onClose();
    } catch (error) { alert("সমস্যা হয়েছে!"); } finally { setIsPublishing(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#242526] w-full max-w-xl rounded-3xl overflow-hidden flex flex-col font-sans">
        <div className="flex items-center justify-between p-5 border-b dark:border-[#333436]"><button onClick={onClose} className="p-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full"><X className="w-5 h-5" /></button><button onClick={handlePublish} disabled={isPublishing} className="px-5 py-2 bg-[#C2410C] text-white rounded-full font-bold">{isPublishing ? 'হচ্ছে...' : 'পাবলিশ করুন'}</button></div>
        <div className="p-6">
          <div className="flex gap-2 mb-4"><button onClick={() => setSelectedCategory('short')} className={`px-4 py-2 rounded-full border ${selectedCategory === 'short' ? 'border-[#C2410C] text-[#C2410C] bg-rose-50' : 'text-gray-500'}`}>ছোট কবিতা</button><button onClick={() => setSelectedCategory('long')} className={`px-4 py-2 rounded-full border ${selectedCategory === 'long' ? 'border-[#C2410C] text-[#C2410C] bg-rose-50' : 'text-gray-500'}`}>গল্প</button></div>
          <div className="bg-[#FDFBF7] dark:bg-[#1E1F20] p-4 rounded-xl border dark:border-[#333436]">
            {selectedCategory === 'long' && <input type="text" placeholder="শিরোনাম" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full bg-transparent border-b pb-2 mb-2 outline-none font-bold text-xl dark:text-white" />}
            <textarea placeholder="এখানে লিখুন..." value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full bg-transparent outline-none resize-none font-serif min-h-[150px] dark:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. POST CARD COMPONENT
// ==========================================
const PostCard = ({ post, isPremiumUser, onMessageAuthor, onSavePost, isSaved }) => {
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const isLocked = post.isPremium && !isPremiumUser; 
  const hasLiked = post.likedBy?.includes(DB.currentUser.id);
  const commentsArray = post.commentsList || [];

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);
    if (hasLiked) await updateDoc(postRef, { likedBy: arrayRemove(DB.currentUser.id), likes: increment(-1) });
    else await updateDoc(postRef, { likedBy: arrayUnion(DB.currentUser.id), likes: increment(1) });
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, { commentsList: arrayUnion({ id: Date.now(), user: DB.currentUser.name, avatar: DB.currentUser.avatar, text: commentText }), comments: increment(1) });
    setCommentText('');
  };

  const handleCopyLink = () => { navigator.clipboard.writeText(window.location.href); alert('লিংক কপি হয়েছে!'); setShowShareMenu(false); };

  return (
    <div className="bg-white dark:bg-[#242526] p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4">
      <div className="flex justify-between mb-4">
        <div className="flex gap-3"><img src={post.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /><div><h4 className="font-bold flex items-center gap-1 dark:text-white">{post.authorName} {post.isAuthor && <BadgeCheck className="w-4 h-4 text-blue-500" />}</h4><p className="text-[12px] text-gray-500">{post.type === 'short' ? 'কবিতা' : 'গল্প'}</p></div></div>
        <div className="flex gap-2 items-center">
          {post.authorId !== DB.currentUser.id && onMessageAuthor && (
            <button onClick={() => onMessageAuthor({id: post.authorId || 'u_2', name: post.authorName, avatar: post.avatar})} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-full text-[12px] font-bold"><MessageSquare className="w-3.5 h-3.5" /> মেসেজ</button>
          )}
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      <div className="mb-4">
        {post.title && <h3 className="font-bold text-xl mb-3 dark:text-white">{post.title}{post.isPremium && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[11px] ml-2"><Lock className="w-3 h-3 inline" /> PRO</span>}</h3>}
        <div className="relative bg-[#FDFBF7] dark:bg-[#1E1F20] border-l-[4px] border-[#C2410C] p-4 rounded-r-xl">
          <div className={isLocked ? 'blur-[4px] select-none pointer-events-none' : ''}><p className={`font-serif dark:text-gray-300 whitespace-pre-line leading-relaxed ${!expanded && post.type === 'long' ? 'line-clamp-4' : ''}`}>{post.content}</p></div>
          {isLocked && <div className="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-black/40"><button className="bg-amber-500 text-white px-5 py-2 rounded-full font-bold shadow-lg">Unlock Premium</button></div>}
          {!expanded && post.type === 'long' && !isLocked && <button onClick={() => setExpanded(true)} className="text-[#C2410C] font-semibold text-[14px] mt-2">আরো পড়ুন ›</button>}
        </div>
      </div>

      <div className="flex justify-between pt-3 border-t dark:border-[#333436]">
        <div className="flex gap-4 sm:gap-6 relative">
          <button onClick={handleLike} className={`flex gap-1.5 items-center ${hasLiked ? 'text-rose-500' : 'text-gray-500'}`}><Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`}/><span className="font-semibold text-[13px]">{post.likes || 0}</span></button>
          <button onClick={() => setShowComments(!showComments)} className="flex gap-1.5 items-center text-gray-500"><MessageCircle className="w-5 h-5"/><span className="font-semibold text-[13px]">{post.comments || 0}</span></button>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="text-gray-500"><Share2 className="w-5 h-5"/></button>
            {showShareMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-[#3A3B3C] border dark:border-[#4E4F50] rounded-xl shadow-xl z-10"><button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold dark:text-white"><Link className="w-4 h-4" /> কপি লিংক</button></div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {onSavePost && <button onClick={() => onSavePost(post)} className={`p-1.5 rounded-full ${isSaved ? 'text-[#C2410C] bg-orange-50 dark:bg-[#3A3B3C]' : 'text-gray-500'}`}><Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`}/></button>}
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t dark:border-[#333436] animate-in fade-in">
          <div className="max-h-48 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin">
            {commentsArray.length === 0 && <p className="text-center text-[12px] text-gray-400">কোনো মন্তব্য নেই।</p>}
            {commentsArray.map((c) => (
              <div key={c.id} className="flex gap-2.5"><img src={c.avatar} className="w-8 h-8 rounded-full" alt="" /><div className="bg-gray-50 dark:bg-[#3A3B3C] px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex-1"><h5 className="font-bold text-[13px] dark:text-white">{c.user}</h5><p className="text-[13px] text-gray-700 dark:text-gray-300 mt-0.5">{c.text}</p></div></div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2"><img src={DB.currentUser.avatar} className="w-8 h-8 rounded-full" alt="" /><div className="flex-1 flex bg-gray-100 dark:bg-[#3A3B3C] rounded-full p-1 pl-4 items-center"><input type="text" placeholder="মন্তব্য লিখুন..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePostComment()} className="flex-1 bg-transparent outline-none text-[13px] dark:text-white" /><button onClick={handlePostComment} className="p-2 rounded-full bg-[#C2410C] text-white"><Send className="w-3.5 h-3.5" /></button></div></div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. ADMIN DASHBOARD
// ==========================================
const AdminDashboard = ({ posts }) => {
  const [adminTab, setAdminTab] = useState('overview');
  const handleDelete = async (postId) => { if (window.confirm("ডিলিট করবেন?")) await deleteDoc(doc(db, "posts", postId)); };
  const togglePremium = async (postId, current) => { await updateDoc(doc(db, "posts", postId), { isPremium: !current }); };

  return (
    <div className="w-full pb-20 font-sans animate-in fade-in">
      <div className="bg-gray-900 p-6 rounded-3xl shadow-lg mb-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6"><ShieldCheck className="w-7 h-7 text-emerald-400" /> অ্যাডমিন কন্ট্রোল সেন্টার</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-2xl"><Activity className="w-6 h-6 text-blue-400 mb-2"/><p className="text-gray-400 text-sm">মোট পোস্ট</p><h3 className="text-2xl font-bold">{posts.length}</h3></div>
          <div className="bg-white/10 p-4 rounded-2xl"><Users className="w-6 h-6 text-purple-400 mb-2"/><p className="text-gray-400 text-sm">মোট ইউজার</p><h3 className="text-2xl font-bold">৩,৪৫০</h3></div>
          <div className="bg-white/10 p-4 rounded-2xl"><DollarSign className="w-6 h-6 text-emerald-400 mb-2"/><p className="text-gray-400 text-sm">আয়</p><h3 className="text-2xl font-bold">৳১২,৪০০</h3></div>
        </div>
      </div>
      <div className="flex border-b mb-6 bg-white dark:bg-[#242526] rounded-xl px-2 dark:border-[#333436]">
        {[{id:'overview', label:'Posts'}, {id:'users', label:'Users'}, {id:'revenue', label:'Payments'}].map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} className={`flex-1 py-3 font-bold text-[14px] border-b-2 ${adminTab === t.id ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-500'}`}>{t.label}</button>
        ))}
      </div>
      <div className="bg-white dark:bg-[#242526] rounded-3xl border dark:border-[#333436] overflow-hidden">
        {adminTab === 'overview' && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-[#3A3B3C] text-sm dark:text-gray-300"><tr><th className="p-4">লেখক</th><th className="p-4">স্ট্যাটাস</th><th className="p-4 text-right">অ্যাকশন</th></tr></thead>
            <tbody className="divide-y dark:divide-[#333436]">
              {posts.map(post => (
                <tr key={post.id} className="dark:text-white">
                  <td className="p-4 font-bold text-sm">{post.authorName}</td>
                  <td className="p-4"><button onClick={() => togglePremium(post.id, post.isPremium)} className={`px-3 py-1 text-xs font-bold rounded-full ${post.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{post.isPremium ? 'PRO' : 'FREE'}</button></td>
                  <td className="p-4 text-right"><button onClick={() => handleDelete(post.id)} className="text-red-500"><Trash2 className="w-5 h-5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 6. MESSAGE VIEW
// ==========================================
const MessageView = ({ predefinedChat, onClosePredefined }) => {
  const [activeChat, setActiveChat] = useState(predefinedChat || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeChat) return;
    const chatRoomId = [DB.currentUser.id, activeChat.id].sort().join('_');
    const q = query(collection(db, "chats", chatRoomId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, [activeChat]);

  const handleSendMessage = async (type = 'text', content = inputText) => {
    if (type === 'text' && !content.trim()) return;
    const chatRoomId = [DB.currentUser.id, activeChat.id].sort().join('_');
    try {
      await addDoc(collection(db, "chats", chatRoomId, "messages"), { senderId: DB.currentUser.id, text: content, type: type, createdAt: serverTimestamp() });
      setInputText('');
    } catch (error) { alert("সমস্যা হয়েছে!"); }
  };

  return (
    <div className="w-full bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333436] h-[calc(100vh-8rem)] flex overflow-hidden font-sans">
      <div className={`w-full md:w-2/5 border-r dark:border-[#333436] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b dark:border-[#333436]"><h2 className="font-bold text-lg dark:text-white">ইনবক্স</h2></div>
        <div className="flex-1 overflow-y-auto">
          {DB.chatList.map(chat => (
            <div key={chat.id} onClick={() => setActiveChat(chat)} className={`flex items-center gap-3 p-4 border-b dark:border-[#3A3B3C] cursor-pointer ${activeChat?.id === chat.id ? 'bg-orange-50 dark:bg-[#3A3B3C]' : 'hover:bg-gray-50'}`}>
              <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt="" /><div className="flex-1 min-w-0"><h4 className="font-bold text-[14px] dark:text-white">{chat.name}</h4><p className="text-[12px] text-gray-500 truncate">{chat.lastMsg}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className={`w-full md:w-3/5 flex flex-col bg-[#F9FAFB] dark:bg-[#18191A] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-white dark:bg-[#242526] border-b dark:border-[#333436] flex justify-between items-center z-10"><div className="flex items-center gap-3"><button onClick={() => {setActiveChat(null); if(onClosePredefined) onClosePredefined();}} className="md:hidden"><ArrowLeft className="w-5 h-5 text-gray-500" /></button><img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /><div><h4 className="font-bold text-[15px] dark:text-white leading-tight">{activeChat.name}</h4><span className="text-[11px] text-emerald-500 font-medium">অনলাইনে আছেন</span></div></div></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
              {messages.length === 0 && <div className="text-center text-gray-400 text-sm mt-10">মেসেজ পাঠান!</div>}
              {messages.map((msg) => {
                const isMe = msg.senderId === DB.currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 text-[14px] shadow-sm ${isMe ? 'bg-[#C2410C] text-white rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-[#3A3B3C] dark:text-white rounded-2xl rounded-tl-sm'}`}>
                      {msg.type === 'text' && msg.text}
                      {msg.type === 'image' && <div className="space-y-1"><img src={msg.text} alt="Shared" className="rounded-xl w-48 h-48 object-cover border border-black/10" /><span className="text-[10px] opacity-70">ছবি পাঠানো হয়েছে</span></div>}
                      {msg.type === 'audio' && <div className="flex items-center gap-2 min-w-[150px]"><div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center"><Mic className="w-4 h-4" /></div><div className="flex-1 h-1.5 bg-black/20 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-white rounded-full"></div></div><span className="text-[11px]">0:12</span></div>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-white dark:bg-[#242526] border-t dark:border-[#333436]">
              <div className="flex items-end gap-2">
                <div className="flex gap-1 mb-1"><button onClick={() => handleSendMessage('image', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300')} className="p-2 text-gray-400 hover:text-[#C2410C] hover:bg-orange-50 rounded-full transition-colors"><Image className="w-5 h-5" /></button><button onClick={() => handleSendMessage('audio', 'dummy_audio_url')} className="p-2 text-gray-400 hover:text-[#C2410C] hover:bg-orange-50 rounded-full transition-colors"><Mic className="w-5 h-5" /></button></div>
                <div className="flex-1 flex bg-gray-100 dark:bg-[#3A3B3C] rounded-3xl p-1.5 pl-4 items-center"><input type="text" placeholder="মেসেজ লিখুন..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage('text')} className="flex-1 bg-transparent outline-none text-[14px] dark:text-white py-1.5" /><button onClick={() => handleSendMessage('text')} disabled={!inputText.trim()} className={`p-2 rounded-full ${inputText.trim() ? 'bg-[#C2410C] text-white' : 'bg-gray-200 text-gray-400'}`}><Send className="w-4 h-4" /></button></div>
              </div>
            </div>
          </>
        ) : (<div className="flex-1 flex flex-col items-center justify-center text-gray-400"><MessageSquare className="w-16 h-16 mb-4 opacity-20" /><p className="font-medium">চ্যাট নির্বাচন করুন</p></div>)}
      </div>
    </div>
  );
};

// ==========================================
// 7. PROFILE VIEW
// ==========================================
const ProfileView = ({ posts, savedPosts, onSavePost }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const myPosts = posts.filter(p => p.authorName === DB.currentUser.name);

  return (
    <div className="w-full pb-20 font-sans">
      <div className="bg-white dark:bg-[#242526] rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-[#C2410C] to-orange-400 w-full"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-10 sm:-mt-12 mb-4"><img src={DB.currentUser.avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-[#242526] bg-white" alt="" /><button className="px-4 py-1.5 border dark:border-[#4E4F50] rounded-full text-[13px] font-semibold dark:text-white">এডিট প্রোফাইল</button></div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-1.5 dark:text-white">{DB.currentUser.name} <BadgeCheck className="w-5 h-5 text-blue-500" /></h2>
        </div>
      </div>
      <div className="flex border-b mb-4 bg-white dark:bg-[#242526] rounded-xl px-2 dark:border-[#333436]">
        <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3.5 font-bold text-[14px] border-b-2 ${activeTab === 'posts' ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-500'}`}>আমার লেখা</button>
        <button onClick={() => setActiveTab('bookshelf')} className={`flex-1 py-3.5 font-bold text-[14px] border-b-2 ${activeTab === 'bookshelf' ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-500'}`}>বুকশেলফ ({savedPosts.length})</button>
      </div>
      <div className="space-y-4">
        {activeTab === 'posts' && (myPosts.length > 0 ? myPosts.map(post => <PostCard key={post.id} post={post} isPremiumUser={true} />) : <p className="text-center text-gray-500 py-10">কোনো লেখা পাওয়া যায়নি।</p>)}
        {activeTab === 'bookshelf' && (savedPosts.length > 0 ? savedPosts.map(post => <PostCard key={post.id} post={post} isPremiumUser={true} onSavePost={onSavePost} isSaved={true} />) : <div className="text-center py-10 flex flex-col items-center"><Bookmark className="w-12 h-12 text-gray-300 mb-3" /><p className="text-gray-500">কোনো পোস্ট সেভ করেননি।</p></div>)}
      </div>
    </div>
  );
};

// ==========================================
// 8. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [currentView, setCurrentView] = useState('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(DB.currentUser.isPremium);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [chatWithUser, setChatWithUser] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => { setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); });
    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleOpenChatFromPost = (user) => { 
    if(!isLoggedIn) return setIsAuthModalOpen(true);
    setChatWithUser(user); setCurrentView('messages'); 
  };
  const handleSavePost = (post) => {
    if(!isLoggedIn) return setIsAuthModalOpen(true);
    setSavedPosts(prev => prev.some(p => p.id === post.id) ? prev.filter(p => p.id !== post.id) : [...prev, post]);
  };

  const navItems = [
    { id: 'feed', label: 'হোম', icon: Home },
    { id: 'poems', label: 'কবিতা', icon: Feather },
    { id: 'library', label: 'বই', icon: BookOpen },
    { id: 'messages', label: 'মেসেজ', icon: MessageSquare },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];
  if (isLoggedIn && DB.currentUser.role === 'admin') navItems.push({ id: 'admin', label: 'অ্যাডমিন প্যানেল', icon: ShieldCheck });

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-[#18191A] text-[#E4E6EB]' : 'bg-[#F3F4F6] text-[#1C1917]'}`}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#242526]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3E4042] z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-xl sm:text-2xl text-[#C2410C] font-serif cursor-pointer" onClick={() => setCurrentView('feed')}>বইয়ের জগৎ</h1>
            {isLoggedIn && <span className={`ml-2 text-[10px] font-bold px-2 py-1 rounded-full border ${isPremiumUser ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-gray-300 text-gray-500'}`}>{isPremiumUser ? '👑 PRO' : 'FREE'}</span>}
          </div>
          
          <div className="flex gap-2 sm:gap-3 items-center">
            {!isLoggedIn ? (
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-1.5 bg-[#1C1917] dark:bg-white text-white dark:text-black px-5 py-2 rounded-full font-bold text-[13px] shadow-sm"><LogIn className="w-4 h-4" /> লগইন করুন</button>
            ) : (
              <>
                {!isPremiumUser && <button onClick={() => setIsPaymentModalOpen(true)} className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-[13px] shadow-sm"><Crown className="w-4 h-4" /> Try Premium</button>}
                <div onClick={() => {setChatWithUser(null); setCurrentView('messages');}} className="w-9 h-9 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer"><MessageSquare className="w-4 h-4 text-gray-700 dark:text-[#E4E6EB]" /></div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto pt-20 px-4 w-full flex justify-center lg:justify-between gap-6">
        
        <aside className="hidden lg:flex flex-col w-[250px] sticky top-24 h-[calc(100vh-6rem)]">
          <nav className="space-y-1 flex-1">
            {navItems.map(item => (
              <button key={item.id} onClick={() => {
                if(!isLoggedIn && item.id !== 'feed') return setIsAuthModalOpen(true);
                setCurrentView(item.id); 
                if(item.id !== 'messages') setChatWithUser(null);
              }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-[15px] ${currentView === item.id ? 'bg-[#C2410C]/10 text-[#C2410C]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3B3C]'}`}><item.icon className="w-5 h-5" /> {item.label}</button>
            ))}
          </nav>
          <button onClick={() => setDarkMode(!darkMode)} className="mt-4 flex items-center gap-4 px-4 py-3 bg-gray-100 dark:bg-[#3A3B3C] rounded-xl font-semibold text-[15px] text-gray-700 dark:text-gray-200">{darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />} {darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</button>
        </aside>

        <main className={`w-full ${currentView === 'admin' || currentView === 'messages' ? 'lg:max-w-[850px]' : 'max-w-[600px]'} flex-1 min-w-0 transition-all duration-300`}>
          {currentView === 'feed' && (
            <div className="w-full pb-20">
              <div className="bg-white dark:bg-[#242526] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 flex gap-3 items-center">
                <img src={isLoggedIn ? DB.currentUser.avatar : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-10 h-10 rounded-full" alt="" />
                <div onClick={() => isLoggedIn ? setIsPostModalOpen(true) : setIsAuthModalOpen(true)} className="flex-1 bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-5 py-3 text-[14px] text-gray-500 cursor-pointer">আপনার ভাবনা লিখুন...</div>
              </div>
              
              <div className="space-y-4">
                {posts.length === 0 ? <div className="text-center py-10 text-gray-500">লোডিং হচ্ছে...</div> : posts.map((post) => (
                  <PostCard key={post.id} post={post} isPremiumUser={isPremiumUser} onUnlockPremium={() => isLoggedIn ? setIsPaymentModalOpen(true) : setIsAuthModalOpen(true)} onMessageAuthor={handleOpenChatFromPost} onSavePost={handleSavePost} isSaved={savedPosts.some(p => p.id === post.id)} />
                ))}
              </div>
            </div>
          )}
          {currentView === 'messages' && <MessageView predefinedChat={chatWithUser} onClosePredefined={() => setChatWithUser(null)} />}
          {currentView === 'profile' && <ProfileView posts={posts} savedPosts={savedPosts} onSavePost={handleSavePost} />}
          {currentView === 'admin' && <AdminDashboard posts={posts} />}
          {(currentView === 'poems' || currentView === 'library') && <div className="text-center py-20 text-gray-500 font-bold">এই পেজটি নির্মাণাধীন...</div>}
        </main>

        <aside className={`${currentView === 'admin' || currentView === 'messages' ? 'hidden' : 'hidden xl:flex'} flex-col w-[280px] sticky top-24 h-[calc(100vh-6rem)]`}>
          <div className="bg-white dark:bg-[#242526] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3E4042]">
            <h3 className="font-bold text-[14px] mb-4 flex items-center gap-2 text-[#1C1917] dark:text-white"><TrendingUp className="w-4 h-4 text-[#C2410C]" /> ট্রেন্ডিং বইসমূহ</h3>
            <div className="space-y-4">{DB.trendingBooks.map(book => <div key={book.id} className="flex gap-3"><img src={book.cover} className="w-10 h-14 rounded object-cover" alt="" /><div><h4 className="font-semibold text-[13px] dark:text-white">{book.title}</h4><p className="text-[11px] text-gray-500">{book.author}</p></div></div>)}</div>
          </div>
        </aside>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={() => setIsLoggedIn(true)} />
      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <SubscriptionModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSubscribe={() => { setIsPremiumUser(true); setIsPaymentModalOpen(false); }} />
    </div>
  );
}