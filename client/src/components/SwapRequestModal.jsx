import React, { useState } from 'react';
import { X, ArrowRightLeft, Calendar, Clock, MessageSquare, Send } from 'lucide-react';
import { api } from '../api';

export default function SwapRequestModal({
  isOpen,
  onClose,
  targetSkill,
  currentUser,
  onSwapCreated,
  showToast,
}) {
  if (!isOpen || !targetSkill) return null;

  const [skillOffered, setSkillOffered] = useState(
    currentUser?.skillsTeaching?.[0] || ''
  );
  const [proposedTopic, setProposedTopic] = useState('');
  const [scheduledDate, setScheduledDate] = useState('2026-11-05');
  const [scheduledTime, setScheduledTime] = useState('15:00 EST');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skillOffered.trim()) {
      setError('Please specify the skill you are offering in return.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        skillId: targetSkill._id,
        receiverId: targetSkill.user._id,
        skillOffered: skillOffered.trim(),
        skillRequested: targetSkill.title,
        proposedTopic: proposedTopic || `Peer exchange on ${targetSkill.title}`,
        message: message || `Hey ${targetSkill.user.name}, I would love to trade skills with you!`,
        scheduledDate,
        scheduledTime,
      };

      await api.swaps.create(payload);
      showToast(`Swap request sent to ${targetSkill.user.name}!`, 'success');
      onSwapCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit swap request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Propose Skill Swap</h3>
              <p className="text-xs text-slate-400">
                Peer exchange with {targetSkill.user?.name} ({targetSkill.user?.college})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Skill Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">You Want to Learn:</p>
            <p className="text-sm font-bold text-white mt-0.5">{targetSkill.title}</p>
            <p className="text-xs text-slate-400 mt-1">
              They are looking for: <span className="text-emerald-400 font-medium">{targetSkill.skillWanted}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              What Skill Will You Teach in Return? <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Figma UI Design, French Conversation, React"
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {currentUser?.skillsTeaching?.length > 0 && (
              <div className="mt-2 flex items-center space-x-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500">Quick pick from your profile:</span>
                {currentUser.skillsTeaching.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSkillOffered(skill)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Proposed Session Topic or Focus
            </label>
            <input
              type="text"
              placeholder="e.g. Build a portfolio nav in Figma / Debug my React component"
              value={proposedTopic}
              onChange={(e) => setProposedTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Preferred Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 16:00 EST"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Note to {targetSkill.user?.name}
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="Introduce yourself and let them know why you are excited to exchange skills..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {loading ? (
              <span>Sending Proposal...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Swap Proposal</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
