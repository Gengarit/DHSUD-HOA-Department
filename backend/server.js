const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const csv = require('csv-parser');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// NIR Cities and Municipalities
const NIR_LOCATIONS = [
  // Negros Occidental
  'Bacolod City', 'Bago City', 'Cadiz City', 'Escalante City', 'Himamaylan City',
  'Kabankalan City', 'La Carlota City', 'Sagay City', 'San Carlos City', 'Silay City',
  'Sipalay City', 'Talisay City', 'Victorias City',
  // Negros Oriental
  'Dumaguete City', 'Bais City', 'Canlaon City', 'Guihulngan City', 'Tanjay City',
  // Municipalities - Negros Occidental
  'Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique B. Magalona',
  'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela', 'La Castellana',
  'Manapla', 'Moises Padilla', 'Murcia', 'Pontevedra', 'Pulupandan',
  'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid',
  // Municipalities - Negros Oriental
  'Amlan', 'Ayungon', 'Bacong', 'Basay', 'Bayawan',
  'Bindoy', 'Dauin', 'Jimalalud', 'La Libertad', 'Mabinay',
  'Manjuyod', 'Pamplona', 'San Jose', 'Santa Catalina', 'Siaton',
  'Sibulan', 'Tayasan', 'Valencia', 'Vallehermoso', 'Zamboanguita'
];

// Input Validation Functions
function validateControlNumber(controlNumber) {
  if (!controlNumber || typeof controlNumber !== 'string') {
    return { valid: false, error: 'Control number is required' };
  }
  
  const trimmed = controlNumber.trim();
  if (trimmed.length < 5 || trimmed.length > 20) {
    return { valid: false, error: 'Control number must be 5-20 characters' };
  }
  
  // Only allow alphanumeric and hyphens
  const regex = /^[A-Z0-9-]+$/i;
  if (!regex.test(trimmed)) {
    return { valid: false, error: 'Control number can only contain letters, numbers, and hyphens' };
  }
  
  return { valid: true, value: trimmed.toUpperCase() };
}

function validateName(name, fieldName) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: `${fieldName} is required` };
  }
  
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 50) {
    return { valid: false, error: `${fieldName} must be 2-50 characters` };
  }
  
  // Only allow letters, spaces, dots, and hyphens (including Ñ)
  const regex = /^[A-Za-zÑñ.\s-]+$/;
  if (!regex.test(trimmed)) {
    return { valid: false, error: `${fieldName} can only contain letters, spaces, dots, and hyphens` };
  }
  
  return { valid: true, value: trimmed };
}

function sanitizeInput(text) {
  if (typeof text !== 'string') return text;
  // Remove any potential SQL injection or XSS attempts
  return text.trim().replace(/[<>]/g, '');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Setup
const dbPath = path.join(__dirname, 'dhsud.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Database Schema
function initializeDatabase() {
  // Check if we need to migrate the old schema
  db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='applicants'", [], (err, row) => {
    if (err) {
      console.error('Error checking table schema:', err.message);
      return;
    }
    
    if (!row) {
      // Table doesn't exist, create it
      console.log('Creating new database schema...');
      createTable();
      return;
    }

    db.all('PRAGMA table_info(applicants)', [], (infoErr, columns) => {
      if (infoErr) {
        console.error('Error checking applicants columns:', infoErr.message);
        return;
      }

      const existing = new Set(columns.map((col) => col.name));
      const required = ['is_archived', 'archived_at', 'status', 'created_at', 'updated_at'];
      const missing = required.some((name) => !existing.has(name));

      if (missing) {
        console.log('Upgrading database schema with new features...');
        addArchiveSupport();
      } else {
        console.log('Database schema is up to date');
      }
    });
  });
}

function createTable() {
  db.serialize(() => {
    // Applicants table
    const createApplicantsQuery = `
      CREATE TABLE IF NOT EXISTS applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        control_number TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        city TEXT NOT NULL,
        is_blacklisted INTEGER DEFAULT 0 CHECK(is_blacklisted IN (0, 1)),
        is_archived INTEGER DEFAULT 0 CHECK(is_archived IN (0, 1)),
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold')),
        archived_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createApplicantsQuery, (err) => {
      if (err) {
        console.error('Error creating applicants table:', err.message);
      } else {
        console.log('Applicants table created successfully');
      }
    });

    // Users table
    const createUsersQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'Editor' CHECK(role IN ('Admin', 'Editor', 'Viewer')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createUsersQuery, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating users table:', err.message);
      }
    });

    // Activity Log table
    const createActivityLogQuery = `
      CREATE TABLE IF NOT EXISTS activity_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        applicant_id INTEGER,
        action TEXT NOT NULL,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(applicant_id) REFERENCES applicants(id)
      )
    `;
    
    db.run(createActivityLogQuery, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating activity_log table:', err.message);
      }
    });

    // Comments table
    const createCommentsQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        applicant_id INTEGER,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(applicant_id) REFERENCES applicants(id)
      )
    `;
    
    db.run(createCommentsQuery, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating comments table:', err.message);
      }
    });

    // Documents table
    const createDocumentsQuery = `
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        applicant_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT,
        file_size INTEGER,
        uploaded_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(applicant_id) REFERENCES applicants(id),
        FOREIGN KEY(uploaded_by) REFERENCES users(id)
      )
    `;
    
    db.run(createDocumentsQuery, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating documents table:', err.message);
      }
    });
  });
}

function addArchiveSupport() {
  db.serialize(() => {
    db.run('ALTER TABLE applicants ADD COLUMN is_archived INTEGER DEFAULT 0 CHECK(is_archived IN (0, 1))', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding is_archived column:', err.message);
      }
    });
    
    db.run('ALTER TABLE applicants ADD COLUMN archived_at DATETIME', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding archived_at column:', err.message);
      }
    });

    db.run('ALTER TABLE applicants ADD COLUMN status TEXT DEFAULT "Pending"', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding status column:', err.message);
      }
    });

    db.run('ALTER TABLE applicants ADD COLUMN created_at DATETIME', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding created_at column:', err.message);
      }
    });

    db.run('ALTER TABLE applicants ADD COLUMN updated_at DATETIME', (err) => {
      if (err && !err.message.includes('duplicate column')) {
        console.error('Error adding updated_at column:', err.message);
      }
    });

    db.run(
      'UPDATE applicants SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)',
      (err) => {
        if (err) {
          console.error('Error backfilling timestamps:', err.message);
        } else {
          console.log('Archive and new features support added successfully');
        }
      }
    );

    // Create other tables if they don't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'Editor' CHECK(role IN ('Admin', 'Editor', 'Viewer')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating users table:', err.message);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      applicant_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(applicant_id) REFERENCES applicants(id)
    )`, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating activity_log table:', err.message);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      applicant_id INTEGER,
      comment TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(applicant_id) REFERENCES applicants(id)
    )`, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating comments table:', err.message);
      }
    });

    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      applicant_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT,
      file_size INTEGER,
      uploaded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(applicant_id) REFERENCES applicants(id),
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    )`, (err) => {
      if (err && !err.message.includes('already exists')) {
        console.error('Error creating documents table:', err.message);
      }
    });
  });
}

function migrateSchema() {
  db.serialize(() => {
    // Create new table without city constraint
    db.run(`
      CREATE TABLE IF NOT EXISTS applicants_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        control_number TEXT UNIQUE NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        city TEXT NOT NULL,
        is_blacklisted INTEGER DEFAULT 0 CHECK(is_blacklisted IN (0, 1)),
        is_archived INTEGER DEFAULT 0 CHECK(is_archived IN (0, 1)),
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold')),
        archived_at DATETIME,
        created_at DATETIME,
        updated_at DATETIME
      )
    `, (err) => {
      if (err) {
        console.error('Error creating new table:', err.message);
        return;
      }
    });
    
    // Copy data from old table to new table
    db.run(`
      INSERT INTO applicants_new (id, control_number, first_name, last_name, city, is_blacklisted, status, archived_at, created_at, updated_at)
      SELECT id, control_number, first_name, last_name, city, is_blacklisted, status, archived_at, created_at, updated_at FROM applicants
    `, (err) => {
      if (err) {
        console.error('Error copying data:', err.message);
        return;
      }
    });
    
    // Drop old table
    db.run('DROP TABLE applicants', (err) => {
      if (err) {
        console.error('Error dropping old table:', err.message);
        return;
      }
    });
    
    // Rename new table to applicants
    db.run('ALTER TABLE applicants_new RENAME TO applicants', (err) => {
      if (err) {
        console.error('Error renaming table:', err.message);
      } else {
        console.log('✓ Schema migration completed - All NIR locations now supported!');
      }
    });
  });
}

// ========================
// API ROUTES
// ========================

// GET all applicants (excluding archived)
app.get('/api/applicants', (req, res) => {
  const query = 'SELECT * FROM applicants WHERE is_archived = 0 ORDER BY id DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Convert is_blacklisted to boolean
    const applicants = rows.map(row => ({
      ...row,
      is_blacklisted: row.is_blacklisted === 1,
      is_archived: row.is_archived === 1
    }));
    res.json(applicants);
  });
});

// GET all archived applicants
app.get('/api/archived', (req, res) => {
  const query = 'SELECT * FROM applicants WHERE is_archived = 1 ORDER BY archived_at DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const applicants = rows.map(row => ({
      ...row,
      is_blacklisted: row.is_blacklisted === 1,
      is_archived: row.is_archived === 1
    }));
    res.json(applicants);
  });
});

// GET single applicant
app.get('/api/applicants/:id', (req, res) => {
  const query = 'SELECT * FROM applicants WHERE id = ?';
  
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    row.is_blacklisted = row.is_blacklisted === 1;
    res.json(row);
  });
});

// POST new applicant
app.post('/api/applicants', (req, res) => {
  const { control_number, first_name, last_name, city, is_blacklisted } = req.body;
  
  // Validation - Check required fields
  if (!control_number || !first_name || !last_name || !city) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  // Validate control number
  const controlNumValidation = validateControlNumber(control_number);
  if (!controlNumValidation.valid) {
    return res.status(400).json({ error: controlNumValidation.error });
  }
  
  // Validate first name
  const firstNameValidation = validateName(first_name, 'First name');
  if (!firstNameValidation.valid) {
    return res.status(400).json({ error: firstNameValidation.error });
  }
  
  // Validate last name
  const lastNameValidation = validateName(last_name, 'Last name');
  if (!lastNameValidation.valid) {
    return res.status(400).json({ error: lastNameValidation.error });
  }
  
  // Validate city
  if (!NIR_LOCATIONS.includes(city)) {
    return res.status(400).json({ error: 'City must be a valid location in Negros Island Region' });
  }
  
  const query = `
    INSERT INTO applicants (control_number, first_name, last_name, city, is_blacklisted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `;
  
  const params = [
    controlNumValidation.value,
    firstNameValidation.value,
    lastNameValidation.value,
    sanitizeInput(city),
    is_blacklisted ? 1 : 0
  ];
  
  db.run(query, params, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ error: 'Control number already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      control_number: controlNumValidation.value,
      first_name: firstNameValidation.value,
      last_name: lastNameValidation.value,
      city: sanitizeInput(city),
      is_blacklisted: is_blacklisted || false
    });
  });
});

// PUT update applicant (with blacklist protection)
app.put('/api/applicants/:id', (req, res) => {
  const { id } = req.params;
  const { control_number, first_name, last_name, city, is_blacklisted } = req.body;
  
  // First, check if applicant exists and is blacklisted
  db.get('SELECT * FROM applicants WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Applicant not found' });
    }
    
    // THE LOCK GUARD: Block control_number change if blacklisted
    if (row.is_blacklisted === 1 && control_number && control_number !== row.control_number) {
      return res.status(403).json({ 
        error: 'Cannot modify control number of a blacklisted account',
        blacklisted: true
      });
    }
    
    // Input validation
    if (control_number !== undefined) {
      const validation = validateControlNumber(control_number);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }
    
    if (first_name !== undefined) {
      const validation = validateName(first_name, 'First name');
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }
    
    if (last_name !== undefined) {
      const validation = validateName(last_name, 'Last name');
      if (!validation.valid) {
        return res.status(400).json({ error: validation.error });
      }
    }
    
    if (city && !NIR_LOCATIONS.includes(city)) {
      return res.status(400).json({ error: 'City must be a valid location in Negros Island Region' });
    }
    
    // Build update query dynamically with validated values
    const updates = [];
    const params = [];
    
    if (control_number !== undefined) {
      const validation = validateControlNumber(control_number);
      updates.push('control_number = ?');
      params.push(validation.value);
    }
    if (first_name !== undefined) {
      const validation = validateName(first_name, 'First name');
      updates.push('first_name = ?');
      params.push(validation.value);
    }
    if (last_name !== undefined) {
      const validation = validateName(last_name, 'Last name');
      updates.push('last_name = ?');
      params.push(validation.value);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      params.push(sanitizeInput(city));
    }
    if (is_blacklisted !== undefined) {
      updates.push('is_blacklisted = ?');
      params.push(is_blacklisted ? 1 : 0);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    params.push(id);
    const query = `UPDATE applicants SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'Control number already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Applicant not found' });
      }
      
      // Fetch updated record
      db.get('SELECT * FROM applicants WHERE id = ?', [id], (err, updatedRow) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        updatedRow.is_blacklisted = updatedRow.is_blacklisted === 1;
        res.json(updatedRow);
      });
    });
  });
});

// DELETE applicant (soft delete - archive)
app.delete('/api/applicants/:id', (req, res) => {
  const query = `UPDATE applicants SET is_archived = 1, archived_at = datetime('now') WHERE id = ? AND is_archived = 0`;
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Applicant not found or already archived' });
    }
    res.json({ message: 'Applicant archived successfully' });
  });
});

// Restore archived applicant
app.put('/api/archived/:id/restore', (req, res) => {
  const query = 'UPDATE applicants SET is_archived = 0, archived_at = NULL WHERE id = ? AND is_archived = 1';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Archived applicant not found' });
    }
    res.json({ message: 'Applicant restored successfully' });
  });
});

// Permanently delete archived applicant
app.delete('/api/archived/:id', (req, res) => {
  const query = 'DELETE FROM applicants WHERE id = ? AND is_archived = 1';
  
  db.run(query, [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Archived applicant not found' });
    }
    res.json({ message: 'Applicant permanently deleted' });
  });
});

// GET blacklisted applicants only (excluding archived)
app.get('/api/blacklist', (req, res) => {
  const query = 'SELECT * FROM applicants WHERE is_blacklisted = 1 AND is_archived = 0 ORDER BY id DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const applicants = rows.map(row => ({
      ...row,
      is_blacklisted: true
    }));
    res.json(applicants);
  });
});

// GET statistics for dashboard
// GET dashboard stats
app.get('/api/stats', (req, res) => {
  // First check if is_archived column exists
  db.get("PRAGMA table_info(applicants)", [], (err, result) => {
    // Check if table has is_archived column
    db.all("PRAGMA table_info(applicants)", [], (err, columns) => {
      const hasArchivedColumn = columns && columns.some(col => col.name === 'is_archived');
      
      const queries = hasArchivedColumn ? {
        total: 'SELECT COUNT(*) as count FROM applicants WHERE is_archived = 0',
        blacklisted: 'SELECT COUNT(*) as count FROM applicants WHERE is_blacklisted = 1 AND is_archived = 0',
        active: 'SELECT COUNT(*) as count FROM applicants WHERE is_blacklisted = 0 AND is_archived = 0',
        archived: 'SELECT COUNT(*) as count FROM applicants WHERE is_archived = 1'
      } : {
        total: 'SELECT COUNT(*) as count FROM applicants',
        blacklisted: 'SELECT COUNT(*) as count FROM applicants WHERE is_blacklisted = 1',
        active: 'SELECT COUNT(*) as count FROM applicants WHERE is_blacklisted = 0',
        archived: 'SELECT 0 as count'
      };
      
      const stats = {};
      let completed = 0;
      const totalQueries = Object.keys(queries).length + 1; // +1 for city breakdown
      
      // Get basic stats
      Object.keys(queries).forEach(key => {
        if (queries[key] === 'SELECT 0 as count') {
          stats[key] = 0;
          completed++;
          if (completed === totalQueries) {
            res.json(stats);
          }
        } else {
          db.get(queries[key], [], (err, row) => {
            if (err) {
              console.error(`Error fetching ${key} stat:`, err.message);
              stats[key] = 0;
            } else {
              stats[key] = row.count;
            }
            
            completed++;
            if (completed === totalQueries) {
              res.json(stats);
            }
          });
        }
      });
      
      // Get city breakdown (excluding archived if column exists)
      const cityQuery = hasArchivedColumn 
        ? 'SELECT city, COUNT(*) as count FROM applicants WHERE is_archived = 0 GROUP BY city ORDER BY count DESC'
        : 'SELECT city, COUNT(*) as count FROM applicants GROUP BY city ORDER BY count DESC';
        
      db.all(cityQuery, [], (err, rows) => {
        if (err) {
          console.error('Error fetching city breakdown:', err.message);
          stats.cityBreakdown = [];
        } else {
          stats.cityBreakdown = rows;
        }
        
        completed++;
        if (completed === totalQueries) {
          res.json(stats);
        }
      });
    });
  });
});

// GET NIR locations
app.get('/api/locations', (req, res) => {
  res.json(NIR_LOCATIONS);
});

// CSV Export - Download all applicants as CSV
app.get('/api/export/csv', (req, res) => {
  const query = 'SELECT id, control_number, first_name, last_name, city, is_blacklisted, is_archived, archived_at FROM applicants ORDER BY id DESC';
  
  db.all(query, [], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    try {
      const csvFilePath = path.join(__dirname, 'exports', 'applicants.csv');
      
      // Ensure exports directory exists
      if (!fs.existsSync(path.join(__dirname, 'exports'))) {
        fs.mkdirSync(path.join(__dirname, 'exports'));
      }
      
      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
          { id: 'id', title: 'ID' },
          { id: 'control_number', title: 'Control Number' },
          { id: 'first_name', title: 'First Name' },
          { id: 'last_name', title: 'Last Name' },
          { id: 'city', title: 'City' },
          { id: 'is_blacklisted', title: 'Blacklisted' },
          { id: 'is_archived', title: 'Archived' },
          { id: 'archived_at', title: 'Archived Date' }
        ]
      });
      
      await csvWriter.writeRecords(rows);
      
      res.download(csvFilePath, `DHSUD_Applicants_${new Date().toISOString().split('T')[0]}.csv`, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        }
        // Clean up file after download
        fs.unlinkSync(csvFilePath);
      });
    } catch (error) {
      console.error('Error creating CSV:', error);
      res.status(500).json({ error: 'Failed to generate CSV file' });
    }
  });
});

// CSV Import - Upload and import applicants from CSV
app.post('/api/import/csv', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const results = [];
  const errors = [];
  let processedCount = 0;
  let successCount = 0;
  let errorCount = 0;
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Process each row
      results.forEach((row, index) => {
        const controlNumber = row['Control Number'] || row['control_number'];
        const firstName = row['First Name'] || row['first_name'];
        const lastName = row['Last Name'] || row['last_name'];
        const city = row['City'] || row['city'];
        const isBlacklisted = row['Blacklisted'] || row['is_blacklisted'] || 0;
        
        // Validate required fields
        if (!controlNumber || !firstName || !lastName || !city) {
          errors.push({ row: index + 2, error: 'Missing required fields' });
          errorCount++;
          processedCount++;
          checkCompletion();
          return;
        }
        
        // Validate control number
        const controlNumValidation = validateControlNumber(controlNumber);
        if (!controlNumValidation.valid) {
          errors.push({ row: index + 2, field: 'Control Number', error: controlNumValidation.error });
          errorCount++;
          processedCount++;
          checkCompletion();
          return;
        }
        
        // Validate first name
        const firstNameValidation = validateName(firstName, 'First name');
        if (!firstNameValidation.valid) {
          errors.push({ row: index + 2, field: 'First Name', error: firstNameValidation.error });
          errorCount++;
          processedCount++;
          checkCompletion();
          return;
        }
        
        // Validate last name
        const lastNameValidation = validateName(lastName, 'Last name');
        if (!lastNameValidation.valid) {
          errors.push({ row: index + 2, field: 'Last Name', error: lastNameValidation.error });
          errorCount++;
          processedCount++;
          checkCompletion();
          return;
        }
        
        // Validate city
        if (!NIR_LOCATIONS.includes(city)) {
          errors.push({ row: index + 2, field: 'City', error: 'Invalid city/municipality' });
          errorCount++;
          processedCount++;
          checkCompletion();
          return;
        }
        
        // Insert into database
        const query = `INSERT INTO applicants (control_number, first_name, last_name, city, is_blacklisted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
        const params = [
          controlNumValidation.value,
          firstNameValidation.value,
          lastNameValidation.value,
          sanitizeInput(city),
          isBlacklisted === '1' || isBlacklisted === 1 || isBlacklisted === 'true' ? 1 : 0
        ];
        
        db.run(query, params, function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              errors.push({ row: index + 2, error: 'Control number already exists' });
            } else {
              errors.push({ row: index + 2, error: err.message });
            }
            errorCount++;
          } else {
            successCount++;
          }
          processedCount++;
          checkCompletion();
        });
      });
      
      function checkCompletion() {
        if (processedCount === results.length) {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);
          
          res.json({
            success: true,
            message: `Import completed: ${successCount} successful, ${errorCount} failed`,
            total: results.length,
            successful: successCount,
            failed: errorCount,
            errors: errors
          });
        }
      }
      
      // If no data in CSV
      if (results.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: 'CSV file is empty or invalid' });
      }
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: 'Failed to parse CSV file' });
    });
});

// ================== STATUS MANAGEMENT ==================
// Update applicant status
app.put('/api/applicants/:id/status', (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.run(
    'UPDATE applicants SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Status updated' });
    }
  );
});

// ================== FILTERING & SORTING ==================
// Get filtered and sorted applicants
app.get('/api/applicants/filter', (req, res) => {
  const { city, status, blacklisted, archived, sortBy = 'id', sortOrder = 'ASC', limit = 100, offset = 0 } = req.query;
  
  let where = ['is_archived = 0'];
  let params = [];
  
  if (city && city !== 'all') {
    where.push('city = ?');
    params.push(city);
  }
  
  if (status && status !== 'all') {
    where.push('status = ?');
    params.push(status);
  }
  
  if (blacklisted === 'true') {
    where.push('is_blacklisted = 1');
  }
  
  if (archived === 'true') {
    where = ['is_archived = 1'];
  }
  
  const validSortColumns = ['control_number', 'first_name', 'last_name', 'city', 'status', 'created_at'];
  const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
  const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  
  const query = `SELECT * FROM applicants WHERE ${where.join(' AND ')} ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ================== BULK OPERATIONS ==================
// Bulk update status
app.post('/api/applicants/bulk/status', (req, res) => {
  const { ids, status } = req.body;
  const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected', 'On Hold'];
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE applicants SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`;
  
  db.run(query, [status, ...ids], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: `Updated ${this.changes} records` });
  });
});

// Bulk delete (move to archive)
app.post('/api/applicants/bulk/archive', (req, res) => {
  const { ids } = req.body;
  
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No IDs provided' });
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const query = `UPDATE applicants SET is_archived = 1, archived_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`;
  
  db.run(query, ids, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, message: `Archived ${this.changes} records` });
  });
});

// ================== ACTIVITY LOG ==================
// Log activity
function logActivity(userId, applicantId, action, details) {
  db.run(
    'INSERT INTO activity_log (user_id, applicant_id, action, details) VALUES (?, ?, ?, ?)',
    [userId || null, applicantId || null, action, details || null]
  );
}

// Get activity log for applicant
app.get('/api/applicants/:id/activity', (req, res) => {
  db.all(
    `SELECT al.*, u.username FROM activity_log al 
     LEFT JOIN users u ON al.user_id = u.id 
     WHERE al.applicant_id = ? 
     ORDER BY al.created_at DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Get all activity log
app.get('/api/activity-log', (req, res) => {
  const { limit = 100, offset = 0 } = req.query;
  
  db.all(
    `SELECT al.*, u.username, a.control_number FROM activity_log al 
     LEFT JOIN users u ON al.user_id = u.id 
     LEFT JOIN applicants a ON al.applicant_id = a.id 
     ORDER BY al.created_at DESC 
     LIMIT ? OFFSET ?`,
    [parseInt(limit), parseInt(offset)],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ================== COMMENTS & NOTES ==================
// Add comment
app.post('/api/applicants/:id/comments', (req, res) => {
  const { comment, userId } = req.body;
  
  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }
  
  db.run(
    'INSERT INTO comments (user_id, applicant_id, comment) VALUES (?, ?, ?)',
    [userId || null, req.params.id, comment],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, success: true });
    }
  );
});

// Get comments for applicant
app.get('/api/applicants/:id/comments', (req, res) => {
  db.all(
    `SELECT c.*, u.username FROM comments c 
     LEFT JOIN users u ON c.user_id = u.id 
     WHERE c.applicant_id = ? 
     ORDER BY c.created_at DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Delete comment
app.delete('/api/comments/:commentId', (req, res) => {
  db.run(
    'DELETE FROM comments WHERE id = ?',
    [req.params.commentId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
});

// ================== DUPLICATE DETECTION ==================
// Check for duplicates on import
app.post('/api/check-duplicates', (req, res) => {
  const { firstName, lastName, controlNumber } = req.body;
  
  db.all(
    `SELECT id, control_number, first_name, last_name FROM applicants 
     WHERE (control_number = ? OR (first_name = ? AND last_name = ?)) 
     AND is_archived = 0`,
    [controlNumber, firstName, lastName],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ duplicates: rows });
    }
  );
});

// ================== ARCHIVE MANAGEMENT ==================
// Restore from archive
app.put('/api/applicants/:id/restore', (req, res) => {
  db.run(
    'UPDATE applicants SET is_archived = 0, archived_at = NULL WHERE id = ?',
    [req.params.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Applicant restored' });
    }
  );
});

// ================== DOCUMENT MANAGEMENT ==================
// Get documents for applicant
app.get('/api/applicants/:id/documents', (req, res) => {
  db.all(
    `SELECT d.*, u.username FROM documents d 
     LEFT JOIN users u ON d.uploaded_by = u.id 
     WHERE d.applicant_id = ? 
     ORDER BY d.created_at DESC`,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ================== DASHBOARD ANALYTICS ==================
// Get statistics
app.get('/api/dashboard/stats', (req, res) => {
  db.all(
    `SELECT 
      (SELECT COUNT(*) FROM applicants WHERE is_archived = 0) as total_active,
      (SELECT COUNT(*) FROM applicants WHERE is_blacklisted = 1 AND is_archived = 0) as total_blacklisted,
      (SELECT COUNT(*) FROM applicants WHERE is_archived = 1) as total_archived,
      (SELECT COUNT(*) FROM applicants WHERE status = 'Approved' AND is_archived = 0) as approved,
      (SELECT COUNT(*) FROM applicants WHERE status = 'Pending' AND is_archived = 0) as pending,
      (SELECT COUNT(*) FROM applicants WHERE status = 'Under Review' AND is_archived = 0) as under_review,
      (SELECT COUNT(*) FROM applicants WHERE status = 'Rejected' AND is_archived = 0) as rejected`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows[0]);
    }
  );
});

// Get applicants by city
app.get('/api/dashboard/by-city', (req, res) => {
  db.all(
    `SELECT city, COUNT(*) as count FROM applicants WHERE is_archived = 0 GROUP BY city ORDER BY count DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Get applicants by status
app.get('/api/dashboard/by-status', (req, res) => {
  db.all(
    `SELECT status, COUNT(*) as count FROM applicants WHERE is_archived = 0 GROUP BY status ORDER BY count DESC`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ================== EXPORT FEATURES ==================
// Export to Excel
app.get('/api/export/excel', (req, res) => {
  const { archived } = req.query;
  const whereClause = archived === 'true' ? 'WHERE is_archived = 1' : 'WHERE is_archived = 0';
  
  db.all(
    `SELECT control_number, first_name, last_name, city, status, is_blacklisted, created_at FROM applicants ${whereClause}`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Create simple CSV with BOM for Excel
      let csv = '\uFEFF'; // UTF-8 BOM
      csv += 'Control Number,First Name,Last Name,City,Status,Blacklisted,Created Date\n';
      
      rows.forEach(row => {
        csv += `"${row.control_number}","${row.first_name}","${row.last_name}","${row.city}","${row.status}","${row.is_blacklisted}","${row.created_at}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="DHSUD_Export_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DHSUD Database API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DHSUD Database Server running on http://localhost:${PORT}`);
  console.log(`📊 Database file: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
