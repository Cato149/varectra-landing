import animationSource from './leg-animation.txt?raw';

export const LEG_FRAME_HEIGHT = 91;
export const LEG_FRAME_WIDTH = 90;
export const LEG_FRAME_MS = 80;
export const LEG_HOLD_MS = 800;

/**
 * Split the concatenated ASCII dump into fixed-size frames.
 * The source is 90-column frames stacked vertically; the last frame may be
 * one line short and is padded so playback stays aligned.
 */
export const parseLegFrames = (raw: string): string[] => {
  const lines = raw.replace(/\r\n/g, '\n').replace(/\s+$/, '').split('\n');
  const frames: string[] = [];

  for (let offset = 0; offset < lines.length; offset += LEG_FRAME_HEIGHT) {
    const chunk = lines.slice(offset, offset + LEG_FRAME_HEIGHT);
    while (chunk.length < LEG_FRAME_HEIGHT) {
      chunk.push(' '.repeat(LEG_FRAME_WIDTH));
    }
    frames.push(chunk.join('\n'));
  }

  while (frames[0] !== undefined && frames[0].trim() === '') {
    frames.shift();
  }

  return frames;
};

export const legFrames = parseLegFrames(animationSource);
