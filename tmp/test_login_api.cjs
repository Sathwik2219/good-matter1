const http = require('http');

const data = JSON.stringify({
  email: 'admin@goodmatter.in',
  password: 'adminpassword123'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      if (res.statusCode === 200 && parsed.token && parsed.user.role === 'ADMIN') {
        console.log('--- TEST PASSED: Admin login successful ---');
      } else {
        console.log('--- TEST FAILED: Admin login failed ---');
      }
    } catch (e) {
      console.log('--- TEST FAILED: Invalid JSON response ---');
    }
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error);
  process.exit(1);
});

req.write(data);
req.end();
