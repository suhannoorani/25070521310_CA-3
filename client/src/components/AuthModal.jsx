import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  BookOpen,
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  onAuthSuccess,
  showToast,
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    major: '',
    bio: '',
    skillsTeaching: '',
    skillsLearning: '',
  });

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.auth.login(loginForm);
      localStorage.setItem('skillswap_token', data.token);
      showToast('Welcome back, ' + data.user.name + '! Logged in successfully.', 'success');
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        college: registerForm.college || 'State University',
        major: registerForm.major || 'Computer Science',
        bio: registerForm.bio || 'Excited to swap skills with fellow peers!',
        skillsTeaching: registerForm.skillsTeaching
          ? registerForm.skillsTeaching.split(',').map((s) => s.trim())
          : [],
        skillsLearning: registerForm.skillsLearning
          ? registerForm.skillsLearning.split(',').map((s) => s.trim())
          : [],
      };

      const data = await api.auth.register(payload);
      localStorage.setItem('skillswap_token', data.token);
      showToast('Account created and saved to MongoDB! Welcome to SkillSwap, ' + data.user.name + '!', 'success');
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (email, password) => {
    setMode('login');
    setLoginForm({ email, password });
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Top Header & Close button */}
        <div className="p-6 pb-4 border-b border-slate-800 bg-gradient-to-b from-slate-800/60 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {mode === 'login' ? 'Student Sign In' : 'Create Student Account'}
                </h3>
                <p className="text-xs text-slate-400">
                  {mode === 'login'
                    ? 'Access your peer skill swaps and exchange sessions'
                    : 'Join the campus community & store your profile in MongoDB'}
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

          {/* Mode Switch Tabs */}
          <div className="mt-4 flex rounded-xl bg-slate-950/70 p-1 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account (MongoDB)
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Forms Body */}
        <div className="p-6">
          {mode === 'login' ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Campus Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="alex.chen@campus.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Log In to SkillSwap</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Accounts Quick-Select */}
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Quick Demo Student Sign In
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('alex.chen@campus.edu', 'password123')}
                    className="p-2 text-left rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition group"
                  >
                    <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400">
                      Alex Chen
                    </p>
                    <p className="text-[10px] text-slate-400">CS Senior • UC Berkeley</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoAccount('maya.patel@campus.edu', 'password123')}
                    className="p-2 text-left rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition group"
                  >
                    <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400">
                      Maya Patel
                    </p>
                    <p className="text-[10px] text-slate-400">Design • Stanford</p>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM (STORE IN MONGODB) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                <Database className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>Stores real user documents in MongoDB with encrypted bcrypt passwords.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="jordan.miller@campus.edu"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Password (min. 6 characters) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Create a secure password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    University / College
                  </label>
                  <input
                    type="text"
                    value={registerForm.college}
                    onChange={(e) => setRegisterForm({ ...registerForm, college: e.target.value })}
                    placeholder="e.g. Harvard, MIT"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Major / Field
                  </label>
                  <input
                    type="text"
                    value={registerForm.major}
                    onChange={(e) => setRegisterForm({ ...registerForm, major: e.target.value })}
                    placeholder="e.g. Data Science"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skill(s) You Can Teach (comma-separated)
                </label>
                <input
                  type="text"
                  value={registerForm.skillsTeaching}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsTeaching: e.target.value })}
                  placeholder="e.g. React.js, Acoustic Guitar, Linear Algebra"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Skill(s) You Want to Learn (comma-separated)
                </label>
                <input
                  type="text"
                  value={registerForm.skillsLearning}
                  onChange={(e) => setRegisterForm({ ...registerForm, skillsLearning: e.target.value })}
                  placeholder="e.g. Figma UI Design, Conversational French"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Bio / Learning Goals
                </label>
                <textarea
                  rows={2}
                  value={registerForm.bio}
                  onChange={(e) => setRegisterForm({ ...registerForm, bio: e.target.value })}
                  placeholder="Tell peers what you are enthusiastic about..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                {loading ? (
                  <span>Saving record to MongoDB...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Registration & Save to DB</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
