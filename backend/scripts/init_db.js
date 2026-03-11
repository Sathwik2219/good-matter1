const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createTables = async () => {
  try {
    await pool.query('BEGIN');

    // 1. Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL, -- 'ADMIN', 'INVESTOR', 'FOUNDER'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Startups Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Startups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        startup_name VARCHAR(255) NOT NULL,
        industry VARCHAR(100),
        stage VARCHAR(50),
        raise_amount DECIMAL(15, 2),
        description TEXT,
        pitch_deck_url VARCHAR(255),
        financial_model_url VARCHAR(255),
        status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Founders Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Founders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
        startup_id UUID REFERENCES Startups(id) ON DELETE CASCADE,
        role VARCHAR(100)
      );
    `);

    // 4. Investors Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Investors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES Users(id) ON DELETE CASCADE,
        investment_focus TEXT[],
        ticket_size VARCHAR(100)
      );
    `);

    // 5. Deals Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS Deals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        startup_id UUID REFERENCES Startups(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        deal_stage VARCHAR(100)
      );
    `);

    // 6. IntroductionRequests Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS IntroductionRequests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        investor_id UUID REFERENCES Investors(id) ON DELETE CASCADE,
        startup_id UUID REFERENCES Startups(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'DECLINED'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query('COMMIT');
    console.log('Database tables created successfully!');
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creating tables:', error);
  } finally {
    pool.end();
  }
};

createTables();
