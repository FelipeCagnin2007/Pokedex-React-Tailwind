import { supabase } from './supabase';

/**
 * Searches for a waiting player in the specified mode.
 * If found, claims the match and returns the opponent's peerId.
 * If not found, adds the current player to the queue and returns null.
 */
export async function findMatch(peerId, mode = 'normal') {
  if (!supabase) return null;

  try {
    // 1. Try to find a waiting player (excluding ourselves just in case)
    const { data: waitingPlayers, error: fetchError } = await supabase
      .from('matchmaking')
      .select('*')
      .eq('status', 'waiting')
      .eq('mode', mode)
      .neq('peer_id', peerId)
      .order('created_at', { ascending: true })
      .limit(1);

    if (fetchError) throw fetchError;

    if (waitingPlayers && waitingPlayers.length > 0) {
      const match = waitingPlayers[0];

      // 2. Try to claim the match (Atomic update using equal id and waiting status)
      const { data: claimedMatch, error: claimError } = await supabase
        .from('matchmaking')
        .update({ status: 'matched' })
        .eq('id', match.id)
        .eq('status', 'waiting')
        .select()
        .single();

      // If we successfully claimed it
      if (!claimError && claimedMatch) {
        return claimedMatch.peer_id; // We connect to this opponent!
      }
      // If someone else claimed it first, we fall through and add ourselves
    }

    // 3. No match found, add ourselves to the queue
    const { error: insertError } = await supabase
      .from('matchmaking')
      .insert([{ peer_id: peerId, mode, status: 'waiting' }]);

    if (insertError) throw insertError;
    return null; // Waiting for someone to connect to us
  } catch (error) {
    console.error('Error finding match:', error);
    return null;
  }
}

/**
 * Removes the player from the queue.
 */
export async function cancelMatchmaking(peerId) {
  if (!supabase) return;
  try {
    await supabase
      .from('matchmaking')
      .delete()
      .eq('peer_id', peerId);
  } catch (error) {
    console.error('Error cancelling matchmaking:', error);
  }
}

/**
 * Clears old dead connections from the queue (older than 5 minutes)
 */
export async function cleanupMatchmaking() {
  if (!supabase) return;
  try {
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    await supabase
      .from('matchmaking')
      .delete()
      .lt('created_at', fiveMinsAgo);
  } catch (err) {
    // ignore
  }
}
