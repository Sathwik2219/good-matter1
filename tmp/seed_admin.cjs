const bcrypt = require('bcryptjs');
const db = require('./backend/config/db');

async function seedAdmin() {
  const name = 'Admin';
  const email = 'admin@goodmatter.in';
  const password = 'adminpassword123';
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const existing = await db.query('SELECT * FROM Users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }
    
    await db.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, email, password_hash, 'ADMIN']
    );
    
    console.log('Admin account created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
