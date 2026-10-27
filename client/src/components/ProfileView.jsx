import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Sparkles,
  Star,
  Plus,
  X,
  Save,
  Database,
  Trash2,
  BookOpen
} from 'lucide-react';
import { api } from '../api';

export default function ProfileView({
  currentUser,
  userSkills = [],
  onUpdateUser,
  onOpenCreateSkill,
  onDeleteSkill,
  showToast,
}) {
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [college, setCollege] = useState(currentUser?.college || '');
  const [major, setMajor] = useState(currentUser?.major || '');
  const [skillsTeaching, setSkillsTeaching] = useState(
    currentUser?.skillsTeaching || []
  );
  const [skillsLearning, setSkillsLearning] = useState(
    currentUser?.skillsLearning || []
  );
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.auth.updateProfile({
        bio,
        college,
        major,
        skillsTeaching,
        skillsLearning,
      });
      onUpdateUser(updated.user);
      showToast('Profile updated in MongoDB!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addTeachSkill = () => {
    if (newTeachSkill.trim() && !skillsTeaching.includes(newTeachSkill.trim())) {
      setSkillsTeaching([...skillsTeaching, newTeachSkill.trim()]);
      setNewTeachSkill('');
    }
  };

  const removeTeachSkill = (skillToRemove) => {
    setSkillsTeaching(skillsTeaching.filter((s) => s !== skillToRemove));
  };

  const addLearnSkill = () => {
    if (newLearnSkill.trim() && !skillsLearning.includes(newLearnSkill.trim())) {
      setSkillsLearning([...skillsLearning, newLearnSkill.trim()]);
      setNewLearnSkill('');
    }
  };

  const removeLearnSkill = (skillToRemove) => {
    setSkillsLearning(skillsLearning.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Profile Card Header */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <img
            src={
              currentUser?.avatar ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.name}`
            }
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full bg-slate-800 object-cover ring-4 ring-indigo-500/30 shadow-lg"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentUser?.name}</h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-slate-400 mt-1">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>
                    {currentUser?.college} • {currentUser?.major}
                  </span>
                </div>
              </div>

              {/* Karma & Rating Badges */}
              <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentUser?.karma || 50} Karma</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{currentUser?.rating || 5.0}</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
              {currentUser?.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                >
                  {badge}
                </span>
              ))}
              <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>MongoDB Verified</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form & Skills Editor */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* University & Major Edit */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Campus Affiliation</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                College / University
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Bio Edit */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>About You</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Bio & Learning Motivation
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Skills I Teach Manager */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Skills You Offer to Teach</h3>
              <p className="text-xs text-slate-400">
                These tags show up on your student profile and help peers discover you.
              </p>
            </div>
          </div>

          {/* Current tags */}
          <div className="flex flex-wrap gap-2">
            {skillsTeaching.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeTeachSkill(skill)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add tag input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add another skill you can teach..."
              value={newTeachSkill}
              onChange={(e) => setNewTeachSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTeachSkill())}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addTeachSkill}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Skills I Want to Learn Manager */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Skills You Want to Learn</h3>
              <p className="text-xs text-slate-400">
                Let fellow peers know what you would like in exchange.
              </p>
            </div>
          </div>

          {/* Current tags */}
          <div className="flex flex-wrap gap-2">
            {skillsLearning.map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeLearnSkill(skill)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add tag input */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add another skill you wish to learn..."
              value={newLearnSkill}
              onChange={(e) => setNewLearnSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLearnSkill())}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addLearnSkill}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating MongoDB...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Your Published Skill Listings Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Your Active Marketplace Listings ({userSkills.length})</span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage the listings that students can discover on the exchange catalog.
            </p>
          </div>
          <button
            onClick={onOpenCreateSkill}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
          >
            + Post New Listing
          </button>
        </div>

        {userSkills.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            You haven't posted any skill listings yet. Offer a skill to start receiving swap requests!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {userSkills.map((s) => (
              <div
                key={s._id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{s.title}</h4>
                  <p className="text-[11px] text-slate-400">{s.category} • {s.level}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">Wants: {s.skillWanted}</p>
                </div>
                <button
                  onClick={() => onDeleteSkill(s._id)}
                  title="Delete listing"
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
