# Setup Instructions for DHSUD HOA Management System

## Prerequisites

Before starting, ensure you have:
- Windows 10/11 with Administrator access
- Python 3.8+ installed and in PATH: https://www.python.org/downloads/
- Node.js 16+ installed and in PATH: https://nodejs.org/
- Git (optional but recommended)

## Quick Start (Recommended)

### For Windows Users

1. **Double-click the batch file**: `START_HOA_SYSTEM.bat`
   - This will automatically install all dependencies
   - Run database migrations
   - Start both backend and frontend servers
   - Open new terminal windows for each service

2. **Access the system**:
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000
   - **Admin Panel**: http://localhost:8000/admin/

3. **Stop the servers**:
   - Close both terminal windows or press Ctrl+C

---

## Manual Setup Instructions

### Step 1: Backend Setup

```bash
# Open Command Prompt and navigate to the project
cd C:\Users\LENOVO\Desktop\PROGRAMMING\Portfolio\HOA\backend

# Install Python dependencies
pip install -r requirements.txt

# Create and run database migrations
python manage.py migrate

# Create admin user (optional but recommended)
python manage.py createsuperuser

# Start Django server
python manage.py runserver 0.0.0.0:8000
```

The backend will run on http://localhost:8000

### Step 2: Frontend Setup (in new Command Prompt)

```bash
# Navigate to frontend directory
cd C:\Users\LENOVO\Desktop\PROGRAMMING\Portfolio\HOA\frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on http://localhost:5173

### Step 3: Accessing the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:8000/admin/ (use credentials from Step 1)

---

## Configuration for Network Access (LAN)

To access from other machines on your local network:

1. **Find your server IP**:
   ```
   ipconfig
   ```
   Look for "IPv4 Address" (usually 192.168.x.x)

2. **Access from other machines**:
   - Frontend: `http://<YOUR_SERVER_IP>:5173`
   - Backend: `http://<YOUR_SERVER_IP>:8000`

3. **Network Configuration (already set)**:
   - `ALLOWED_HOSTS = ['*']` in Django settings enables all network access
   - CORS is enabled for all origins

---

## Database Management

### Create Superuser (Admin)

```bash
cd backend
python manage.py createsuperuser
```

### Backup Database

```bash
# The database file is at:
backend/db.sqlite3

# To backup, simply copy this file:
copy backend/db.sqlite3 backend/db.sqlite3.backup
```

### Reset Database

```bash
cd backend
# Delete the database file
del db.sqlite3

# Recreate from scratch
python manage.py migrate

# Create new superuser
python manage.py createsuperuser
```

---

## Features Overview

### 1. Dashboard
- Overview statistics
- Calendar with events
- Recent activity

### 2. HOA Registry
- View all HOA profiles
- Add new HOA applicants
- Search and filter
- Export/Import CSV
- Soft delete (archive)

### 3. Legal Modules
- **NOV**: Notice of Violations
- **OTP**: Order to Perform
- **OIAS**: Order for Investigation and Sanctions
- **Sanctions**: 6-point severity scale

### 4. Archive
- View deleted items
- Restore deleted items
- Permanently delete

---

## Adding First HOA

1. Navigate to "HOA Registry"
2. Click "➕ Add HOA Applicant"
3. Fill in all required fields (marked with *)
4. Select status and mark any violations
5. Click "✅ Submit"

Required fields:
- HOA Name
- Certificate of Incorporation No
- City/Municipality
- Contact Person
- Contact Details
- Evaluator Name

---

## CSV Import/Export

### Export
1. Go to "HOA Registry"
2. Click "📥 Export CSV"
3. File downloads as `hoa_profiles.csv`

### Import
1. Go to "HOA Registry"
2. Click "📤 Import CSV"
3. Select CSV file
4. System imports and displays count

CSV Format:
```
HOA Name,Cert of Inc No,City/Municipality,Province,Contact Person,Contact Details,Total Members,Evaluator Name
Sample HOA,INC-001,Manila,Metro Manila,John Doe,09123456789,50,Evaluator A
```

---

## Troubleshooting

### Python not found
**Error**: `'python' is not recognized as an internal or external command`

**Solution**:
1. Install Python from https://www.python.org/downloads/
2. During installation, CHECK "Add Python to PATH"
3. Restart Command Prompt

### Node.js not found
**Error**: `'npm' is not recognized`

**Solution**:
1. Install Node.js from https://nodejs.org/
2. Restart Command Prompt

### Port 8000 already in use
**Error**: `Address already in use`

**Solution**:
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
python manage.py runserver 0.0.0.0:8001
```

### Frontend can't connect to backend
**Error**: `Network Error` or `Connection Refused`

**Solution**:
1. Verify backend is running: http://localhost:8000
2. Check browser console (F12) for errors
3. Clear browser cache (Ctrl+Shift+Delete)
4. Ensure firewall allows port 8000

### Database migrations failed
**Error**: `Migration error` or database lock

**Solution**:
```bash
cd backend

# Fresh migrate
python manage.py migrate --run-syncdb

# If still issues, reset:
del db.sqlite3
python manage.py migrate
```

---

## Default Admin Access

After running `python manage.py createsuperuser`:

Admin URL: `http://localhost:8000/admin/`

You can manage all data through the admin panel.

---

## Performance Tips

1. **Initial Load**: First startup takes ~30 seconds (npm install)
2. **Database**: SQLite is fast enough for < 10,000 records
3. **Network**: LAN access works well for small teams

For large deployments:
- Consider upgrading to PostgreSQL
- Use production server (Gunicorn)
- Enable caching

---

## Backup & Recovery

### Backup Complete System
```bash
# Backup database
copy backend\db.sqlite3 backup\db.sqlite3.%date:~-10%

# Backup frontend node_modules (optional)
copy /s frontend\node_modules backup\node_modules\
```

### Restore from Backup
```bash
# Restore database
copy backup\db.sqlite3 backend\db.sqlite3

# Restart servers
# Backend: python manage.py runserver 0.0.0.0:8000
# Frontend: npm run dev
```

---

## Next Steps

1. ✅ Start with `START_HOA_SYSTEM.bat`
2. ✅ Create superuser account
3. ✅ Add first HOA profile
4. ✅ Test CSV export/import
5. ✅ Explore all modules
6. ✅ Configure for network access if needed

---

## Support Resources

- Django Docs: https://docs.djangoproject.com/
- Vue 3 Docs: https://vuejs.org/
- Django REST Framework: https://www.django-rest-framework.org/
- Tailwind CSS: https://tailwindcss.com/

---

**System Created**: February 2026
**Version**: 1.0.0
**Status**: Production Ready
