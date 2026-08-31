import { publicUrl } from '../paths';

export type ProtocolIconId =
  | 'barq'
  | 'telegram'
  | 'whatsapp'
  | 'email'
  | 'x'
  | 'discord'
  | 'furaffinity'
  | 'steam'
  | 'vk'
  | 'github'
  | 'bluesky'
  | 'generic';

/**
 * Icon files live in /icons/social.
 * pixelarticons (MIT, 24×24 8-bit): barq, telegram, whatsapp, email, x, discord, github, bluesky, generic, steam (gamepad)
 * VK is a 24×24 8-bit "VK" caption on the same grid.
 * Fur Affinity uses Simple Icons (CC0) because a 12×12 grid cannot keep the dragon mark.
 */
const protocolIconFiles: Record<ProtocolIconId, string> = {
  barq: '/icons/social/barq.svg',
  telegram: '/icons/social/telegram.svg',
  whatsapp: '/icons/social/whatsapp.svg',
  email: '/icons/social/email.svg',
  x: '/icons/social/x.svg',
  discord: '/icons/social/discord.svg',
  furaffinity: '/icons/social/furaffinity.svg',
  steam: '/icons/social/steam.svg',
  vk: '/icons/social/vk.svg',
  github: '/icons/social/github.svg',
  bluesky: '/icons/social/bluesky.svg',
  generic: '/icons/social/generic.svg',
};

const normalizePlatform = (platform: string): string =>
  platform.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Map a CMS platform label onto a drawn icon. */
export const resolveProtocolIcon = (platform: string): ProtocolIconId => {
  const key = normalizePlatform(platform);
  switch (key) {
    case 'barq':
      return 'barq';
    case 'telegram':
      return 'telegram';
    case 'whatsapp':
      return 'whatsapp';
    case 'email':
    case 'mail':
      return 'email';
    case 'x':
    case 'twitter':
      return 'x';
    case 'discord':
      return 'discord';
    case 'furaffinity':
    case 'furafinity':
      return 'furaffinity';
    case 'steam':
      return 'steam';
    case 'vk':
    case 'vkontakte':
      return 'vk';
    case 'github':
      return 'github';
    case 'bluesky':
      return 'bluesky';
    default:
      return 'generic';
  }
};

export const protocolIconSrc = (platform: string): string => {
  const id = resolveProtocolIcon(platform);
  switch (id) {
    case 'barq':
      return publicUrl(protocolIconFiles.barq);
    case 'telegram':
      return publicUrl(protocolIconFiles.telegram);
    case 'whatsapp':
      return publicUrl(protocolIconFiles.whatsapp);
    case 'email':
      return publicUrl(protocolIconFiles.email);
    case 'x':
      return publicUrl(protocolIconFiles.x);
    case 'discord':
      return publicUrl(protocolIconFiles.discord);
    case 'furaffinity':
      return publicUrl(protocolIconFiles.furaffinity);
    case 'steam':
      return publicUrl(protocolIconFiles.steam);
    case 'vk':
      return publicUrl(protocolIconFiles.vk);
    case 'github':
      return publicUrl(protocolIconFiles.github);
    case 'bluesky':
      return publicUrl(protocolIconFiles.bluesky);
    case 'generic':
      return publicUrl(protocolIconFiles.generic);
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
};
