import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const sbContent = fs.readFileSync('src/supabaseClient.js', 'utf8');
const urlMatch = sbContent.match(/createClient\(([^,]+),\s*([^)]+)\)/);
if (!urlMatch) { console.log('Could not parse supabaseClient.js'); process.exit(1); }

let supabaseUrl = urlMatch[1].replace(/['"`]/g, '');
let supabaseKey = urlMatch[2].replace(/['"`]/g, '');

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: aData, error: aErr } = await supabase.from('appointments').select('*').limit(2);
    if (aErr) {
        console.error("Appointments fetch error:", aErr);
    } else {
        console.log("Appointments sample data:");
        console.log(JSON.stringify(aData, null, 2));
    }
}

check();
