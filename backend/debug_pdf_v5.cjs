const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('--- TESTING PDFParse Depth ---');
    const filePath = path.resolve(__dirname, 'uploads/pitch-decks/deck-1773730300924-338813892.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        const instance = new PDFParse(dataBuffer);
        console.log('Instance properties:', Object.getOwnPropertyNames(instance));
        console.log('Prototype properties:', Object.getOwnPropertyNames(Object.getPrototypeOf(instance)));
        
        // Try some common names
        if (typeof instance.parse === 'function') {
            console.log('Found .parse() method');
            const result = await instance.parse();
            console.log('Parse result keys:', Object.keys(result || {}));
        }
        
        // If it's a "thenable" (promise-like)
        if (typeof instance.then === 'function') {
            console.log('Instance is thenable');
            const data = await instance;
            console.log('Resolved text length:', data.text?.length);
        }

    } catch (err) {
        console.error('Failure:', err.message);
    }
}
test();
