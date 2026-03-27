// uplink.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function injectData() {
  console.log('🚀 Initializing Human OS Uplink...');

// --- 1. PROCESS CAPTAIN'S LOGS (Historical Data) ---
  try {
    const fileContent = fs.readFileSync('./captains_logs_shares.json', 'utf-8');
    const logData = JSON.parse(fileContent);
    const entries = logData.entries || [];

    console.log(`🚀 Processing ${entries.length} Captain's Logs...`);

    for (const entry of entries) {
      let entryDate;

      try {
        // Attempt to parse. If it's missing or weird, fallback to now.
        entryDate = entry.timestamp ? new Date(entry.timestamp).toISOString() : new Date().toISOString();
      } catch (dateErr) {
        console.warn(`⚠️ Date fix for ${entry.id || 'unknown'}: using now.`);
        entryDate = new Date().toISOString();
      }

      const { error } = await supabase.from('captains_logs').insert({
        entry_type: 'CAPTAINS_LOG',
        entry_text: JSON.stringify(entry),
        created_at: entryDate,
        is_deleted: false,
      });

      if (error) {
        console.error(`❌ DB Error for ${entry.id || 'unknown'}:`, error.message);
      }
    }
    console.log('✅ Captains Logs injection complete.');
  } catch (err) {
    // This now only hits if the FILE itself is missing or the JSON is totally broken
    console.error('❌ CRITICAL ERROR in Captains Logs section:', err.message);
  }

  // --- 2. PROCESS HUMAN OS MANIFEST (Core Logic) ---
  try {
    const manifestData = JSON.parse(fs.readFileSync('./human_os_manifest.json', 'utf-8'));

    const { error } = await supabase.from('captains_logs').insert({
      entry_type: 'OS_MANIFEST',
      entry_text: JSON.stringify(manifestData),
      is_deleted: false,
    });

    if (error) console.error(`❌ Manifest injection failed:`, error.message);
    else console.log('✅ Human OS Manifest processed.');
  } catch (err) {
    console.warn('⚠️ Skip: human_os_manifest.json not found.');
  }

  // --- 3. PROCESS ANALOG WASTELAND (Project Data) ---
  try {
    const wastelandData = JSON.parse(fs.readFileSync('./analog_wasteland.json', 'utf-8'));

    const { error } = await supabase.from('captains_logs').insert({
      entry_type: 'ANALOG_WASTELAND',
      entry_text: JSON.stringify(wastelandData),
      is_deleted: false,
    });

    if (error) console.error(`❌ Analog Wasteland injection failed:`, error.message);
    else console.log('✅ Analog Wasteland processed.');
  } catch (err) {
    console.warn('⚠️ Skip: analog_wasteland.json not found.');
  }

  // --- 4. PROCESS SAFEHOOD PROTOCOL (Security Framework) ---
  try {
    const protocolData = JSON.parse(fs.readFileSync('./safehood_protocol.json', 'utf-8'));

    const { error } = await supabase.from('captains_logs').insert({
      entry_type: 'SAFEHOOD_PROTOCOL',
      entry_text: JSON.stringify(protocolData),
      is_deleted: false,
    });

    if (error) console.error(`❌ SAFEHOOD Protocol injection failed:`, error.message);
    else console.log('✅ SAFEHOOD Protocol processed.');
  } catch (err) {
    console.warn('⚠️ Skip: safehood_protocol.json not found.');
  }

  console.log('🏁 Uplink Complete.');
}

injectData();
