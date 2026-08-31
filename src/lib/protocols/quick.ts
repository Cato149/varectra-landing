export type QuickContactId = 'telegram' | 'discord';
export type QuickContactKey = 't' | 'd';

export interface QuickContact {
  id: QuickContactId;
  key: QuickContactKey;
  url: string;
}

const QUICK_CONTACT_ORDER: readonly QuickContactId[] = ['telegram', 'discord'];

const QUICK_CONTACT_KEYS: Record<QuickContactId, QuickContactKey> = {
  telegram: 't',
  discord: 'd',
};

const normalizePlatform = (platform: string): string =>
  platform.toLowerCase().replace(/[^a-z0-9]/g, '');

const platformMatches = (platform: string, id: QuickContactId): boolean => {
  const key = normalizePlatform(platform);
  switch (id) {
    case 'telegram':
      return key === 'telegram';
    case 'discord':
      return key === 'discord';
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
};

/** Home-row contacts in T / D order, resolved from CMS protocol entries. */
export const pickQuickContacts = (
  protocols: Array<{ platform: string; url: string }>,
): QuickContact[] =>
  QUICK_CONTACT_ORDER.flatMap((id) => {
    const match = protocols.find((protocol) => platformMatches(protocol.platform, id));
    return match ? [{ id, key: QUICK_CONTACT_KEYS[id], url: match.url }] : [];
  });

export const quickContactLabel = (
  id: QuickContactId,
  labels: { telegram: string; discord: string },
): string => {
  switch (id) {
    case 'telegram':
      return labels.telegram;
    case 'discord':
      return labels.discord;
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
};
