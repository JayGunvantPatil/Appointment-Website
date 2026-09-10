const url = "https://fwlgqhjytzqtbwnawveu.supabase.co/rest/v1/appointments?select=*";
const key = "sb_publishable_kBRbWRsJxxf7WhsiQVZ88w_tx1OM9U4";

async function run() {
    const res = await fetch(url, { headers: { "apikey": key, "Authorization": `Bearer ${key}` } });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
run();
