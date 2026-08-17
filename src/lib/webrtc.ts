/**
 * Retrieves the configured ICE servers list.
 * Merges public Google STUN fallbacks with custom TURN server credentials.
 */
export function getIceServers(): RTCIceServer[] {
  const stunUrl = import.meta.env.VITE_STUN_URL || 'stun:stun.l.google.com:19302';
  const turnUrl = import.meta.env.VITE_TURN_URL;
  const turnUsername = import.meta.env.VITE_TURN_USERNAME;
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

  const servers: RTCIceServer[] = [
    {
      urls: stunUrl.startsWith('stun:') ? stunUrl : `stun:${stunUrl}`,
    },
  ];

  if (turnUrl) {
    servers.push({
      urls: turnUrl.startsWith('turn:') ? turnUrl : `turn:${turnUrl}`,
      username: turnUsername,
      credential: turnCredential,
    });
  }

  return servers;
}

/**
 * Creates and returns a new RTCPeerConnection instance using the loaded config.
 */
export function createPeerConnection(): RTCPeerConnection {
  const config: RTCConfiguration = {
    iceServers: getIceServers(),
    iceCandidatePoolSize: 10,
  };
  return new RTCPeerConnection(config);
}
