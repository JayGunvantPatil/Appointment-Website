const url = "https://fwlgqhjytzqtbwnawveu.supabase.co/rest/v1/appointments?id=eq.71057484-8eaa-426c-8ab5-3b98c34fba3c"; // generic uuid
const key = "sb_publishable_kBRbWRsJxxf7WhsiQVZ88w_tx1OM9U4";

async function run() {
    const res = await fetch(url, {
        method: 'DELETE',
        headers: { "apikey": key, "Authorization": `Bearer ${key}` }
    });
    console.log(res.status);
    console.log(await res.text());
}
run();
