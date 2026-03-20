const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.resolve(__dirname, '../database.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    role TEXT NOT NULL,
    is_verified INTEGER DEFAULT 0,
    auth_provider TEXT DEFAULT 'email',
    verification_token TEXT,
    token_expiry DATETIME
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Founders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    is_verified INTEGER DEFAULT 0,
    auth_provider TEXT DEFAULT 'email',
    verification_token TEXT,
    token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Investors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Startups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_name TEXT NOT NULL,
    industry TEXT,
    category TEXT,
    stage TEXT,
    raise_amount TEXT,
    description TEXT,
    founders TEXT,
    traction TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startup_id INTEGER NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    deal_stage TEXT,
    deal_type TEXT,
    closing_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS IntroductionRequests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investor_id INTEGER,
    startup_id INTEGER,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS StartupApplications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    founder_name TEXT NOT NULL,
    email TEXT NOT NULL,
    linkedin_url TEXT,
    startup_name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    stage TEXT,
    raise_amount TEXT,
    description TEXT,
    pitch_deck_url TEXT,
    additional_info TEXT,
    status TEXT DEFAULT 'PENDING',
    rejection_reason TEXT,
    ai_score INTEGER DEFAULT 0,
    ai_summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS Bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    startup_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, startup_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS DealSubmissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submitted_by TEXT NOT NULL,
    email TEXT NOT NULL,
    startup_name TEXT NOT NULL,
    industry TEXT,
    stage TEXT,
    problem TEXT,
    solution TEXT,
    market_size TEXT,
    business_model TEXT,
    traction TEXT,
    revenue_metrics TEXT,
    competition TEXT,
    financial_projection TEXT,
    funding_amount TEXT,
    pitch_deck_url TEXT,
    tam TEXT,
    sam TEXT,
    som TEXT,
    cagr TEXT,
    retention_metrics TEXT,
    cac TEXT,
    ltv TEXT,
    competitors TEXT,
    differentiation TEXT,
    projections TEXT,
    status TEXT DEFAULT 'PENDING',
    filter_status TEXT DEFAULT 'PENDING',
    rejection_reason TEXT,
    ai_score INTEGER DEFAULT 0,
    ai_breakdown TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS InvestorProfiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    preferred_sectors TEXT DEFAULT '[]',
    preferred_stages TEXT DEFAULT '[]',
    ticket_size TEXT,
    bio TEXT,
    linkedin_url TEXT,
    firm_name TEXT,
    role TEXT,
    geography TEXT,
    stage_focus TEXT,
    investment_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Alter existing table to add missing columns (idempotent)
  ['firm_name TEXT', 'role TEXT', 'geography TEXT', 'stage_focus TEXT', 'investment_type TEXT'].forEach(col => {
    db.run(`ALTER TABLE InvestorProfiles ADD COLUMN ${col}`, () => {});
  });

  ['auth_provider TEXT DEFAULT "email"', 'verification_token TEXT', 'token_expiry DATETIME'].forEach(col => {
    db.run(`ALTER TABLE Users ADD COLUMN ${col}`, () => {});
    db.run(`ALTER TABLE Founders ADD COLUMN ${col}`, () => {});
  });

  [
    'tam TEXT', 'sam TEXT', 'som TEXT', 'cagr TEXT', 'retention_metrics TEXT',
    'cac TEXT', 'ltv TEXT', 'competitors TEXT', 'differentiation TEXT', 'projections TEXT',
    'pitch_deck_file TEXT', 'tier TEXT', 'error_message TEXT',
    'team_score INTEGER', 'market_score INTEGER', 'traction_score INTEGER',
    'product_score INTEGER', 'competition_score INTEGER', 'financial_score INTEGER',
    'analysis_json TEXT',
    'needs_review INTEGER DEFAULT 0'   // ← new: flags low-confidence / invalid extractions
  ].forEach(col => {
    db.run(`ALTER TABLE DealSubmissions ADD COLUMN ${col}`, () => {});
  });

  db.run(`CREATE TABLE IF NOT EXISTS DealInterest (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER NOT NULL,
    investor_id INTEGER NOT NULL,
    status TEXT DEFAULT 'INTERESTED',
    notified_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(deal_id, investor_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS CartItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'PENDING',
    payment_gateway_id TEXT,
    payment_type TEXT DEFAULT 'SERVICE',
    metadata TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    plan_name TEXT DEFAULT 'Priority Access',
    price INTEGER DEFAULT 25000,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'ACTIVE',
    renewal_date DATETIME,
    payment_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS OTPs (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);


  // Seed services if empty
  db.get('SELECT COUNT(*) as count FROM Services', [], (err, row) => {
    if (!err && row && row.count === 0) {
      const svcs = [
        ['Pitch Deck Review', 'Expert review and feedback on your investor pitch deck', 15000, 'INR'],
        ['Investor Introductions', 'Direct warm introductions to 3 matched investors', 35000, 'INR'],
        ['Fundraising Support', 'End-to-end fundraise process support and advisory', 75000, 'INR'],
        ['Deal Listing', 'List your startup on the GoodMatter curated deal room', 10000, 'INR'],
        ['Financial Model', '3-5 year financial model and valuation analysis', 20000, 'INR'],
        ['Pitch Deck Creation', 'Full professional pitch deck design and narrative', 25000, 'INR'],
      ];
      const stmt = db.prepare('INSERT INTO Services (name, description, price, currency) VALUES (?,?,?,?)');
      svcs.forEach(s => stmt.run(s));
      stmt.finalize();
    }
  });
  db.run(`CREATE TABLE IF NOT EXISTS DealMatches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deal_id INTEGER NOT NULL,
    investor_id INTEGER NOT NULL,
    match_score INTEGER DEFAULT 0,
    match_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(deal_id, investor_id)
  )`);

  // Seed deals across all 5 Notion categories if table is empty
  db.get('SELECT COUNT(*) as count FROM Startups', [], (err, row) => {
    if (!err && row && row.count === 0) {
      const startups = [
        // Angel / Early Stage (Live from Notion)
        ['Nomadiq', 'TravelTech', 'Angel / Early Stage', 'Seed', '₹4.5Cr', 'AI-powered travel platform tracking real-time fare changes and auto-booking at the lowest price. Eliminating manual travel searching and decision fatigue.', 'Kai (Founder), k.kai21999@gmail.com', '200+ early sign-ups on waitlist, Real-time fare tracking engine', 'nomadiq.co.in'],
        ['Doffair', 'Pet Care (Tech)', 'Angel / Early Stage', 'Seed', '₹3Cr', 'PetTech ecosystem for socialization (playdates) and verified services + SaaS CRM for professionals. Building a full-stack pet parenting ecosystem.', 'Dushyant (Founder), dushyant@doffair.com', 'Verified service network, SaaS CRM for pet professionals', 'doffair.com'],
        ['Frutacrunch', 'F&B', 'Angel / Early Stage', 'Early Stage', '₹50L', 'Premium, culture-driven air-dried fruit snacking brand targeting conscious urban consumers. Heritage and geography narrative focus.', 'Frutacrunch Team, frutacrunchindia@gmail.com', 'Premium brand positioning, Culture-driven narrative', 'frutacrunch.co.in'],
        // VC / PE (Live from Notion)
        ['Sugar Daddy\'s', 'Health & Wellness', 'Venture Capital / PE', 'Early Stage', '₹10Cr', 'D2C FoodTech brand replacing refined sugar with natural sweeteners across tea, coffee, and spreads. Diabetic-safe, clean-label alternatives.', 'Sugar Daddy\'s Team, notavailable@gmail.com', 'ARR ₹19 Lakh, Diabetic-safe certification', 'notavailable.com'],
        // Institutional grade institutional examples (to show full 5 categories)
        ['Cognitive AI', 'AI/SaaS', 'Venture Capital / PE', 'Series A', '₹35Cr', 'Enterprise compliance workflows automated using LLMs. Reducing compliance costs by 60% for mid-market clients.', 'Arjun Dev (Ex-McKinsey), Deepika Rao (Stanford AI)', '25 enterprise clients, ₹4.2Cr ARR', 'cognitive.ai'],
        // IPO Stage
        ['LogiRoute', 'Logistics', 'IPO Stage', 'Pre-IPO', '₹120Cr', 'AI-powered route optimisation for last-mile delivery. Operating across 18 cities, reducing delivery costs by 35%.', 'Manish Gupta (Ex-Delhivery), Ritika Agarwal', '18 cities, ₹42Cr ARR, profitable for 2 quarters', 'logiroute.com'],
        // Debt & Structured Finance
        ['AgriCredit', 'AgriFintech', 'Debt & Structured Finance', 'Growth', '₹50Cr (Structured Debt)', 'Non-dilutive structured credit facility for Agritech scale-ups. Revenue-based financing with flexible repayment.', 'Ravi Teja (CA, Ex-HDFC)', 'Deployed ₹18Cr across 6 companies, 0 defaults', 'agricredit.in'],
        // M&A
        ['RetailMax', 'Retail / D2C', 'Mergers & Acquisitions', 'Acquisition Target', '₹80Cr (Exit)', 'Profitable D2C brand in premium home goods with strong offline presence. Founders seeking PE or strategic acquirer.', 'Sanjay Mehta (Founder), Nilam Shah (COO)', '₹22Cr revenue, EBITDA positive, 8 years operating history', 'retailmax.co'],
      ];

      const stmt = db.prepare(`INSERT INTO Startups 
        (startup_name, industry, category, stage, raise_amount, description, founders, traction, website) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      startups.forEach(s => stmt.run(s));
      stmt.finalize();

      setTimeout(() => {
        db.all('SELECT id, category FROM Startups', [], (err, rows) => {
          if (!err && rows) {
            const dealStmt = db.prepare('INSERT INTO Deals (startup_id, status, deal_stage, deal_type, closing_date) VALUES (?, ?, ?, ?, ?)');
            rows.forEach(r => {
              const closingDates = ['2025-04-30', '2025-05-31', '2025-06-30', '2025-07-31'];
              const closing = closingDates[Math.floor(Math.random() * closingDates.length)];
              dealStmt.run([r.id, 'ACTIVE', 'Open', r.category, closing]);
            });
            dealStmt.finalize();
          }
        });
      }, 200);
    }
  });
});

function convertParams(text) {
  return text.replace(/\$(\d+)/g, '?');
}

module.exports = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      const sqliteText = convertParams(text);
      const trimmed = sqliteText.trim().toUpperCase();
      const isInsert = trimmed.startsWith('INSERT');

      if (isInsert) {
        const hasReturning = /RETURNING/i.test(sqliteText);
        if (hasReturning) {
          const parts = sqliteText.split(/RETURNING/i);
          const insertSQL = parts[0].trim();
          const returningFields = parts[1].trim();
          
          // Extract table name from INSERT INTO [TableName]
          const match = insertSQL.match(/INSERT\s+INTO\s+([^\s\(\)]+)/i);
          const tableName = match ? match[1] : 'Users';

          db.run(insertSQL, params, function(err) {
            if (err) {
              console.error('SQL Error (INSERT):', err.message, '| Query:', insertSQL);
              return reject(err);
            }
            const lastId = this.lastID;
            db.get(`SELECT ${returningFields} FROM ${tableName} WHERE id = ?`, [lastId], (err, row) => {
              if (err || !row) resolve({ rows: [{ id: lastId }] });
              else resolve({ rows: [row] });
            });
          });
        } else {
          db.run(sqliteText, params, function(err) {
            if (err) {
              console.error('SQL Error (INSERT):', err.message, '| Query:', sqliteText);
              return reject(err);
            }
            resolve({ rows: [{ id: this.lastID }] });
          });
        }
      } else {
        db.all(sqliteText, params, (err, rows) => {
          if (err) {
            console.error('SQL Error:', err.message, '| Query:', sqliteText);
            reject(err);
          } else {
            resolve({ rows: rows || [] });
          }
        });
      }
    });
  }
};
