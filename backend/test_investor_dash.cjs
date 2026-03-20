const db = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const API = 'http://localhost:5001/api';

async function testInvestorDashboard() {
  console.log('--- TESTING INVESTOR DASHBOARD API ---');

  // 1. Get an investor user
  const userRes = await db.query("SELECT id, name, email, role FROM Users WHERE id = 5 LIMIT 1");
  const user = userRes.rows[0];

  if (!user) {
    console.log('No investor found. Please run seed script first.');
    process.exit(1)
  }

  console.log(`Testing for Investor: ${user.name} (ID: ${user.id})`);

  // 2. Generate token
  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1h' }
  );

  // 3. Fetch Dashboard
  try {
    const dashRes = await fetch(`${API}/investor/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const dashData = await dashRes.json();
    console.log('\n[Dashboard Response]:');
    console.log(JSON.stringify(dashData, null, 2));

    const matchedRes = await fetch(`${API}/investor/matched-deals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const matchedData = await matchedRes.json();
    console.log('\n[Matched Deals Response]:');
    console.log(JSON.stringify(matchedData, null, 2));

  } catch (err) {
    console.error('Fetch error:', err.message);
  }

  process.exit(0);
}

testInvestorDashboard();
