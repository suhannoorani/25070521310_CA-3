import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Layers, Clock, Globe } from 'lucide-react';
import { api } from '../api';

export default function CreateSkillModal({
  isOpen,
  onClose,
  currentUser,
  onSkillCreated,
  showToast,
}) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Code & Tech');
  const [level, setLevel] = useState('All Levels');
  const [skillWanted, setSkillWanted] = useState('');
  const [format, setFormat] = useState('Online / Video Call');
  const [sessionLength, setSessionLength] = useState('45 mins');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Code & Tech',
    'Design & Creative',
    'Academics & Math',
    'Languages',
    'Music & Arts',
    'Business & Career',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !skillWanted.trim()) {
      setError('Title, description, and skill wanted are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        title: title.trim(),
        category,
        level,
        skillWanted: skillWanted.trim(),
        format,
        sessionLength,
        description: description.trim(),
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      };

      await api.skills.create(payload);
      showToast('Skill listing published! You earned +10 Karma points.', 'success');
      onSkillCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to publish skill listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Offer a Skill to Peers</h3>
              <p className="text-xs text-slate-400">Share your knowledge and earn +10 Karma points</p>
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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Skill / Topic Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Full-Stack React & Node.js, Jazz Guitar, Calculus II"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Skill You Want in Exchange <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Conversational French, Python for ML, Acoustic Guitar"
              value={skillWanted}
              onChange={(e) => setSkillWanted(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Exchange Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="Online / Video Call">Online / Video Call</option>
                <option value="Campus In-Person">Campus In-Person</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Session Length
              </label>
              <select
                value={sessionLength}
                onChange={(e) => setSessionLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
              >
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description & What You Will Cover <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Outline what you will teach, your experience, and how sessions will be structured..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, JavaScript, Web Development"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            {loading ? (
              <span>Publishing Listing...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Publish Listing (+10 Karma)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
