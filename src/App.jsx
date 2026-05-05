import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Bell, User, Heart, MessageCircle, Share2, 
  Bookmark, MoreVertical, Flame, Trophy,
  Quote, Menu, Home, Feather, FileText, Moon, Sun, TrendingUp, PlusCircle
} from 'lucide-react';

// --- MOCK DB (ডেটাবেস) ---
const DB = {
  currentUser: {
    id: 'u_1', name: 'রাফসান আহমেদ', role: 'admin', streak: 12, totalRead: 5,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
  },
  quotes: [
    { id: 'q1', author: 'হুমায়ূন আহমেদ', text: 'কখনো কখনো তোমার মুখটা...', bg: 'bg-gradient-to-br from-orange-400 to-red-500' },
    { id: 'q2', author: 'সমরেশ মজুমদার', text: 'ভালোবাসা হচ্ছে একধরনের...', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500' },
    { id: 'q3', author: 'রবীন্দ্রনাথ', text: 'তুমি কি কেবলই ছবি...', bg: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { id: 'q4', author: 'কাজী নজরুল', text: 'গাহি সাম্যের গান...', bg: 'bg-gradient-to-br from-purple-400 to-pink-500' },
  ],
  posts: [
    { 
      id: 'p1', 
      authorName: 'সাদিয়া ইসলাম', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 
      type: 'short', 
      content: 'আকাশের রঙ বদলায়,\nমনের রঙ বদলায় না।\nতুমি চলে গেলে তবু\nস্মৃতির সাথে থাকে সদা।', 
      likes: 856, 
      comments: 42 
    },
    { 
      id: 'p2', 
      authorName: 'রাফসান আহমেদ', 
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', 
      type: 'long', 
      title: 'বই পড়ার আনন্দ', 
      content: 'বই পড়ার কোনো নির্দিষ্ট বয়স নেই। যখনই আপনি একটি নতুন বই খুলবেন, মনে হবে আপনি নতুন একটি পৃথিবীতে প্রবেশ করেছেন। এই পৃথিবীতে কোনো দুঃখ নেই, আছে কেবল অসীম জ্ঞান আর কল্পনার বিস্তার। বিস্তারিত আরও অনেক কিছু বলা যায় এই বিষয়ে...', 
      likes: 450, 
      comments: 32 
    }
  ],
  trendingBooks: [
    { id: 'tb1', title: 'নূরজাহান', author: 'ইমদাদুল হক মিলন', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
    { id: 'tb2', title: 'দেয়াল', author: 'হুমায়ূন আহমেদ', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100' },
  ],
  suggestedAuthors: [
    { id: 'sa1', name: 'সাদাত হোসাইন', followers: '12k', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { id: 'sa2', name: 'মুনজেরিন শহীদ', followers: '45k', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
  ]
};

// --- POST CARD COMPONENT ---
const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.type === 'long';

  return (
    <div className="bg-white dark:bg-[#242526] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 sm:mb-6">
      
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4 sm:mb-5 font-sans">
        <div className="flex items-center gap-3">
          <img src={post.avatar} className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100 dark:ring-[#3A3B3C]" alt="" />
          <div>
            <h4 className="font-bold text-[#292524] dark:text-[#E4E6EB] text-[14px] sm:text-[15px] leading-tight">{post.authorName}</h4>
            <p className="text-[12px] text-[#78716C] dark:text-[#9CA3AF] mt-0.5">
              ২ ঘণ্টা আগে • {post.type === 'short' ? 'কবিতা' : 'গল্প'}
            </p>
          </div>
        </div>
        <MoreVertical className="w-5 h-5 text-[#A8A29E] dark:text-[#B0B3B8] cursor-pointer" />
      </div>
      
      {/* Content Area */}
      <div className="mb-4">
        {post.title && <h3 className="font-bold text-xl sm:text-2xl font-serif mb-3 text-[#1C1917] dark:text-[#E4E6EB]">{post.title}</h3>}
        
        <div className="relative bg-[#FDFBF7] dark:bg-[#1E1F20] border-l-[4px] border-l-[#C2410C] rounded-r-xl rounded-l-sm p-4 sm:p-5">
          {post.type === 'short' && (
            <Quote className="absolute top-3 right-3 w-8 h-8 text-black/5 dark:text-white/5 rotate-180 pointer-events-none" />
          )}
          
          {/* Serif Font for Reading */}
          <p className={`text-[#3F3F46] dark:text-[#D1D5DB] font-serif whitespace-pre-line ${post.type === 'short' ? 'text-[16px] sm:text-lg font-medium leading-loose' : 'text-[15px] sm:text-[16px] leading-relaxed'} ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
            {post.content}
          </p>
          
          {isLong && !expanded && (
            <button onClick={() => setExpanded(true)} className="text-[#C2410C] dark:text-[#EA580C] font-semibold text-[14px] mt-2 font-sans">
              আরো পড়ুন ›
            </button>
          )}
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-[#333436] font-sans">
        <div className="flex gap-5">
          <button className="flex items-center gap-1.5 text-[#78716C] dark:text-[#9CA3AF]">
            <Heart className="w-5 h-5"/> <span className="text-[13px]">{post.likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-[#78716C] dark:text-[#9CA3AF]">
            <MessageCircle className="w-5 h-5"/> <span className="text-[13px]">{post.comments}</span>
          </button>
        </div>
        <div className="flex gap-3">
          <Bookmark className="w-5 h-5 text-[#78716C] dark:text-[#9CA3AF]" />
          <Share2 className="w-5 h-5 text-[#78716C] dark:text-[#9CA3AF]" />
        </div>
      </div>
    </div>
  );
};

// --- CENTER FEED VIEW ---
const FeedView = () => {
  return (
    // মোবাইলে বটম নেভিগেশন বারের জন্য পর্যাপ্ত জায়গা (pb-24) রাখা হয়েছে
    <div className="w-full pb-24 lg:pb-10 font-sans">
      
      {/* Create Post Input */}
      <div className="bg-white dark:bg-[#242526] p-4 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-4 flex gap-3 items-center">
        <img src={DB.currentUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="User" />
        <div className="flex-1 bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-4 py-2.5">
           <span className="text-[13px] text-[#78716C] dark:text-[#B0B3B8]">আপনার সাহিত্যিক ভাবনা লিখুন...</span>
        </div>
      </div>

      {/* Stories / Quotes (Mobile Scroll Fix) */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-2 w-full snap-x snap-mandatory scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="w-24 h-36 flex-shrink-0 snap-start rounded-2xl bg-white dark:bg-[#242526] border border-gray-200 dark:border-[#3E4042] flex flex-col items-center justify-center">
          <div className="w-10 h-10 bg-[#C2410C] rounded-full text-white flex items-center justify-center text-xl font-bold mb-2">+</div>
          <span className="text-xs font-semibold text-[#78716C] dark:text-[#B0B3B8]">উদ্ধৃতি দিন</span>
        </div>
        {DB.quotes.map(q => (
          <div key={q.id} className={`w-24 h-36 flex-shrink-0 snap-start rounded-2xl ${q.bg} p-3 flex flex-col justify-between text-white shadow-sm`}>
            <Quote className="w-4 h-4 opacity-50" />
            <p className="text-[11px] font-serif font-medium line-clamp-3 leading-relaxed">{q.text}</p>
            <p className="text-[10px] opacity-80 font-sans truncate">{q.author}</p>
          </div>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {DB.posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { id: 'feed', label: 'হোম', icon: Home },
    { id: 'poems', label: 'কবিতা', icon: Feather },
    { id: 'stories', label: 'গল্প', icon: FileText },
    { id: 'library', label: 'বই', icon: BookOpen },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    // overflow-x-hidden বডি লেভেলে দেওয়া হয়েছে যাতে কোনোভাবেই ডানে-বামে স্ক্রল না হয়
    <div className={`min-h-screen w-full overflow-x-hidden font-sans transition-colors duration-300 ${darkMode ? 'bg-[#18191A] text-[#E4E6EB]' : 'bg-[#F3F4F6] text-[#1C1917]'}`}>
      
      {/* --- TOP NAVBAR (Fixed) --- */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#242526]/95 backdrop-blur-md border-b border-gray-200 dark:border-[#3E4042] z-50">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu 
              className="w-6 h-6 lg:hidden text-gray-800 dark:text-[#E4E6EB]" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
            <h1 className="font-bold text-xl sm:text-2xl text-[#C2410C] font-serif">
              বইয়ের জগৎ
            </h1>
          </div>
          
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center">
              <Search className="w-4 h-4 text-gray-700 dark:text-[#E4E6EB]" />
            </div>
            <div className="w-9 h-9 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center">
              <Bell className="w-4 h-4 text-gray-700 dark:text-[#E4E6EB]" />
            </div>
          </div>
        </div>
      </header>

      {/* --- MOBILE THEME TOGGLE MENU --- */}
      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white dark:bg-[#242526] border-b border-gray-200 dark:border-[#3E4042] p-4 z-40 lg:hidden">
          <button 
            onClick={() => { setDarkMode(!darkMode); setIsMobileMenuOpen(false); }} 
            className="w-full px-4 py-3 bg-gray-100 dark:bg-[#3A3B3C] rounded-xl flex items-center gap-3"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            <span className="font-semibold">{darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
          </button>
        </div>
      )}

      {/* --- MAIN LAYOUT WRAPPER --- */}
      <div className="max-w-[1200px] mx-auto pt-20 px-4 w-full flex justify-center lg:justify-between gap-6">
        
        {/* LEFT SIDEBAR (Desktop Only) */}
        <aside className="hidden lg:flex flex-col w-[250px] sticky top-24 h-[calc(100vh-6rem)]">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img src={DB.currentUser.avatar} className="w-10 h-10 rounded-full" alt="Profile" />
            <div>
              <h3 className="font-bold text-[14px]">{DB.currentUser.name}</h3>
              <p className="text-xs text-gray-500">@rafsan_reads</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-[15px] ${currentView === item.id ? 'bg-[#C2410C]/10 text-[#C2410C] dark:bg-[#3A3B3C] dark:text-[#EA580C]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3A3B3C]'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="mt-4 flex items-center gap-4 px-4 py-3 bg-gray-100 dark:bg-[#3A3B3C] rounded-xl font-semibold text-[15px] text-gray-700 dark:text-gray-200"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            {darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
          </button>
        </aside>

        {/* CENTER FEED (Mobile: 100% width, Desktop: 600px) */}
        <main className="w-full max-w-[600px] flex-1 min-w-0">
          {currentView === 'feed' && <FeedView />}
          {currentView !== 'feed' && (
            <div className="text-center py-20 text-gray-400 font-bold text-lg">
              এই পেজটি নির্মাণাধীন...
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR (Desktop Only) */}
        <aside className="hidden xl:flex flex-col w-[280px] sticky top-24 h-[calc(100vh-6rem)]">
          <div className="bg-white dark:bg-[#242526] p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-[#3E4042] mb-5">
            <h3 className="font-bold text-[14px] mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <TrendingUp className="w-4 h-4 text-[#C2410C]" /> ট্রেন্ডিং বইসমূহ
            </h3>
            <div className="space-y-4">
              {DB.trendingBooks.map(book => (
                <div key={book.id} className="flex gap-3">
                  <img src={book.cover} className="w-10 h-14 rounded object-cover" alt="" />
                  <div>
                    <h4 className="font-semibold text-[13px]">{book.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Fixed at Bottom) --- */}
      {/* এটি শুধুমাত্র মোবাইলে (lg:hidden) দেখাবে এবং স্ক্রিনের একদম নিচে ফিক্সড থাকবে */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-[#242526] border-t border-gray-200 dark:border-[#3E4042] z-50 lg:hidden pb-1">
        <div className="flex justify-around items-center h-14 px-2">
          {navItems.slice(0, 5).map(item => (
            <button 
              key={item.id} 
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === item.id ? 'text-[#C2410C] dark:text-[#EA580C]' : 'text-gray-400 dark:text-gray-500'}`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
}