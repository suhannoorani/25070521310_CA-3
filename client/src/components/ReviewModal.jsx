import React, { useState } from 'react';
import { X, Star, Heart, Send } from 'lucide-react';
import { api } from '../api';

export default function ReviewModal({
  isOpen,
  onClose,
  swap,
  currentUser,
  onReviewSubmitted,
  showToast,
}) {
  if (!isOpen || !swap) return null;

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const isRequester = swap.requester?._id === currentUser?._id;
  const peer = isRequester ? swap.receiver : swap.requester;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.swaps.submitReview(swap._id, {
        rating,
        comment: comment.trim() || 'Great peer session! Learned a lot and highly recommend.',
      });
      showToast('Endorsement and rating submitted! Thank you for supporting your peer.', 'success');
      onReviewSubmitted();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-400" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Endorse Your Peer</h3>
              <p className="text-xs text-slate-400">Review for {peer?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-400 font-medium">How was your learning experience?</p>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs font-bold text-amber-400">
              {rating === 5
                ? 'Outstanding Peer Tutor!'
                : rating === 4
                ? 'Great Session!'
                : rating === 3
                ? 'Good'
                : 'Needs Improvement'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Endorsement Feedback
            </label>
            <textarea
              rows={3}
              placeholder="Highlight what your peer explained well, their patience, clarity, or helpful tips..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting...' : 'Post Endorsement'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
