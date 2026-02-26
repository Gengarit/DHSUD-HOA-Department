# DHSUD HOA Management System - Quick Reference

## Quick Start
```
# Windows
Double-click: START_HOA_SYSTEM.bat

# Linux/macOS
./start-hoa-system.sh
```

## Services
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin/

## Key Endpoints

### HOA Registry
- GET /api/hoa-profiles/
- POST /api/hoa-profiles/
- GET /api/hoa-profiles/{id}/
- PUT /api/hoa-profiles/{id}/
- DELETE /api/hoa-profiles/{id}/
- GET /api/hoa-profiles/archived/
- GET /api/hoa-profiles/export_csv/
- POST /api/hoa-profiles/import_csv/

### Violations
- GET /api/nov/
- POST /api/nov/
- GET /api/otp/
- POST /api/otp/
- GET /api/oias/
- POST /api/oias/

### Sanctions
- GET /api/sanctions/
- POST /api/sanctions/

## Database Models

### HOAProfile
```python
hoa_name, cert_of_inc_no, reg_type, issuance_date, classification,
barangay, city_municipality, province,
contact_person, contact_details,
total_members, date_of_election, term_of_office,
latest_legal_order, order_date_issued, status_findings, compliance_reports,
evaluator_name,
status (choices), 
violation_section_64, violation_section_101, violation_section_62,
date_of_last_update, is_archived
```

### NOV
```python
hoa_profile (FK), control_no, violations, date_issued, evaluator, is_archived
```

### OTP
```python
hoa_profile (FK), control_no, nov_control_no (FK), submission_comment,
date, evaluator, mr_status, is_archived
```

### OIAS
```python
hoa_profile (FK), control_no, nov_control_no (FK), penalties,
date, evaluator, mr_status, is_archived
```

### Sanction
```python
hoa_profile (FK), severity_level (1-6), description,
date_imposed, effective_date, evaluator, oias_reference (FK), is_archived
```

## Common Tasks

### Create Admin User
```bash
cd backend
python manage.py createsuperuser
```

### Export HOA Data
```
1. Go to HOA Registry
2. Click "📥 Export CSV"
3. File downloads
```

### Import HOA Data
```
1. Prepare CSV file with headers
2. Go to HOA Registry
3. Click "📤 Import CSV"
4. Select file
```

### Add New HOA
```
1. Click "➕ Add HOA Applicant"
2. Fill all required fields
3. Submit
```

### Archive HOA
```
1. In HOA Registry, click "🗑️ Delete"
2. Appears in Archive
3. Can restore or permanently delete
```

## Status Options
- Active
- Suspended (Links to Sanctions)
- Pending
- Dissolved
- Revoked
- Term expired
- No legal standing

## Violation Sections
- Section 62
- Section 64
- Section 101

## Sanctions Scale
1. Censure
2. Fine
3. Suspension of Privileges
4. Suspension of Board
5. Removal of Officers
6. Revocation

## Troubleshooting

### Backend Won't Start
```bash
# Check port
netstat -ano | findstr :8000
# Kill process
taskkill /PID <PID> /F
```

### Frontend Can't Connect
```
1. Verify backend running
2. Clear browser cache
3. Check CORS settings
```

### Database Issues
```bash
cd backend
python manage.py migrate --run-syncdb
```

## Network Access

From another machine:
```
http://SERVER_IP:5173 (Frontend)
http://SERVER_IP:8000/api/ (Backend)
```

Replace SERVER_IP with your server's IP (ipconfig)

## Development Directory Structure

```
backend/
  ├── manage.py
  ├── requirements.txt
  ├── db.sqlite3
  ├── hoa_project/
  │   ├── settings.py
  │   ├── urls.py
  │   └── wsgi.py
  └── hoa_registry/
      ├── models.py
      ├── views.py
      ├── serializers.py
      ├── admin.py
      └── migrations/

frontend/
  ├── package.json
  ├── vite.config.js
  ├── tailwind.config.js
  ├── index.html
  └── src/
      ├── main.js
      ├── router.js
      ├── api.js
      ├── App.vue
      └── components/
          ├── Dashboard.vue
          ├── HOARegistry.vue
          ├── AddHOA.vue
          ├── NOVList.vue
          ├── OTPList.vue
          ├── OIASList.vue
          ├── SanctionsList.vue
          └── Archive.vue
```

## Technologies

### Backend
- Python 3.8+
- Django 4.2
- Django REST Framework 3.14
- Django CORS Headers
- SQLite 3

### Frontend
- Node.js 16+
- Vue.js 3
- Vite 4
- Tailwind CSS 3
- Axios

## Admin Features
- Full CRUD for all models
- Search and filtering
- Inline editing
- Admin site customization
- User permissions management

## Notes
- All data is stored locally (SQLite)
- No internet required for operation
- System works on local network (LAN)
- Deployment ready with custom configuration
- CSV import/export of HOA data
- Complete audit trail with dates

---

For detailed setup, see SETUP_GUIDE.md
For complete documentation, see README.md
For file structure, see PROJECT_STRUCTURE.md
