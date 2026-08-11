import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xqpfrmsounqbhyiwutrg.supabase.co'
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_EJJHgxc1TMuGn2b45iU9mA_o-pm1Box'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export const cloudSyncRequested = import.meta.env.VITE_ENABLE_CLOUD_SYNC === 'true'
