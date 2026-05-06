import { supabase } from './supabaseClient'

export async function signUpWithEmail({ email, password, firstName, lastName, username }) {
  return supabase.auth.signUp({
    email, password,
    options: {
      data: { first_name: firstName, last_name: lastName, username },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}

export async function signInWithEmail({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}
