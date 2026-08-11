import { cloudSyncRequested, supabase } from '../lib/supabase.js'

export async function ensureCloudUser() {
  if (!cloudSyncRequested) return null
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session?.user) return sessionData.session.user

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) return null
    return data.user || null
  } catch {
    return null
  }
}

export async function getCloudFavorites(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('user_favorites')
    .select('place_id')
    .eq('user_id', userId)
  if (error) return []
  return (data || []).map((row) => String(row.place_id))
}

export async function setCloudFavorite(userId, placeId, enabled) {
  if (!userId) return
  if (enabled) {
    await supabase.from('user_favorites').upsert(
      { user_id: userId, place_id: Number(placeId) },
      { onConflict: 'user_id,place_id' },
    )
  } else {
    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('place_id', Number(placeId))
  }
}

export async function pushHistory(userId, placeId) {
  if (!userId) return
  await supabase.from('user_history').upsert(
    {
      user_id: userId,
      place_id: Number(placeId),
      viewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,place_id' },
  )
}
