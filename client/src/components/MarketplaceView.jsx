import React, { useState } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  ArrowRightLeft,
  GraduationCap,
  Clock,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  PlusCircle,
  BookOpen
} from 'lucide-react';

export default function MarketplaceView({
  skills,
  user,
  onInitiateSwap,
  onOpenCreateSkill,
  onOpenAuth,
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const categories = [
    'All',
    'Code & Tech',
    'Design & Creative',
    'Academics & Math',
    'Languages',
    'Music & Arts',
    'Business & Career',
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter skills
  const filteredSkills = skills.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesLevel =
      selectedLevel === 'All' || item.level === selectedLevel;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skillWanted?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user?.college?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Showcase Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Tuition • Pure Student Knowledge Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-none">
            Trade What You Know. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Learn What You Want.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            The premier campus barter network. Swap pair programming for guitar lessons,
            Figma design for calculus coaching, or conversational French for data science.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (user) onOpenCreateSkill();
                else onOpenAuth('register');
              }}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Offer a Skill Listing (+10 Karma)</span>
            </button>
            <a
              href="#explore-catalog"
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Browse {skills.length} Student Offers</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-2xl font-bold text-white">{skills.length}</p>
              <p className="text-xs text-slate-400 font-medium">Active Peer Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Free Campus Barter</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">5.0 ★</p>
              <p className="text-xs text-slate-400 font-medium">Avg Student Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">Karma</p>
              <p className="text-xs text-slate-400 font-medium">Reputation Driven</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div id="explore-catalog" className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search skills, topics, universities, or peers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-400 font-medium">Skill Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <GraduationCap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No skill listings found</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1 mb-5">
            Try adjusting your search criteria or be the first student to offer this topic!
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedLevel('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((item) => {
            const isSelf = user && item.user?._id === user._id;

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 p-5 group"
              >
                <div>
                  {/* Card Header: Peer Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.user?.name || 'peer'}`}
                        alt={item.user?.name || 'Student'}
                        className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-indigo-500/20"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                          {item.user?.name || 'Anonymous Student'}
                        </h4>
                        <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="truncate max-w-[130px]">
                            {item.college || item.user?.college || 'Campus Member'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating || '5.0'}</span>
                    </div>
                  </div>

                  {/* Skill Badge & Level */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {item.level}
                    </span>
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{item.sessionLength || '45 mins'}</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div>
                  {/* Skill Wanted in Exchange */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center space-x-1">
                      <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
                      <span>Wants In Exchange:</span>
                    </p>
                    <p className="text-xs font-semibold text-emerald-300">
                      {item.skillWanted}
                    </p>
                  </div>

                  {/* Action Button */}
                  {isSelf ? (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-center text-xs font-semibold">
                      Your Skill Listing
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!user) {
                          onOpenAuth('login');
                        } else {
                          onInitiateSwap(item);
                        }
                      }}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20 group-hover:scale-[1.01]"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Request Skill Swap</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
