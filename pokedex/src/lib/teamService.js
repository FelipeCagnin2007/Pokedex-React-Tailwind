import { supabase } from './supabase';
import { ITEMS } from '../data/items';

/**
 * Saves the current team to the user's profile in Supabase.
 * Requires a JSONB column named `saved_team` in the `profiles` table.
 */
export async function saveTeamToCloud(userId, team) {
  if (!userId || !team) return false;
  
  try {
    // Strip heavy data if needed, but for now we store the whole object
    // Removing currentHp since it's transient
    const cleanTeam = team.map(p => ({ ...p, currentHp: p.maxHp }));
    
    const { error } = await supabase
      .from('profiles')
      .update({ saved_team: cleanTeam })
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save team to cloud:', err);
    return false;
  }
}

/**
 * Loads the saved team from the user's profile in Supabase.
 */
export async function loadTeamFromCloud(userId) {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('saved_team')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    const team = data?.saved_team || null;
    if (team && Array.isArray(team)) {
      return team.map(poke => {
        if (poke.item && poke.item.id && ITEMS[poke.item.id]) {
          poke.item = ITEMS[poke.item.id];
        }
        return poke;
      });
    }
    return team;
  } catch (err) {
    console.error('Failed to load team from cloud:', err);
    return null;
  }
}
