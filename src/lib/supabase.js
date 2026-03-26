import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sbvfeovsndbrdnpfzmqg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmZlb3ZzbmRicmRucGZ6bXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTYwMDgsImV4cCI6MjA4OTc3MjAwOH0.gtbvMyTge9FKBJg9e8q6v4a3oQqK1_nluDnMujZfd50";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("ENV ERROR:", { supabaseUrl, supabaseAnonKey });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);