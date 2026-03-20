const db = require('../backend/config/db');

const API = 'http://localhost:5001/api';

async function cleanup(email) {
  // We keep the record for a bit to verify instead of immediate deletion
  // await db.query(`DELETE FROM DealSubmissions WHERE email = ?`, [email]);
}

async function runMasterAudit() {
  console.log('--- GOODMATTER MASTER QA AUDIT (FIXED) ---');
  const testEmail = 'founder_qa_2@test.com';
  const testName = 'QA Master Founder';

  // Ensure test user exists
  await db.query(`DELETE FROM Users WHERE email = ?`, [testEmail]);
  const userResult = await db.query(`INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, 'hash', 'FOUNDER') RETURNING id`, [testName, testEmail]);
  const user = userResult.rows[0];
  console.log(`User created with ID: ${user.id}`);

  // 1. Founder Deal Submission
  console.log('\n[STEP 1] Founder Deal Submission...');
  const submissionPayload = {
    submitted_by: testName,
    email: testEmail,
    startup_name: 'AuditLogix AI V2',
    industry: 'Enterprise SaaS',
    stage: 'Seed',
    problem: 'Automating audits.',
    solution: 'Proprietary engine.',
    market_size: '$10B market',
    traction: '3 pilots',
    revenue: '₹5L',
    financial_projection: '₹2Cr ARR',
    funding_amount: '₹5Cr',
    pitch_deck_url: 'https://docsend.com/view/auditlogix',
  };

  const submitRes = await fetch(`${API}/founder/submit-deal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submissionPayload)
  });
  const submitData = await submitRes.json();
  
  if (submitRes.ok) {
    console.log(`PASS: Deal submitted. AI Score: ${submitData.ai_score}`);
  } else {
    console.log(`FAIL: Deal submission failed. Status: ${submitRes.status}, Msg: ${submitData.message}`);
  }

  // 2. Verify Database Entry
  const dbDeal = (await db.query(`SELECT * FROM DealSubmissions WHERE email = ? ORDER BY id DESC LIMIT 1`, [testEmail])).rows[0];
  if (dbDeal) {
    console.log(`PASS: DealSubmissions entry verified (ID: ${dbDeal.id}, Name: ${dbDeal.startup_name}).`);
  } else {
    console.log('FAIL: DealSubmissions entry not found.');
  }

  // 3. Admin Approval
  if (dbDeal) {
    console.log('\n[STEP 2] Admin Approval...');
    await db.query(`UPDATE DealSubmissions SET status = 'APPROVED' WHERE id = ?`, [dbDeal.id]);
    console.log('PASS: Deal status forced to APPROVED in DB.');
  }

  // 4. Payment & Subscription
  console.log('\n[STEP 3] Webhook Processing...');
  const metadata = JSON.stringify({ services: [], listing_fee: 8000, subscription_plan: 'Priority Access' });
  await db.query(`INSERT INTO Payments (user_id, amount, status, metadata) VALUES (?, ?, 'PENDING', ?)`, [user.id, 25000, metadata]);

  const webhookPayload = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_QA_FIXED',
          notes: { user_id: user.id }
        }
      }
    }
  };

  const webhookRes = await fetch(`${API}/services/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookPayload)
  });

  if (webhookRes.ok) {
    const updatedPayment = (await db.query(`SELECT * FROM Payments WHERE user_id = ? AND status = 'SUCCESS'`, [user.id])).rows[0];
    const sub = (await db.query(`SELECT * FROM Subscriptions WHERE user_id = ?`, [user.id])).rows[0];
    const dealAfterPayment = (await db.query(`SELECT status FROM DealSubmissions WHERE id = ?`, [dbDeal?.id])).rows[0];

    console.log(`Payment Status (ID ${updatedPayment?.id}): ${updatedPayment?.status}`);
    console.log(`Subscription Status (Plan ${sub?.plan_name}): ${sub?.status}`);
    console.log(`Deal Submission Status (ID ${dbDeal?.id}): ${dealAfterPayment?.status}`);

    if (updatedPayment?.status === 'SUCCESS' && sub?.status === 'ACTIVE' && dealAfterPayment?.status === 'FEE_PAID') {
      console.log('PASS: Full Payment workflow completed.');
    } else {
      console.log('FAIL: Webhook processing state mismatch.');
    }
  }

  console.log('\n--- MASTER AUDIT COMPLETE ---');
  process.exit(0);
}

runMasterAudit();
