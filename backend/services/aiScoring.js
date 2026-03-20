const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure .env is loaded from the backend directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

/**
 * Returns a fallback analysis result when an error occurs or API key is missing.
 * @param {string} errorMessage - The specific error message to include in the analysis.
 * @returns {Object} - A structured fallback analysis object.
 */
function returnFallback(errorMessage) {
  return {
    team_score: 10,
    market_score: 10,
    traction_score: 10,
    product_score: 8,
    competition_score: 8,
    financial_score: 5,
    total_score: 51,
    tier: 'LIMITED',
    analysis: `Automated analysis encountered an error: ${errorMessage}. This is a baseline score based on provided information. Please review manually.`
  };
}

/**
 * Analyzes startup pitch deck text using Gemini AI.
 * @param {string} text - Extracted text from pitch deck.
 * @returns {Promise<object>} - Structured analysis and score.
 */
async function analyzeStartup(text) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.length < 10) {
    console.warn('[AI] Missing or invalid GEMINI_API_KEY in .env. Using fallback scoring.');
    return returnFallback('API key missing or invalid.');
  }

  try {
    const prompt = `
      You are a venture capital expert evaluating startup pitch decks.
      Analyze the provided pitch deck text and score the startup on a scale of 0-100.
      
      Evaluate based on these categories (total score is weighted):
      - Team (20 points)
      - Market (20 points)
      - Traction (20 points)
      - Product (15 points)
      - Competition (15 points)
      - Financials (10 points)

      Return ONLY a JSON object with this structure:
      {
        "team_score": number, (out of 20)
        "market_score": number, (out of 20)
        "traction_score": number, (out of 20)
        "product_score": number, (out of 15)
        "competition_score": number, (out of 15)
        "financial_score": number, (out of 10)
        "total_score": number, (0-100)
        "tier": string, (FEATURED if >=85, STANDARD if >=70, LIMITED if >=60, REJECTED otherwise)
        "analysis": string (Concise executive summary of 3-4 sentences)
      }

      Pitch Deck Text:
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from response (sometimes Gemini wraps JSON in markdown)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format.');
    }
    
    const analysisResult = JSON.parse(jsonMatch[0]);
    return analysisResult;
  } catch (error) {
    console.error('Gemini Analysis Error:', error.message);
    // Fallback logic if Gemini fails
    return {
      team_score: 10,
      market_score: 10,
      traction_score: 10,
      product_score: 8,
      competition_score: 8,
      financial_score: 5,
      total_score: 51,
      tier: 'LIMITED',
      analysis: "Automated analysis encountered an error. This is a baseline score based on provided information. Please review manually."
    };
  }
}

module.exports = { analyzeStartup };
