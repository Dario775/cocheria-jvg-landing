import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pbrivnpozzqjyskfimje.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBicml2bnBvenpxanlza2ZpbWplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxNzk0NjEsImV4cCI6MjEwNDc1NTQ2MX0.lJ1C8QhVDYDjZp6hz-cKNAd2A2zgAjaz5WIp82-5jX8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
