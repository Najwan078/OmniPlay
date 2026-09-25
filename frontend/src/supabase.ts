import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ctrraikvfslcsqpvgto.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_fufm97nVdanX00-mq6W9UA_J8OjI0K7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
