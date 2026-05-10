import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rgtatjqxochctgjvhyuq.supabase.co';
const supabaseAnonKey = 'sb_publishable_QIGf78vFHnzpe-m9urYh9Q_3Ny-W7FB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);