# SkillSwap — Peer-to-Peer Student Skill Exchange Platform

**Folder:** `25070521310`  
**Topic:** Peer-to-Peer Student Skill Exchange Platform  
**Stack:** React (Vite, Tailwind CSS, Lucide Icons) + Node.js/Express + MongoDB (Mongoose, MongoDB Compass compatible)

---

## 🌟 Overview

**SkillSwap** is a modern full-stack web application designed for campus communities, university students, and lifelong learners. Instead of paying expensive hourly tutoring fees, students trade what they know for what they want to learn (e.g., swapping React/Node.js coaching for acoustic guitar lessons or Figma design for Calculus tutoring).

The entire platform is powered by an interactive **Karma & Reputation** economy, offering real-time matching, request tracking, a live exchange room with collaborative whiteboard notes and real-time chat, and peer endorsement reviews.

---

## 🏗️ Architecture & Directory Structure

```text
25070521310/
├── client/                     # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar with karma badges & active user pills
│   │   │   ├── AuthModal.jsx            # Sign In & Account Creation (saved to MongoDB)
│   │   │   ├── MarketplaceView.jsx      # Skill catalog, category filters & search
│   │   │   ├── CreateSkillModal.jsx     # Form to publish skill offerings (+10 Karma)
│   │   │   ├── SwapRequestModal.jsx     # Barter proposal modal
│   │   │   ├── MySwapsView.jsx          # Pending, Active, and Completed swap management
│   │   │   ├── LiveSwapRoomView.jsx     # Interactive peer study room with video, notes & chat
│   │   │   ├── CommunityLeaderboardView.jsx # Campus honor roll, karma stats & reviews
│   │   │   ├── ProfileView.jsx          # Student profile, bio & skill portfolio editor
│   │   │   ├── ReviewModal.jsx          # Star ratings & endorsement modal
│   │   │   └── Toast.jsx                # Notification toasts
│   │   ├── api.js                       # Centralized API fetch layer
│   │   ├── App.jsx                      # Main application view router
│   │   ├── main.jsx                     # Vite React entry point
│   │   └── index.css                    # Tailwind CSS + custom glassmorphism styles
│   ├── index.html
│   ├── vite.config.js                   # Configured with proxy to http://localhost:5000
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                    # Resilient MongoDB connector (Compass + Auto-fallback)
│   │   ├── models/
│   │   │   ├── User.js                  # Student profile schema with bcrypt hashing
│   │   │   ├── Skill.js                 # Marketplace skill listing schema
│   │   │   └── SwapRequest.js           # Barter requests, scheduling, chat & reviews
│   │   ├── middleware/
│   │   │   └── auth.js                  # JWT bearer authentication middleware
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # Registration (MongoDB storage), login, profile
│   │   │   ├── skillRoutes.js           # Catalog search, filtering, and CRUD
│   │   │   ├── swapRoutes.js            # Swap lifecycle, status updates, chat messages, reviews
│   │   │   └── communityRoutes.js       # Campus statistics, karma leaderboards, endorsements
│   │   ├── seed.js                      # Realistic seed data generator
│   │   └── index.js                     # Express server entry point (CORS enabled)
│   ├── .env                             # Environment variables (PORT, MONGODB_URI, JWT_SECRET)
│   └── package.json
└── README.md
```

---

## 🗄️ MongoDB Community Server & Compass Setup

The backend is configured to connect to MongoDB Community Server at:
```
mongodb://127.0.0.1:27017/skillswap
```

### 1. How to Install MongoDB Community Server on Windows
If MongoDB Community Server is not yet installed on your system:

#### Option A: Terminal via `winget` (Administrator Command Prompt or PowerShell)
1. Open PowerShell or Command Prompt **as Administrator**.
2. Run:
   ```powershell
   winget install --id MongoDB.Server --source winget
   ```
3. Once completed, start the Windows service if not already started:
   ```powershell
   net start MongoDB
   ```

#### Option B: Official MSI Installer
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community).
2. Run the MSI installer, select **Complete**, and ensure **"Run service as Network Service user"** is selected.
3. Finish the installation.

### 2. Inspecting Data in MongoDB Compass
1. Download and open [MongoDB Compass](https://www.mongodb.com/try/download/compass).
2. Paste the connection string:
   ```
   mongodb://127.0.0.1:27017/skillswap
   ```
3. Click **Connect**. You will see the collections: `users`, `skills`, and `swaprequests`.

> **Note on Zero-Config Fallback:**  
> The backend features a resilient database manager in `server/src/config/db.js`. If your local MongoDB Community Server service is temporarily stopped or not yet running, it automatically boots an embedded MongoDB instance seamlessly so you can test every feature immediately without interruption. Once your MongoDB Community service is active, it connects to it directly.

---

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd 25070521310/server
npm install
npm run dev
```
Backend will start on **`http://localhost:5000`**.  
Health check endpoint: **`http://localhost:5000/api/health`**

### 2. Start the Frontend Client
```bash
cd 25070521310/client
npm install
npm run dev
```
Frontend will be accessible at: **`http://localhost:5173`**

---

## 🔑 Pre-Seeded Student Demo Accounts

For instant testing, the database is pre-seeded with sample student profiles (all use password: `password123`):

| Name | Campus Email | University | Specialization |
| :--- | :--- | :--- | :--- |
| **Alex Chen** | `alex.chen@campus.edu` | UC Berkeley | React & Node.js, Frontend Architecture |
| **Maya Patel** | `maya.patel@campus.edu` | Stanford University | Figma UI/UX, Design Systems |
| **Liam Rodriguez** | `liam.r@campus.edu` | UT Austin | Calculus II, Linear Algebra |
| **Chloe Dubois** | `chloe.dubois@campus.edu` | NYU | Conversational French, Academic Writing |

You can also use the one-click **"Quick Demo Student Sign In"** buttons in the login modal!

---

## ✨ Features Implemented

1. **User Authentication & MongoDB Storage**:
   - Create Account page validates inputs and stores new student user records in MongoDB.
   - Passwords securely hashed with `bcryptjs`.
   - JWT token authentication for state persistence.
   - Demo student quick-login buttons for one-click testing.

2. **Skill Marketplace & Explorer**:
   - Category filtering (Code & Tech, Design, Academics, Languages, Music, Business).
   - Real-time text search by title, description, keywords, or campus.
   - Visual cards showing teacher profile, star ratings, format, and "Wants In Exchange" badge.

3. **Peer Swap Proposal & Matchmaking**:
   - Send barter proposals ("I will teach you X if you teach me Y").
   - Propose specific dates, times, and focus topics.
   - Accept or decline incoming swap proposals.

4. **Live Exchange Room**:
   - Dual simulated video stream tiles with Camera On/Off, Mic Mute, and Screen Share toggles.
   - Live elapsed session timer.
   - Collaborative study notes & code snippet scratchpad with auto-save.
   - Real-time interactive session chat with instant messaging.
   - One-click Google Meet / Zoom external conference link launcher.

5. **Campus Karma Economy & Leaderboard**:
   - Karma awarded on registration (+50), offering skills (+10), and completing swaps (+25 to both students).
   - Campus Honor Roll leaderboard displaying top student mentors.
   - Peer endorsement reviews and 5-star rating system.

6. **Student Profile & Portfolio Management**:
   - Editable bio, university, and major.
   - Add/remove tags for "Skills I Teach" and "Skills I Want to Learn".
   - View and manage your active marketplace listings.
