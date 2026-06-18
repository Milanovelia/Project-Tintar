import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
// For server-side operations like deleting/uploading, we use the service role key
// It bypasses Row Level Security. Ensure it's not exposed to the client.
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is missing. Storage functions will fail.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
