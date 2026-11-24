import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Auth is enabled only after the public project settings are supplied.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
