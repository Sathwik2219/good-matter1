const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

async function runUpdate() {
  const hash = await bcrypt.hash('adminpassword123', 10);
  const email = 'admin@goodmatter.in';
  
  db.run("UPDATE Users SET password_hash = ?, email = ? WHERE role = 'ADMIN'", [hash, email], function(err) {
    if (err) {
      console.error('Update Error:', err);
    } else {
      console.log('Admin user updated successfully in root DB!');
      console.log('Email:', email);
      console.log('Hash used:', hash);
      console.log('Rows affected:', this.changes);
    }
    db.close();
  });
}

runUpdate();
