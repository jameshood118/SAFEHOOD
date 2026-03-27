import { GenerativeModel } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { analyzeFailureAndReport, deployAgentCode, executePlaywright } from './core-io.js';
import { getQaAgent } from './system-prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛡️ THE THROTTLE PROTOCOL: Sleep utility for asynchronous cooldowns
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 🛡️ THE RETRY WRAPPER: Intercepts 429s and waits automatically
const generateWithBackoff = async (agent: GenerativeModel, prompt: string, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await agent.generateContent(prompt);
    } catch (error: unknown) {
      const err = error as { status?: number; message?: string };
      if (err.status === 429 || err?.message?.includes('429')) {
        console.log(
          `[System Audit] ⚠️ API Bouncer hit (429). Cooling down for 20 seconds (Attempt ${attempt}/${maxRetries})...`,
        );
        await sleep(20000); // Wait 20 seconds
      } else {
        throw error; // If it's a different error, fail hard
      }
    }
  }
  throw new Error('[System Error] Max retries reached. The API is locked down.');
};

export const runAgenticQA = async (taskFileName: string) => {
  const agent = getQaAgent();

  const taskPath = path.join(__dirname, '..', 'docs', 'qa-tasks', `${taskFileName}.md`);

  if (!fs.existsSync(taskPath)) {
    console.error(`[System Error] QA Task not found at: ${taskPath}`);
    process.exit(1);
  }

  const taskContent = fs.readFileSync(taskPath, 'utf-8');

  // 🚀 THE RAG INJECTION: Reading the Physical Schematic
  const templatePath = path.join(__dirname, 'golden-template.ts');
  let goldenTemplate = '';
  if (fs.existsSync(templatePath)) {
    goldenTemplate = fs.readFileSync(templatePath, 'utf-8');
    console.log(`[System Audit] 🛡️ Golden Schematic loaded. Forcing physical trace.`);
  } else {
    console.warn(
      `[System Audit] ⚠️ Golden Template missing at ${templatePath}. The Feral Agent is unconstrained!`,
    );
  }

  console.log(`[System Audit] ⚙️ Ingesting QA Task: ${taskFileName}`);

  // 🚀 THE FIX: The Reverend Silvertongue Protocol (V3 - RAG Constrained)
  const prompt = `Translate this QA Task into a robust Playwright TypeScript test.

  [CRITICAL SYSTEM PROTOCOL: THE GOLDEN SCHEMATIC]
  You are operating under STRICT SYNTAX LAWS. Your probabilistic memory is flawed and prone to syntax errors. You will trace the physical schematic provided below.

  THE LAW OF THE SCHEMATIC:
  You must perfectly map the QA Task requirements onto this exact code structure. Do not invent new Playwright syntax. Do not change how test.step() is formatted.

  === VERIFIED GOLDEN TEMPLATE ===
  ${goldenTemplate}
  ================================

  [THE REVEREND'S COMMANDMENTS]
  1. THE LAW OF THE STEP: Use the exact 'await test.step('label', async () => { ... });' structure from the template.
  2. THE HELPER FUNCTION BYPASS: You are STRICTLY FORBIDDEN from using 'test.step()' inside helper functions.
  3. THE BANISHMENT OF testInfo: Do NOT inject 'testInfo' into function signatures.
  4. THE LAW OF ESM: Use the exact '__dirname' boilerplate shown at the top of the Golden Template.

  Output ONLY valid TypeScript code that matches the Golden Template's structural integrity. Double check all closing brackets '});'. \n\n === QA TASK CONTENT === \n ${taskContent}`;

  // 🚀 Execute with the Throttle Protocol
  const result = await generateWithBackoff(agent, prompt);
  const aiGeneratedCode = result.response.text();

  // The Physical Shift: Routing to the Quarantine Silo
  const testPath = deployAgentCode(aiGeneratedCode, taskFileName);
  const execution = executePlaywright(testPath);

  if (execution.status === 'failure') {
    const screenshotDir = path.join(__dirname, '..', 'test-results');

    let foundScreenshot = '';
    if (fs.existsSync(screenshotDir)) {
      const files = fs.readdirSync(screenshotDir, {
        recursive: true,
      }) as string[];
      const pngFiles = files.filter((f) => f.endsWith('.png'));
      if (pngFiles.length > 0) {
        foundScreenshot = path.join(screenshotDir, pngFiles[0]);
      }
    }

    if (foundScreenshot) {
      await analyzeFailureAndReport(agent, taskFileName, execution.log as string, foundScreenshot);
    } else {
      console.log(
        `[System Error] Screenshot not found in ${screenshotDir}. Proceeding with text-only log.`,
      );
      // 🚀 THE FIX 2: Actually write the text-only report!
      const fallbackDir = path.join(__dirname, '..', 'docs', 'bug-reports');
      const fallbackPath = path.join(fallbackDir, `${taskFileName}-syntax-fault.md`);
      const fallbackContent = `# [SYNTAX FAULT] Feral Agent Compilation Error\n\n**System Audit:** The AI generated invalid Playwright syntax or crashed before execution. No visual evidence was captured.\n\n## Raw Black Box Log\n\`\`\`text\n${execution.log}\n\`\`\`\n`;
      fs.writeFileSync(fallbackPath, fallbackContent);
      console.log(`[Verification] 📝 Fallback Error Report saved to: ${fallbackPath}`);
    }
  } else {
    // The Quarantine Logic: Even successful runs stay quarantined for human verification
    console.log(
      `[Verification] ✅ Task executed successfully in quarantine. Run 'npm run test:quarantine' to review.`,
    );
  }
};

const targetTask = process.argv[2];
if (!targetTask) {
  console.error('Please provide a QA task filename. Example: npm run agent:qa login-flow');
  process.exit(1);
}

runAgenticQA(targetTask);
