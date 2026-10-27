import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, Star, Award, GraduationCap, Flame, Heart, ArrowRightLeft, Clock } from 'lucide-react';
import { api } from '../api';

export default function CommunityLeaderboardView({ stats, onRefreshStats }) {
  const [data, setData] = useState(stats || null);
  const [loading, setLoading] = useState(!stats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.community.getStats();
        setData(res);
      } catch (err) {
        console.error('Failed to load community stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold mb-2">
          <Trophy className="w-3.5 h-3.5" />
          <span>Campus Honor Roll & Peer Impact</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Community Karma & Leaderboard
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Celebrating students who give back to their fellow peers through peer-to-peer tutoring and mentoring.
        </p>
      </div>

      {/* Global Impact Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Students Enrolled</span>
            <GraduationCap className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{data?.totalUsers || 24}</p>
          <p className="text-[11px] text-emerald-400 mt-1">Across 12+ Universities</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Swaps Completed</span>
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{data?.completedSwaps || 16}</p>
          <p className="text-[11px] text-emerald-400 mt-1">100% Free Peer Tutoring</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Exchange Hours</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{data?.hoursExchanged || 48} hrs</p>
          <p className="text-[11px] text-amber-400 mt-1">Dedicated Study Time</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Karma Points</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{data?.karmaAwarded || 1850}</p>
          <p className="text-[11px] text-purple-400 mt-1">Community Goodwill</p>
        </div>
      </div>

      {/* Main Content: Leaderboard + Endorsements Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Top Student Leaders (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Top Student Swappers</span>
          </h3>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800/80 shadow-xl">
            {data?.leaderboard?.map((student, idx) => {
              const rank = idx + 1;
              const isTopThree = rank <= 3;

              return (
                <div
                  key={student._id || idx}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/30'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : rank === 3
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rank}
                    </div>

                    {/* Avatar & Info */}
                    <img
                      src={student.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}`}
                      alt={student.name}
                      className="w-10 h-10 rounded-full bg-slate-800 object-cover"
                    />

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{student.name}</span>
                        {student.badges?.[0] && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                            {student.badges[0]}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {student.college} • {student.major}
                      </p>
                    </div>
                  </div>

                  {/* Karma & Rating */}
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-1 text-amber-400 font-extrabold text-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{student.karma || 100}</span>
                      <span className="text-[10px] font-normal text-slate-400">pts</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      ★ {student.rating || '5.0'} rating
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Peer Reviews & How It Works (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Peer Endorsements / Testimonials */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-rose-400" />
              <span>Recent Peer Endorsements</span>
            </h3>

            <div className="space-y-3">
              {data?.recentReviews?.length > 0 ? (
                data.recentReviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={rev.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.student}`}
                          alt={rev.student}
                          className="w-7 h-7 rounded-full bg-slate-800"
                        />
                        <span className="text-xs font-bold text-white">{rev.student}</span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs">
                        {[...Array(rev.rating || 5)].map((_, idx) => (
                          <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
                    <p className="text-[10px] text-indigo-400 font-medium">
                      Exchanged for: {rev.skillTitle}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  Reviews will appear here once students complete live swap sessions!
                </div>
              )}
            </div>
          </div>

          {/* How SkillSwap Works Guide Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-500/30 space-y-3">
            <h4 className="text-sm font-bold text-white">How The Karma System Works</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                  ✓
                </span>
                <span><strong>+50 Karma</strong> starting balance on registration.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                  ✓
                </span>
                <span><strong>+10 Karma</strong> awarded whenever you publish a skill listing.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                  ✓
                </span>
                <span><strong>+25 Karma</strong> awarded to both peers upon successful swap completion.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
