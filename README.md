# DHSUD HOA Management System

## Overview
A comprehensive HOA (Homeowners Association) Management System built with Django and Vue.js 3, designed for offline LAN deployment. This system manages HOA profiles, violations, compliance orders, and sanctions with a complete audit trail.

## Features

### Core Modules
1. **HOA Registry** - Complete HOA profile management with all required fields
2. **NOV (Notice of Violation)** - Track violations by section (64, 101, 62)
3. **OTP (Order to Perform)** - Motion for reconsideration tracking
4. **OIAS (Order for Investigation)** - Investigation and penalty documentation
5. **Sanctions & Penalties** - 6-point severity scale management
6. **Archive** - Soft delete with recovery capabilities

### Data Models

#### HOA Profile (Registry)
- **Basic Info**: Name, Certificate of Incorporation, Registration Type, Issuance Date, Classification
- **Location**: Barangay, City/Municipality, Province
- **Contact**: Contact Person, Contact Details
- **Governance**: Total Members, Date of Election, Term of Office
- **Legal/Monitoring**: Latest Legal Order, Order Date, Status/Findings, Compliance Reports, Evaluator Name
- **Status**: Active, Suspended, No legal standing, Dissolved, Revoked, Term expired, Pending
- **Violations**: Checkboxes for Sections 64, 101, 62
- **System**: Auto-updated timestamp, soft delete flag

#### Legal Modules
- **NOV**: Control No, HOA Name, Violations, Date Issued, Evaluator
- **OTP**: Control No, HOA Name, NOV Reference, Submission/Comment, Date, Evaluator, MR Status
- **OIAS**: Control No, HOA Name, NOV Reference, Penalties, Date, Evaluator, MR Status

### UI/UX Components

**Sidebar Navigation**
- 📊 Dashboard
- 📋 HOA Registry
- ⚠️ NOV (Notice of Violation)
- 📝 OTP (Order to Perform)
- 🔍 OIAS (Order for Investigation)
- ⚖️ Sanctions & Penalties
- 📦 Archive

**Dashboard**
- Overview statistics
- Calendar with events (Board Appointments, Orientations)
- Recent activity feed

**HOA Registry Table**
- Sortable columns: HOA Name, Status, City/Municipality, Violation badges
- Row-click detail view
- Status badge hyperlinks (Suspended → Sanctions)
- "Add HOA Applicant" button
- CSV Import/Export

**Sanctions & Penalties** (6-Point Scale)
1. Censure
2. Fine
3. Suspension of Privileges
4. Suspension of Board
5. Removal of Officers
6. Revocation

### Tools & Features

**CSV Management**
- Export HOA Registry to CSV
- Import HOA profiles from CSV

**Archive System**
- Soft delete for all entities
- Central archive for recovery
- Permanent deletion option

**Admin Panel**
- Django admin interface at `/admin/`
- Full CRUD operations for all entities
- Filtering and search capabilities

## Technology Stack

- **Backend**: Django 4.2, Django REST Framework
- **Frontend**: Vue.js 3, Tailwind CSS, Vite
- **Database**: SQLite (offline compatible)
- **API**: RESTful with pagination and filtering

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Quick Start (Windows)

1. **One-Click Launch**
   ```
   Double-click: START_HOA_SYSTEM.bat
   ```
   This will automatically:
   - Install dependencies
   - Run migrations
   - Start Django backend (port 8000)
   - Start Vue.js frontend (port 5173)

### Manual Setup

**Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

**Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/
- **Swagger Docs**: http://localhost:8000/api/docs/ (when configured)

## Network Configuration

For offline LAN deployment:
- `ALLOWED_HOSTS = ['*']` enables access from any machine on the network
- Access from other machines: `http://<server-ip>:5173` and `http://<server-ip>:8000`
- Default firewall rules may need adjustment

## Admin Credentials

Create a superuser for admin panel:
```bash
python manage.py createsuperuser
```

## API Endpoints

### HOA Profiles
- `GET /api/hoa-profiles/` - List all HOAs
- `POST /api/hoa-profiles/` - Create new HOA
- `GET /api/hoa-profiles/{id}/` - Get HOA details
- `PUT /api/hoa-profiles/{id}/` - Update HOA
- `DELETE /api/hoa-profiles/{id}/` - Delete HOA
- `GET /api/hoa-profiles/archived/` - List archived HOAs
- `GET /api/hoa-profiles/export_csv/` - Export to CSV
- `POST /api/hoa-profiles/import_csv/` - Import from CSV

### NOV, OTP, OIAS, Sanctions
Similar CRUD operations available at:
- `/api/nov/`
- `/api/otp/`
- `/api/oias/`
- `/api/sanctions/`

## Database Schema

The system uses SQLite with the following main tables:
- `hoa_registry_hoaprofile`
- `hoa_registry_nov`
- `hoa_registry_otp`
- `hoa_registry_oias`
- `hoa_registry_sanction`
- `hoa_registry_eventschedule`

Database file: `backend/db.sqlite3`

## Features & Workflows

### Adding a New HOA
1. Click "➕ Add HOA Applicant"
2. Fill all required fields
3. Select status and mark any violations
4. Submit

### Managing Violations
1. Navigate to NOV section
2. Enter violation details
3. Link to specific HOA from registry
4. Track through OTP and OIAS

### Sanctions Management
1. View/Create sanctions in "Sanctions & Penalties"
2. Choose severity level (1-6)
3. Set effective dates
4. Link to investigation records

### Archiving & Recovery
1. Delete HOA (soft delete)
2. View in "Archive" section
3. Restore or permanently delete

## Customization

### Adding Custom Fields
Edit `backend/hoa_registry/models.py` and add fields to required models, then run:
```bash
python manage.py makemigrations
python manage.py migrate
```

### Styling
Tailwind CSS configuration: `frontend/tailwind.config.js`
Main stylesheet: `frontend/src/style.css`

## Troubleshooting

**Backend won't start**
- Ensure port 8000 is not in use: `netstat -ano | findstr :8000`
- Check Python installation: `python --version`

**Frontend shows blank page**
- Check browser console for errors
- Ensure backend is running: `http://localhost:8000/api/hoa-profiles/`
- Clear browser cache

**CORS errors**
- Already configured with `django-cors-headers` and `CORS_ALLOW_ALL_ORIGINS = True`
- For production, modify allowed origins in settings

## Production Deployment

For production use:
1. Set `DEBUG = False` in `settings.py`
2. Generate strong `SECRET_KEY`
3. Configure `ALLOWED_HOSTS` with specific domains
4. Use PostgreSQL instead of SQLite
5. Set up proper authentication
6. Enable HTTPS

## Support & Documentation

For issues or questions:
1. Check Django logs: `backend/logs/`
2. Check Vue.js console errors
3. Review database migrations status

## License

Internal use only - DHSUD

---

**Version**: 1.0.0  
**Last Updated**: February 2026
