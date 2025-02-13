
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://flqsrmsxfskxxetioahe.supabase.co';
let supabase = null;

function getClient(){
    if( supabase ) return supabase;
    supabase = createClient(supabaseUrl, process.env.SUPABASE_KEY);
    return supabase;
}

export default getClient;