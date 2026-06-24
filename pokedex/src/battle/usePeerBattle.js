import { useState, useEffect, useRef, useCallback } from 'react';
import Peer from 'peerjs';
import { findMatch, cancelMatchmaking } from '../lib/matchmakingService';

const PEER_CONFIG = {
  // Uses the free PeerJS cloud server (0.peerjs.com)
  // For production, replace with your own peerserver
  debug: 0,
};

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const PVP_MSG = {
  READY:       'READY',
  TEAM_SYNC:   'TEAM_SYNC',
  ACTION:      'ACTION',
  REPLACE:     'REPLACE',
  SELECT_MOVE: 'SELECT_MOVE', // legacy if needed
  SWITCH:      'SWITCH', // legacy
  FORFEIT:     'FORFEIT',
  PING:        'PING',
  PONG:        'PONG',
};

/**
 * Hook for PeerJS P2P battle connections.
 *
 * @param {function} onMessage - called with (msg) when peer sends data
 * @param {function} onConnect - called when connection established
 * @param {function} onDisconnect - called when peer disconnects
 */
export function usePeerBattle({ onMessage, onConnect, onDisconnect } = {}) {
  const [peerId, setPeerId]     = useState(null);
  const [roomId, setRoomId]     = useState(null);
  const [status, setStatus]     = useState('idle'); // idle|creating|waiting|connecting|connected|error|disconnected
  const [error, setError]       = useState(null);
  const [isHost, setIsHost]     = useState(false);

  const peerRef = useRef(null);
  const connRef = useRef(null);

  const cleanup = useCallback(() => {
    connRef.current?.close();
    peerRef.current?.destroy();
    connRef.current = null;
    peerRef.current = null;
  }, []);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const setupConnection = useCallback((conn) => {
    connRef.current = conn;

    conn.on('open', () => {
      setStatus('connected');
      onConnect?.();
    });

    conn.on('data', (data) => {
      if (data?.type === PVP_MSG.PING) {
        sendMessage({ type: PVP_MSG.PONG });
        return;
      }
      onMessage?.(data);
    });

    conn.on('close', () => {
      setStatus('disconnected');
      onDisconnect?.();
    });

    conn.on('error', (err) => {
      setError(err.message);
      setStatus('error');
    });
  }, [onMessage, onConnect, onDisconnect]);

  // ─── Create room (host) ────────────────────────────────────────────────
  const createRoom = useCallback(() => {
    cleanup();
    const id = generateRoomId();
    setRoomId(id);
    setIsHost(true);
    setStatus('creating');
    setError(null);

    const peer = new Peer(`poke-battle-${id}`, PEER_CONFIG);
    peerRef.current = peer;

    peer.on('open', (pid) => {
      setPeerId(pid);
      setStatus('waiting');
    });

    peer.on('connection', (conn) => {
      setStatus('connecting');
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      setError(err.message || 'Erro ao criar sala. Tente novamente.');
      setStatus('error');
    });
  }, [cleanup, setupConnection]);

  // ─── Join room (guest) ─────────────────────────────────────────────────
  const joinRoom = useCallback((id) => {
    cleanup();
    const targetId = `poke-battle-${id.trim().toUpperCase()}`;
    setIsHost(false);
    setStatus('connecting');
    setError(null);
    setRoomId(id.trim().toUpperCase());

    const peer = new Peer(PEER_CONFIG);
    peerRef.current = peer;

    peer.on('open', (pid) => {
      setPeerId(pid);
      const conn = peer.connect(targetId, { reliable: true });
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      const msg = err.type === 'peer-unavailable'
        ? `Sala "${id}" não encontrada. Verifique o código.`
        : err.message;
      setError(msg);
      setStatus('error');
    });
  }, [cleanup, setupConnection]);

  // ─── Send message ──────────────────────────────────────────────────────
  const sendMessage = useCallback((msg) => {
    if (connRef.current?.open) {
      connRef.current.send(msg);
    }
  }, []);

  // ─── Random Matchmaking ────────────────────────────────────────────────
  const startRandomMatchmaking = useCallback(async (mode) => {
    cleanup();
    setRoomId('Procurando...');
    setIsHost(false);
    setStatus('waiting'); // Show waiting instantly
    setError(null);

    const peer = new Peer(PEER_CONFIG);
    peerRef.current = peer;

    peer.on('open', async (pid) => {
      setPeerId(pid);
      
      // Try to find a match
      const targetId = await findMatch(pid, mode);
      if (targetId) {
        // Match found! We act as the connector.
        setStatus('connecting');
        const conn = peer.connect(targetId, { reliable: true });
        setupConnection(conn);
      } else {
        // No match found, we wait in the queue.
        setStatus('waiting');
        setIsHost(true); // Technically we are waiting for a connection now
      }
    });

    peer.on('connection', (conn) => {
      // Someone found us in the queue!
      setStatus('connecting');
      setupConnection(conn);
    });

    peer.on('error', (err) => {
      setError(err.message || 'Erro no matchmaking.');
      setStatus('error');
    });
  }, [cleanup, setupConnection]);

  // ─── Disconnect ────────────────────────────────────────────────────────
  const disconnect = useCallback(() => {
    sendMessage({ type: PVP_MSG.FORFEIT });
    if (peerId) cancelMatchmaking(peerId);
    cleanup();
    setStatus('idle');
    setRoomId(null);
    setPeerId(null);
  }, [sendMessage, cleanup, peerId]);

  return {
    peerId, roomId, status, error, isHost,
    createRoom, joinRoom, startRandomMatchmaking, sendMessage, disconnect,
  };
}
