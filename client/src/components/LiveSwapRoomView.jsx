import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  ScreenShare,
  MessageSquare,
  Send,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle,
  Copy,
  Check,
  Code,
  Users,
  Maximize2
} from 'lucide-react';
import { api } from '../api';

export default function LiveSwapRoomView({
  activeSwap,
  allSwaps = [],
  currentUser,
  onSelectSwap,
  onCompleteSwap,
  showToast,
}) {
  // If no swap is selected, pick the first active accepted swap
  const currentSwap =
    activeSwap ||
    allSwaps.find((s) => s.status === 'accepted') ||
    allSwaps[0];

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notes, setNotes] = useState(
    `# SkillSwap Peer Session Notes\n\n- Topic: ${currentSwap?.proposedTopic || 'Peer Skill Exchange'}\n- Session Goal: Master key concepts & build a mini-project\n\n## Action Items\n[x] Share repo & starter code\n[ ] Walk through architecture & design\n[ ] Q&A & practice exercises\n\n\`\`\`javascript\n// Shared snippet\nconst swapSkills = (peerA, peerB) => {\n  return "100% Free Learning Supercharged!";\n};\n\`\`\``
  );

  const [messages, setMessages] = useState(currentSwap?.messages || []);
  const [chatInput, setChatInput] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(1450); // simulated elapsed session time
  const chatBottomRef = useRef(null);

  // Timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync messages if currentSwap changes
  useEffect(() => {
    if (currentSwap?.messages) {
      setMessages(currentSwap.messages);
    }
  }, [currentSwap]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentSwap) return;

    const tempText = chatInput;
    setChatInput('');
    setSendingMsg(true);

    try {
      const updatedMessages = await api.swaps.sendMessage(currentSwap._id, tempText);
      setMessages(updatedMessages);
    } catch (err) {
      showToast('Failed to send message: ' + err.message, 'error');
    } finally {
      setSendingMsg(false);
    }
  };

  const copyMeetingLink = () => {
    const link = currentSwap?.meetingLink || window.location.href;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    showToast('Meeting room link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!currentSwap) {
    return (
      <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
        <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">No Active Swap Session Selected</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2 mb-6">
          You don't have any active swap sessions yet. Go to the marketplace to propose a skill swap or accept a pending request!
        </p>
      </div>
    );
  }

  const isRequester = currentSwap.requester?._id === currentUser?._id;
  const peer = isRequester ? currentSwap.receiver : currentSwap.requester;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Session Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">
                Live Peer Exchange: {currentSwap.proposedTopic || 'Skill Swap'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                Live Room Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Exchanging with <span className="text-indigo-400 font-semibold">{peer?.name}</span> ({peer?.college})
            </p>
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Session: {formatTimer(sessionSeconds)}</span>
          </div>

          <button
            onClick={copyMeetingLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share Link'}</span>
          </button>

          <button
            onClick={() => onCompleteSwap(currentSwap._id)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Finish & Award Karma</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Simulated Video Feeds & Collaborative Notes (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dual Video Stream Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Peer Video Tile */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg flex items-center justify-center group">
              <img
                src={peer?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${peer?.name || 'peer'}`}
                alt={peer?.name}
                className="w-20 h-20 rounded-full bg-slate-800 object-cover ring-4 ring-indigo-500/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700">
                  {peer?.name || 'Peer'} (Teaching)
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                <span className="p-1.5 rounded-lg bg-slate-900/80 backdrop-blur text-slate-300">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                </span>
              </div>
            </div>

            {/* Self Video Tile */}
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-lg flex items-center justify-center">
              {videoOn ? (
                <img
                  src={currentUser?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.name || 'self'}`}
                  alt="You"
                  className="w-20 h-20 rounded-full bg-slate-800 object-cover ring-4 ring-emerald-500/20"
                />
              ) : (
                <div className="text-center p-4">
                  <VideoOff className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">Camera turned off</p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700">
                  You ({currentUser?.name?.split(' ')[0] || 'Student'})
                </span>
                {!micOn && (
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">
                    Muted
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Video Control Bar */}
          <div className="flex items-center justify-center space-x-4 p-3 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => {
                setMicOn(!micOn);
                showToast(micOn ? 'Microphone muted' : 'Microphone unmuted', 'info');
              }}
              className={`p-3 rounded-xl transition ${
                micOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              }`}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setVideoOn(!videoOn);
                showToast(videoOn ? 'Camera disabled' : 'Camera enabled', 'info');
              }}
              className={`p-3 rounded-xl transition ${
                videoOn
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              }`}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setScreenSharing(!screenSharing);
                showToast(screenSharing ? 'Screen share stopped' : 'Screen share active', 'info');
              }}
              className={`p-3 rounded-xl transition ${
                screenSharing
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
            >
              <ScreenShare className="w-5 h-5" />
            </button>

            <a
              href={currentSwap.meetingLink || 'https://meet.google.com/new'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Launch External Video Call</span>
            </a>
          </div>

          {/* Collaborative Session Scratchpad / Whiteboard */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Collaborative Study Notes & Code</h4>
              </div>
              <span className="text-[10px] text-slate-500">Auto-saved to session</span>
            </div>

            <textarea
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none selection:bg-indigo-500"
            />
          </div>

        </div>

        {/* Right Column: Interactive Real-Time Chat (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-[650px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Session Dialogue</h3>
            </div>
            <span className="text-[11px] text-slate-400">
              {messages.length} messages
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No messages yet. Say hi and start your exchange session!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = msg.sender === currentUser?._id;
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-1 px-1">
                      {isMe ? 'You' : msg.senderName || peer?.name || 'Peer'}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-950/40 border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {[
              "Let's review the code!",
              'Can you hear me clearly?',
              'Great explanation!',
              'Can you share your screen?',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setChatInput(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message or paste a code link..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={sendingMsg || !chatInput.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50 shadow-md shadow-indigo-600/30"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
