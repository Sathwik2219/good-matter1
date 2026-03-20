const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testSubmit() {
  const form = new FormData();
  form.append('submitted_by', 'Test Founder');
  form.append('email', 'test@example.com');
  form.append('startup_name', 'Test Startup');
  form.append('industry', 'AI/SaaS');
  form.append('stage', 'Seed');
  form.append('funding_amount', '₹1Cr');
  form.append('description', 'This is a test pitch for checking validation.');
  form.append('pitch_deck_url', 'http://example.com/deck');

  try {
    const res = await axios.post('http://localhost:5001/api/founder/submit-deal', form, {
      headers: form.getHeaders(),
    });
    console.log('SUCCESS:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('FAILED:', err.response.status, err.response.data);
    } else {
      console.log('ERROR:', err.message);
    }
  }
}

testSubmit();
