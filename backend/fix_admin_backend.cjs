const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.resolve(__dirname, './database.sqlite');
const db = new sqlite3.Database(dbPath);

async function runUpdate() {
  const hash = await bcrypt.hash('adminpassword123', 10);
  const email = 'admin@goodmatter.in';
  
  // First check if table exists
  db.run("UPDATE Users SET password_hash = ?, email = ? WHERE role = 'ADMIN'", [hash, email], function(err) {
    if (err) {
      console.error('Update Error:', err);
    } else if (this.changes === 0) {
      console.log('Admin user not found in backend DB. Creating it...');
      db.run("INSERT INTO Users (name, email, password_hash, role) VALUES ('Admin', ?, ?, 'ADMIN')", [email, hash], function(err2) {
        if (err2) console.error('Insert Error:', err2);
        else console.log('Admin user created successfully in backend DB!');
        db.close();
      });
    } else {
      console.log('Admin user updated successfully in backend DB!');
      db.close();
    }
  });
}

runUpdate();
