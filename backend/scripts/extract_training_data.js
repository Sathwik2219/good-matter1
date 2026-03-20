const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const TRAINING_DIR = path.join(__dirname, '..', 'training_data');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'training_dataset.json');
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("Error: GEMINI_API_KEY not found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const fileManager = new GoogleAIFileManager(API_KEY);

async function extractSignalsFromPDF(filePath) {
  let uploadedFile = null;
  const fileName = path.basename(filePath);
  
  try {
    console.log(`[Processor] Uploading ${fileName}...`);
    uploadedFile = await fileManager.uploadFile(filePath, {
      mimeType: 'application/pdf',
      displayName: fileName
    });

    let fileState = await fileManager.getFile(uploadedFile.file.name);
    while (fileState.state === 'PROCESSING') {
      process.stdout.write(".");
      await new Promise(resolve => setTimeout(resolve, 5000));
      fileState = await fileManager.getFile(uploadedFile.file.name);
    }
    console.log("\n");

    if (fileState.state === 'FAILED') {
      throw new Error(`Gemini failed to process ${fileName}`);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      You are a high-level venture capital analyst. 
      Analyze this pitch deck and extract a highly detailed profile of the startup.
      Focus on extraction of raw signals from charts, graphs, and text.

      Return ONLY a JSON object with this exact structure:
      {
        "startup_name": "string",
        "signals": {
          "team_score_potential": number (0-10),
          "market_size_raw": "string (e.g. $10B)",
          "revenue_mrr": "string (e.g. $20k or None)",
          "growth_rate": "string",
          "moat_strength": number (0-10),
          "business_model": "string",
          "tech_complexity": number (0-10)
        },
        "executive_summary": "string (2 sentences)",
        "label": "HIGH_QUALITY" 
      }
    `;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadedFile.file.mimeType,
          fileUri: uploadedFile.file.uri
        }
      },
      { text: prompt }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid JSON response');
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error(`[Error] Failed to process ${fileName}:`, error.message);
    return null;
  } finally {
    if (uploadedFile) {
      await fileManager.deleteFile(uploadedFile.file.name).catch(() => {});
    }
  }
}

async function run() {
  const files = fs.readdirSync(TRAINING_DIR).filter(f => f.toLowerCase().endsWith('.pdf'));
  console.log(`Found ${files.length} PDFs to process.`);

  const dataset = [];
  
  // Create data directory if not exists
  if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  }

  // Process sequentially to avoid aggressive rate limiting
  for (let i = 0; i < files.length; i++) {
    console.log(`\nProcessing (${i + 1}/${files.length}): ${files[i]}`);
    const filePath = path.join(TRAINING_DIR, files[i]);
    const data = await extractSignalsFromPDF(filePath);
    
    if (data) {
      dataset.push(data);
      // Save incrementally
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dataset, null, 2));
      console.log(`[Success] Data extracted for ${data.startup_name}`);
    }
    
    // Safety delay to stay under TPM/RPM limits
    console.log("Waiting 15 seconds for quota safety...");
    await new Promise(r => setTimeout(r, 15000));
  }

  console.log(`\nDONE! Final dataset saved to ${OUTPUT_FILE}`);
  console.log(`Successfully processed ${dataset.length} out of ${files.length} files.`);
}

run();
