const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('./database.sqlite');

async function resetAdmin() {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);
    
    db.run("UPDATE Users SET password_hash = ? WHERE email = 'admin@goodmatter.com'", [hash], function(err) {
        if (err) console.error(err);
        else console.log("Admin password reset successfully to: admin123");
        db.close();
    });
}

resetAdmin();
