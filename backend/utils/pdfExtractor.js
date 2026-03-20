const fs = require('fs');
const { PDFParse } = require('pdf-parse');

/**
 * Extracts text from a PDF file.
 * @param {string} filePath - Path to the PDF file.
 * @returns {Promise<string>} - Extracted text.
 */
async function extractText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const uint8Array = new Uint8Array(dataBuffer);
    
    // Instantiate PDFParse (requires new for version 2.4.x)
    const instance = new PDFParse(uint8Array);
    
    // Load the document
    await instance.load();
    
    // Extract text from all pages
    const pages = await instance.getText();
    
    if (Array.isArray(pages)) {
      // Join text from all pages
      return pages.map(page => page.text || '').join('\n');
    }
    
    return typeof pages === 'string' ? pages : '';
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw new Error('Failed to extract text from pitch deck.');
  }
}

module.exports = { extractText };
