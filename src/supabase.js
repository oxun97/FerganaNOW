import { createClient } from '@supabase/supabase-js'

const fallbackUrl = 'https://xqpfrmsounqbhyiwutrg.supabase.co'
const fallbackPublishableKey = 'sb_publishable_EJJHgxc1TMuGn2b45iU9mA_o-pm1Box'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || fallbackPublishableKey

export const supabase = createClient(supabaseUrl, supabaseKey)
