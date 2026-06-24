/**
 * src/lib/matchService.js
 * Records match results in Supabase and updates MMR.
 *
 * MMR system: +20 for a win, -15 for a loss (provisional players gain/lose more)
 */
import { supabase } from './supabase';

const MMR_WIN  = 20;
const MMR_LOSS = 15;

/**
 * Records a completed match and adjusts MMR for both players.
 * @param {string} winnerId   - Supabase auth user ID of the winner
 * @param {string} loserId    - Supabase auth user ID of the loser (null for CPU matches)
 * @param {object} opts       - { matchType: 'ranked'|'casual'|'seasonal', turns, seasonId }
 */
export async function recordMatch(winnerId, loserId, { matchType = 'casual', turns = 0, seasonId = null } = {}) {
  if (!winnerId) return; // not logged in

  try {
    // 1. Insert match history
    await supabase.from('match_history').insert([{
      winner_id: winnerId,
      loser_id: loserId || null,
      match_type: matchType,
      season_id: seasonId,
      turns,
    }]);

    // 2. Update winner MMR (+20 wins)
    await supabase.rpc('increment_mmr', { profile_id: winnerId, delta: MMR_WIN });
    await supabase.from('profiles')
      .update({ wins: supabase.rpc('raw_increment', { x: 1 }) })
      .eq('id', winnerId);

    // 3. Update loser MMR (-15) if it's a real player
    if (loserId) {
      await supabase.rpc('increment_mmr', { profile_id: loserId, delta: -MMR_LOSS });
      await supabase.from('profiles')
        .update({ losses: supabase.rpc('raw_increment', { x: 1 }) })
        .eq('id', loserId);
    }
  } catch (err) {
    // Non-critical: don't interrupt gameplay if Supabase is unreachable
    console.warn('[matchService] Could not record match:', err.message);
  }
}

/**
 * Simpler alternative using plain SQL updates (no RPC needed).
 * Use this if you haven't set up the increment_mmr function in Supabase.
 */
export async function recordMatchSimple(winnerId, loserId, { matchType = 'casual', turns = 0, seasonId = null } = {}) {
  if (!winnerId) return;

  try {
    // Fetch current stats
    const ids = [winnerId, loserId].filter(Boolean);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, mmr, wins, losses')
      .in('id', ids);

    if (!profiles) return;

    const winnerProfile = profiles.find(p => p.id === winnerId);
    const loserProfile  = profiles.find(p => p.id === loserId);

    // Update winner
    if (winnerProfile) {
      await supabase.from('profiles').update({
        mmr:  Math.max(0, winnerProfile.mmr + MMR_WIN),
        wins: winnerProfile.wins + 1,
      }).eq('id', winnerId);
    }

    // Update loser
    if (loserProfile) {
      await supabase.from('profiles').update({
        mmr:    Math.max(0, loserProfile.mmr - MMR_LOSS),
        losses: loserProfile.losses + 1,
      }).eq('id', loserId);
    }

    // Insert history
    await supabase.from('match_history').insert([{
      winner_id: winnerId,
      loser_id:  loserId || null,
      match_type: matchType,
      season_id: seasonId,
      turns,
    }]);
  } catch (err) {
    console.warn('[matchService] Could not record match:', err.message);
  }
}
