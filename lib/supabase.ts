// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your_supabase_url_here';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your_supabase_anon_key_here';

// Kontrollera om vi har riktiga Supabase-credentials
const hasSupabaseCredentials = !supabaseUrl.includes('your_') && !supabaseAnonKey.includes('your_');

export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Types for database tables
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  place_address: string;
  created_at: string;
}

// Authentication functions
export async function signUp(email: string, password: string, fullName?: string) {
  if (!supabase) {
    throw new Error('Supabase inte konfigurerat. Kontrollera API-nycklar.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase inte konfigurerat. Kontrollera API-nycklar.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Favorites functions
export async function addToFavorites(placeId: string, placeName: string, placeAddress: string) {
  if (!supabase) {
    // Fallback: använd localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorite = {
      id: `local_${Date.now()}`,
      place_id: placeId,
      place_name: placeName,
      place_address: placeAddress,
      created_at: new Date().toISOString()
    };
    favorites.push(newFavorite);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return newFavorite;
  }

  const user = await getCurrentUser();
  if (!user) throw new Error('Du måste vara inloggad för att spara favoriter');

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      place_id: placeId,
      place_name: placeName,
      place_address: placeAddress,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeFromFavorites(placeId: string) {
  if (!supabase) {
    // Fallback: använd localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const filtered = favorites.filter((fav: any) => fav.place_id !== placeId);
    localStorage.setItem('favorites', JSON.stringify(filtered));
    return;
  }

  const user = await getCurrentUser();
  if (!user) throw new Error('Du måste vara inloggad för att ta bort favoriter');

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('place_id', placeId);

  if (error) throw error;
}

export async function getFavorites(): Promise<Favorite[]> {
  if (!supabase) {
    // Fallback: använd localStorage
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function isFavorite(placeId: string): Promise<boolean> {
  if (!supabase) {
    // Fallback: använd localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some((fav: any) => fav.place_id === placeId);
  }

  const user = await getCurrentUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('place_id', placeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}

// Real-time subscription for auth changes
export function onAuthStateChange(callback: (user: any) => void) {
  if (!supabase) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}