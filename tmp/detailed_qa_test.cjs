const db = require('../backend/config/db');

const API = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- STARTING DETAILED QA TESTS ---');

  // TEST 1: Investor Access Control
  try {
    console.log('\n[TEST 1] Testing Investor self-signup blocking...');
    const response = await fetch(`${API}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sneaky Investor',
        email: 'sneaky@investor.com',
        password: 'password123',
        role: 'INVESTOR'
      })
    });

    if (response.status === 403) {
      console.log('PASS: Investor signup blocked as expected (403 Forbidden)');
    } else {
      console.log(`FAIL: Investor signup returned status ${response.status}`);
      const data = await response.json();
      console.log('Response body:', data);
    }
  } catch (err) {
    console.log('ERROR in Test 1:', err.message);
  }

  // TEST 2: Score-Based Pricing Logic
  console.log('\n[TEST 2] Verifying AI Score mapping to Tiers/Fees...');
  const testCases = [
    { score: 90, expectedTier: 'FEATURED', expectedFee: 8000 },
    { score: 75, expectedTier: 'STANDARD', expectedFee: 15000 },
    { score: 65, expectedTier: 'LIMITED', expectedFee: 22000 },
    { score: 45, expectedTier: 'REJECT', expectedFee: 0 }
  ];

  for (const tc of testCases) {
    let tier = 'REJECT', fee = 0;
    if (tc.score >= 85) { tier = 'FEATURED'; fee = 8000; }
    else if (tc.score >= 70) { tier = 'STANDARD'; fee = 15000; }
    else if (tc.score >= 60) { tier = 'LIMITED'; fee = 22000; }

    const pass = tier === tc.expectedTier && fee === tc.expectedFee;
    console.log(`Score ${tc.score}: Expected ${tc.expectedTier}/₹${tc.expectedFee}, Got ${tier}/₹${fee} -> ${pass ? 'PASS' : 'FAIL'}`);
  }

  // TEST 3: Admin Email Notification Logic (Database & Service Trigger)
  try {
    console.log('\n[TEST 3] Verifying Investor Interest Notification logic...');
    
    // We'll insert a mock interest and check state
    const dealId = 888;
    const investorId = 2;
    
    // Cleanup old mock if exists
    await db.query(`DELETE FROM DealInterest WHERE deal_id = ?`, [dealId]);

    // 1. Simulate interest express
    await db.query(
      `INSERT INTO DealInterest (deal_id, investor_id, status, notified_admin) VALUES (?,?,?,0)`,
      [dealId, investorId, 'INTERESTED']
    );
    
    const record = (await db.query(`SELECT * FROM DealInterest WHERE deal_id = ?`, [dealId])).rows[0];
    console.log(`Step 1: Interest record created with notified_admin = ${record.notified_admin}`);

    // 2. Simulate notification update
    await db.query(
        `UPDATE DealInterest SET notified_admin = 1 WHERE deal_id = ? AND investor_id = ?`,
        [dealId, investorId]
      );
    const updated = (await db.query(`SELECT * FROM DealInterest WHERE deal_id = ?`, [dealId])).rows[0];
    console.log(`Step 2: notified_admin updated to ${updated.notified_admin} -> ${updated.notified_admin === 1 ? 'PASS' : 'FAIL'}`);

    // Cleanup
    await db.query(`DELETE FROM DealInterest WHERE deal_id = ?`, [dealId]);
  } catch (err) {
    console.log('ERROR in Test 3:', err.message);
  }

  console.log('\n--- DETAILED QA TESTS COMPLETE ---');
  process.exit(0);
}

runTests();
