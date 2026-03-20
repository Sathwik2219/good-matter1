const { extractText } = require('../backend/utils/pdfExtractor');
const path = require('path');
const fs = require('fs');

async function testExtraction() {
  const filePath = path.resolve(__dirname, '../backend/uploads/pitch-decks/deck-1773730300924-338813892.pdf');
  console.log(`[TEST] Extracting from: ${filePath}`);
  
  try {
    const text = await extractText(filePath);
    console.log(`[TEST] Extractions Successful!`);
    console.log(`[TEST] Text Length: ${text.length} characters`);
    console.log(`[TEST] First 500 characters preview:\n${text.substring(0, 500)}...`);
    
    if (text.length > 500) {
      console.log(`[TEST] SUCCESS: Text length > 500`);
    } else {
      console.log(`[TEST] WARNING: Text length <= 500`);
    }
  } catch (error) {
    console.error(`[TEST] Extraction Failed:`, error.message);
  }
}

testExtraction();
