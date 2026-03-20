import db from '../backend/config/db.js';
import bcrypt from 'bcryptjs';

async function verifyAdmin() {
  try {
    const result = await db.query('SELECT * FROM Users WHERE email = ?', ['admin@goodmatter.in']);
    if (result.rows.length === 0) {
      console.log('Admin user not found in database.');
      process.exit(0);
    }
    
    const user = result.rows[0];
    console.log('User found:');
    console.log('ID:', user.id);
    console.log('Name:', user.name);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Hash:', user.password_hash);
    
    const isMatch = await bcrypt.compare('adminpassword123', user.password_hash);
    console.log('Bcrypt match with "adminpassword123":', isMatch);
    
    process.exit(0);
  } catch (err) {
    console.error('Error verifying admin:', err);
    process.exit(1);
  }
}

verifyAdmin();
