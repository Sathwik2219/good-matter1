const pdf = require('pdf-parse');
console.log('--- DEBUG PDF-PARSE ---');
console.log('Type of pdf:', typeof pdf);
console.log('Keys of pdf:', Object.keys(pdf || {}));
if (typeof pdf === 'function') {
    console.log('SUCCESS: pdf is a function');
} else {
    for (const key in pdf) {
        console.log(`Key: ${key}, Type: ${typeof pdf[key]}`);
    }
}
console.log('--- END DEBUG ---');
