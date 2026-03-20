/**
 * Simple FIFO In-Memory Job Queue
 * Processes 1 Gemini AI job at a time with 5-second delay between jobs.
 * No Redis or external dependencies needed.
 */

const queue = [];
let isProcessing = false;

/**
 * Adds an AI analysis job to the queue.
 * @param {number} dealId
 * @param {string} filePath
 */
function enqueue(dealId, filePath) {
  queue.push({ dealId, filePath });
  console.log(`[Queue] Job enqueued — Deal #${dealId}. Queue length: ${queue.length}`);
  processQueue();
}

/**
 * Processes the next job in the queue.
 * Runs 1 job at a time. Waits 5 seconds between jobs to avoid rate limits.
 */
async function processQueue() {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;
  const job = queue.shift();
  console.log(`[Queue] Processing Deal #${job.dealId}. Remaining in queue: ${queue.length}`);

  try {
    const pitchDeckAnalyzer = require('./pitchDeckAnalyzer');
    await pitchDeckAnalyzer.analyze(job.dealId, job.filePath);
  } catch (err) {
    console.error(`[Queue] Job failed for Deal #${job.dealId}:`, err.message);
  }

  isProcessing = false;

  // Wait 5 seconds before the next job to avoid Gemini rate limits (15 RPM)
  setTimeout(processQueue, 5000);
}

module.exports = { enqueue };
