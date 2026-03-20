const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('--- TESTING PDFParse ---');
    const filePath = path.resolve(__dirname, 'uploads/pitch-decks/deck-1773730300924-338813892.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        console.log('Calling PDFParse(dataBuffer)...');
        // Check if it needs 'new' if it's a class
        let data;
        try {
            data = await PDFParse(dataBuffer);
        } catch (e) {
            console.log('Calling PDFParse without new failed, trying new PDFParse...');
            // If it's a class, it might have a static method or be used with new
            // But usually PDFParse(buffer) is fine if it handles it
            console.log('Error:', e.message);
        }
        
        if (!data) {
             // Maybe it's a static method? 
             // Let's check if it's a class with a parse method
             // Re-inspecting keys of pdf earlier: PDFParse was a function.
        }

        console.log('Result type:', typeof data);
        if (data) {
            console.log('Result keys:', Object.keys(data));
            console.log('Text length:', data.text?.length);
        }
    } catch (err) {
        console.error('Final failure:', err.message);
    }
}
test();
