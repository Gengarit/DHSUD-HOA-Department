# DHSUD NIR HOA Management System

A comprehensive **Homeowners Association (HOA) Registration and Monitoring System** built for the **Department of Housing and Urban Development (DHSUD)** - Negros Island Region.

## 🎯 Overview

This system enables government officials to:
- Register and monitor HOAs across the Negros Island Region
- Track legal compliance and violations
- Issue administrative sanctions through a structured workflow
- Process appeals through the Motion for Reconsideration process
- Maintain comprehensive compliance records

## ✨ Key Features

### 1. **HOA Management**
- Complete HOA registry with certificate of incorporation tracking
- Real-time searchable database of associations
- Classification tracking (Residential, Commercial, Mixed-Use)
- Contact person and member information
- Geographic organization by city/municipality/barangay
- Status indicators: Active, Under Review, Suspended, Sanctioned

### 2. **Dashboard & Analytics**
- Real-time statistics dashboard
- Key metrics: Total HOAs, Active associations, Under Review, Sanctioned
- Total membership count across all associations
- Quick action buttons for frequent operations
- Status overview cards with color-coded indicators

### 3. **Legal Workflow System**
The system enforces a structured legal progression:

```
START
  ↓
NOV (Notice of Violation)
  ├→ Response/Compliance
  ├→ Violation Details Filing
  └→ Evaluator Assignment
  ↓
OTP (Order of Termination)
  ├→ Non-compliance Escalation
  └→ Formal Termination Order
  ↓
OIAS (Order of Imposition and Sanction)
  ├→ Administrative Sanction
  ├→ Fine/Monetary Penalty
  └→ SANCTION LOCK Activated
  ↓
MR (Motion for Reconsideration) [Optional]
  ├→ Appeal Filed
  ├→ Hearing Scheduled
  └→ Appeal Resolution
  ↓
END
```

### 4. **Notice of Violation (NOV)**
- Track violation notices issued to HOAs
- Document specific violations
- Assign evaluators for follow-up
- Set response deadlines
- Monitor compliance response

### 5. **Order of Termination (OTP)**
- Issue formal termination orders for persistent non-compliance
- Link to original NOV records
- Document legal grounds for termination
- Set effective dates

### 6. **Order of Imposition and Sanction (OIAS)**
- Issue administrative sanctions with monetary penalties
- Track sanction amounts and payment status
- Set appeal deadlines
- **Activate SANCTION LOCK** on affected HOAs
- Prevent modification of sanctioned entity details

### 7. **Motion for Reconsideration (MR)**
- File appeals against OIAS/OTP orders
- Document grounds for appeal
- Schedule hearing dates
- Track appeal resolution status
- Record appeal outcomes

### 8. **Compliance Status Tracking**
- Comprehensive compliance overview
- Multi-status categorization:
  - Active (Good Standing)
  - Suspended (Active Violations)
  - Revoked (Permanent)
  - Dissolved (Ceased Operations)
  - Terminated (Legal Action)
  - Under Legal Review
- Filter by compliance status
- Identify and track problematic associations

## 🔐 Business Logic: SANCTION LOCK

**Critical Security Feature:**
When an **OIAS (Order of Imposition and Sanction)** is issued for an HOA:

1. HOA receives "SANCTIONED" status badge
2. Primary identifier (Certificate of Incorporation Number) becomes **READ-ONLY**
3. Prevents accidental modification of sanctioned entity records
4. Ensures legal compliance and data integrity
5. Appeal process (MR) can modify status if granted

**Implementation:**
```
PUT /api/hoas/:cert_of_inc_no
- Check: Does this HOA have any OIAS records?
- If YES → Return 403 Forbidden with message:
  "Cannot modify cert_of_inc_no for HOA with active OIAS. 
   File Motion for Reconsideration to appeal sanction."
- If NO → Allow modification
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Ultra-fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Lucide-React** - Consistent icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Relational database
- **csv-writer** - CSV export functionality
- **multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Database
- **SQLite3** - File-based relational database
- **Offline-capable** - No network connection required
- **Portable** - Single `dhsud_hoa.db` file

## 📦 Installation

### Prerequisites
```
✓ Node.js v16+ (Check: node -v)
✓ npm v7+ (Check: npm -v)
✓ Git (for version control)
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Verify SQLite3 installation
npm list sqlite3

# Start backend server
npm start
```

**Expected Output:**
```
🚀 DHSUD HOA Management System Backend
📊 Server running on http://localhost:5000
💾 Database initialized: dhsud_hoa.db
🌱 Sample data seeded (5 HOAs + 2 legal orders)
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application

- **Frontend**: Open browser → `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Documentation**: See "API Endpoints" section below

## 🗄️ Database Schema

### HOAs Table (hoas)
Core registry of homeowners associations

| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| cert_of_inc_no | TEXT | PRIMARY KEY | Unique certificate number |
| hoa_name | TEXT | NOT NULL | Official HOA name |
| reg_type | TEXT | | Registration type |
| issuance_date | TEXT | | Certificate issuance date |
| classification | TEXT | | HOA classification type |
| barangay | TEXT | | Administrative division |
| city_municipality | TEXT | | City or municipality name |
| province | TEXT | | Province (Negros Occidental/Oriental) |
| contact_person | TEXT | | Primary contact name |
| contact_details | TEXT | | Phone/email |
| total_members | INTEGER | | Active membership count |
| date_of_election | TEXT | | Latest election date |
| term_of_office | TEXT | | Leadership term period |
| status_findings | TEXT | | Current status (Active/Suspended/Sanctioned) |
| evaluator_name | TEXT | | Assigned evaluator |
| date_last_update | TEXT | | Last modification date |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Status Values:**
- `Active` - Good standing, compliant
- `Under Review` - Under evaluation
- `Suspended` - Active violations
- `Sanctioned` - OIAS issued, SANCTION LOCK active

### Legal Orders Table (legal_orders)
Tracks all notices, orders, and sanctions

| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Auto-generated ID |
| cert_of_inc_no | TEXT | FOREIGN KEY → hoas | HOA reference |
| type | TEXT | NOT NULL | NOV / OTP / OIAS |
| control_number | TEXT | UNIQUE NOT NULL | Unique order identifier |
| date_issued | TEXT | | Order issue date |
| violation_type | TEXT | | Category of violation |
| violation_description | TEXT | | Detailed violation text |
| evaluator | TEXT | | Assigned official |
| status | TEXT | | Active / Resolved / Under Appeal |
| sanction_amount | REAL | | Monetary penalty (PHP) |
| effective_date | TEXT | | When order takes effect |
| appeal_deadline | TEXT | | Last day to file appeal |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Type Values:**
- `NOV` - Notice of Violation (initial warning)
- `OTP` - Order of Termination (escalated)
- `OIAS` - Order of Imposition (final sanction)

**Status Values:**
- `Active` - Currently in effect
- `Under Appeal` - MR filed against it
- `Resolved` - No longer active
- `Dismissed` - Appeal granted or invalidated

### Appeals Table (appeals)
Records Motion for Reconsideration filings

| Column | Type | Constraint | Purpose |
|--------|------|-----------|---------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Auto-generated ID |
| order_id | INTEGER | FOREIGN KEY → legal_orders | Order under appeal |
| type | TEXT | | Always "MR" |
| appeal_control_number | TEXT | UNIQUE NOT NULL | Unique appeal ID |
| date_filed | TEXT | | When appeal submitted |
| status | TEXT | | Under Review / Granted / Denied |
| grounds_for_appeal | TEXT | | Reason for appeal |
| filing_date | TEXT | | Official filing date |
| hearing_date | TEXT | | Scheduled hearing |
| created_at | TEXT | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

**Status Values:**
- `Under Review` - Pending evaluation
- `Pending Hearing` - Awaiting hearing date
- `Resolved - Granted` - Appeal succeeded
- `Resolved - Denied` - Appeal rejected

## 📊 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### HOA Management

#### Get All HOAs
```
GET /api/hoas
Query Parameters:
  - status: (filter by status)
  - city: (filter by city)
  - search: (search by name or cert_of_inc_no)
Response: { hoas: [...], count: number }
```

#### Get Single HOA
```
GET /api/hoas/:cert_of_inc_no
Response: { hoa: {...} }
```

#### Create New HOA
```
POST /api/hoas
Body: {
  cert_of_inc_no: "string",
  hoa_name: "string",
  reg_type: "string",
  issuance_date: "YYYY-MM-DD",
  classification: "string",
  barangay: "string",
  city_municipality: "string",
  province: "string",
  contact_person: "string",
  contact_details: "string",
  total_members: number,
  date_of_election: "YYYY-MM-DD",
  term_of_office: "string",
  evaluator_name: "string"
}
Response: { id: number, message: "string" }
```

#### Update HOA
```
PUT /api/hoas/:cert_of_inc_no
Body: { ...any fields to update }
Returns: 403 Forbidden if SANCTION LOCK active
Response: { message: "success" | error message }
```

#### Delete HOA
```
DELETE /api/hoas/:cert_of_inc_no
Response: { message: "success" }
```

### Legal Orders Management

#### Get All Legal Orders
```
GET /api/legal-orders
Query Parameters:
  - type: (NOV | OTP | OIAS)
  - status: (filter by status)
  - hoa: (filter by cert_of_inc_no)
Response: { orders: [...], count: number }
```

#### Get Single Order
```
GET /api/legal-orders/:id
Response: { order: {...} }
```

#### Create Legal Order
```
POST /api/legal-orders
Body: {
  cert_of_inc_no: "string",
  type: "NOV" | "OTP" | "OIAS",
  control_number: "string",
  date_issued: "YYYY-MM-DD",
  violation_type: "string",
  violation_description: "string",
  evaluator: "string",
  status: "Active",
  sanction_amount: number (for OIAS),
  effective_date: "YYYY-MM-DD",
  appeal_deadline: "YYYY-MM-DD"
}
Response: { id: number, message: "string" }
Special: OIAS creation triggers HOA update to "Sanctioned"
```

#### Update Legal Order
```
PUT /api/legal-orders/:id
Body: { ...fields to update }
Response: { message: "success" }
```

#### Delete Legal Order
```
DELETE /api/legal-orders/:id
Response: { message: "success" }
```

### Appeals Management

#### Get All Appeals
```
GET /api/appeals
Query Parameters:
  - status: (filter by status)
  - order_id: (filter by related order)
Response: { appeals: [...], count: number }
```

#### Get Single Appeal
```
GET /api/appeals/:id
Response: { appeal: {...} }
```

#### File Motion for Reconsideration
```
POST /api/appeals
Body: {
  order_id: number,
  type: "MR",
  appeal_control_number: "string",
  date_filed: "YYYY-MM-DD",
  status: "Under Review",
  grounds_for_appeal: "string",
  filing_date: "YYYY-MM-DD",
  hearing_date: "YYYY-MM-DD"
}
Response: { id: number, message: "string" }
Special: Creates/updates legal order status to "Under Appeal"
```

#### Update Appeal
```
PUT /api/appeals/:id
Body: { ...fields to update }
Response: { message: "success" }
```

#### Delete Appeal
```
DELETE /api/appeals/:id
Response: { message: "success" }
```

### Dashboard & Reports

#### Get Dashboard Statistics
```
GET /api/dashboard/stats
Response: {
  total_hoas: number,
  active_hoas: number,
  under_review: number,
  sanctioned_hoas: number,
  total_members: number,
  active_novs: number
}
```

#### Get HOAs by City
```
GET /api/dashboard/by-city
Response: {
  "Bacolod City": number,
  "Dumaguete City": number,
  ...
}
```

#### Export HOAs to CSV
```
GET /api/export/hoas
Response: CSV file download (DHSUD_HOAs_YYYY-MM-DD.csv)
```

#### Health Check
```
GET /api/health
Response: { status: "ok", timestamp: "ISO string" }
```

## 🎨 UI/UX Design

### Color Palette (Dark Mode - Soft Bento)

| Component | Color | Hex | Purpose |
|-----------|-------|-----|---------|
| Background | Deep Navy | #1A1F2B | Page background |
| Card/Surface | Slate Blue | #242B3D | Component backgrounds |
| Border | Steel Blue | #3A4A62 | Dividers and borders |
| Text Primary | Light Gray | #E2E8F0 | Main text |
| Text Secondary | Medium Gray | #9CA3AF | Labels, descriptions |
| Text Tertiary | Dark Gray | #6B7280 | Disabled, subtle text |
| Accent (Primary) | Indigo | #6366F1 | Buttons, highlights |
| Accent (Hover) | Indigo Dark | #4F46E5 | Hover states |
| Status: Success | Green | #10B981 | Active, compliant |
| Status: Warning | Amber | #F59E0B | Under review |
| Status: Danger | Red | #EF4444 | Sanctioned, alerts |
| Status: Info | Blue | #3B82F6 | Informational |

### Layout Components

**Fixed Left Sidebar**
- 8 main navigation items
- Active item highlighting
- Settings button (bottom)
- Logo and branding

**Bento Grid Dashboard**
- 4 main statistics cards
- 3 secondary metrics
- Quick action buttons
- Status indicators

**Data Tables**
- Searchable columns
- Sortable headers
- Status badges
- Action buttons per row

**Detail Panels**
- Right-side drawer
- Complete record information
- Related records (MR for orders)
- Edit/delete actions

## 🚀 Usage Guide

### Creating a New HOA Registration

1. **Navigate**: Left sidebar → "HOA Management"
2. **Click**: "Create New HOA" button or form
3. **Fill Form**:
   - Certificate of Incorporation #
   - HOA Name
   - Registration Type
   - Classification
   - Location (Barangay, City, Province)
   - Contact Information
   - Member Details
   - Election Information
4. **Validate**: System checks for duplicate cert_of_inc_no
5. **Save**: Click "Save HOA" button
6. **Confirm**: Record appears in HOA list

### Filing a Notice of Violation

1. **Navigate**: Left sidebar → "Notice of Violation"
2. **Click**: "Create New NOV" button
3. **Select**: Target HOA from dropdown
4. **Enter Details**:
   - Violation Type (categorize violation)
   - Violation Description (detailed explanation)
   - Assigned Evaluator
   - Response Deadline
5. **Issue**: Click "File NOV"
6. **Tracking**: Record appears in NOV list with status "Active"

### Issuing Order of Imposition

1. **Navigate**: Left sidebar → "Order of Imposition"
2. **Click**: "Create OIAS" button
3. **Link**: Select related NOV or HOA
4. **Specify**:
   - Sanction Type
   - Monetary Amount (Fine)
   - Effective Date
   - Appeal Deadline (usually 30 days)
5. **Issue**: Click "Issue OIAS"
6. **Automatic**: HOA status changes to "Sanctioned" → **SANCTION LOCK activated**

### Filing Motion for Reconsideration

1. **Navigate**: Left sidebar → "Motion for Reconsideration"
2. **Click**: "File New MR" button
3. **Select**: Original OIAS to appeal
4. **Document**:
   - Grounds for Appeal (reason for MR)
   - Filing Date
   - Scheduled Hearing Date
5. **Submit**: Click "File MR"
6. **Status Update**: Order status changes to "Under Appeal"

### Monitoring Compliance Status

1. **Navigate**: Left sidebar → "Compliance Status"
2. **View**: All compliance categories with counts
3. **Filter**: Select status category to view HOAs
4. **Analyze**: Identify problematic associations
5. **Action**: Flag for follow-up or legal action

### Dashboard Monitoring

1. **Navigate**: Left sidebar → "Dashboard" (default home)
2. **Review**:
   - Key statistics cards
   - Trend indicators
   - Quick action buttons
3. **Export**: Click "View Reports" to download HOA data
4. **Monitor**: Check legal workflow status

## ⚙️ Configuration

### Supported Locations (Negros Island Region)

**Negros Occidental Cities:**
- Bacolod City
- Bago City
- Cadiz City
- Escalante City
- Himamaylan City
- Kabankalan City
- La Carlota City
- Sagay City
- San Carlos City
- Silay City
- Sipalay City
- Talisay City
- Victorias City
- Plus 19 municipalities

**Negros Oriental Cities:**
- Dumaguete City (Provincial Capital)
- Bais City
- Canlaon City
- Guihulngan City
- Tanjay City
- Plus 15 municipalities

### Sample Data

System auto-seeds on first run:

**5 Sample HOAs:**
1. Green Residences HOA - Bacolod City (Active)
2. Valley Park Community - Dumaguete City (Active)
3. Heritage Homes Association - Talisay City (Under Review)
4. Riverside Estates HOA - Silay City (Sanctioned)
5. Mountain View Homeowners - La Carlota City (Active)

**2 Sample Legal Orders:**
1. NOV for Valley Park Community (violation: collection issue)
2. OIAS for Riverside Estates (₱50,000 sanction)

Reset by deleting `dhsud_hoa.db` - system recreates on startup.

## 🔐 Security Features

### SANCTION LOCK Protection
- **Read-Only cert_of_inc_no** for sanctioned HOAs
- **403 Forbidden** response when attempting modification
- **Automatic activation** when OIAS created
- **Removal** upon successful MR appeal

### Data Validation
- **NOV**: Requires violation description and evaluator
- **OTP**: Links to NOV, requires termination reason
- **OIAS**: Requires sanction amount and appeal deadline
- **MR**: Requires grounds for appeal and hearing date

### Referential Integrity
- Foreign keys enforce HOA existence
- Cascade delete protection
- Order/Appeal relationship guaranteed

### Input Sanitization
- No SQL injection via parameterized queries
- XSS prevention through React auto-escaping
- File upload validation

## 🐛 Troubleshooting

### Backend Won't Start

**Error: "Port 5000 already in use"**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <pid> /F

# Try starting again
npm start
```

**Error: "Cannot find module sqlite3"**
```bash
# Reinstall sqlite3
npm install sqlite3

# If issues persist, use pre-built binary
npm install --build-from-source sqlite3
```

**Error: "ENOENT: no such file or directory, open 'dhsud_hoa.db'"**
- First run? Normal. Server creates database automatically.
- Check backend folder has write permissions
- Database creates after first API call

### Frontend Won't Start

**Error: "Port 5173 already in use"**
```powershell
netstat -ano | findstr :5173
taskkill /PID <pid> /F
npm run dev
```

**Error: "Module not found"**
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

### API Connection Errors

**Frontend showing blank dashboard**
- Check backend running: `http://localhost:5000/api/health`
- Check CORS: Browser console for CORS errors
- Check network: Verify port 5000 accessible

**"Cannot POST /api/hoas"**
- Server not running? Start with `npm start` in backend
- Wrong endpoint? Check URL spelling
- Request body? Submit JSON with correct Content-Type

### Database Issues

**Data disappeared**
- Check `dhsud_hoa.db` file exists in backend folder
- Verify file permissions (read/write)
- Check available disk space

**Reset Database**
```bash
# Delete database file (Windows)
del backend\dhsud_hoa.db

# Delete database file (Mac/Linux)
rm backend/dhsud_hoa.db

# Start backend - creates fresh database
cd backend
npm start
```

## 📈 Performance Tips

- **Dashboard**: Loads 5 HOAs + 2 legal orders initially
- **Search**: Filter locally for <1000 records
- **Export**: CSV generation <1 second for 5000+ HOAs
- **Database**: SQLite suitable for <100,000 records
- **Scaling**: Consider PostgreSQL for >100,000 HOAs

## 🔄 Workflow Examples

### Example 1: Complete Legal Progression

**Scenario:** HOA fails to submit annual reports

**Steps:**
1. **Issue NOV** → Notify of violation (30-day response period)
2. **Monitor Response** → Track compliance efforts
3. **If Non-Compliant** → Issue OTP (formal termination notice)
4. **If Still Non-Compliant** → Issue OIAS with ₱50,000 fine
   - ✅ SANCTION LOCK activates
   - HOA status → "Sanctioned"
   - cert_of_inc_no → Read-only
5. **HOA Files MR** → Appeals sanction with justification
6. **Hearing Scheduled** → Review grounds for appeal
7. **MR Granted** → Sanction lifted, SANCTION LOCK removed

### Example 2: Quick Compliance

**Scenario:** HOA submits missing documents within NOV period

**Steps:**
1. **Issue NOV** → Set deadline 30 days
2. **HOA Responds** → Submitted documents within deadline
3. **Mark as Resolved** → Close NOV record
4. **Update Status** → HOA returns to "Active"
5. **No Legal Action** → Cycle complete

## 📝 Export Functionality

### CSV Export Format

**Headers:**
```
Certificate of Incorporation,HOA Name,Registration Type,Classification,
Barangay,City,Province,Contact Person,Members,Status,Evaluator,Last Updated
```

**Example:**
```
BHOA-2024-001,Green Residences,Residential,Type A,Taguig,Metro Manila,
NCR,Juan Dela Cruz,450,Active,Maria Santos,2024-01-15
```

**Usage:**
- Dashboard → "View Reports" button → CSV downloads
- Filename: `DHSUD_HOAs_2024-01-15.csv`
- Opens in Excel/Sheets for analysis

## 🎛️ Settings & Preferences

Navigate to Settings (left sidebar → ⚙️ icon) for:
- System information and version
- Database statistics
- Export all HOAs
- Clear archived records
- View system logs (future)
- Backup database (future)

## 📋 Status Reference

### HOA Status Values

| Status | Meaning | Can Edit | Can Appeal |
|--------|---------|----------|-----------|
| Active | Good standing, compliant | ✅ Yes | N/A |
| Under Review | Pending evaluation | ✅ Yes | N/A |
| Suspended | Active violations | ⚠️ Limited | ✅ Yes (MR) |
| Sanctioned | OIAS issued, penalty active | ❌ No (LOCK) | ✅ Yes (MR) |

### Legal Order Status Values

| Status | Meaning | Can File MR |
|--------|---------|------------|
| Active | Currently in effect | ✅ Yes |
| Under Appeal | MR filed against it | ⏳ Pending |
| Resolved | No longer active | ❌ No |
| Dismissed | Appeal granted | ❌ No |

### Appeal Status Values

| Status | Meaning |
|--------|---------|
| Under Review | Being evaluated |
| Pending Hearing | Awaiting hearing date |
| Resolved - Granted | Appeal successful |
| Resolved - Denied | Appeal rejected |

## 🚀 Future Enhancements

- **Multi-user Access**: User authentication and role-based access control
- **Advanced Reporting**: Custom report generation and scheduling
- **Document Management**: Upload and manage supporting documents
- **Mobile App**: React Native version for field officers
- **Email Notifications**: Automated alerts for violations and deadlines
- **Audit Trail**: Complete action history for compliance
- **Batch Operations**: Process multiple HOAs simultaneously
- **Analytics Dashboard**: Trend analysis and predictive insights
- **Integration**: Connect with other government databases
- **Data Migration**: Import from legacy systems

## 📄 License

DHSUD NIR HOA Management System v1.0

## 👥 Support & Contact

For technical support, deployment assistance, or questions:
- Review backend server logs for errors
- Check browser console (F12) for frontend errors
- Verify all dependencies installed correctly
- Ensure backend running on port 5000 and accessible

## 📚 Additional Resources

- **Figma Design**: 6 UI mockups provided in requirements
- **Database Backup**: Copy `dhsud_hoa.db` for backup
- **Git Repository**: Code available at GitHub (initial commit)
- **Deployment**: Ready for containerization (Docker) or cloud deployment

---

**Version**: 1.0  
**Last Updated**: 2024  
**Framework**: React 18 + Node.js + SQLite3  
**Target Users**: DHSUD Officials, RegionIV-A, Negros Island Region