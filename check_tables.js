import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const sbContent = fs.readFileSync('src/supabaseClient.js', 'utf8');
const urlMatch = sbContent.match(/createClient\(([^,]+),\s*([^)]+)\)/);
if (!urlMatch) { console.log('Could not parse supabaseClient.js'); process.exit(1); }

let supabaseUrl = urlMatch[1].replace(/['"`]/g, '');
let supabaseKey = urlMatch[2].replace(/['"`]/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    // Check if there is a patientRecords table or patients table
    const { data: pData, error: pErr } = await supabase.from('patients').select('*').limit(1);
    console.log("Patients table:", pErr ? pErr.message : "Exists!");

    const { data: prData, error: prErr } = await supabase.from('patientRecords').select('*').limit(1);
    console.log("PatientRecords table:", prErr ? prErr.message : "Exists!");

    const { data: aData, error: aErr } = await supabase.from('appointments').select('*').limit(1);
    console.log("Appointments table:", aErr ? aErr.message : "Exists!");
}

check();
