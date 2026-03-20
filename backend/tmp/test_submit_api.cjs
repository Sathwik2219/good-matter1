const http = require('http');

async function testSubmit() {
  console.log("Testing Submit Deal API via native http...");
  const data = JSON.stringify({
    startup_name: "API Test Startup",
    email: "test@example.com",
    industry: "AI/SaaS",
    stage: "Seed",
    description: "Test description"
  });

  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/founder/submit-deal',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log("Response Status:", res.statusCode);
      console.log("Response Body:", body);
    });
  });

  req.on('error', (e) => console.error("Error:", e.message));
  req.write(data);
  req.end();
}
testSubmit();
