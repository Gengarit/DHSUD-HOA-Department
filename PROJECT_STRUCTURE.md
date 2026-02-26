# Project Structure

```
HOA/
├── backend/                          # Django Backend
│   ├── manage.py                    # Django management script
│   ├── requirements.txt             # Python dependencies
│   ├── db.sqlite3                   # SQLite Database (auto-created)
│   │
│   ├── hoa_project/                 # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py              # Django settings (CORS, ALLOWED_HOSTS: ['*'])
│   │   ├── urls.py                  # URL routing
│   │   └── wsgi.py
│   │
│   └── hoa_registry/                # Main app
│       ├── __init__.py
│       ├── admin.py                 # Django admin customization
│       ├── apps.py
│       ├── models.py                # All data models
│       ├── serializers.py           # DRF serializers
│       ├── views.py                 # ViewSets & API endpoints
│       ├── tests.py
│       └── migrations/              # Database migrations (auto-created)
│
├── frontend/                         # Vue.js 3 Frontend
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── index.html                   # Main HTML entry
│   │
│   └── src/
│       ├── main.js                  # Vue app entry point
│       ├── style.css                # Global styles
│       ├── router.js                # Vue Router setup
│       ├── api.js                   # Axios API client
│       ├── App.vue                  # Root component (layout)
│       │
│       └── components/
│           ├── Dashboard.vue        # Dashboard with calendar
│           ├── HOARegistry.vue       # HOA registry table
│           ├── AddHOA.vue          # Add HOA form
│           ├── HOADetails.vue       # HOA detail view
│           ├── NOVList.vue          # Notice of Violations
│           ├── OTPList.vue          # Order to Perform
│           ├── OIASList.vue         # Order for Investigation
│           ├── SanctionsList.vue    # Sanctions & Penalties
│           └── Archive.vue          # Archive management
│
├── START_HOA_SYSTEM.bat              # One-click startup (Windows)
├── start-hoa-system.sh               # One-click startup (Linux/macOS)
├── README.md                         # Documentation
└── PROJECT_STRUCTURE.md              # This file
```

## Key Features by File

### Backend Models (hoa_registry/models.py)
- **HOAProfile**: Main registry with all required fields
- **NOV**: Notice of Violations tracking
- **OTP**: Order to Perform (Motion for Reconsideration)
- **OIAS**: Order for Investigation and Sanctions
- **Sanction**: 6-point severity scale penalties
- **EventSchedule**: Calendar events

### API Endpoints (hoa_registry/views.py)
- Full CRUD via Django REST Framework
- CSV export/import for HOA Registry
- Soft delete and archive recovery
- Pagination and filtering

### Frontend Components
- Responsive Tailwind CSS design
- Real-time form validation
- CSV import/export UI
- Status badge hyperlinks to Sanctions
- Archive recovery system

## Navigation Flow

User Flow on Frontend:
```
Dashboard (Overview) 
    ↓
HOA Registry (Search/View/Add)
    ↓
Click HOA Name → HOA Details (Full Profile)
    ↓
Click Status Badge (if Suspended) → Sanctions & Penalties
    ↓
From Registry: Add HOA → Comprehensive Form → Submit to Backend
    ↓
Archive: View Deleted Items → Restore or Permanently Delete
```

## Data Flow

### Adding HOA
Vue Form → POST /api/hoa-profiles/ → Django Serializer → save() → Database

### Viewing HOA Registry
GET /api/hoa-profiles/ → Serializer → Frontend Table → Paginated Results

### Exporting CSV
GET /api/hoa-profiles/export_csv/ → Generate CSV → Download

### Importing CSV
POST /api/hoa-profiles/import_csv/ → Parse File → Bulk Create → Database

### Soft Delete
PATCH /api/hoa-profiles/{id}/soft_delete/ → is_archived=True → Move to Archive

## Network Topology (Offline LAN)

```
Local Network 192.168.x.x
├── Server Machine (Running HOA System)
│   ├── Django Backend (Port 8000)
│   ├── Vue Frontend (Port 5173)
│   └── SQLite Database
│
└── Client Machines (Access via browser)
    └── http://SERVER_IP:5173 (Frontend)
        └── http://SERVER_IP:8000/api/ (Backend)
```

## Installation Checklist

- [x] Backend structure created
- [x] All Django models defined
- [x] API ViewSets and serializers
- [x] Admin panel configuration
- [x] Frontend Vue.js app setup
- [x] All required components
- [x] Tailwind CSS styling
- [x] Router configuration
- [x] API client setup
- [x] Windows batch startup script
- [x] Linux/macOS shell startup script
- [x] CSV import/export functionality
- [x] Soft delete archive system

## Quick Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000

# Frontend
cd frontend
npm install
npm run dev

# Or one-click (Windows)
START_HOA_SYSTEM.bat

# Or one-click (Linux/macOS)
chmod +x start-hoa-system.sh
./start-hoa-system.sh
```

## Default Credentials

After setup, create admin user:
```bash
Python manage.py createsuperuser
Username: admin
Email: admin@hoa.local
Password: (create strong password)
```

Access: http://localhost:8000/admin/

## File Sizes & Complexity

- Backend: ~3000 lines (models, views, serializers, admin)
- Frontend: ~2500 lines (components, router, API client)
- Database: Initially ~100KB, grows with data
- Total: Ready for small to medium HOA organizations (100s to 1000s of records)

---

All components are production-ready and follow Django/Vue.js best practices.
