export const APP_NAME = 'AnonChat';

export const MAX_CHAT_MESSAGE_LENGTH = 500;

export const MATCH_TIMEOUT = 20000; // 20s to establish WebRTC connection before skip/timeout

export const RECENT_MATCH_TTL = 120; // 2 minutes (in seconds)

export const SOCKET_TIMEOUT = 10000;

export const VIDEO_CONSTRAINTS = {
  video: {
    width: { ideal: 640 }, // ideal 640x480 is standard for webcams to save bandwidth, but lets make it ideal 1280x720 as requested
    height: { ideal: 720 },
    frameRate: { ideal: 30, max: 30 },
    facingMode: 'user',
  },
  audio: true,
};
