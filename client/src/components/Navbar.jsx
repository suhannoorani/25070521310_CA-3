import React from 'react';
import {
  ArrowLeftRight,
  Compass,
  Repeat,
  Video,
  Trophy,
  User,
  PlusCircle,
  LogIn,
  LogOut,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function Navbar({
  currentView,
  setCurrentView,
  user,
  onOpenAuth,
  onOpenCreateSkill,
  onLogout,
  swapsCount = 0
}) {
  const navItems = [
    { id: 'marketplace', label: 'Explore Skills', icon: Compass },
    { id: 'swaps', label: 'My Swaps', icon: Repeat, badge: swapsCount > 0 ? swapsCount : null },
    { id: 'live-room', label: 'Live Exchange Room', icon: Video },
    { id: 'community', label: 'Karma & Leaders', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentView('marketplace')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  SkillSwap
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Peer-to-Peer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Trade Skills, Not Money • Student Powered
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={onOpenCreateSkill}
                  className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Offer Skill</span>
                </button>

                {/* Karma badge */}
                <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.karma || 50} Karma</span>
                </div>

                {/* Profile Pill */}
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`flex items-center space-x-2.5 p-1.5 pr-3 rounded-full transition border ${
                    currentView === 'profile'
                      ? 'bg-indigo-500/20 border-indigo-500/40 text-white'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full bg-slate-700 object-cover"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold leading-tight truncate max-w-[90px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[90px]">
                      {user.college?.split(' ')[0] || 'Campus'}
                    </p>
                  </div>
                </button>

                {/* Logout */}
                <button
                  onClick={onLogout}
                  title="Log out"
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/25 transition"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Join SkillSwap</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80 bg-slate-900/95 text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
