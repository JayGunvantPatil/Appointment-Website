import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fwlgqhjytzqtbwnawveu.supabase.co';
const supabaseKey = 'sb_publishable_kBRbWRsJxxf7WhsiQVZ88w_tx1OM9U4';

export const supabase = createClient(supabaseUrl, supabaseKey);
