const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const readline = require('readline');
const multer = require('multer');

const app = express();
const PORT = 5000;

// Multer configuration for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Database Setup
const dbPath = path.join(__dirname, 'dhsud_hoa.db');
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
  db.serialize(() => {
    // HOAs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS hoas (
        cert_of_inc_no TEXT PRIMARY KEY,
        hoa_name TEXT NOT NULL,
        reg_type TEXT,
        issuance_date DATE,
        classification TEXT,
        barangay TEXT,
        city_municipality TEXT,
        province TEXT,
        contact_person TEXT,
        contact_details TEXT,
        total_members INTEGER,
        date_of_election DATE,
        term_of_office TEXT,
        status_findings TEXT,
        evaluator_name TEXT,
        date_last_update DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('Error creating hoas table:', err);
      else console.log('✓ HOAs table ready');
    });

    // Legal Orders Table (NOV, OTP, OIAS)
    db.run(`
      CREATE TABLE IF NOT EXISTS legal_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cert_of_inc_no TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('NOV', 'OTP', 'OIAS')),
        control_number TEXT UNIQUE NOT NULL,
        date_issued DATE,
        violation_type TEXT,
        violation_description TEXT,
        evaluator TEXT,
        status TEXT DEFAULT 'Active' CHECK(status IN ('Active', 'Under Appeal', 'Resolved', 'Dismissed')),
        sanction_amount DECIMAL(10, 2),
        effective_date DATE,
        appeal_deadline DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(cert_of_inc_no) REFERENCES hoas(cert_of_inc_no)
      )
    `, (err) => {
      if (err) console.error('Error creating legal_orders table:', err);
      else console.log('✓ Legal Orders table ready');
    });

    // Appeals Table (Motion for Reconsideration)
    db.run(`
      CREATE TABLE IF NOT EXISTS appeals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('MR')),
        appeal_control_number TEXT UNIQUE NOT NULL,
        date_filed DATE,
        status TEXT DEFAULT 'Under Review' CHECK(status IN ('Under Review', 'Pending Hearing', 'Resolved - Denied', 'Resolved - Granted')),
        grounds_for_appeal TEXT,
        filing_date DATE,
        hearing_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(order_id) REFERENCES legal_orders(id)
      )
    `, (err) => {
      if (err) console.error('Error creating appeals table:', err);
      else console.log('✓ Appeals table ready');
    });

    // Create indexes for performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_hoas_city ON hoas(city_municipality)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_legal_orders_cert ON legal_orders(cert_of_inc_no)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_legal_orders_type ON legal_orders(type)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_appeals_order ON appeals(order_id)`);

    // Seed data if tables are empty
    seedDatabase();
  });
}

function seedDatabase() {
  db.get('SELECT COUNT(*) as count FROM hoas', [], (err, row) => {
    if (err) {
      console.error('Error checking hoas table:', err);
      return;
    }

    if (row.count === 0) {
      console.log('Seeding database with sample HOA data...');
      const sampleHoas = [
        {
          cert_of_inc_no: 'HOA-2024-001',
          hoa_name: 'Sunset Valley HOA',
          reg_type: 'Residential',
          issuance_date: '2024-01-15',
          classification: 'Class A',
          barangay: 'District 1',
          city_municipality: 'Bacolod City',
          province: 'Negros Occidental',
          contact_person: 'John Martinez',
          contact_details: 'john.m@sunsetvalley.org',
          total_members: 150,
          date_of_election: '2024-01-10',
          term_of_office: '2024-2027',
          status_findings: 'In Good Standing',
          evaluator_name: 'Maria Elena Santos'
        },
        {
          cert_of_inc_no: 'HOA-2024-002',
          hoa_name: 'Green Meadows Association',
          reg_type: 'Residential',
          issuance_date: '2024-02-20',
          classification: 'Class A',
          barangay: 'District 2',
          city_municipality: 'Dumaguete City',
          province: 'Negros Oriental',
          contact_person: 'Maria Santos',
          contact_details: 'maria.s@greenmeadows.org',
          total_members: 220,
          date_of_election: '2024-02-15',
          term_of_office: '2024-2027',
          status_findings: 'In Good Standing',
          evaluator_name: 'Roberto M. Cruz'
        },
        {
          cert_of_inc_no: 'HOA-2023-889',
          hoa_name: 'Lakeside Residents HOA',
          reg_type: 'Residential',
          issuance_date: '2023-11-10',
          classification: 'Class B',
          barangay: 'District 1',
          city_municipality: 'Silay City',
          province: 'Negros Occidental',
          contact_person: 'Robert Chen',
          contact_details: 'robert.c@lakeside.org',
          total_members: 95,
          date_of_election: '2023-11-08',
          term_of_office: '2023-2026',
          status_findings: 'Under Review',
          evaluator_name: 'Ana Marie Reyes'
        },
        {
          cert_of_inc_no: 'HOA-2024-003',
          hoa_name: 'Palm Heights Community',
          reg_type: 'Residential',
          issuance_date: '2024-03-05',
          classification: 'Class A',
          barangay: 'District 3',
          city_municipality: 'Bago City',
          province: 'Negros Occidental',
          contact_person: 'Sarah Johnson',
          contact_details: 'sarah.j@palmheights.org',
          total_members: 310,
          date_of_election: '2024-03-01',
          term_of_office: '2024-2027',
          status_findings: 'In Good Standing',
          evaluator_name: 'Jose P. Hernandez'
        },
        {
          cert_of_inc_no: 'HOA-2023-067',
          hoa_name: 'River Park Homeowners',
          reg_type: 'Residential',
          issuance_date: '2023-09-12',
          classification: 'Class A',
          barangay: 'District 2',
          city_municipality: 'Himamaylan City',
          province: 'Negros Occidental',
          contact_person: 'Michael Davis',
          contact_details: 'michael.d@riverpark.org',
          total_members: 180,
          date_of_election: '2023-09-10',
          term_of_office: '2023-2026',
          status_findings: 'Sanctioned',
          evaluator_name: 'Roberto M. Cruz'
        }
      ];

      sampleHoas.forEach(hoa => {
        db.run(
          `INSERT INTO hoas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            hoa.cert_of_inc_no,
            hoa.hoa_name,
            hoa.reg_type,
            hoa.issuance_date,
            hoa.classification,
            hoa.barangay,
            hoa.city_municipality,
            hoa.province,
            hoa.contact_person,
            hoa.contact_details,
            hoa.total_members,
            hoa.date_of_election,
            hoa.term_of_office,
            hoa.status_findings,
            hoa.evaluator_name
          ],
          (err) => {
            if (err && !err.message.includes('UNIQUE constraint')) {
              console.error('Error seeding HOA:', err);
            }
          }
        );
      });

      // Seed sample legal orders
      const sampleOrders = [
        {
          cert_of_inc_no: 'HOA-2023-067',
          type: 'OIAS',
          control_number: 'OIAS-2026-001',
          date_issued: '2026-02-05',
          violation_type: 'Administrative Fine',
          violation_description: 'Multiple violations of reporting requirements and governance standards',
          evaluator: 'Roberto M. Cruz',
          sanction_amount: 50000.00,
          effective_date: '2026-01-15',
          appeal_deadline: '2026-03-05'
        },
        {
          cert_of_inc_no: 'HOA-2024-001',
          type: 'NOV',
          control_number: 'NOV-2026-001',
          date_issued: '2026-02-10',
          violation_type: 'Failure to Submit Annual Reports',
          violation_description: 'HOA failed to submit required annual financial reports for fiscal year 2025',
          evaluator: 'Maria Elena Santos',
          status: 'Active'
        }
      ];

      sampleOrders.forEach(order => {
        db.run(
          `INSERT INTO legal_orders (cert_of_inc_no, type, control_number, date_issued, violation_type, violation_description, evaluator, status, sanction_amount, effective_date, appeal_deadline, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
          [
            order.cert_of_inc_no,
            order.type,
            order.control_number,
            order.date_issued,
            order.violation_type,
            order.violation_description,
            order.evaluator,
            order.status || 'Active',
            order.sanction_amount || null,
            order.effective_date || null,
            order.appeal_deadline || null
          ],
          (err) => {
            if (err && !err.message.includes('UNIQUE constraint')) {
              console.error('Error seeding legal order:', err);
            }
          }
        );
      });

      console.log('✓ Database seeded successfully');
    } else {
      console.log('✓ Database already seeded');
    }
  });
}

// ==================== HOA ROUTES ====================

// GET all HOAs with filters
app.get('/api/hoas', (req, res) => {
  const { search, status, city } = req.query;

  let query = 'SELECT * FROM hoas WHERE 1=1';
  const params = [];

  if (search) {
    query += ` AND (hoa_name LIKE ? OR cert_of_inc_no LIKE ? OR contact_person LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (status) {
    query += ` AND status_findings = ?`;
    params.push(status);
  }

  if (city) {
    query += ` AND city_municipality = ?`;
    params.push(city);
  }

  query += ` ORDER BY date_last_update DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Enrich each HOA with legal order information
    Promise.all((rows || []).map(hoa => {
      return new Promise((resolve) => {
        db.all(
          'SELECT id, type, control_number, date_issued, status FROM legal_orders WHERE cert_of_inc_no = ? ORDER BY date_issued DESC',
          [hoa.cert_of_inc_no],
          (err, orders) => {
            resolve({
              ...hoa,
              legal_orders: orders || [],
              has_oias: orders && orders.some(o => o.type === 'OIAS'),
              is_sanctioned: orders && orders.some(o => o.type === 'OIAS')
            });
          }
        );
      });
    })).then(enriched => {
      res.json(enriched);
    });
  });
});

// GET single HOA detail
app.get('/api/hoas/:cert_of_inc_no', (req, res) => {
  const { cert_of_inc_no } = req.params;

  db.get('SELECT * FROM hoas WHERE cert_of_inc_no = ?', [cert_of_inc_no], (err, hoa) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!hoa) {
      res.status(404).json({ error: 'HOA not found' });
      return;
    }

    // Get legal orders
    db.all(
      'SELECT * FROM legal_orders WHERE cert_of_inc_no = ? ORDER BY date_issued DESC',
      [cert_of_inc_no],
      (err, orders) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        res.json({
          ...hoa,
          legal_orders: orders || [],
          has_oias: orders && orders.some(o => o.type === 'OIAS'),
          is_sanctioned: orders && orders.some(o => o.type === 'OIAS')
        });
      }
    );
  });
});

// CREATE new HOA
app.post('/api/hoas', (req, res) => {
  const {
    cert_of_inc_no,
    hoa_name,
    reg_type,
    issuance_date,
    classification,
    barangay,
    city_municipality,
    province,
    contact_person,
    contact_details,
    total_members,
    date_of_election,
    term_of_office,
    status_findings,
    evaluator_name
  } = req.body;

  if (!cert_of_inc_no || !hoa_name) {
    res.status(400).json({ error: 'cert_of_inc_no and hoa_name are required' });
    return;
  }

  db.run(
    `INSERT INTO hoas VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    [
      cert_of_inc_no,
      hoa_name,
      reg_type,
      issuance_date,
      classification,
      barangay,
      city_municipality,
      province,
      contact_person,
      contact_details,
      total_members,
      date_of_election,
      term_of_office,
      status_findings || 'In Good Standing',
      evaluator_name
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(409).json({ error: 'HOA already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.status(201).json({ message: 'HOA created', cert_of_inc_no });
    }
  );
});

// UPDATE HOA (except cert_of_inc_no if sanctioned)
app.put('/api/hoas/:cert_of_inc_no', (req, res) => {
  const { cert_of_inc_no } = req.params;
  const updates = req.body;

  // Check if HOA is sanctioned
  db.get(
    'SELECT legal_orders.id FROM legal_orders WHERE cert_of_inc_no = ? AND type = ?',
    [cert_of_inc_no, 'OIAS'],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // If sanctioned, don't allow cert_of_inc_no changes
      if (row && updates.cert_of_inc_no) {
        res.status(403).json({ error: 'Cannot modify cert_of_inc_no for sanctioned HOA' });
        return;
      }

      const validFields = [
        'hoa_name', 'reg_type', 'issuance_date', 'classification',
        'barangay', 'city_municipality', 'province', 'contact_person',
        'contact_details', 'total_members', 'date_of_election', 'term_of_office',
        'status_findings', 'evaluator_name'
      ];

      const setClause = [];
      const values = [];

      for (const field of validFields) {
        if (field in updates) {
          setClause.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }

      if (setClause.length === 0) {
        res.status(400).json({ error: 'No valid fields provided' });
        return;
      }

      setClause.push(`date_last_update = CURRENT_TIMESTAMP`);
      values.push(cert_of_inc_no);

      db.run(
        `UPDATE hoas SET ${setClause.join(', ')} WHERE cert_of_inc_no = ?`,
        values,
        (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ message: 'HOA updated' });
        }
      );
    }
  );
});

// DELETE HOA
app.delete('/api/hoas/:cert_of_inc_no', (req, res) => {
  const { cert_of_inc_no } = req.params;

  db.serialize(() => {
    // Delete related appeals first
    db.run(
      'DELETE FROM appeals WHERE order_id IN (SELECT id FROM legal_orders WHERE cert_of_inc_no = ?)',
      [cert_of_inc_no]
    );
    
    // Delete related orders
    db.run('DELETE FROM legal_orders WHERE cert_of_inc_no = ?', [cert_of_inc_no]);
    
    // Delete HOA
    db.run(
      'DELETE FROM hoas WHERE cert_of_inc_no = ?',
      [cert_of_inc_no],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'HOA deleted' });
      }
    );
  });
});

// ==================== LEGAL ORDERS ROUTES ====================

// GET all legal orders
app.get('/api/legal-orders', (req, res) => {
  const { type, status, search } = req.query;

  let query = 'SELECT * FROM legal_orders WHERE 1=1';
  const params = [];

  if (type) {
    query += ` AND type = ?`;
    params.push(type);
  }

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (search) {
    query += ` AND (control_number LIKE ? OR cert_of_inc_no LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ` ORDER BY date_issued DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// GET single legal order with HOA details
app.get('/api/legal-orders/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT lo.*, h.hoa_name, h.contact_person 
     FROM legal_orders lo
     JOIN hoas h ON lo.cert_of_inc_no = h.cert_of_inc_no
     WHERE lo.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Legal order not found' });
        return;
      }

      res.json(row);
    }
  );
});

// CREATE legal order (NOV, OTP, OIAS)
app.post('/api/legal-orders', (req, res) => {
  const {
    cert_of_inc_no,
    type,
    control_number,
    date_issued,
    violation_type,
    violation_description,
    evaluator,
    sanction_amount,
    effective_date,
    appeal_deadline
  } = req.body;

  if (!cert_of_inc_no || !type || !control_number) {
    res.status(400).json({ error: 'cert_of_inc_no, type, and control_number are required' });
    return;
  }

  if (!['NOV', 'OTP', 'OIAS'].includes(type)) {
    res.status(400).json({ error: 'type must be NOV, OTP, or OIAS' });
    return;
  }

  db.run(
    `INSERT INTO legal_orders (cert_of_inc_no, type, control_number, date_issued, violation_type, violation_description, evaluator, sanction_amount, effective_date, appeal_deadline, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      cert_of_inc_no,
      type,
      control_number,
      date_issued,
      violation_type,
      violation_description,
      evaluator,
      sanction_amount || null,
      effective_date || null,
      appeal_deadline || null
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(409).json({ error: 'Control number already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }

      // If creating an OIAS, update HOA status
      if (type === 'OIAS') {
        db.run(
          'UPDATE hoas SET status_findings = ? WHERE cert_of_inc_no = ?',
          ['Sanctioned', cert_of_inc_no]
        );
      }

      res.status(201).json({ message: 'Legal order created', id: this.lastID });
    }
  );
});

// UPDATE legal order
app.put('/api/legal-orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, violation_description, sanction_amount } = req.body;

  const updates = [];
  const values = [];

  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }

  if (violation_description !== undefined) {
    updates.push('violation_description = ?');
    values.push(violation_description);
  }

  if (sanction_amount !== undefined) {
    updates.push('sanction_amount = ?');
    values.push(sanction_amount);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  values.push(id);

  db.run(
    `UPDATE legal_orders SET ${updates.join(', ')} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Legal order updated' });
    }
  );
});

// DELETE legal order
app.delete('/api/legal-orders/:id', (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    // Delete related appeals
    db.run('DELETE FROM appeals WHERE order_id = ?', [id]);
    
    // Delete order
    db.run(
      'DELETE FROM legal_orders WHERE id = ?',
      [id],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ message: 'Legal order deleted' });
      }
    );
  });
});

// ==================== APPEALS ROUTES ====================

// GET all appeals
app.get('/api/appeals', (req, res) => {
  const { status, search } = req.query;

  let query = `SELECT a.*, lo.control_number as order_control, lo.type as order_type, h.hoa_name
               FROM appeals a
               JOIN legal_orders lo ON a.order_id = lo.id
               JOIN hoas h ON lo.cert_of_inc_no = h.cert_of_inc_no
               WHERE 1=1`;
  const params = [];

  if (status) {
    query += ` AND a.status = ?`;
    params.push(status);
  }

  if (search) {
    query += ` AND (a.appeal_control_number LIKE ? OR h.hoa_name LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm);
  }

  query += ` ORDER BY a.filing_date DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// GET single appeal
app.get('/api/appeals/:id', (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT a.*, lo.control_number as order_control, lo.type as order_type, lo.violation_description, h.hoa_name, h.contact_person
     FROM appeals a
     JOIN legal_orders lo ON a.order_id = lo.id
     JOIN hoas h ON lo.cert_of_inc_no = h.cert_of_inc_no
     WHERE a.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Appeal not found' });
        return;
      }

      res.json(row);
    }
  );
});

// CREATE appeal (Motion for Reconsideration)
app.post('/api/appeals', (req, res) => {
  const {
    order_id,
    appeal_control_number,
    date_filed,
    grounds_for_appeal,
    filing_date,
    hearing_date
  } = req.body;

  if (!order_id || !appeal_control_number) {
    res.status(400).json({ error: 'order_id and appeal_control_number are required' });
    return;
  }

  db.run(
    `INSERT INTO appeals (order_id, type, appeal_control_number, date_filed, grounds_for_appeal, filing_date, hearing_date, created_at)
     VALUES (?, 'MR', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [
      order_id,
      appeal_control_number,
      date_filed,
      grounds_for_appeal,
      filing_date,
      hearing_date
    ],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(409).json({ error: 'Appeal control number already exists' });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.status(201).json({ message: 'Appeal filed', id: this.lastID });
    }
  );
});

// UPDATE appeal
app.put('/api/appeals/:id', (req, res) => {
  const { id } = req.params;
  const { status, grounds_for_appeal, hearing_date } = req.body;

  const updates = [];
  const values = [];

  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }

  if (grounds_for_appeal !== undefined) {
    updates.push('grounds_for_appeal = ?');
    values.push(grounds_for_appeal);
  }

  if (hearing_date !== undefined) {
    updates.push('hearing_date = ?');
    values.push(hearing_date);
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  values.push(id);

  db.run(
    `UPDATE appeals SET ${updates.join(', ')} WHERE id = ?`,
    values,
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Appeal updated' });
    }
  );
});

// DELETE appeal
app.delete('/api/appeals/:id', (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM appeals WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Appeal deleted' });
    }
  );
});

// ==================== DASHBOARD ROUTES ====================

// GET dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  db.serialize(() => {
    Promise.all([
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM hoas', (err, row) => {
          resolve(err ? 0 : row.count);
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM hoas WHERE status_findings = ?', ['In Good Standing'], (err, row) => {
          resolve(err ? 0 : row.count);
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM hoas WHERE status_findings = ?', ['Sanctioned'], (err, row) => {
          resolve(err ? 0 : row.count);
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT SUM(total_members) as total FROM hoas', (err, row) => {
          resolve(err ? 0 : (row.total || 0));
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM legal_orders WHERE type = ?', ['NOV'], (err, row) => {
          resolve(err ? 0 : row.count);
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM legal_orders WHERE type = ? AND status = ?', ['OIAS', 'Active'], (err, row) => {
          resolve(err ? 0 : row.count);
        });
      }),
      new Promise((resolve) => {
        db.get('SELECT COUNT(*) as count FROM hoas WHERE status_findings = ?', ['Under Review'], (err, row) => {
          resolve(err ? 0 : row.count);
        });
      })
    ]).then(([totalHoas, activeHoas, sanctionedHoas, totalMembers, totalNovs, activeOias, underReview]) => {
      res.json({
        totalHoas,
        activeHoas,
        sanctionedHoas,
        totalMembers,
        totalNovs,
        activeOias,
        underReview
      });
    });
  });
});

// GET HOAs by city
app.get('/api/dashboard/by-city', (req, res) => {
  db.all(
    'SELECT city_municipality, COUNT(*) as count FROM hoas GROUP BY city_municipality ORDER BY count DESC LIMIT 10',
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows || []);
    }
  );
});

// ==================== EXPORT ROUTES ====================

// Export HOAs to CSV
app.get('/api/export/hoas', (req, res) => {
  db.all('SELECT * FROM hoas ORDER BY date_last_update DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!rows || rows.length === 0) {
      res.status(404).json({ error: 'No data to export' });
      return;
    }

    try {
      const exportDir = path.join(__dirname, 'exports');
      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      const csvWriter = createObjectCsvWriter({
        path: path.join(exportDir, 'hoas_export.csv'),
        header: [
          { id: 'cert_of_inc_no', title: 'Cert of Inc No' },
          { id: 'hoa_name', title: 'HOA Name' },
          { id: 'reg_type', title: 'Registration Type' },
          { id: 'issuance_date', title: 'Issuance Date' },
          { id: 'classification', title: 'Classification' },
          { id: 'city_municipality', title: 'City/Municipality' },
          { id: 'contact_person', title: 'Contact Person' },
          { id: 'total_members', title: 'Total Members' },
          { id: 'status_findings', title: 'Status' }
        ]
      });

      csvWriter.writeRecords(rows)
        .then(() => {
          res.download(path.join(exportDir, 'hoas_export.csv'));
        })
        .catch(err => {
          res.status(500).json({ error: err.message });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'Connected' });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n 🚀 DHSUD HOA Management System Backend\n`);
  console.log(`📊 Server running on http://localhost:${PORT}`);
  console.log(`💾 Database: ${dbPath}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\n✓ Database connection closed');
    }
    process.exit(0);
  });
});
