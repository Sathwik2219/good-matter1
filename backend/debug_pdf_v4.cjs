const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('--- TESTING PDFParse with new ---');
    const filePath = path.resolve(__dirname, 'uploads/pitch-decks/deck-1773730300924-338813892.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        console.log('Calling new PDFParse(dataBuffer)...');
        const instance = new PDFParse(dataBuffer);
        // Usually these libraries return a promise or have a parse method
        console.log('Instance created, type:', typeof instance);
        console.log('Instance keys:', Object.keys(instance));
        
        // Wait, if it's a class, maybe it has a .then or we need to wait for it?
        // Let's see if it's thenable
        if (instance && typeof instance.then === 'function') {
            const data = await instance;
            console.log('Resolved data type:', typeof data);
            console.log('Text length:', data.text?.length);
        } else {
            console.log('Instance is not a promise. Checking for methods...');
        }
    } catch (err) {
        console.error('Failure:', err.message);
    }
}
test();
