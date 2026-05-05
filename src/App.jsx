import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Bell, User, Heart, MessageCircle, Share2, 
  Bookmark, MoreVertical, Quote, Menu, Home, Feather, FileText, 
  Moon, Sun, TrendingUp, PlusCircle, BadgeCheck, Folder, 
  MessageSquare, Phone, Video, Send, ArrowLeft, 
  Crown, Lock, Download, ExternalLink, X, Image, Link, CheckCircle 
} from 'lucide-react';

// --- ফায়ারবেস ইমপোর্ট ---
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// --- MOCK DB (ইউজার ডেটা আপাতত লোকাল রাখছি, পরে অথেনটিকেশন যোগ করব) ---
const DB = {
  currentUser: {
    id: 'u_1', name: 'রাফসান আহমেদ', role: 'user', isAuthor: true, isPremium: false, 
    followers: '1.2k', following: '120',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
  },
  trendingBooks: [
    { id: 'tb1', title: 'নূরজাহান', author: 'ইমদাদুল হক মিলন', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
    { id: 'tb2', title: 'দেয়াল', author: 'হুমায়ূন আহমেদ', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100' },
  ],
  savedFolders: [
    { id: 'f1', name: 'প্রিয় কবিতা', count: 12, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-500/10' },
  ],
  chats: [
    { id: 'c1', name: 'সাদিয়া ইসলাম', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', lastMsg: 'নতুন কবিতাটা দারুণ হয়েছে!', time: '১০:৩০ মি.', unread: 2 },
  ]
};

// --- SUBSCRIPTION / PAYMENT MODAL ---
const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => onSubscribe(), 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[80] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#242526] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden font-sans relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors z-10"><X className="w-5 h-5" /></button>
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
            <h2 className="text-2xl font-bold text-[#1C1917] dark:text-[#E4E6EB] mb-2">পেমেন্ট সফল হয়েছে!</h2>
            <p className="text-gray-500">আপনাকে প্রো (PRO) মেম্বারশিপে আপগ্রেড করা হয়েছে।</p>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-4"><Crown className="w-12 h-12 text-amber-500" /></div>
            <h2 className="text-2xl font-bold text-center text-[#1C1917] dark:text-[#E4E6EB] mb-2">প্রিমিয়াম আনলক করুন</h2>
            <p className="text-center text-[14px] text-gray-500 mb-6">বিজ্ঞাপনমুক্ত পড়ুন এবং এক্সক্লুসিভ গল্প ও কবিতা আনলক করুন।</p>
            <div className="bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-500 rounded-2xl p-4 mb-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider">POPULAR</div>
              <div className="flex justify-between items-center mb-2"><span className="font-bold text-amber-800 dark:text-amber-500 text-lg">মাসিক সাবস্ক্রিপশন</span><span className="font-bold text-2xl text-[#1C1917] dark:text-[#E4E6EB]">৳৫০<span className="text-[14px] text-gray-500 font-normal">/মাস</span></span></div>
              <ul className="text-[13px] text-amber-700 dark:text-amber-200/80 space-y-1"><li>✓ সকল প্রিমিয়াম কন্টেন্ট আনলক</li><li>✓ অফলাইন সেভ করার সুবিধা</li><li>✓ সম্পূর্ণ বিজ্ঞাপনমুক্ত</li></ul>
            </div>
            <button onClick={handlePayment} disabled={isProcessing} className={`w-full py-3.5 rounded-xl font-bold text-[15px] shadow-lg transition-all flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02]'}`}>
              {isProcessing ? 'পেমেন্ট প্রসেস হচ্ছে...' : 'বিকাশ/নগদ দিয়ে পেমেন্ট করুন'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- CREATE POST MODAL COMPONENT (FIREBASE CONNECTED) ---
const CreatePostModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('short');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;
  const categories = [{ id: 'short', label: 'ছোট কবিতা', icon: Feather }, { id: 'long', label: 'গল্প', icon: FileText }, { id: 'review', label: 'বইয়ের রিভিউ', icon: BookOpen }, { id: 'quote', label: 'উদ্ধৃতি', icon: Quote }];

  // ফায়ারবেসে ডেটা পাঠানোর ফাংশন
  const handlePublish = async () => {
    if (!postContent.trim()) return alert('অনুগ্রহ করে কিছু লিখুন!');
    setIsPublishing(true);
    
    try {
      await addDoc(collection(db, 'posts'), {
        authorName: DB.currentUser.name,
        isAuthor: DB.currentUser.isAuthor,
        isPremium: false, // আপাতত সব পোস্ট ফ্রি
        avatar: DB.currentUser.avatar,
        type: selectedCategory === 'short' || selectedCategory === 'quote' ? 'short' : 'long',
        title: postTitle,
        content: postContent,
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp() // ফায়ারবেসের টাইমস্ট্যাম্প
      });
      
      setPostTitle(''); setPostContent(''); onClose();
    } catch (error) {
      console.error("Error adding post: ", error);
      alert("পোস্ট পাবলিশ করতে সমস্যা হয়েছে!");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#242526] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-[#333436]">
          <div className="flex items-center gap-3"><button onClick={onClose} className="p-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"><X className="w-5 h-5" /></button><h2 className="font-bold text-lg text-[#1C1917] dark:text-[#E4E6EB]">নতুন পোস্ট তৈরি করুন</h2></div>
          <button onClick={handlePublish} disabled={isPublishing || !postContent.trim()} className={`px-5 py-2 rounded-full font-bold text-[14px] transition-all ${postContent.trim() ? 'bg-[#C2410C] text-white shadow-md hover:bg-[#9A3412]' : 'bg-gray-100 dark:bg-[#3A3B3C] text-gray-400 cursor-not-allowed'}`}>
            {isPublishing ? 'পাবলিশ হচ্ছে...' : 'পাবলিশ করুন'}
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 mb-6"><img src={DB.currentUser.avatar} className="w-12 h-12 rounded-full object-cover" alt="" /><div><h4 className="font-bold text-[#1C1917] dark:text-[#E4E6EB]">{DB.currentUser.name}</h4><p className="text-[12px] text-gray-500">Public • Everyone can see</p></div></div>
          <div className="mb-6"><p className="text-[13px] font-bold text-gray-500 mb-3 uppercase tracking-wider">ক্যাটাগরি নির্বাচন করুন</p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map(cat => <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${selectedCategory === cat.id ? 'border-[#C2410C] bg-rose-50 dark:bg-[#C2410C]/10 text-[#C2410C]' : 'border-gray-200 dark:border-[#3E4042] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3A3B3C]'}`}><cat.icon className="w-4 h-4" /> {cat.label}</button>)}
            </div>
          </div>
          <div className="bg-[#FDFBF7] dark:bg-[#1E1F20] border border-gray-100 dark:border-[#333436] rounded-2xl p-4">
            {(selectedCategory === 'long' || selectedCategory === 'review') && <input type="text" placeholder="পোস্টের শিরোনাম (Title)" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full bg-transparent border-b border-gray-200 dark:border-[#3E4042] pb-3 mb-3 outline-none font-bold text-xl font-serif text-[#1C1917] dark:text-[#E4E6EB] placeholder:text-gray-400" />}
            <textarea placeholder={`আপনার ${categories.find(c => c.id === selectedCategory).label} এখানে লিখুন...`} value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full bg-transparent outline-none resize-none font-serif text-[#3F3F46] dark:text-[#D1D5DB] text-lg sm:text-xl leading-relaxed min-h-[150px] placeholder:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- AD BANNER COMPONENT ---
const AdBanner = () => (
  <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 dark:border-[#3E4042] mb-4 sm:mb-6 flex flex-col items-center text-center relative overflow-hidden group cursor-pointer">
    <div className="absolute top-0 right-0 bg-gray-100 dark:bg-[#3A3B3C] px-2 py-1 rounded-bl-lg text-[9px] font-bold text-gray-400 uppercase tracking-wider">Ad</div>
    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><ExternalLink className="w-6 h-6 text-blue-500" /></div>
    <h4 className="font-bold text-[#1C1917] dark:text-[#E4E6EB] text-[15px] mb-1">রকমারি বইমেলা ২০২৫</h4>
    <p className="text-[13px] text-gray-500 mb-4">বেস্টসেলার বইগুলোতে পান সর্বোচ্চ ৫০% পর্যন্ত ছাড়! আজই অর্ডার করুন।</p>
    <button className="bg-[#1C1917] dark:bg-white text-white dark:text-black px-6 py-2 rounded-full text-[13px] font-bold hover:opacity-90 transition-opacity">অর্ডার করুন</button>
  </div>
);

// --- POST CARD COMPONENT ---
const PostCard = ({ post, isPremiumUser, onUnlockPremium }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const isLong = post.type === 'long';
  const isLocked = post.isPremium && !isPremiumUser; 

  const handleLike = () => { setIsLiked(!isLiked); setLikeCount(isLiked ? likeCount - 1 : likeCount + 1); };
  const handlePostComment = () => {
    if (!commentText.trim()) return;
    setCommentsList([...commentsList, { id: Date.now(), user: DB.currentUser.name, avatar: DB.currentUser.avatar, text: commentText }]);
    setCommentText('');
  };

  return (
    <div className="bg-white dark:bg-[#242526] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 sm:mb-6 transition-all animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between mb-4 sm:mb-5 font-sans">
        <div className="flex items-center gap-3">
          <img src={post.avatar} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-[#3A3B3C]" alt="" />
          <div><h4 className="font-bold text-[#292524] dark:text-[#E4E6EB] text-[14px] sm:text-[15px] flex items-center gap-1">{post.authorName} {post.isAuthor && <BadgeCheck className="w-[15px] h-[15px] text-blue-500" />}</h4><p className="text-[12px] text-[#78716C] dark:text-[#9CA3AF] mt-0.5">এখনই • {post.type === 'short' ? 'কবিতা/উদ্ধৃতি' : 'গল্প/প্রবন্ধ'}</p></div>
        </div>
        <MoreVertical className="w-5 h-5 text-[#A8A29E] dark:text-[#B0B3B8] cursor-pointer" />
      </div>
      
      <div className="mb-4">
        {post.title && <h3 className="font-bold text-xl sm:text-2xl font-serif mb-3 text-[#1C1917] dark:text-[#E4E6EB] flex flex-wrap gap-2">{post.title}{post.isPremium && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-500/20 dark:to-orange-500/20 text-amber-700 dark:text-amber-500 text-[11px] font-sans font-bold tracking-wide"><Lock className="w-3 h-3" /> Premium</span>}</h3>}
        <div className="relative bg-[#FDFBF7] dark:bg-[#1E1F20] border-l-[4px] border-l-[#C2410C] rounded-r-xl rounded-l-sm p-4 sm:p-5 overflow-hidden">
          {post.type === 'short' && <Quote className="absolute top-3 right-3 w-8 h-8 text-black/5 dark:text-white/5 rotate-180 pointer-events-none" />}
          <div className={isLocked ? 'blur-[4px] select-none opacity-60 pointer-events-none' : ''}>
            <p className={`text-[#3F3F46] dark:text-[#D1D5DB] font-serif whitespace-pre-line ${post.type === 'short' ? 'text-[16px] sm:text-lg font-medium leading-loose' : 'text-[15px] sm:text-[16px] leading-relaxed'} ${!expanded && isLong ? 'line-clamp-4' : ''}`}>{post.content}</p>
          </div>
          {isLocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-[#1E1F20]/60 backdrop-blur-[1px]">
              <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl shadow-lg flex flex-col items-center text-center border border-amber-100 dark:border-amber-500/20">
                <Crown className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="font-bold text-[#1C1917] dark:text-[#E4E6EB] text-[14px] mb-1">প্রিমিয়াম কন্টেন্ট</h4>
                <p className="text-[11px] text-gray-500 mb-3">বাকি অংশ পড়তে সাবস্ক্রিপশন নিন</p>
                <button onClick={onUnlockPremium} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-2 rounded-full font-bold text-[13px] shadow-md hover:scale-105 transition-transform">Unlock Now</button>
              </div>
            </div>
          )}
          {isLong && !expanded && !isLocked && <button onClick={() => setExpanded(true)} className="text-[#C2410C] dark:text-[#EA580C] font-semibold text-[14px] mt-2 font-sans">আরো পড়ুন ›</button>}
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-[#333436] font-sans">
        <div className="flex gap-4 sm:gap-6 relative">
          <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors group ${isLiked ? 'text-rose-500' : 'text-[#78716C] dark:text-[#9CA3AF] hover:text-rose-500'}`}><Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-current scale-110' : 'group-hover:scale-110 group-active:scale-125'}`} /> <span className="text-[13px] font-semibold">{likeCount}</span></button>
          <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1.5 transition-colors group ${showComments ? 'text-blue-500' : 'text-[#78716C] dark:text-[#9CA3AF] hover:text-blue-500'}`}><MessageCircle className={`w-5 h-5 transition-transform duration-300 ${showComments ? 'fill-blue-50 dark:fill-blue-500/20' : 'group-hover:scale-110 group-active:scale-125'}`} /> <span className="text-[13px] font-semibold">{(post.comments || 0) + commentsList.length}</span></button>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} onBlur={() => setTimeout(() => setShowShareMenu(false), 200)} className="flex items-center gap-1.5 text-[#78716C] hover:text-gray-900 dark:text-[#9CA3AF] dark:hover:text-white transition-colors group"><Share2 className="w-5 h-5 group-hover:scale-110 group-active:scale-125 transition-transform" /></button>
            {showShareMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#3A3B3C] border border-gray-100 dark:border-[#4E4F50] rounded-xl shadow-xl z-10 animate-in slide-in-from-bottom-2 fade-in duration-200 overflow-hidden">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#4E4F50] transition-colors"><Link className="w-4 h-4" /> কপি লিংক</button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#4E4F50] transition-colors border-t border-gray-100 dark:border-[#4E4F50]"><Send className="w-4 h-4 text-blue-500" /> মেসেঞ্জারে পাঠান</button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          {isPremiumUser && <button title="Save Offline" className="flex items-center justify-center p-1.5 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 transition-all"><Download className="w-5 h-5" /></button>}
          <button title="Add to Bookshelf" className="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-[#3A3B3C] text-[#78716C] dark:text-[#9CA3AF] hover:text-[#C2410C] transition-all"><Bookmark className="w-5 h-5" /></button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#333436] font-sans animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-48 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin">
            {commentsList.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <img src={comment.avatar} className="w-8 h-8 rounded-full object-cover mt-0.5" alt="" />
                <div className="bg-gray-50 dark:bg-[#3A3B3C] px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex-1"><h5 className="font-bold text-[13px] text-[#1C1917] dark:text-[#E4E6EB]">{comment.user}</h5><p className="text-[13px] text-gray-700 dark:text-gray-300 mt-0.5">{comment.text}</p></div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <img src={DB.currentUser.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
            <div className="flex-1 relative">
              <input type="text" placeholder="আপনার মন্তব্য লিখুন..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handlePostComment()} className="w-full bg-gray-100 dark:bg-[#3A3B3C] text-[13px] text-gray-800 dark:text-[#E4E6EB] rounded-full px-4 py-2.5 pr-10 outline-none border border-transparent focus:border-gray-200 dark:focus:border-[#4E4F50] transition-colors" />
              <button onClick={handlePostComment} disabled={!commentText.trim()} className={`absolute right-1.5 top-1.5 p-1 rounded-full transition-colors ${commentText.trim() ? 'bg-[#C2410C] text-white' : 'text-gray-400 cursor-not-allowed'}`}><Send className="w-3.5 h-3.5 translate-x-[1px] translate-y-[1px]" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- FEED VIEW COMPONENT ---
const FeedView = ({ posts, isPremiumUser, onOpenPostModal, onUnlockPremium }) => (
  <div className="w-full pb-24 lg:pb-10 font-sans">
    <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 flex gap-3 items-center">
      <img src={DB.currentUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="User" />
      <div onClick={onOpenPostModal} className="flex-1 bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-5 py-3 text-[14px] text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors">আপনার সাহিত্যিক ভাবনা লিখুন...</div>
    </div>
    
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500">লোডিং হচ্ছে...</div>
      ) : (
        posts.map((post, index) => (
          <React.Fragment key={post.id}>
            <PostCard post={post} isPremiumUser={isPremiumUser} onUnlockPremium={onUnlockPremium} />
            {index === 0 && !isPremiumUser && <AdBanner />}
          </React.Fragment>
        ))
      )}
    </div>
  </div>
);

// --- PROFILE VIEW COMPONENT ---
const ProfileView = ({ posts, isPremiumUser }) => {
  const [activeTab, setActiveTab] = useState('posts');
  // ফায়ারবেস থেকে পাওয়া পোস্টগুলো ফিল্টার করা
  const myPosts = posts.filter(p => p.authorName === DB.currentUser.name);

  return (
    <div className="w-full pb-24 lg:pb-10 font-sans">
      <div className="bg-white dark:bg-[#242526] rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 overflow-hidden">
        <div className="h-24 sm:h-32 bg-gradient-to-r from-[#C2410C] to-orange-400 w-full"></div>
        <div className="px-4 sm:px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-10 sm:-mt-12 mb-4">
            <img src={DB.currentUser.avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-[#242526] object-cover bg-white" alt="Profile" />
            <button className="px-4 py-1.5 border border-gray-200 dark:border-[#4E4F50] rounded-full text-[13px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3A3B3C]">এডিট প্রোফাইল</button>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] dark:text-[#E4E6EB] flex items-center gap-1.5">{DB.currentUser.name} {DB.currentUser.isAuthor && <BadgeCheck className="w-5 h-5 text-blue-500" />}</h2>
            <p className="text-[13px] text-gray-500 mb-4">@rafsan_reads</p>
            <div className="flex gap-6 text-[#1C1917] dark:text-[#E4E6EB]">
              <div><span className="font-bold">{DB.currentUser.followers}</span> <span className="text-[13px] text-gray-500">ফলোয়ার</span></div>
              <div><span className="font-bold">{DB.currentUser.following}</span> <span className="text-[13px] text-gray-500">ফলোয়িং</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex border-b border-gray-200 dark:border-[#333436] mb-4 bg-white dark:bg-[#242526] rounded-t-xl px-2">
        <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3.5 font-semibold text-[14px] border-b-2 transition-colors ${activeTab === 'posts' ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-500'}`}>আমার লেখা</button>
        <button onClick={() => setActiveTab('bookshelf')} className={`flex-1 py-3.5 font-semibold text-[14px] border-b-2 transition-colors ${activeTab === 'bookshelf' ? 'border-[#C2410C] text-[#C2410C]' : 'border-transparent text-gray-500'}`}>বুকশেলফ (Saved)</button>
      </div>
      <div>
        {activeTab === 'posts' && <div className="space-y-4">{myPosts.length > 0 ? myPosts.map(post => <PostCard key={post.id} post={post} isPremiumUser={isPremiumUser} />) : <p className="text-center text-gray-500 py-10">কোনো লেখা পাওয়া যায়নি।</p>}</div>}
        {activeTab === 'bookshelf' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {DB.savedFolders.map(folder => (
              <div key={folder.id} className="bg-white dark:bg-[#242526] p-4 rounded-2xl border border-gray-100 dark:border-[#333436] flex items-center gap-4 cursor-pointer hover:shadow-sm transition-all group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${folder.bg} ${folder.color}`}><Folder className="w-7 h-7 group-hover:scale-110 transition-transform" /></div>
                <div><h4 className="font-bold text-[#1C1917] dark:text-[#E4E6EB] text-[15px]">{folder.name}</h4><p className="text-[12px] text-gray-500 mt-0.5">{folder.count} টি সেভ করা আইটেম</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MESSAGE VIEW COMPONENT (Unchanged) ---
const MessageView = () => {
  const [activeChat, setActiveChat] = useState(null);
  return (
    <div className="w-full bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-100 dark:border-[#333436] h-[calc(100vh-8rem)] flex overflow-hidden font-sans">
      <div className={`w-full md:w-2/5 lg:w-1/3 border-r border-gray-100 dark:border-[#333436] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 dark:border-[#333436]"><h2 className="font-bold text-lg text-[#1C1917] dark:text-[#E4E6EB]">মেসেজসমূহ</h2></div>
        <div className="flex-1 overflow-y-auto">
          {DB.chats.map(chat => (
            <div key={chat.id} onClick={() => setActiveChat(chat)} className="flex items-center gap-3 p-4 border-b border-gray-50 dark:border-[#3A3B3C] cursor-pointer hover:bg-gray-50 dark:hover:bg-[#3A3B3C] transition-colors">
              <img src={chat.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
              <div className="flex-1 min-w-0"><div className="flex justify-between items-center mb-1"><h4 className="font-bold text-[14px] text-[#1C1917] dark:text-[#E4E6EB] truncate">{chat.name}</h4><span className="text-[11px] text-gray-400">{chat.time}</span></div><p className={`text-[13px] truncate ${chat.unread > 0 ? 'text-[#1C1917] dark:text-white font-semibold' : 'text-gray-500'}`}>{chat.lastMsg}</p></div>
              {chat.unread > 0 && <div className="w-5 h-5 bg-[#C2410C] rounded-full flex items-center justify-center text-white text-[10px] font-bold">{chat.unread}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className={`w-full md:w-3/5 lg:w-2/3 flex flex-col bg-[#F9FAFB] dark:bg-[#18191A] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <div className="p-4 bg-white dark:bg-[#242526] border-b border-gray-100 dark:border-[#333436] flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3"><button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-gray-500"><ArrowLeft className="w-5 h-5" /></button><img src={activeChat.avatar} className="w-10 h-10 rounded-full object-cover" alt="" /><h4 className="font-bold text-[15px] text-[#1C1917] dark:text-[#E4E6EB]">{activeChat.name}</h4></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex flex-col gap-1 items-start"><div className="bg-white dark:bg-[#3A3B3C] p-3 rounded-2xl rounded-tl-none shadow-sm text-[14px] text-gray-800 dark:text-gray-200 max-w-[80%]">{activeChat.lastMsg}</div><span className="text-[10px] text-gray-400 ml-1">{activeChat.time}</span></div>
            </div>
            <div className="p-4 bg-white dark:bg-[#242526] border-t border-gray-100 dark:border-[#333436]">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#3A3B3C] rounded-full p-1 pl-4"><input type="text" placeholder="মেসেজ লিখুন..." className="flex-1 bg-transparent border-none outline-none text-[14px] text-gray-800 dark:text-gray-200" /><button className="bg-[#C2410C] text-white p-2.5 rounded-full hover:bg-orange-700 transition-colors"><Send className="w-4 h-4 translate-x-px translate-y-px" /></button></div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 font-medium">চ্যাট শুরু করতে বাম পাশ থেকে একটি নাম নির্বাচন করুন</div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isPremiumUser, setIsPremiumUser] = useState(DB.currentUser.isPremium);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // ফায়ারবেস থেকে ডেটা লোড করার স্টেট
  const [posts, setPosts] = useState([]);

  // ফায়ারবেস থেকে রিয়েল-টাইম ডেটা ফেচ করা
  useEffect(() => {
    // query তৈরি: 'posts' কালেকশন থেকে সব ডেটা আনো, নতুনটা আগে (descending order)
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsArray);
    });

    return () => unsubscribe(); // ক্লিনআপ
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const navItems = [
    { id: 'feed', label: 'হোম', icon: Home },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    <div className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-[#18191A] text-[#E4E6EB]' : 'bg-[#F3F4F6] text-[#1C1917]'}`}>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#242526]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3E4042] z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 lg:hidden text-gray-800 dark:text-[#E4E6EB]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            <h1 className="font-bold text-xl sm:text-2xl text-[#C2410C] font-serif cursor-pointer" onClick={() => setCurrentView('feed')}>বইয়ের জগৎ</h1>
            <span className={`ml-2 text-[10px] font-bold px-2 py-1 rounded-full border ${isPremiumUser ? 'border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-gray-300 text-gray-500'}`}>{isPremiumUser ? '👑 PRO' : 'FREE'}</span>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center">
            {!isPremiumUser && <button onClick={() => setIsPaymentModalOpen(true)} className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-[13px] shadow-sm hover:scale-105 transition-all mr-2"><Crown className="w-4 h-4" /> Try Premium</button>}
            <div className="w-9 h-9 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer"><Search className="w-4 h-4 text-gray-700 dark:text-[#E4E6EB]" /></div>
            <div onClick={() => setCurrentView('messages')} className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors ${currentView === 'messages' ? 'bg-[#C2410C]/10 text-[#C2410C]' : 'bg-gray-100 dark:bg-[#3A3B3C] text-gray-700 dark:text-[#E4E6EB]'}`}><MessageSquare className="w-4 h-4" /></div>
            <div className="w-9 h-9 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer"><Bell className="w-4 h-4 text-gray-700 dark:text-[#E4E6EB]" /></div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto pt-20 px-4 w-full flex justify-center lg:justify-between gap-6">
        <aside className="hidden lg:flex flex-col w-[250px] sticky top-24 h-[calc(100vh-6rem)]">
          {!isPremiumUser && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-500/20 mb-6 flex flex-col items-center text-center">
               <Crown className="w-8 h-8 text-amber-500 mb-2 drop-shadow-sm" /><h4 className="font-bold text-[15px] text-amber-800 dark:text-amber-500 mb-1">বিজ্ঞাপনমুক্ত পড়ুন</h4><button onClick={() => setIsPaymentModalOpen(true)} className="w-full mt-3 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold text-[14px] shadow-md hover:scale-[1.02] transition-transform">Upgrade Now</button>
            </div>
          )}
          <nav className="space-y-1 flex-1">
            {navItems.map(item => <button key={item.id} onClick={() => setCurrentView(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-[15px] ${currentView === item.id ? 'bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#3A3B3C] dark:text-[#EA580C]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3B3C]'}`}><item.icon className="w-5 h-5" /> {item.label}</button>)}
            <button onClick={() => setCurrentView('messages')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-[15px] ${currentView === 'messages' ? 'bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#3A3B3C] dark:text-[#EA580C]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3B3C]'}`}><MessageSquare className="w-5 h-5" /> মেসেজ</button>
          </nav>
          <button onClick={() => setDarkMode(!darkMode)} className="mt-4 flex items-center gap-4 px-4 py-3 bg-gray-100 dark:bg-[#3A3B3C] rounded-xl font-semibold text-[15px] text-gray-700 dark:text-gray-200">{darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />} {darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</button>
        </aside>

        <main className={`w-full ${currentView === 'messages' ? 'lg:max-w-[850px]' : 'max-w-[600px]'} flex-1 min-w-0 transition-all duration-300`}>
          {currentView === 'feed' && <FeedView posts={posts} isPremiumUser={isPremiumUser} onOpenPostModal={() => setIsPostModalOpen(true)} onUnlockPremium={() => setIsPaymentModalOpen(true)} />}
          {currentView === 'profile' && <ProfileView posts={posts} isPremiumUser={isPremiumUser} />}
          {currentView === 'messages' && <MessageView />}
        </main>

        <aside className={`${currentView === 'messages' ? 'hidden' : 'hidden xl:flex'} flex-col w-[280px] sticky top-24 h-[calc(100vh-6rem)]`}>
          <div className="bg-white dark:bg-[#242526] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3E4042] mb-5">
            <h3 className="font-bold text-[14px] mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200"><TrendingUp className="w-4 h-4 text-[#C2410C]" /> ট্রেন্ডিং বইসমূহ</h3>
            <div className="space-y-4">
              {DB.trendingBooks.map(book => <div key={book.id} className="flex gap-3"><img src={book.cover} className="w-10 h-14 rounded object-cover" alt="" /><div><h4 className="font-semibold text-[13px]">{book.title}</h4><p className="text-[11px] text-gray-500 mt-0.5">{book.author}</p></div></div>)}
            </div>
          </div>
        </aside>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-[#242526] border-t border-gray-200 dark:border-[#3E4042] z-50 lg:hidden pb-1">
        <div className="flex justify-around items-center h-14 px-2">
          <button onClick={() => setCurrentView('feed')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'feed' ? 'text-[#C2410C] dark:text-[#EA580C]' : 'text-gray-400 dark:text-gray-500'}`}><Home className={`w-5 h-5 ${currentView === 'feed' ? 'stroke-[2.5px]' : 'stroke-2'}`} /><span className="text-[10px] font-semibold">হোম</span></button>
          <button onClick={() => setCurrentView('messages')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'messages' ? 'text-[#C2410C] dark:text-[#EA580C]' : 'text-gray-400 dark:text-gray-500'}`}><MessageSquare className={`w-5 h-5 ${currentView === 'messages' ? 'stroke-[2.5px]' : 'stroke-2'}`} /><span className="text-[10px] font-semibold">মেসেজ</span></button>
          <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'profile' ? 'text-[#C2410C] dark:text-[#EA580C]' : 'text-gray-400 dark:text-gray-500'}`}><User className={`w-5 h-5 ${currentView === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} /><span className="text-[10px] font-semibold">প্রোফাইল</span></button>
        </div>
      </nav>

      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
      <SubscriptionModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSubscribe={() => { setIsPremiumUser(true); setIsPaymentModalOpen(false); }} />
    </div>
  );
}