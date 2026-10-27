import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import MarketplaceView from './components/MarketplaceView';
import MySwapsView from './components/MySwapsView';
import LiveSwapRoomView from './components/LiveSwapRoomView';
import CommunityLeaderboardView from './components/CommunityLeaderboardView';
import ProfileView from './components/ProfileView';
import CreateSkillModal from './components/CreateSkillModal';
import SwapRequestModal from './components/SwapRequestModal';
import ReviewModal from './components/ReviewModal';
import Toast from './components/Toast';
import { api } from './api';
import { Sparkles, Database, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('marketplace');
  const [skills, setSkills] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [createSkillModalOpen, setCreateSkillModalOpen] = useState(false);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [targetSkillForSwap, setTargetSkillForSwap] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedSwapForReview, setSelectedSwapForReview] = useState(null);
  const [activeRoomSwap, setActiveRoomSwap] = useState(null);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Initial Data Fetch
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      try {
        // 1. Fetch current user if token exists
        const token = localStorage.getItem('skillswap_token');
        if (token) {
          try {
            const currentUser = await api.auth.getMe();
            setUser(currentUser);
          } catch (err) {
            console.warn('Session expired or invalid token:', err);
            localStorage.removeItem('skillswap_token');
          }
        }

        // 2. Fetch marketplace skills
        await refreshSkills();

        // 3. Fetch community stats
        const communityStats = await api.community.getStats();
        setStats(communityStats);
      } catch (err) {
        console.error('App initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  // Fetch swaps whenever user changes or logs in
  useEffect(() => {
    if (user) {
      refreshSwaps();
    } else {
      setSwaps([]);
    }
  }, [user]);

  const refreshSkills = async () => {
    try {
      const allSkills = await api.skills.getAll();
      setSkills(allSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const refreshSwaps = async () => {
    if (!user) return;
    try {
      const userSwaps = await api.swaps.getAll();
      setSwaps(userSwaps);
    } catch (err) {
      console.error('Error fetching swaps:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('skillswap_token');
    setUser(null);
    setCurrentView('marketplace');
    showToast('You have been logged out successfully.', 'info');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    refreshSwaps();
  };

  const handleInitiateSwap = (skill) => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setTargetSkillForSwap(skill);
    setSwapModalOpen(true);
  };

  const handleEnterLiveRoom = (swap) => {
    setActiveRoomSwap(swap);
    setCurrentView('live-room');
  };

  const handleOpenReviewModal = (swap) => {
    setSelectedSwapForReview(swap);
    setReviewModalOpen(true);
  };

  const handleDeleteSkill = async (skillId) => {
    if (!confirm('Are you sure you want to remove this skill listing?')) return;
    try {
      await api.skills.delete(skillId);
      showToast('Skill listing removed.', 'info');
      refreshSkills();
    } catch (err) {
      showToast(err.message || 'Failed to delete skill', 'error');
    }
  };

  const userSkills = skills.filter((s) => s.user?._id === user?._id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenCreateSkill={() => {
          if (!user) handleOpenAuth('login');
          else setCreateSkillModalOpen(true);
        }}
        onLogout={handleLogout}
        swapsCount={swaps.filter((s) => s.status === 'pending').length}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-xs text-slate-400 font-medium">
              Connecting to SkillSwap & MongoDB database...
            </p>
          </div>
        ) : (
          <>
            {currentView === 'marketplace' && (
              <MarketplaceView
                skills={skills}
                user={user}
                onInitiateSwap={handleInitiateSwap}
                onOpenCreateSkill={() => {
                  if (!user) handleOpenAuth('login');
                  else setCreateSkillModalOpen(true);
                }}
                onOpenAuth={handleOpenAuth}
              />
            )}

            {currentView === 'swaps' && (
              <MySwapsView
                swaps={swaps}
                currentUser={user}
                onRefreshSwaps={refreshSwaps}
                onEnterLiveRoom={handleEnterLiveRoom}
                onOpenReviewModal={handleOpenReviewModal}
                showToast={showToast}
              />
            )}

            {currentView === 'live-room' && (
              <LiveSwapRoomView
                activeSwap={activeRoomSwap}
                allSwaps={swaps}
                currentUser={user}
                onSelectSwap={setActiveRoomSwap}
                onCompleteSwap={async (id) => {
                  try {
                    await api.swaps.complete(id);
                    showToast('Swap marked complete! Both students earned +25 Karma.', 'success');
                    refreshSwaps();
                  } catch (e) {
                    showToast('Failed to complete swap', 'error');
                  }
                }}
                showToast={showToast}
              />
            )}

            {currentView === 'community' && (
              <CommunityLeaderboardView stats={stats} onRefreshStats={refreshSkills} />
            )}

            {currentView === 'profile' && (
              <ProfileView
                currentUser={user}
                userSkills={userSkills}
                onUpdateUser={(updated) => setUser(updated)}
                onOpenCreateSkill={() => setCreateSkillModalOpen(true)}
                onDeleteSkill={handleDeleteSkill}
                showToast={showToast}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-200">SkillSwap</span>
            <span>•</span>
            <span>Peer-to-Peer Student Exchange Platform</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <span>MongoDB Connected</span>
            <span>•</span>
            <span>Vite + React + Tailwind + Node.js</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
        showToast={showToast}
      />

      <CreateSkillModal
        isOpen={createSkillModalOpen}
        onClose={() => setCreateSkillModalOpen(false)}
        currentUser={user}
        onSkillCreated={() => {
          refreshSkills();
          refreshSwaps();
        }}
        showToast={showToast}
      />

      <SwapRequestModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        targetSkill={targetSkillForSwap}
        currentUser={user}
        onSwapCreated={() => {
          refreshSwaps();
          setCurrentView('swaps');
        }}
        showToast={showToast}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        swap={selectedSwapForReview}
        currentUser={user}
        onReviewSubmitted={() => {
          refreshSwaps();
          refreshSkills();
        }}
        showToast={showToast}
      />
    </div>
  );
}
