const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    console.log('--- TESTING PDFParse getText ---');
    const filePath = path.resolve(__dirname, 'uploads/pitch-decks/deck-1773730300924-338813892.pdf');
    const dataBuffer = fs.readFileSync(filePath);
    
    try {
        const instance = new PDFParse(dataBuffer);
        
        // Let's try load first if it exists
        if (typeof instance.load === 'function') {
            console.log('Calling instance.load()...');
            await instance.load();
        }

        if (typeof instance.getText === 'function') {
            console.log('Calling instance.getText()...');
            const sections = await instance.getText();
            console.log('Sections type:', typeof sections);
            // If it returns an object/array, we might need to join it
            if (Array.isArray(sections)) {
                console.log('Sections is array, length:', sections.length);
                const fullText = sections.map(s => s.text || s).join('\n');
                console.log('Full text length:', fullText.length);
                console.log('Preview:', fullText.substring(0, 100));
            } else if (typeof sections === 'object') {
                console.log('Sections is object. Keys:', Object.keys(sections));
                // Sometimes it has a .text property
                if (sections.text) console.log('sections.text length:', sections.text.length);
            } else {
                console.log('getText result:', sections);
            }
        }

    } catch (err) {
        console.error('Failure:', err.message);
    }
}
test();
