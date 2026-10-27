import React, { useState } from 'react';
import {
  Repeat,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Video,
  ArrowRightLeft,
  MessageSquare,
  Award,
  Sparkles,
  ExternalLink,
  Star
} from 'lucide-react';
import { api } from '../api';

export default function MySwapsView({
  swaps,
  currentUser,
  onRefreshSwaps,
  onEnterLiveRoom,
  onOpenReviewModal,
  showToast,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'accepted' | 'completed'

  const filteredSwaps = swaps.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const handleUpdateStatus = async (swapId, newStatus) => {
    try {
      await api.swaps.updateStatus(swapId, newStatus);
      showToast(`Swap request ${newStatus}!`, 'success');
      onRefreshSwaps();
    } catch (err) {
      showToast(err.message || 'Failed to update swap status', 'error');
    }
  };

  const handleCompleteSwap = async (swapId) => {
    try {
      await api.swaps.complete(swapId);
      showToast('Swap marked completed! Both students awarded +25 Karma!', 'success');
      onRefreshSwaps();
    } catch (err) {
      showToast(err.message || 'Failed to complete swap', 'error');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Repeat className="w-6 h-6 text-indigo-400" />
            <span>My Skill Swaps</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track incoming requests, launch live exchange sessions, and endorse peers.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'accepted', label: 'Active Sessions' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 font-semibold rounded-lg transition ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Repeat className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No swaps in this view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Explore the marketplace to propose a skill barter or accept incoming student requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredSwaps.map((swap) => {
            const isRequester = swap.requester?._id === currentUser?._id;
            const peer = isRequester ? swap.receiver : swap.requester;
            const myOfferedSkill = isRequester ? swap.skillOffered : swap.skillRequested;
            const peerOfferedSkill = isRequester ? swap.skillRequested : swap.skillOffered;

            return (
              <div
                key={swap._id}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-slate-700 transition space-y-4"
              >
                {/* Header: Peer Info & Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={peer?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${peer?.name || 'peer'}`}
                      alt={peer?.name}
                      className="w-11 h-11 rounded-full bg-slate-800 object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                        <span>{peer?.name || 'Peer Student'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-normal">
                          {isRequester ? 'Sent by you' : 'Received'}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        {peer?.college} • {peer?.major}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      swap.status === 'accepted'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : swap.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : swap.status === 'completed'
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {swap.status === 'accepted' ? 'Active / In Progress' : swap.status}
                  </span>
                </div>

                {/* Exchange Exchange Details */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">You Teach:</span>
                    <span className="font-semibold text-emerald-300">{myOfferedSkill}</span>
                  </div>
                  <div className="h-px bg-slate-800/60" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">They Teach:</span>
                    <span className="font-semibold text-indigo-300">{peerOfferedSkill}</span>
                  </div>
                  {swap.proposedTopic && (
                    <div className="pt-1 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-300">Topic:</span> {swap.proposedTopic}
                    </div>
                  )}
                </div>

                {/* Session Scheduling & Meeting Link */}
                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{swap.scheduledDate || 'Date: TBD'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{swap.scheduledTime || 'Time: TBD'}</span>
                    </span>
                  </div>
                </div>

                {/* Review Display if completed */}
                {swap.review?.rating && (
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs">
                    <div className="flex items-center space-x-1 text-amber-400 mb-1">
                      {[...Array(swap.review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="ml-1 text-[11px] font-bold text-white">Peer Endorsement</span>
                    </div>
                    <p className="text-slate-300 italic">"{swap.review.comment}"</p>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {/* If Pending & Receiver */}
                  {!isRequester && swap.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(swap._id, 'accepted')}
                        className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Swap</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(swap._id, 'declined')}
                        className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-medium transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}

                  {/* If Pending & Requester */}
                  {isRequester && swap.status === 'pending' && (
                    <div className="w-full py-2 px-3 rounded-xl bg-slate-800/40 text-slate-400 text-center text-xs">
                      Awaiting {peer?.name}'s response...
                    </div>
                  )}

                  {/* If Accepted / Active Session */}
                  {swap.status === 'accepted' && (
                    <>
                      <button
                        onClick={() => onEnterLiveRoom(swap)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
                      >
                        <Video className="w-4 h-4" />
                        <span>Enter Live Swap Room</span>
                      </button>
                      <button
                        onClick={() => handleCompleteSwap(swap._id)}
                        className="flex items-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                      >
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        <span>Complete (+25 Karma)</span>
                      </button>
                    </>
                  )}

                  {/* If Completed & No Review Left */}
                  {swap.status === 'completed' && !swap.review?.rating && (
                    <button
                      onClick={() => onOpenReviewModal(swap)}
                      className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
                    >
                      <Star className="w-4 h-4" />
                      <span>Endorse Peer & Rate Session</span>
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
