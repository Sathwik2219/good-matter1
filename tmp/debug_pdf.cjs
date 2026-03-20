const pdf = require('pdf-parse');
console.log('Type of pdf:', typeof pdf);
console.log('PDF keys:', Object.keys(pdf || {}));
if (typeof pdf === 'function') {
  console.log('pdf is a function');
} else if (pdf && typeof pdf.default === 'function') {
  console.log('pdf.default is a function');
} else {
  console.log('Neither is a function');
}
