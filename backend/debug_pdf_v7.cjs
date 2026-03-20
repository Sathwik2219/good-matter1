const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('--- TESTING PDFParse Uint8Array ---');
    const filePath = path.resolve(__dirname, 'uploads/pitch-decks/deck-1773730300924-338813892.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    
    try {
        const instance = new PDFParse(uint8Array);
        
        console.log('Calling instance.load()...');
        await instance.load();

        console.log('Calling instance.getText()...');
        const sections = await instance.getText();
        
        if (Array.isArray(sections)) {
            const fullText = sections.map(s => s.text || s).join('\n');
            console.log('SUCCESS! Text length:', fullText.length);
            console.log('Preview:', fullText.substring(0, 100));
        } else {
            console.log('Result:', sections);
        }

    } catch (err) {
        console.error('Failure:', err.message);
    }
}
test();
