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
  ],
  books: [
    { id: 'b1', title: 'বাদশাহ নামদার', author: 'হুমায়ূন আহমেদ', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400&h=600', status: 'reading' },
    { id: 'b2', title: 'প্যারাডক্সিক্যাল সাজিদ', author: 'আরিফ আজাদ', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400&h=600', status: 'read' },
  ],
  trendingBooks: [
    { id: 'tb1', title: 'নূরজাহান', author: 'ইমদাদুল হক মিলন', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=100' },
    { id: 'tb2', title: 'দেয়াল', author: 'হুমায়ূন আহমেদ', cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=100' },
  ],
  suggestedAuthors: [
    { id: 'sa1', name: 'সাদাত হোসাইন', followers: '12k', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
    { id: 'sa2', name: 'মুনজেরিন শহীদ', followers: '45k', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
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
  ]
};

// --- POST CARD COMPONENT ---
const PostCard = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = post.type === 'long';

  return (
    <div className="bg-white dark:bg-[#242526] p-4 sm:p-6 rounded-3xl shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-[#333436] mb-6 transition-all duration-300 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)] dark:hover:border-[#4E4F50]">
      
      {/* Post Header (UI - Sans Serif) */}
      <div className="flex items-center justify-between mb-5 font-sans">
        <div className="flex items-center gap-3">
          <img src={post.avatar} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-gray-50 dark:ring-[#3A3B3C]" alt="" />
          <div>
            <h4 className="font-bold text-[#292524] dark:text-[#E4E6EB] text-[14px] sm:text-[15px]">{post.authorName}</h4>
            <p className="text-[12px] sm:text-[13px] text-[#78716C] dark:text-[#9CA3AF] mt-0.5 font-medium">
              ২ ঘণ্টা আগে • {post.type === 'short' ? 'কবিতা' : 'গল্প'}
            </p>
          </div>
        </div>
        <div className="p-2 hover:bg-gray-50 dark:hover:bg-[#3A3B3C] rounded-full cursor-pointer transition-colors">
           <MoreVertical className="w-5 h-5 text-[#A8A29E] dark:text-[#B0B3B8]" />
        </div>
      </div>
      
      {/* Post Content (Reading Area - Serif) */}
      <div className="mb-4">
        {post.title && <h3 className="font-bold text-xl sm:text-2xl font-serif mb-4 text-[#1C1917] dark:text-[#E4E6EB] tracking-tight">{post.title}</h3>}
        
        <div className="relative bg-[#FDFBF7] dark:bg-[#1E1F20] border border-[#F5F1EA] dark:border-[#2A2B2D] border-l-[4px] border-l-[#F27752] dark:border-l-[#C2410C] rounded-r-2xl rounded-l-md p-4 sm:p-6 transition-colors duration-300 group">
          
          {post.type === 'short' && (
            <Quote className="absolute top-4 right-4 w-8 h-8 sm:w-10 sm:h-10 text-orange-900/5 dark:text-white/5 rotate-180 pointer-events-none transition-transform group-hover:scale-110" />
          )}
          
          {/* 这里是 Serif ফন্ট ব্যবহার করা হয়েছে পড়ার আরামের জন্য */}
          <p className={`text-[#3F3F46] dark:text-[#D1D5DB] font-serif whitespace-pre-line ${post.type === 'short' ? 'text-[16px] sm:text-xl font-medium leading-[2.2]' : 'text-[15px] sm:text-[17px] leading-[1.9]'} ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
            {post.content}
          </p>
          
          {isLong && !expanded && (
            <div className="mt-2 pt-2 bg-gradient-to-t from-[#FDFBF7] dark:from-[#1E1F20] to-transparent font-sans">
              <button onClick={() => setExpanded(true)} className="text-[#C2410C] dark:text-[#EA580C] font-semibold text-[14px] sm:text-[15px] hover:text-[#9A3412] dark:hover:text-[#F97316] transition-colors flex items-center gap-1">
                আরো পড়ুন <span className="text-lg leading-none pb-0.5">›</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Footer (UI - Sans Serif) */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-50 dark:border-[#333436] font-sans">
        <div className="flex gap-4 sm:gap-6 mt-2">
          <button className="flex items-center gap-1.5 sm:gap-2 text-[#78716C] dark:text-[#9CA3AF] hover:text-rose-500 dark:hover:text-rose-400 transition-colors group">
            <div className="p-1.5 rounded-full group-hover:bg-rose-50 dark:group-hover:bg-rose-500/10 transition-colors">
              <Heart className="w-5 h-5 sm:w-[22px] sm:h-[22px]"/>
            </div>
            <span className="font-medium text-[13px] sm:text-[14px]">{post.likes}</span>
          </button>
          
          <button className="flex items-center gap-1.5 sm:gap-2 text-[#78716C] dark:text-[#9CA3AF] hover:text-blue-500 dark:hover:text-blue-400 transition-colors group">
            <div className="p-1.5 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
              <MessageCircle className="w-5 h-5 sm:w-[22px] sm:h-[22px]"/>
            </div>
            <span className="font-medium text-[13px] sm:text-[14px]">{post.comments}</span>
          </button>
        </div>
        
        <div className="flex gap-1 mt-2">
          <div className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-full cursor-pointer transition-colors group">
            <Bookmark className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#78716C] dark:text-[#9CA3AF] group-hover:text-[#1C1917] dark:group-hover:text-white" />
          </div>
          <div className="p-2 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-full cursor-pointer transition-colors group">
            <Share2 className="w-5 h-5 sm:w-[22px] sm:h-[22px] text-[#78716C] dark:text-[#9CA3AF] group-hover:text-[#1C1917] dark:group-hover:text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CENTER FEED VIEW ---
const FeedView = () => {
  return (
    <div className="w-full pb-24 lg:pb-10 font-sans">
      <div className="bg-white dark:bg-[#242526] p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-[#333436] mb-6 flex gap-3 transition-colors duration-300">
        <img src={DB.currentUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="User" />
        <div className="flex-1 bg-[#F5F5F4] dark:bg-[#3A3B3C] rounded-full px-4 sm:px-5 py-2.5 flex items-center hover:bg-[#E7E5E4] dark:hover:bg-[#4E4F50] transition-colors cursor-pointer">
           <span className="text-[13px] sm:text-sm font-medium text-[#78716C] dark:text-[#B0B3B8]">আপনার সাহিত্যিক ভাবনা লিখুন...</span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-3 w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="w-24 h-36 flex-shrink-0 rounded-2xl bg-white dark:bg-[#242526] border border-[#E7E5E4] dark:border-[#3E4042] flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-colors">
          <div className="w-10 h-10 bg-[#C2410C] dark:bg-[#EA580C] rounded-full text-white flex items-center justify-center text-xl font-bold mb-2">+</div>
          <span className="text-xs font-semibold text-[#78716C] dark:text-[#B0B3B8]">উদ্ধৃতি দিন</span>
        </div>
        {DB.quotes.map(q => (
          <div key={q.id} className={`w-24 h-36 flex-shrink-0 rounded-2xl ${q.bg} p-3 flex flex-col justify-between text-white cursor-pointer hover:opacity-90 shadow-sm`}>
            <Quote className="w-4 h-4 opacity-50" />
            <p className="text-xs font-serif font-medium line-clamp-3 leading-relaxed">{q.text}</p>
            <p className="text-[10px] opacity-80 font-sans">{q.author}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-4">
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
    { id: 'poems', label: 'ছোট কবিতা', icon: Feather },
    { id: 'stories', label: 'গল্প', icon: FileText },
    { id: 'library', label: 'বই', icon: BookOpen },
    { id: 'profile', label: 'প্রোফাইল', icon: User },
  ];

  return (
    // 전체 অ্যাপের ডিফল্ট ফন্ট font-sans (Inter/Noto Sans Bengali) করা হয়েছে
    <div className={`min-h-screen font-sans relative z-0 overflow-x-hidden transition-colors duration-500 ${darkMode ? 'bg-[#18191A] text-[#E4E6EB]' : 'bg-[#FAFAFA] text-[#1C1917]'}`}>
      
      <header className="fixed top-0 w-full bg-white/95 dark:bg-[#242526]/95 backdrop-blur-md border-b border-[#E7E5E4] dark:border-[#3E4042] z-50 transition-colors duration-300">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Menu 
              className="w-7 h-7 lg:hidden text-[#1C1917] dark:text-[#E4E6EB] cursor-pointer" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
            <h1 className="font-extrabold text-xl sm:text-2xl text-[#C2410C] dark:text-[#EA580C] font-serif cursor-pointer tracking-tight">
              বইয়ের জগৎ
            </h1>
          </div>
          
          <div className="flex gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-[#E4E6EB]" />
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 dark:bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-[#E4E6EB]" />
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed top-16 left-0 w-full bg-white dark:bg-[#242526] border-b border-[#E7E5E4] dark:border-[#3E4042] p-4 z-40 lg:hidden shadow-lg">
          <button 
            onClick={() => { setDarkMode(!darkMode); setIsMobileMenuOpen(false); }} 
            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#3A3B3C] rounded-xl flex items-center gap-3"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600 dark:text-[#E4E6EB]" />}
            <span className="font-semibold text-[15px]">{darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
          </button>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto pt-20 sm:pt-24 px-4 sm:px-6 flex justify-center lg:justify-between gap-6 relative w-full">
        
        <aside className="hidden lg:flex flex-col w-[250px] flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img src={DB.currentUser.avatar} className="w-10 h-10 rounded-full shadow-sm" alt="Profile" />
            <div>
              <h3 className="font-bold text-[14px]">{DB.currentUser.name}</h3>
              <p className="text-xs text-[#A8A29E] dark:text-[#B0B3B8] font-medium">@rafsan_reads</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold text-[15px] ${currentView === item.id ? 'bg-rose-50 dark:bg-[#3A3B3C] text-[#C2410C] dark:text-[#EA580C]' : 'text-[#78716C] dark:text-[#B0B3B8] hover:bg-gray-100 dark:hover:bg-[#3A3B3C]'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="mt-auto flex items-center gap-4 px-4 py-3 bg-gray-100 dark:bg-[#3A3B3C] rounded-xl hover:bg-gray-200 dark:hover:bg-[#4E4F50] transition-colors font-semibold text-[15px] text-[#78716C] dark:text-[#E4E6EB]"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            {darkMode ? 'লাইট মোড' : 'ডার্ক মোড'}
          </button>
        </aside>

        <main className="w-full lg:max-w-[600px] flex-1 mx-auto">
          {currentView === 'feed' && <FeedView />}
          {currentView !== 'feed' && (
            <div className="text-center py-20 text-[#A8A29E] dark:text-[#B0B3B8] font-bold text-xl">
              এই পেজটি নির্মাণাধীন...
            </div>
          )}
        </main>

        <aside className="hidden xl:flex flex-col w-[280px] flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="bg-white dark:bg-[#242526] p-5 rounded-3xl shadow-sm border border-[#E7E5E4] dark:border-[#3E4042] mb-5">
            <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2 text-[#1C1917] dark:text-[#E4E6EB]">
              <TrendingUp className="w-4 h-4 text-[#C2410C] dark:text-[#EA580C]" /> ট্রেন্ডিং বইসমূহ
            </h3>
            <div className="space-y-4">
              {DB.trendingBooks.map(book => (
                <div key={book.id} className="flex gap-3 cursor-pointer group">
                  <img src={book.cover} className="w-12 h-16 rounded-md object-cover group-hover:scale-105 transition-transform" alt="" />
                  <div className="py-1">
                    <h4 className="font-semibold text-[14px] group-hover:text-[#C2410C] dark:group-hover:text-[#EA580C] transition-colors line-clamp-1">{book.title}</h4>
                    <p className="text-[12px] text-[#A8A29E] dark:text-[#B0B3B8] mt-0.5">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#242526] p-5 rounded-3xl shadow-sm border border-[#E7E5E4] dark:border-[#3E4042]">
            <h3 className="font-bold text-[15px] mb-4 flex items-center gap-2 text-[#1C1917] dark:text-[#E4E6EB]">
              <User className="w-4 h-4 text-blue-500" /> পঠিত লেখক
            </h3>
            <div className="space-y-4">
              {DB.suggestedAuthors.map(author => (
                <div key={author.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={author.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <div>
                      <h4 className="font-semibold text-[13px]">{author.name}</h4>
                      <p className="text-[11px] text-[#A8A29E] dark:text-[#B0B3B8] font-medium">{author.followers} ফলোয়ার</p>
                    </div>
                  </div>
                  <button className="bg-gray-100 dark:bg-[#3A3B3C] hover:bg-gray-200 dark:hover:bg-[#4E4F50] p-1.5 rounded-full transition-colors">
                    <PlusCircle className="w-4 h-4 text-[#78716C] dark:text-[#E4E6EB]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      <nav className="fixed bottom-0 w-full bg-white dark:bg-[#242526] border-t border-[#E7E5E4] dark:border-[#3E4042] pb-safe z-50 lg:hidden">
        <div className="flex justify-around p-2">
          {navItems.slice(0, 5).map(item => (
            <div 
              key={item.id} 
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center cursor-pointer px-3 py-1.5 rounded-xl transition-all ${currentView === item.id ? 'text-[#C2410C] dark:text-[#EA580C] bg-rose-50 dark:bg-[#3A3B3C]' : 'text-[#A8A29E] dark:text-[#B0B3B8]'}`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

    </div>
  );
}