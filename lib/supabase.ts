import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

/**
 * PRO TIP: Pokud chcete, aby se vás aplikace přestala ptát na URL a Key, 
 * vyplňte své údaje přímo sem. Pak můžete smazat localStorage a setup obrazovka se už nezobrazí.
 */
const HARDCODED_URL = 'https://jfdqyahfwxrlcaonyzpr.supabase.co'; // SEM VLOŽTE VAŠE SUPABASE URL (např. https://xyz.supabase.co)
const HARDCODED_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZHF5YWhmd3hybGNhb255enByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwNTM3OTMsImV4cCI6MjA4NDYyOTc5M30.Tsziafd1Njs5cOg_1dyzueTKioqZcWteeGTuhPMPQbk'; // SEM VLOŽTE VÁŠ ANON KEY

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

const sanitizeKey = (key: string) => {
    if (!key) return '';
    return key.replace(/[^\x21-\x7E]/g, '').trim();
};

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  // 1. Try hardcoded values first (Permanent fix for the user)
  const url = HARDCODED_URL || localStorage.getItem('SP_KB_SUPABASE_URL');
  const rawKey = HARDCODED_KEY || localStorage.getItem('SP_KB_SUPABASE_KEY');

  if (url && rawKey) {
    try {
      const validUrl = new URL(url);
      const key = sanitizeKey(rawKey);
      supabaseInstance = createClient<Database>(url, key);
      return supabaseInstance;
    } catch (e) {
      console.warn("Supabase config invalid:", e);
      return null;
    }
  }
  
  return null;
};

export const isConfigured = () => {
  // If hardcoded values exist, we are configured
  if (HARDCODED_URL && HARDCODED_KEY) return true;

  const url = localStorage.getItem('SP_KB_SUPABASE_URL');
  const key = localStorage.getItem('SP_KB_SUPABASE_KEY');
  
  if (!url || !key) return false;

  try {
     const validUrl = new URL(url);
     return validUrl.protocol.startsWith('http');
  } catch {
     return false;
  }
};

export const configureSupabase = (url: string, key: string) => {
  let finalUrl = url.trim();
  const finalKey = sanitizeKey(key);
  
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
  }
  
  localStorage.setItem('SP_KB_SUPABASE_URL', finalUrl);
  localStorage.setItem('SP_KB_SUPABASE_KEY', finalKey);
  
  try {
    supabaseInstance = createClient<Database>(finalUrl, finalKey);
  } catch (e) {
    console.error("Failed to init supabase", e);
  }
};

export const resetConfiguration = () => {
    localStorage.removeItem('SP_KB_SUPABASE_URL');
    localStorage.removeItem('SP_KB_SUPABASE_KEY');
    supabaseInstance = null;
    window.location.reload();
}