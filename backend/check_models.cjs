const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function list() {
  try {
    // Current SDK doesn't have a direct listModels in the main genAI object easily exposed this way
    // but we can try a dummy request or check the docs.
    // Actually, I'll just try the most common variant: gemini-1.5-flash
    console.log("Checking gemini-1.5-flash access...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const res = await model.generateContent("test");
    console.log("SUCCESS");
  } catch (e) {
    console.log("ERROR:", e.message);
  }
}
list();
