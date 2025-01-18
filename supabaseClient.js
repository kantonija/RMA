import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://asbzriuwaegdklyuiesd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzYnpyaXV3YWVnZGtseXVpZXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTk3OTgsImV4cCI6MjA1Mjc3NTc5OH0.gZIQN-SQKSwma75tfGcUr3OevLQjd4fiWKL_orlOuqE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
