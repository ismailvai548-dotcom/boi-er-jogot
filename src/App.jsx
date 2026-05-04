import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Bell, User, Heart, MessageCircle, Share2, 
  ChevronRight, Bookmark, Settings, MoreVertical, Star, TrendingUp, 
  Users, Edit3, PlusCircle, CheckCircle, Shield, Menu, X, ArrowLeft,
  Type, Moon, Sun, PlayCircle, Filter, AlignLeft, BookMarked, MessageSquare, 
  BookA, List
} from 'lucide-react';

// --- MOCK DATA ---

const MOCK_CATEGORIES = [
  { id: 'c1', name: 'উপন্যাস', icon: BookOpen },
  { id: 'c2', name: 'কবিতা', icon: Edit3 },
  { id: 'c3', name: 'ইসলামিক', icon: Heart },
  { id: 'c4', name: 'অনুপ্রেরণা', icon: TrendingUp },
  { id: 'c5', name: 'ইতিহাস', icon: Bookmark },
  { id: 'c6', name: 'গল্প', icon: AlignLeft },
  { id: 'c7', name: 'ভাবনা', icon: MessageSquare },
];

const MOCK_AUTHORS = [
  { id: 'a1', name: 'হুমায়ূন আহমেদ', followers: '1.2M', books: 45, writings: 120, bio: 'বাংলাদেশের সবচেয়ে জনপ্রিয় কথাসাহিত্যিক।', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'a2', name: 'সমরেশ মজুমদার', followers: '850K', books: 32, writings: 50, bio: 'প্রখ্যাত বাঙালি ঔপন্যাসিক।', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'a3', name: 'সাদাত হোসাইন', followers: '420K', books: 15, writings: 300, bio: 'সমসাময়িক জনপ্রিয় লেখক ও কবি।', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'a4', name: 'আরিফ আজাদ', followers: '950K', books: 8, writings: 45, bio: 'ইসলামিক চিন্তাবিদ ও বেস্টসেলার লেখক।', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150&h=150' },
];

const MOCK_BOOKS = [
  {
    id: 'b1', title: 'বাদশাহ নামদার', author: 'হুমায়ূন আহমেদ', category: 'ইতিহাস', rating: 4.8, reviews: 1240, chapters: 24, isPremium: false,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600',
    description: 'মোগল সম্রাট হুমায়ূনের জীবনের নানা দিক নিয়ে লেখা অসাধারণ একটি ঐতিহাসিক উপন্যাস। এতে মোগল সাম্রাজ্যের উত্থান-পতনের পাশাপাশি সম্রাটের ব্যক্তিগত জীবনের আবেগ ও দ্বন্দ্ব ফুটে উঠেছে।'
  },
  {
    id: 'b2', title: 'প্যারাডক্সিক্যাল সাজিদ', author: 'আরিফ আজাদ', category: 'ইসলামিক', rating: 4.9, reviews: 5430, chapters: 15, isPremium: false,
    cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600',
    description: 'বিশ্বাস ও অবিশ্বাসের দোলাচলে থাকা এক তরুণের গল্প। সাজিদ তার যুক্তির মাধ্যমে কীভাবে নাস্তিকতার বিভিন্ন প্রশ্নের উত্তর দেয়, তারই সংকলন।'
  },
  {
    id: 'b3', title: 'অর্ধেক জীবন', author: 'সুনীল গঙ্গোপাধ্যায়', category: 'জীবনী', rating: 4.7, reviews: 890, chapters: 30, isPremium: true,
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400&h=600',
    description: 'লেখকের নিজের জীবনের প্রথমার্ধের গল্প। শৈশব, কৈশোর এবং যৌবনের নানা ঘাত-প্রতিঘাত ও স্বপ্নের কথা তিনি সাবলীল ভাষায় তুলে ধরেছেন।'
  },
  {
    id: 'b4', title: 'সাতকাহন', author: 'সমরেশ মজুমদার', category: 'উপন্যাস', rating: 4.6, reviews: 2100, chapters: 45, isPremium: true,
    cover: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&q=80&w=400&h=600',
    description: 'দীপাবলি নামের এক লড়াকু মেয়ের জীবন সংগ্রাম। সমাজের নানা বাধা পেরিয়ে সে কীভাবে নিজেকে প্রতিষ্ঠিত করে তার অনবদ্য কাহিনি।'
  }
];

const MOCK_POSTS = [
  {
    id: 'p1', user: MOCK_AUTHORS[2], type: 'short_text', category: 'ভাবনা', time: '২ ঘণ্টা আগে', likes: 1205, comments: 89,
    content: 'মানুষের সবচেয়ে বড় ব্যর্থতা হলো সে যা ভালোবাসে, তাকে সময় দিতে পারে না। আমরা সবাই কোনো না কোনো ব্যস্ততার অজুহাতে নিজের প্রিয় জিনিসগুলো থেকে দূরে সরে যাই।'
  },
  {
    id: 'p2', user: { name: 'রাফসান আহমেদ', isVerified: false, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150' }, type: 'review', category: 'রিভিউ', time: '৫ ঘণ্টা আগে', likes: 324, comments: 45, bookTag: 'বাদশাহ নামদার', rating: 5,
    content: 'এইমাত্র "বাদশাহ নামদার" শেষ করলাম। কী অদ্ভুত সুন্দর লেখনী! ইতিহাস যে এতো উপভোগ্য হতে পারে তা আগে বুঝিনি। ৫ এ ৫ রেটিং দিচ্ছি।'
  },
  {
    id: 'p3', user: MOCK_AUTHORS[0], type: 'long_text', category: 'গল্প', time: '১ দিন আগে', likes: 4500, comments: 320, title: 'নীল অপরাজিতা',
    content: 'বৃষ্টির দিনে রূপার মন সবসময় খারাপ থাকে। কেন খারাপ থাকে সে নিজেও জানে না। হয়তো ছোটবেলার কোনো এক বৃষ্টির দিনের স্মৃতি তাকে তাড়া করে ফেরে। আজ সকাল থেকেই আকাশ মেঘলা। যেকোনো সময় নামবে মুষলধারে বৃষ্টি। রূপা বারান্দায় দাঁড়িয়ে আছে। তার হাতে এক কাপ ধোঁয়া ওঠা কফি... (আরও পড়ুন)'
  },
  {
    id: 'p4', user: MOCK_AUTHORS[3], type: 'book_update', category: 'ঘোষণা', time: '২ দিন আগে', likes: 8900, comments: 1200, bookTag: 'নতুন পাণ্ডুলিপি',
    content: 'আলহামদুলিল্লাহ। আমার নতুন বইয়ের কাজ প্রায় শেষের দিকে। আগামী বইমেলায় ইনশাআল্লাহ আপনাদের হাতে তুলে দিতে পারবো। সবাই দোয়া করবেন।'
  }
];

// --- COMPONENTS ---

// 1. Navigation
const Navbar = ({ currentView, setView, userRole }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavItem = ({ view, label }) => (
    <button 
      onClick={() => setView(view)} 
      className={`font-medium pb-1 border-b-2 transition-all ${currentView === view ? 'text-orange-500 border-orange-500' : 'text-slate-600 border-transparent hover:text-orange-500 hover:border-orange-200'}`}
    >
      {label}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <BookOpen className="h-7 w-7 text-orange-600 mr-2" />
            <span className="font-bold text-2xl text-slate-900 tracking-tight font-serif">বইয়ের জগৎ</span>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <NavItem view="home" label="হোম" />
            <NavItem view="feed" label="কমিউনিটি ফিড" />
            <NavItem view="books" label="বইসমূহ" />
            <NavItem view="writings" label="লেখালেখি" />
            <NavItem view="authors" label="লেখকবৃন্দ" />
            <NavItem view="library" label="লাইব্রেরি" />
            {userRole === 'admin' && (
              <button onClick={() => setView('admin')} className="font-medium text-blue-600 hover:text-blue-800 flex items-center">
                <Shield className="w-4 h-4 mr-1" /> এডমিন
              </button>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <input type="text" placeholder="খুঁজুন..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-slate-50 w-48 transition-all group-hover:bg-white" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
            <button className="text-slate-500 hover:text-slate-900 relative p-2 rounded-full hover:bg-slate-100 transition"><Bell className="h-5 w-5" /><span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-orange-500"></span></button>
            <button onClick={() => setView('userProfile')} className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition"><User className="h-5 w-5" /></button>
          </div>

          <div className="lg:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600"><Menu className="h-6 w-6" /></button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white px-4 pt-2 pb-4 space-y-2 border-b border-slate-200 absolute w-full shadow-lg z-50">
           {['home', 'feed', 'books', 'writings', 'authors', 'library', 'userProfile'].map(view => (
             <button key={view} onClick={() => {setView(view); setIsMobileMenuOpen(false);}} className="block w-full text-left font-medium text-slate-700 py-2 capitalize">{view === 'userProfile' ? 'Profile' : view === 'home' ? 'হোম' : view}</button>
           ))}
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-orange-500 mr-2" />
          <span className="font-bold text-xl text-white tracking-tight font-serif">বইয়ের জগৎ</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          বাংলা সাহিত্যের এক বিশাল ডিজিটাল সংগ্রহশালা ও সামাজিক মাধ্যম। পড়ুন, লিখুন এবং যুক্ত থাকুন।
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">প্ল্যাটফর্ম</h3>
        <ul className="space-y-2 text-sm">
          <li><button className="hover:text-orange-400 transition">সকল বই</button></li>
          <li><button className="hover:text-orange-400 transition">লেখকবৃন্দ</button></li>
          <li><button className="hover:text-orange-400 transition">কমিউনিটি ফোরাম</button></li>
          <li><button className="hover:text-orange-400 transition">প্রিমিয়াম সাবস্ক্রিপশন</button></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">সহায়তা</h3>
        <ul className="space-y-2 text-sm">
          <li><button className="hover:text-orange-400 transition">প্রায়শই জিজ্ঞাসিত প্রশ্ন</button></li>
          <li><button className="hover:text-orange-400 transition">আমাদের সাথে যোগাযোগ</button></li>
          <li><button className="hover:text-orange-400 transition">লেখকদের জন্য গাইডলাইন</button></li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">আইনগত</h3>
        <ul className="space-y-2 text-sm">
          <li><button className="hover:text-orange-400 transition">শর্তাবলী</button></li>
          <li><button className="hover:text-orange-400 transition">গোপনীয়তা নীতি</button></li>
          <li><button className="hover:text-orange-400 transition">কপিরাইট</button></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
      © {new Date().getFullYear()} বইয়ের জগৎ. সর্বস্বত্ব সংরক্ষিত।
    </div>
  </footer>
);

// 2. Core UI Blocks
const BookCard = ({ book, onClick }) => (
  <div onClick={() => onClick(book)} className="group cursor-pointer flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
    <div className="relative h-64 w-full overflow-hidden bg-slate-100">
      <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      {book.isPremium ? (
        <div className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm flex items-center"><Star className="w-3 h-3 mr-1 fill-current"/> প্রিমিয়াম</div>
      ) : (
         <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">ফ্রি</div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
         <button className="w-full py-2 bg-white text-slate-900 rounded-lg font-medium text-sm flex justify-center items-center shadow-sm">
            <BookOpen className="w-4 h-4 mr-2" /> পড়তে শুরু করুন
         </button>
      </div>
    </div>
    <div className="p-4 flex-1 flex flex-col">
      <p className="text-xs text-orange-500 font-semibold mb-1 uppercase tracking-wider">{book.category}</p>
      <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 line-clamp-1 font-serif">{book.title}</h3>
      <p className="text-sm text-slate-500 mb-3">{book.author}</p>
      
      <div className="mt-auto flex items-center justify-between text-sm">
        <div className="flex items-center text-amber-500">
          <Star className="w-4 h-4 fill-current mr-1" />
          <span className="font-medium text-slate-700">{book.rating}</span>
        </div>
        <span className="text-slate-400 text-xs flex items-center"><List className="w-3 h-3 mr-1"/> {book.chapters} পর্ব</span>
      </div>
    </div>
  </div>
);

const PostCard = ({ post, onAuthorClick }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-5 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center cursor-pointer group" onClick={() => onAuthorClick && onAuthorClick(post.user)}>
        <img src={post.user.image} alt={post.user.name} className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-orange-200 transition" />
        <div className="ml-3">
          <h4 className="font-bold text-slate-900 flex items-center group-hover:text-orange-600 transition">
            {post.user.name} {post.user.followers && <CheckCircle className="w-3.5 h-3.5 text-blue-500 ml-1" />}
          </h4>
          <p className="text-xs text-slate-500">{post.time} • <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{post.category}</span></p>
        </div>
      </div>
      <button className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-50"><MoreVertical className="w-5 h-5" /></button>
    </div>
    
    <div className="mb-4">
      {post.title && <h3 className="font-bold text-xl text-slate-900 mb-2 font-serif">{post.title}</h3>}
      {post.rating && (
        <div className="flex text-amber-400 mb-2">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < post.rating ? 'fill-current' : 'text-slate-200'}`} />)}
        </div>
      )}
      <p className={`text-slate-700 leading-relaxed ${post.type === 'short_text' ? 'text-lg font-medium' : 'text-base'} whitespace-pre-line`}>{post.content}</p>
      
      {post.bookTag && (
        <div className="mt-4 inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg cursor-pointer hover:bg-orange-100 transition border border-orange-100">
          <BookOpen className="w-4 h-4 mr-2" /> {post.bookTag}
        </div>
      )}
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
      <div className="flex space-x-1 sm:space-x-2">
         <button className="flex items-center px-2 sm:px-3 py-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition group">
           <Heart className="w-5 h-5 mr-1.5 group-hover:fill-current" /> <span className="text-sm font-medium">{post.likes}</span>
         </button>
         <button className="flex items-center px-2 sm:px-3 py-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
           <MessageCircle className="w-5 h-5 mr-1.5" /> <span className="text-sm font-medium">{post.comments}</span>
         </button>
         <button className="flex items-center px-2 sm:px-3 py-1.5 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
           <Share2 className="w-5 h-5 mr-1.5" /> <span className="text-sm font-medium hidden sm:inline">শেয়ার</span>
         </button>
      </div>
      <button className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition"><Bookmark className="w-5 h-5" /></button>
    </div>
  </div>
);

// 3. Main Views
const HomeView = ({ setView, setSelectedBook }) => {
  const handleBookClick = (book) => { setSelectedBook(book); setView('book'); };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-20 pb-32 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <span className="px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium text-orange-400 mb-6 inline-block border border-white/10">পড়ালেখার নতুন ঠিকানা</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-serif leading-tight">
            বইয়ের জগৎ, <br/><span className="text-slate-400">পাঠকের মিলনমেলা</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
            বিজ্ঞাপনমুক্ত, শুদ্ধ সাহিত্যের একটি প্রিমিয়াম সোশ্যাল প্ল্যাটফর্ম। পড়ুন, ছোট-বড় লেখা প্রকাশ করুন এবং সমমনা পাঠকদের সাথে যুক্ত হোন।
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button onClick={() => setView('books')} className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-600/30 flex items-center justify-center">
               <BookOpen className="mr-2 w-5 h-5" /> পড়া শুরু করুন
             </button>
             <button onClick={() => setView('feed')} className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition backdrop-blur-sm border border-white/20 flex items-center justify-center">
               কমিউনিটিতে যোগ দিন
             </button>
          </div>
        </div>
      </section>

      {/* Clean Category Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 grid grid-cols-3 md:grid-cols-7 gap-4">
          {MOCK_CATEGORIES.map(cat => (
            <div key={cat.id} className="flex flex-col items-center p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition group border border-transparent hover:border-slate-100">
              <cat.icon className="w-8 h-8 text-slate-400 group-hover:text-orange-500 mb-3 transition-colors" />
              <span className="text-sm font-medium text-slate-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">জনপ্রিয় বইসমূহ</h2>
              <p className="text-slate-500">পাঠকদের সর্বাধিক পঠিত এবং রেটিং প্রাপ্ত বই</p>
            </div>
            <button onClick={() => setView('books')} className="text-orange-600 font-medium hover:text-orange-700 flex items-center">
              সব দেখুন <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MOCK_BOOKS.map(book => <BookCard key={book.id} book={book} onClick={handleBookClick} />)}
          </div>
        </div>
      </section>

       {/* Trending Writings Teaser */}
       <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 font-serif flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-orange-500" /> ট্রেন্ডিং লেখালেখি
              </h2>
              <button onClick={() => setView('writings')} className="text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 px-4 py-2 rounded-full transition">সব পড়ুন</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {MOCK_POSTS.slice(0, 2).map(post => <PostCard key={post.id} post={post} />)}
           </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 bg-orange-100 rounded-full mb-6">
            <Star className="w-8 h-8 text-orange-600 fill-current" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 font-serif">সীমাহীন পড়ার স্বাধীনতা</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            প্রিমিয়াম সাবস্ক্রিপশন নিন এবং হাজারো এক্সক্লুসিভ বই পড়ুন কোনো বিজ্ঞাপন ছাড়াই। লেখকদের সরাসরি সহায়তা করুন।
          </p>
          <div className="flex justify-center">
            <div className="bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-slate-900/20 w-full max-w-md relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">জনপ্রিয়</div>
               <h3 className="text-2xl font-bold text-white mb-2 font-serif">প্রিমিয়াম পাস</h3>
               <p className="text-4xl font-extrabold text-white mb-8">৳৪৯ <span className="text-sm font-normal text-slate-400">/মাস</span></p>
               <ul className="text-left space-y-4 mb-8 text-slate-300">
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-orange-400 mr-3" /> সমস্ত বই উন্মুক্ত</li>
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-orange-400 mr-3" /> বিজ্ঞাপনমুক্ত অভিজ্ঞতা</li>
                 <li className="flex items-center"><CheckCircle className="w-5 h-5 text-orange-400 mr-3" /> অফলাইন পড়ার সুবিধা</li>
               </ul>
               <button className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-600/30">আপগ্রেড করুন</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeedView = ({ setView }) => (
  <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-slate-900 font-serif">কমিউনিটি ফিড</h1>
      <p className="text-slate-500 mt-1">পাঠক ও লেখকদের টেক্সট-ভিত্তিক সামাজিক মাধ্যম</p>
    </div>
    
    {/* Write Post Box */}
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/60 mb-8 hover:shadow-md transition-shadow">
       <div className="flex gap-4 mb-4">
         <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150" alt="User" className="w-12 h-12 rounded-full object-cover border border-slate-100" />
         <button className="flex-1 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-5 py-3 transition font-medium text-base">
           নতুন লেখা, ভাবনা বা বইয়ের রিভিউ শেয়ার করুন...
         </button>
       </div>
       <div className="flex justify-between items-center pt-3 border-t border-slate-100">
         <div className="flex gap-1 sm:gap-2">
           <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition"><AlignLeft className="w-5 h-5 mr-2 text-blue-500"/> বড় লেখা</button>
           <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-600 rounded-lg transition"><Type className="w-5 h-5 mr-2 text-orange-500"/> ছোট টেক্সট</button>
         </div>
         <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition">পোস্ট</button>
       </div>
    </div>

    {/* Feed Filter */}
    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
      {['সব', 'গল্প', 'কবিতা', 'ভাবনা', 'রিভিউ', 'ঘোষণা'].map((tag, i) => (
        <button key={tag} className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium border transition ${i === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
          {tag}
        </button>
      ))}
    </div>

    {/* Posts */}
    <div className="space-y-6">
      {MOCK_POSTS.map(post => <PostCard key={post.id} post={post} onAuthorClick={() => setView('authorProfile')} />)}
      {MOCK_POSTS.map(post => <PostCard key={post.id + 'dup'} post={{...post, id: post.id+'dup', time: '1 week ago'}} />)}
    </div>
  </div>
);

const BooksView = ({ setView, setSelectedBook }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Category', 'Popular', 'Latest', 'Free', 'Premium'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">ডিজিটাল লাইব্রেরি</h1>
          <p className="text-slate-500 mt-1">হাজারো বইয়ের সংগ্রহশালা থেকে আপনার পছন্দের বইটি খুঁজে নিন</p>
        </div>
        <div className="relative">
          <input type="text" placeholder="বই খুঁজুন..." className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white w-full md:w-64" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-slate-200">
        {filters.map((filter) => (
          <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap px-5 py-2 rounded-xl text-sm font-medium transition ${activeFilter === filter ? 'bg-slate-900 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {filter === 'All' ? 'সব বই' : filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...MOCK_BOOKS, ...MOCK_BOOKS].map((book, i) => (
          <BookCard key={i} book={{...book, id: `b${i}`}} onClick={(b) => { setSelectedBook(b); setView('book'); }} />
        ))}
      </div>
    </div>
  );
};

const WritingsView = () => {
  const [activeTab, setActiveTab] = useState('long');
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">পাঠকের লেখালেখি</h1>
          <p className="text-slate-500 mt-1">কমিউনিটির সদস্যদের প্রকাশিত গল্প, প্রবন্ধ ও ভাবনাগুলো পড়ুন</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-slate-800 transition shadow-sm">
          <Edit3 className="w-4 h-4 mr-2" /> লিখতে শুরু করুন
        </button>
      </div>

      <div className="flex border-b border-slate-200 mb-8">
        <button onClick={() => setActiveTab('long')} className={`px-6 py-4 font-medium text-lg transition-colors border-b-2 ${activeTab === 'long' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>বড় লেখা (Long Texts)</button>
        <button onClick={() => setActiveTab('short')} className={`px-6 py-4 font-medium text-lg transition-colors border-b-2 ${activeTab === 'short' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>ছোট ভাবনা (Short Texts)</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           {activeTab === 'long' 
              ? MOCK_POSTS.filter(p => p.type === 'long_text' || p.type === 'review').map(p => <PostCard key={p.id} post={p} />)
              : MOCK_POSTS.filter(p => p.type === 'short_text').map(p => <PostCard key={p.id} post={p} />)
           }
        </div>
        <div className="hidden md:block space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center font-serif text-lg"><Filter className="w-5 h-5 mr-2 text-slate-500"/> টপিক ফিল্টার</h3>
             <div className="flex flex-wrap gap-2">
               {['প্রেম', 'বিরহ', 'ইসলামিক', 'অনুপ্রেরণা', 'কবিতা', 'ব্যক্তিগত', 'গল্প', 'দর্শন'].map(tag => (
                 <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl cursor-pointer hover:border-orange-500 hover:text-orange-600 transition">{tag}</span>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const BookDetailView = ({ book, setView }) => {
  if (!book) return null;

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 animate-in fade-in duration-300">
      <div className="h-72 bg-slate-900 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20">
            <img src={book.cover} alt="blur" className="w-full h-full object-cover filter blur-2xl" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90"></div>
         <button onClick={() => setView('books')} className="absolute top-6 left-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-md transition z-10 border border-white/20">
           <ArrowLeft className="w-5 h-5" />
         </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col md:flex-row gap-10 border border-slate-100">
          {/* Cover Area */}
          <div className="w-56 sm:w-72 flex-shrink-0 mx-auto md:mx-0">
            <img src={book.cover} alt={book.title} className="w-full rounded-xl shadow-2xl border-4 border-white" />
            <div className="mt-8 space-y-3">
              <button onClick={() => setView('read')} className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-600/30 flex justify-center items-center">
                 <PlayCircle className="w-6 h-6 mr-2" /> পড়া শুরু করুন
              </button>
              <button className="w-full py-4 bg-slate-50 text-slate-800 rounded-xl font-bold hover:bg-slate-100 transition flex justify-center items-center border border-slate-200">
                 <Bookmark className="w-5 h-5 mr-2" /> লাইব্রেরিতে রাখুন
              </button>
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded-md tracking-wider border border-slate-200">{book.category}</span>
              {book.isPremium && <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold uppercase rounded-md flex items-center border border-orange-200"><Star className="w-3 h-3 mr-1 fill-current"/> প্রিমিয়াম</span>}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-2 leading-tight font-serif">{book.title}</h1>
            <p className="text-xl text-slate-600 mb-8 font-medium">লেখক: <button onClick={()=>setView('authorProfile')} className="text-orange-600 hover:underline">{book.author}</button></p>
            
            <div className="flex items-center gap-8 mb-10 text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-flex">
               <div className="flex flex-col items-center">
                 <span className="font-bold text-slate-900 text-xl flex items-center"><Star className="w-5 h-5 text-amber-500 fill-current mr-1"/> {book.rating}</span>
                 <span className="mt-1">{book.reviews} রেটিং</span>
               </div>
               <div className="h-10 w-px bg-slate-200"></div>
               <div className="flex flex-col items-center">
                 <span className="font-bold text-slate-900 text-xl flex items-center"><List className="w-5 h-5 mr-1 text-slate-400"/> {book.chapters}</span>
                 <span className="mt-1">মোট পর্ব</span>
               </div>
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-xl text-slate-900 mb-3 font-serif">সারাংশ</h3>
              <p className="text-slate-700 leading-relaxed text-lg">{book.description}</p>
            </div>

            {/* Chapter List Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-slate-900 font-serif">সূচিপত্র</h3>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 transition">সব দেখুন</span>
              </div>
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                {[1, 2, 3].map(chapter => (
                  <div key={chapter} className="flex justify-between items-center p-5 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer transition group">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold mr-4 text-sm group-hover:bg-orange-100 group-hover:text-orange-600 transition">{chapter}</div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg">সূচনা পর্ব</h4>
                        <p className="text-sm text-slate-500 mt-0.5">প্রকাশিত: ২ দিন আগে</p>
                      </div>
                    </div>
                    <button className="text-sm bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg font-medium group-hover:border-orange-500 group-hover:text-orange-600 transition">পড়ুন</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ReaderView = ({ setView }) => {
  const [fontSize, setFontSize] = useState(20);
  const [theme, setTheme] = useState('light');
  const [showControls, setShowControls] = useState(true);

  const getThemeStyles = () => {
    switch(theme) {
      case 'dark': return 'bg-[#111827] text-slate-300 border-slate-800';
      case 'sepia': return 'bg-[#F4ECD8] text-[#433422] border-[#E4DCC8]';
      default: return 'bg-white text-slate-800 border-slate-200';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeStyles()}`} onClick={() => setShowControls(!showControls)}>
      
      {/* Top Controls */}
      <div className={`fixed top-0 left-0 right-0 p-4 border-b ${theme === 'dark' ? 'bg-[#111827]/95 border-slate-800' : theme==='sepia' ? 'bg-[#F4ECD8]/95 border-[#E4DCC8]' : 'bg-white/95 border-slate-200'} backdrop-blur-md flex justify-between items-center transition-transform duration-300 z-50 ${showControls ? 'translate-y-0' : '-translate-y-full'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center">
           <button onClick={() => setView('book')} className="mr-4 p-2 rounded-full hover:bg-slate-500/10 transition">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
             <h2 className="font-bold text-base m-0 font-serif">বাদশাহ নামদার</h2>
             <p className="text-xs opacity-70 font-medium">পর্ব ১: সূচনা</p>
           </div>
        </div>
        <div className="flex items-center space-x-3">
           <div className="flex bg-slate-500/10 rounded-xl p-1">
             <button onClick={() => setTheme('light')} className={`p-2 rounded-lg transition ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'opacity-50 hover:opacity-100'}`}><Sun className="w-4 h-4"/></button>
             <button onClick={() => setTheme('sepia')} className={`p-2 rounded-lg transition ${theme === 'sepia' ? 'bg-[#E4DCC8] text-[#5b4636] shadow-sm' : 'opacity-50 hover:opacity-100'}`}><BookA className="w-4 h-4"/></button>
             <button onClick={() => setTheme('dark')} className={`p-2 rounded-lg transition ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}><Moon className="w-4 h-4"/></button>
           </div>
           <div className="hidden sm:flex items-center bg-slate-500/10 rounded-xl">
             <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="px-4 py-2 font-bold hover:bg-slate-500/10 rounded-l-xl transition">-</button>
             <span className="px-2 text-sm font-medium"><Type className="w-4 h-4"/></span>
             <button onClick={() => setFontSize(Math.min(36, fontSize + 2))} className="px-4 py-2 font-bold hover:bg-slate-500/10 rounded-r-xl transition">+</button>
           </div>
           <button className="p-2 rounded-full hover:bg-slate-500/10 transition"><Bookmark className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Reading Content */}
      <div className="max-w-2xl mx-auto px-6 pt-32 pb-40">
         <h1 className="font-extrabold mb-12 text-center font-serif leading-tight" style={{ fontSize: `${fontSize * 1.5}px`}}>পর্ব ১: সূচনা</h1>
         
         <div className="space-y-8 leading-relaxed font-serif" style={{ fontSize: `${fontSize}px`}}>
            <p>দিল্লির সিংহাসন তখন টলটলায়মান। ক্ষমতার রদবদল, ষড়যন্ত্র আর রক্তের গন্ধ বাতাসে ভাসছে। এই অস্থিতিশীল পরিস্থিতির মাঝেই জন্ম হলো এক নতুন অধ্যায়ের।</p>
            <p>হুমায়ূন, নামের অর্থ সৌভাগ্যবান হলেও, তার জীবনের পরতে পরতে লুকিয়ে ছিল দুর্ভাগ্য আর সংগ্রামের কাহিনি। বাবার রেখে যাওয়া বিশাল সাম্রাজ্য রক্ষা করার দায়িত্ব তার কাঁধে। কিন্তু চারপাশের শত্রুরা সুযোগের অপেক্ষায়।</p>
            <p>দরবারের ভেতরের রাজনীতি ছিল সবচেয়ে ভয়ংকর। কে বন্ধু আর কে শত্রু, তা বোঝা বড় দায়। বিশ্বস্ত সেনাপতিরাও অনেক সময় বিশ্বাসঘাতকতা করত সামান্য স্বার্থের জন্য। এই পরিবেশে নিজেকে টিকিয়ে রাখা ছিল এক বিশাল চ্যালেঞ্জ।</p>
            <p>একদিন সন্ধ্যেবেলা, দরবারের এক গোপন কক্ষে বসে হুমায়ূন তার সবচেয়ে বিশ্বস্ত পাত্রের সাথে আলোচনা করছিলেন। তাদের আলোচনার বিষয় ছিল গুজরাটের বিদ্রোহ। কীভাবে এই বিদ্রোহ দমন করা যায়, তা নিয়ে চলছিল গভীর চিন্তাভাবনা।</p>
            <p>হঠাৎ কক্ষের দরজায় কড়া নাড়ার শব্দ হলো। একজন রক্ষী হাঁপাতে হাঁপাতে ভেতরে প্রবেশ করল। তার চোখেমুখে আতঙ্কের ছাপ। সে জানাল, আফগান নেতা শের খান বিহারের দিকে অগ্রসর হচ্ছেন।</p>
         </div>
      </div>

      {/* Bottom Controls */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t ${theme === 'dark' ? 'bg-[#111827]/95 border-slate-800' : theme==='sepia' ? 'bg-[#F4ECD8]/95 border-[#E4DCC8]' : 'bg-white/95 border-slate-200'} backdrop-blur-md flex justify-between items-center transition-transform duration-300 z-50 ${showControls ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
         <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-500/10 hover:bg-slate-500/20 transition">পূর্ববর্তী পর্ব</button>
         <div className="text-center hidden sm:block">
            <span className="text-sm font-bold block mb-1">অধ্যায় ১ / ২৪</span>
            <div className="w-48 h-1 bg-slate-500/20 rounded-full overflow-hidden">
               <div className="w-[10%] h-full bg-orange-500 rounded-full"></div>
            </div>
         </div>
         <button className="px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-600/30 hover:bg-orange-700 transition">পরবর্তী পর্ব</button>
      </div>
    </div>
  );
};

const AuthorProfileView = ({ setView }) => {
  const author = MOCK_AUTHORS[0];
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-20 animate-in fade-in duration-300">
      <div className="h-48 bg-slate-900 relative"></div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <img src={author.image} alt={author.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
          <div className="flex-1">
             <h1 className="text-3xl font-extrabold text-slate-900 font-serif flex items-center justify-center md:justify-start">
               {author.name} <CheckCircle className="w-6 h-6 text-blue-500 ml-2" />
             </h1>
             <p className="text-slate-600 mt-2 font-medium">{author.bio}</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
             <button className="flex-1 md:flex-none px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-sm">ফলো করুন</button>
             <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-600"><MoreVertical className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
          <div><p className="text-2xl font-bold text-slate-900">{author.followers}</p><p className="text-sm text-slate-500 font-medium">ফলোয়ার</p></div>
          <div className="border-x border-slate-200"><p className="text-2xl font-bold text-slate-900">{author.books}</p><p className="text-sm text-slate-500 font-medium">বই</p></div>
          <div><p className="text-2xl font-bold text-slate-900">{author.writings}</p><p className="text-sm text-slate-500 font-medium">লেখালেখি</p></div>
        </div>

        <div className="flex border-b border-slate-200 mb-6 bg-white rounded-t-2xl px-4 pt-4 border-x border-t">
          {['posts', 'books', 'about'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-bold text-base capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
              {tab === 'posts' ? 'পোস্টসমূহ' : tab === 'books' ? 'বইসমূহ' : 'সম্পর্কে'}
            </button>
          ))}
        </div>

        <div>
           {activeTab === 'posts' && MOCK_POSTS.slice(0, 2).map(p => <PostCard key={p.id} post={{...p, user: author}} />)}
           {activeTab === 'books' && (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <BookCard book={MOCK_BOOKS[0]} onClick={()=>setView('book')}/>
                <BookCard book={{...MOCK_BOOKS[1], title: 'অন্য এক বই'}} onClick={()=>setView('book')}/>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const UserProfileView = () => (
   <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-3xl font-bold font-serif">R</div>
          <div className="text-center sm:text-left flex-1">
             <h1 className="text-2xl font-bold text-slate-900 font-serif mb-1">রাফসান আহমেদ</h1>
             <p className="text-slate-500">নিয়মিত পাঠক • ঢাকা, বাংলাদেশ</p>
          </div>
          <button className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center"><Settings className="w-4 h-4 mr-2"/> প্রোফাইল এডিট</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4 font-serif text-lg">আমার লাইব্রেরি</h3>
               <ul className="space-y-3">
                 <li className="flex items-center text-slate-700 hover:text-orange-600 cursor-pointer font-medium"><BookMarked className="w-5 h-5 mr-3 text-slate-400"/> সেভ করা বই (১২)</li>
                 <li className="flex items-center text-slate-700 hover:text-orange-600 cursor-pointer font-medium"><History className="w-5 h-5 mr-3 text-slate-400"/> পড়ার হিস্ট্রি</li>
                 <li className="flex items-center text-slate-700 hover:text-orange-600 cursor-pointer font-medium"><Bookmark className="w-5 h-5 mr-3 text-slate-400"/> সেভ করা পোস্ট</li>
               </ul>
            </div>
         </div>
         <div className="md:col-span-2">
            <h3 className="font-bold text-slate-900 mb-6 font-serif text-xl border-b border-slate-200 pb-3">আমার লেখালেখি</h3>
            <div className="bg-slate-50 p-8 text-center rounded-2xl border border-slate-200 border-dashed">
               <Edit3 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-500 font-medium mb-4">আপনি এখনো কোনো লেখা প্রকাশ করেননি।</p>
               <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition">নতুন কিছু লিখুন</button>
            </div>
         </div>
      </div>
   </div>
);
const History = ({className}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const AdminPanel = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center font-serif">
          <Shield className="w-8 h-8 mr-3 text-slate-900" /> এডমিন ড্যাশবোর্ড
        </h1>
        <p className="text-slate-500 mt-1 font-medium">সম্পূর্ণ প্ল্যাটফর্ম নিয়ন্ত্রণ কেন্দ্র</p>
      </div>
      <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center hover:bg-slate-800 transition shadow-sm">
        <PlusCircle className="w-5 h-5 mr-2" /> নতুন বই যোগ করুন
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'মোট ব্যবহারকারী', value: '১২,৪৫০', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'মোট বই', value: '৩,২০০', icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'প্রিমিয়াম সদস্য', value: '১,১৫০', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
        { label: 'রিপোর্ট', value: '২৪', icon: Bell, color: 'text-red-500', bg: 'bg-red-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center">
           <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} mr-5`}>
             <stat.icon className="w-7 h-7" />
           </div>
           <div>
             <p className="text-sm text-slate-500 font-bold mb-1">{stat.label}</p>
             <p className="text-3xl font-extrabold text-slate-900 font-serif">{stat.value}</p>
           </div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-slate-800 text-lg font-serif">সাম্প্রতিক বইসমূহ</h2>
        <button className="text-sm font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">সব দেখুন</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
            <tr>
              <th className="px-6 py-4">বইয়ের নাম</th>
              <th className="px-6 py-4">লেখক</th>
              <th className="px-6 py-4">ক্যাটাগরি</th>
              <th className="px-6 py-4">স্ট্যাটাস</th>
              <th className="px-6 py-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_BOOKS.map((book, i) => (
              <tr key={i} className="hover:bg-slate-50 transition group">
                <td className="px-6 py-4 font-bold text-slate-900 flex items-center font-serif">
                  <img src={book.cover} className="w-10 h-14 object-cover rounded shadow-sm mr-4" alt="cover"/>
                  {book.title}
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">{book.author}</td>
                <td className="px-6 py-4 text-slate-600 font-medium"><span className="bg-slate-100 px-2 py-1 rounded-md">{book.category}</span></td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">প্রকাশিত</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-blue-600 mr-3 p-1.5 rounded-lg hover:bg-blue-50 transition"><Edit3 className="w-4 h-4" /></button>
                  <button className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"><X className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [selectedBook, setSelectedBook] = useState(null);
  const [userRole] = useState('admin'); 

  useEffect(() => { window.scrollTo(0, 0); }, [currentView]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-900 selection:bg-orange-200 selection:text-orange-900">
      {currentView !== 'read' && <Navbar currentView={currentView} setView={setCurrentView} userRole={userRole} />}
      
      <main className="min-h-[calc(100vh-4rem)]">
        {currentView === 'home' && <HomeView setView={setCurrentView} setSelectedBook={setSelectedBook} />}
        {currentView === 'feed' && <FeedView setView={setCurrentView} />}
        {currentView === 'books' && <BooksView setView={setCurrentView} setSelectedBook={setSelectedBook} />}
        {currentView === 'writings' && <WritingsView />}
        {currentView === 'book' && <BookDetailView book={selectedBook || MOCK_BOOKS[0]} setView={setCurrentView} />}
        {currentView === 'read' && <ReaderView setView={setCurrentView} />}
        {currentView === 'authorProfile' && <AuthorProfileView setView={setCurrentView} />}
        {currentView === 'userProfile' && <UserProfileView />}
        {currentView === 'admin' && userRole === 'admin' && <AdminPanel />}
      </main>

      {currentView !== 'read' && <Footer />}
    </div>
  );
}