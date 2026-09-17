const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const QRCode = require('qrcode');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database('./tickets.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sellers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      qr_code TEXT UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      ticket_type TEXT NOT NULL,
      price INTEGER NOT NULL,
      status TEXT DEFAULT 'active',
      sold_by TEXT NOT NULL,
      location TEXT NOT NULL,
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      checked_in_at DATETIME,
      checked_in_by TEXT,
      FOREIGN KEY(sold_by) REFERENCES sellers(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      seller_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      location TEXT NOT NULL,
      verified BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id),
      FOREIGN KEY(seller_id) REFERENCES sellers(id)
    )
  `);
});

// Helper functions
const generateTicketId = () => crypto.randomBytes(8).toString('hex');
const generateQRCode = (data) => QRCode.toDataURL(data);

// Routes

// 1. Seller Registration/Login
app.post('/api/sellers/login', (req, res) => {
  const { seller_name, location } = req.body;

  if (!seller_name || !location) {
    return res.status(400).json({ error: 'Seller name and location required' });
  }

  const sellerId = crypto.randomBytes(8).toString('hex');

  db.run(
    `INSERT INTO sellers (id, name, location) VALUES (?, ?, ?)`,
    [sellerId, seller_name, location],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        success: true,
        sellerId,
        sellerName: seller_name,
        location
      });
    }
  );
});

// 2. Create Ticket (Seller generates after customer pays)
app.post('/api/tickets/create', async (req, res) => {
  const { customer_name, customer_phone, ticket_type, payment_method, seller_id, location } = req.body;

  if (!customer_name || !customer_phone || !ticket_type || !seller_id || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const ticketPrices = { 'K50': 50, 'K80': 80, 'K150': 150 };
  const amount = ticketPrices[ticket_type];
  const ticketId = generateTicketId();

  const qrData = JSON.stringify({
    ticketId,
    event: 'SallyJoyCamps2026',
    customer: customer_name,
    type: ticket_type,
    timestamp: new Date().toISOString()
  });

  try {
    const qrCode = await generateQRCode(qrData);

    db.run(
      `INSERT INTO tickets (id, qr_code, customer_name, customer_phone, ticket_type, price, sold_by, location, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticketId, qrCode, customer_name, customer_phone, ticket_type, amount, seller_id, location, payment_method],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        db.run(
          `INSERT INTO sales (ticket_id, seller_id, amount, payment_method, location, verified)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [ticketId, seller_id, amount, payment_method, location],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              success: true,
              ticket: {
                ticketId,
                customerName: customer_name,
                customerPhone: customer_phone,
                type: ticket_type,
                amount,
                qrCode,
                ticketUrl: `/ticket/${ticketId}`,
                whatsappLink: `https://wa.me/${customer_phone.replace(/\D/g, '')}?text=Your%20Sally%20Joy%20Camps%20ticket%3A%20${encodeURIComponent(req.get('host') || 'localhost:5000')}/ticket/${ticketId}`,
                createdAt: new Date()
              }
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Ticket Details (for API)
app.get('/api/tickets/:ticketId', (req, res) => {
  const { ticketId } = req.params;

  db.get(
    `SELECT * FROM tickets WHERE id = ?`,
    [ticketId],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Ticket not found' });

      res.json(row);
    }
  );
});

// Get Seller Sales
app.get('/api/sellers/:sellerId/sales', (req, res) => {
  const { sellerId } = req.params;

  db.all(
    `SELECT t.*, s.created_at as sale_date
     FROM tickets t
     LEFT JOIN sales s ON t.id = s.ticket_id
     WHERE t.sold_by = ?
     ORDER BY t.created_at DESC`,
    [sellerId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const stats = {
        total_sold: rows.length,
        total_revenue: rows.reduce((sum, t) => sum + t.price, 0),
        by_type: {},
        tickets: rows
      };

      rows.forEach(ticket => {
        if (!stats.by_type[ticket.ticket_type]) {
          stats.by_type[ticket.ticket_type] = { count: 0, revenue: 0 };
        }
        stats.by_type[ticket.ticket_type].count++;
        stats.by_type[ticket.ticket_type].revenue += ticket.price;
      });

      res.json(stats);
    }
  );
});

// 3. Check-in: Scan QR Code
app.post('/api/checkin/scan', (req, res) => {
  const { qrData, staffName } = req.body;

  if (!qrData) {
    return res.status(400).json({ error: 'QR data required' });
  }

  try {
    const data = JSON.parse(qrData);
    const { ticketId } = data;

    db.get(
      `SELECT * FROM tickets WHERE id = ?`,
      [ticketId],
      (err, ticket) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

        if (ticket.status === 'checked_in') {
          return res.status(400).json({ 
            error: 'Already checked in',
            ticket: {
              name: ticket.customer_name,
              type: ticket.ticket_type,
              checkedInAt: ticket.checked_in_at
            }
          });
        }

        db.run(
          `UPDATE tickets 
           SET status = 'checked_in', checked_in_at = datetime('now'), checked_in_by = ?
           WHERE id = ?`,
          [staffName || 'staff', ticketId],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              success: true,
              message: 'Checked in successfully',
              ticket: {
                name: ticket.customer_name,
                type: ticket.ticket_type,
                phone: ticket.customer_phone
              }
            });
          }
        );
      }
    );
  } catch (err) {
    res.status(400).json({ error: 'Invalid QR data' });
  }
});

// 4. Admin Dashboard: Get All Tickets
app.get('/api/admin/tickets', (req, res) => {
  db.all(
    `SELECT t.*, s.amount, s.payment_method, s.verified
     FROM tickets t
     LEFT JOIN sales s ON t.id = s.ticket_id
     ORDER BY t.created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 5. Admin Dashboard: Get Stats
app.get('/api/admin/stats', (req, res) => {
  db.all(
    `SELECT 
      COUNT(*) as total_tickets,
      SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as checked_in,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as not_checked_in,
      SUM(price) as total_revenue,
      GROUP_CONCAT(DISTINCT ticket_type) as ticket_types
     FROM tickets`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows[0]);
    }
  );
});

// 6. Admin Dashboard: Get Revenue by Ticket Type
app.get('/api/admin/revenue', (req, res) => {
  db.all(
    `SELECT ticket_type, COUNT(*) as count, SUM(price) as revenue
     FROM tickets
     GROUP BY ticket_type`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 7. Verify Payment (for manual verification)
app.post('/api/admin/verify-payment', (req, res) => {
  const { ticketId, staffName } = req.body;

  db.run(
    `UPDATE sales SET verified = 1, verified_at = datetime('now') WHERE ticket_id = ?`,
    [ticketId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🎫 Sally Joy Camps Ticketing System running on http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`🔍 Check-in App: http://localhost:${PORT}/checkin`);
});
