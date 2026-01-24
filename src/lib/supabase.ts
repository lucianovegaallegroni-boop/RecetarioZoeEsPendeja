import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://fywntqkuvdmvmvzmqwob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d250cWt1dmRtdm12em1xd29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNTgxNDYsImV4cCI6MjA4NDgzNDE0Nn0.XQ2h2U-SdU3AraENCKA0Sx3UqmKWguMQazXSBapR7bc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
