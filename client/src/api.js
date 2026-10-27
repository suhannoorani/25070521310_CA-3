const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('skillswap_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  auth: {
    async register(data) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Registration failed');
      return json;
    },

    async login(credentials) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Login failed');
      return json;
    },

    async getMe() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch user');
      return json.user;
    },

    async updateProfile(data) {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update profile');
      return json;
    },
  },

  // Skills
  skills: {
    async getAll(filters = {}) {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.level && filters.level !== 'All') params.append('level', filters.level);
      if (filters.format && filters.format !== 'All') params.append('format', filters.format);
      if (filters.college && filters.college !== 'All') params.append('college', filters.college);

      const url = `${API_BASE}/skills${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, { headers: getHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch skills');
      return json.skills;
    },

    async getById(id) {
      const res = await fetch(`${API_BASE}/skills/${id}`, { headers: getHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch skill');
      return json.skill;
    },

    async create(data) {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create skill');
      return json;
    },

    async delete(id) {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to delete skill');
      return json;
    },
  },

  // Swaps
  swaps: {
    async getAll(status = 'all') {
      const url = status && status !== 'all' ? `${API_BASE}/swaps?status=${status}` : `${API_BASE}/swaps`;
      const res = await fetch(url, { headers: getHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch swaps');
      return json.swaps;
    },

    async getById(id) {
      const res = await fetch(`${API_BASE}/swaps/${id}`, { headers: getHeaders() });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch swap');
      return json.swap;
    },

    async create(data) {
      const res = await fetch(`${API_BASE}/swaps`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to create swap request');
      return json;
    },

    async updateStatus(id, status) {
      const res = await fetch(`${API_BASE}/swaps/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to update swap status');
      return json;
    },

    async complete(id) {
      const res = await fetch(`${API_BASE}/swaps/${id}/complete`, {
        method: 'PATCH',
        headers: getHeaders(),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to complete swap');
      return json;
    },

    async sendMessage(id, text) {
      const res = await fetch(`${API_BASE}/swaps/${id}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ text }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to post message');
      return json.messages;
    },

    async submitReview(id, reviewData) {
      const res = await fetch(`${API_BASE}/swaps/${id}/review`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to submit review');
      return json;
    },
  },

  // Community
  community: {
    async getStats() {
      const res = await fetch(`${API_BASE}/community/stats`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch community stats');
      return json;
    },

    async getPeers() {
      const res = await fetch(`${API_BASE}/community/peers`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch peers');
      return json.peers;
    },
  },

  // Health
  health: {
    async check() {
      const res = await fetch(`${API_BASE}/health`);
      return res.json();
    },
  },
};
