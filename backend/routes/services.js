const express = require('express');
const db = require('../config/db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// ─── GET /api/services ────────────────────────────────────────────────────────
router.get('/services', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM Services WHERE active = 1 ORDER BY price ASC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── GET /api/services/cart ───────────────────────────────────────────────────
router.get('/cart', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ci.id, s.id as service_id, s.name, s.description, s.price, s.currency
       FROM CartItems ci
       JOIN Services s ON s.id = ci.service_id
       WHERE ci.user_id = ?`, [req.user.id]
    );
    const total = result.rows.reduce((sum, item) => sum + item.price, 0);
    res.json({ items: result.rows, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/services/cart ──────────────────────────────────────────────────
router.post('/cart', authMiddleware, async (req, res) => {
  try {
    const { service_id } = req.body;
    if (!service_id) return res.status(400).json({ message: 'service_id required' });

    await db.query(
      `INSERT OR IGNORE INTO CartItems (user_id, service_id) VALUES (?,?)`,
      [req.user.id, service_id]
    );
    res.json({ message: 'Service added to cart.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── DELETE /api/services/cart/:service_id ────────────────────────────────────
router.delete('/cart/:service_id', authMiddleware, async (req, res) => {
  try {
    await db.query(
      `DELETE FROM CartItems WHERE user_id = ? AND service_id = ?`,
      [req.user.id, req.params.service_id]
    );
    res.json({ message: 'Service removed from cart.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/services/checkout ─────────────────────────────────────────────
// Creates a payment record (supports unified single checkout: services + listing fee + subscription)
router.post('/checkout', authMiddleware, async (req, res) => {
  try {
    const { payment_gateway_id, amount, listing_fee, subscription_plan } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid amount.' });

    // Get cart items for metadata
    const cartResult = await db.query(
      `SELECT ci.service_id, s.name FROM CartItems ci JOIN Services s ON s.id = ci.service_id WHERE ci.user_id = ?`,
      [req.user.id]
    );

    const metadata = {
      services: cartResult.rows,
      listing_fee: listing_fee || 0,
      subscription_plan: subscription_plan || null
    };

    const paymentType = subscription_plan ? 'UNIFIED_SUBSCRIPTION' : 'UNIFIED_CHECKOUT';

    const result = await db.query(
      `INSERT INTO Payments (user_id, amount, currency, status, payment_gateway_id, payment_type, metadata)
       VALUES (?,?,?,?,?,?,?)`,
      [req.user.id, amount, 'INR',
       payment_gateway_id ? 'SUCCESS' : 'PENDING',
       payment_gateway_id || null,
       paymentType,
       JSON.stringify(metadata)]
    );

    // If payment is already confirmed upfront (mocking client-side checkout)
    if (payment_gateway_id) {
      await processSuccessfulPayment(req.user.id, payment_gateway_id, amount, metadata, result.rows[0]?.id);
    }

    res.json({
      message: payment_gateway_id ? 'Payment confirmed! Services activated.' : 'Payment initiated.',
      payment_id: result.rows[0]?.id,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/services/webhook ─────────────────────────────────────────────
// Razorpay / Stripe webhook listener
router.post('/webhook', async (req, res) => {
  try {
    // In production, signature verification happens here
    const { event, payload } = req.body;
    
    // Abstracted payload parsing (compatible with Stripe/Razorpay mock structure)
    const payment = payload?.payment?.entity || req.body;
    const payment_id = payment.id;
    const user_id = payment.notes?.user_id || payment.user_id;

    if (event === 'payment.captured' || event === 'payment_intent.succeeded') {
      
      // Fetch the pending payment record
      const dbPayment = await db.query(`SELECT * FROM Payments WHERE user_id = ? AND status = 'PENDING' ORDER BY id DESC LIMIT 1`, [user_id]);
      const record = dbPayment.rows[0];

      if (record) {
        await processSuccessfulPayment(user_id, payment_id, record.amount, JSON.parse(record.metadata), record.id);
      }
    }
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).send('Webhook Error');
  }
});

async function processSuccessfulPayment(user_id, payment_gateway_id, amount, metadata, id) {
  // 1. Mark Payment Success
  await db.query(
    `UPDATE Payments SET status = 'SUCCESS', payment_gateway_id = ? WHERE id = ?`,
    [payment_gateway_id, id]
  );

  // 2. Clear Cart if services purchased
  if (metadata.services && metadata.services.length > 0) {
    await db.query(`DELETE FROM CartItems WHERE user_id = ?`, [user_id]);
  }

  // 3. Mark DealSubmission Listing Fee as paid
  if (metadata.listing_fee > 0) {
    // In reality, we would pass deal_id in metadata. This updates their latest approved deal.
    await db.query(
      `UPDATE DealSubmissions SET status = 'FEE_PAID' WHERE submitted_by IN (SELECT name FROM Users WHERE id = ?) AND status = 'APPROVED'`,
      [user_id]
    );
  }

  // 4. Activate Subscription
  if (metadata.subscription_plan) {
    const renewalDate = new Date();
    // Assuming monthly subscription for generic plan or Priority Access
    renewalDate.setDate(renewalDate.getDate() + 30);
    
    const existing = await db.query(`SELECT id FROM Subscriptions WHERE user_id = ?`, [user_id]);
    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE Subscriptions SET status='ACTIVE', renewal_date=?, payment_id=?, plan_name=? WHERE user_id=?`,
        [renewalDate.toISOString(), id, metadata.subscription_plan, user_id]
      );
    } else {
      let subPrice = amount; // fallback
      if (metadata.subscription_plan === 'Priority Access') subPrice = 25000;
      await db.query(
        `INSERT INTO Subscriptions (user_id, plan_name, price, currency, status, renewal_date, payment_id)
         VALUES (?,?,?,?,?,?,?)`,
        [user_id, metadata.subscription_plan, subPrice, 'INR', 'ACTIVE', renewalDate.toISOString(), id]
      );
    }
  }
}

// ─── GET /api/services/subscription ──────────────────────────────────────────
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM Subscriptions WHERE user_id = ?`, [req.user.id]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ─── POST /api/services/subscribe ────────────────────────────────────────────
// Subscribe to Priority Access plan (₹25,000/month) - Legacy hook, now routes to unified wrapper internally
router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { payment_gateway_id } = req.body;

    const metadata = { subscription_plan: 'Priority Access', services: [], listing_fee: 0 };

    // Create payment record
    const payResult = await db.query(
      `INSERT INTO Payments (user_id, amount, currency, status, payment_gateway_id, payment_type, metadata)
       VALUES (?,?,?,?,?,?,?)`,
      [req.user.id, 25000, 'INR',
       payment_gateway_id ? 'SUCCESS' : 'PENDING',
       payment_gateway_id || null,
       'SUBSCRIPTION',
       JSON.stringify(metadata)]
    );
    const paymentId = payResult.rows[0]?.id;

    if (payment_gateway_id) {
       await processSuccessfulPayment(req.user.id, payment_gateway_id, 25000, metadata, paymentId);
    }

    res.json({ message: 'Subscription request logged. Processing...' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
