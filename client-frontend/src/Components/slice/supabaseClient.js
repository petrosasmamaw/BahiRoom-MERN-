import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rodhudkgrwhfosxvtxjz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZGh1ZGtncndoZm9zeHZ0eGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzkwMTEsImV4cCI6MjA4MDM1NTAxMX0.nahOY7kMw_IwzuqAc_Sb1jThSoLnZPBvoNOo8ctwkT0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get current user
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

// Sign in
export async function signInWithEmail({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password });
}

// Sign up
export async function signUpWithEmail({ email, password }) {
  return supabase.auth.signUp({ email, password });
}

// Sign out
export async function signOut() {
  return supabase.auth.signOut();
}
