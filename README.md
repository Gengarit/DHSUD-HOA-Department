# DHSUD - Negros Island Region Database

A desktop application for managing applicant records with blacklist security features.

## 🎯 Features

- **CRUD Operations**: Create, Read, Update, and Delete applicant records
- **Blacklist System**: Mark accounts as blacklisted with automatic restrictions
- **Security Lock**: Blacklisted accounts cannot have their control numbers modified
- **Offline Capable**: Fully functional without internet connection
- **Modern UI**: Soft Bento Dark Mode design optimized for desktop
- **Real-time Dashboard**: Statistics and overview of all records

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite3 (Local file-based)
- **Icons**: Lucide React

## 📋 Requirements

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

### 2. Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

## ▶️ Running the Application

### Start Backend Server (Terminal 1)

```powershell
cd backend
npm start
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server (Terminal 2)

```powershell
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
DHSUD Database/
├── backend/
│   ├── server.js           # Express server with API routes
│   ├── package.json        # Backend dependencies
│   └── dhsud.db           # SQLite database (auto-created)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ApplicantForm.jsx
    │   │   └── BlacklistWarning.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── ApplicantRecords.jsx
    │   │   ├── Blacklist.jsx
    │   │   └── Settings.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json

```

## 🗃️ Database Schema

### Applicants Table

| Column          | Type    | Constraints                      |
|-----------------|---------|----------------------------------|
| id              | INTEGER | PRIMARY KEY AUTOINCREMENT        |
| control_number  | TEXT    | UNIQUE, NOT NULL                 |
| first_name      | TEXT    | NOT NULL                         |
| last_name       | TEXT    | NOT NULL                         |
| city            | TEXT    | NOT NULL (Bacolod/Dumaguete)    |
| is_blacklisted  | INTEGER | DEFAULT 0 (0 or 1)              |

## 🔐 Security Features

### The Lock Guard (Backend)
- Blocks PUT requests attempting to modify `control_number` of blacklisted accounts
- Returns 403 Forbidden with error message

### Frontend Guard
- Displays high-contrast warning modal when editing blacklisted records
- Prevents user from accessing edit form for blacklisted accounts

## 🎨 UI/UX Design

### Color Scheme
- **Background**: `#1A1F2B`
- **Cards**: `#242B3D`
- **Text**: `#E2E8F0`
- **Accent**: Indigo (`#6366F1`)
- **Danger**: Red (`#EF4444`)
- **Success**: Green (`#10B981`)

### Layout
- **Left Sidebar**: Main navigation (Dashboard, Applicant Records, Blacklist, Settings)
- **Main Content**: Dynamic pages with card-based Bento design

## 📡 API Endpoints

### Applicants
- `GET /api/applicants` - Get all applicants
- `GET /api/applicants/:id` - Get single applicant
- `POST /api/applicants` - Create new applicant
- `PUT /api/applicants/:id` - Update applicant (with blacklist protection)
- `DELETE /api/applicants/:id` - Delete applicant

### Blacklist
- `GET /api/blacklist` - Get all blacklisted applicants

### Statistics
- `GET /api/stats` - Get dashboard statistics

### Health
- `GET /api/health` - Check API status

## 🧪 Testing the Blacklist Feature

1. Create a new applicant
2. Mark the applicant as blacklisted (toggle the checkbox in the form)
3. Try to edit the blacklisted applicant
4. You should see the "ACTION DENIED" warning modal
5. If you bypass the frontend and try via API, the backend will block control number changes

## 🌐 Supported Cities

- Bacolod (Capital of Negros Occidental)
- Dumaguete (Capital of Negros Oriental)

## 📝 Development Scripts

### Backend
```powershell
npm start      # Start production server
npm run dev    # Start development server with nodemon
```

### Frontend
```powershell
npm run dev       # Start Vite development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🔧 Configuration

The frontend is configured to proxy API requests to the backend:
- Vite proxy: `/api` → `http://localhost:5000`

## 📄 License

MIT

## 👨‍💻 Author

DHSUD - Negros Island Region Database System

---

**Note**: This application is designed to run completely offline. All data is stored locally in the SQLite database file.
