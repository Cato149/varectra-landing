import { describe, expect, it } from 'vitest';
import { protocolIconSrc, resolveProtocolIcon } from '../src/lib/protocols/icons';
import { pickQuickContacts, quickContactLabel } from '../src/lib/protocols/quick';

describe('protocol icons', () => {
  it('maps the listed platforms onto dedicated marks', () => {
    expect(resolveProtocolIcon('BARQ')).toBe('barq');
    expect(resolveProtocolIcon('Telegram')).toBe('telegram');
    expect(resolveProtocolIcon('WhatsApp')).toBe('whatsapp');
    expect(resolveProtocolIcon('Email')).toBe('email');
    expect(resolveProtocolIcon('X')).toBe('x');
    expect(resolveProtocolIcon('Discord')).toBe('discord');
    expect(resolveProtocolIcon('Fur Affinity')).toBe('furaffinity');
    expect(resolveProtocolIcon('Fur Afinity')).toBe('furaffinity');
    expect(resolveProtocolIcon('Steam')).toBe('steam');
    expect(resolveProtocolIcon('VK')).toBe('vk');
    expect(resolveProtocolIcon('GitHub')).toBe('github');
    expect(resolveProtocolIcon('Bluesky')).toBe('bluesky');
  });

  it('falls back to a generic link mark', () => {
    expect(resolveProtocolIcon('UnknownNet')).toBe('generic');
    expect(protocolIconSrc('UnknownNet')).toBe('/icons/social/generic.svg');
  });

  it('points BARQ and Telegram at vendored SVG files', () => {
    expect(protocolIconSrc('BARQ')).toBe('/icons/social/barq.svg');
    expect(protocolIconSrc('Telegram')).toBe('/icons/social/telegram.svg');
  });
});

describe('quick contacts', () => {
  it('picks Telegram, mail, and Discord in T / M / D order', () => {
    expect(
      pickQuickContacts([
        { platform: 'Discord', url: 'https://discord.com/users/varectra' },
        { platform: 'GitHub', url: 'https://github.com/varectra' },
        { platform: 'Mail', url: 'mailto:varectra@example.com' },
        { platform: 'Telegram', url: 'https://t.me/varectra' },
      ]),
    ).toEqual([
      { id: 'telegram', key: 't', url: 'https://t.me/varectra' },
      { id: 'email', key: 'm', url: 'mailto:varectra@example.com' },
      { id: 'discord', key: 'd', url: 'https://discord.com/users/varectra' },
    ]);
  });

  it('skips a contact when that protocol is missing', () => {
    expect(pickQuickContacts([{ platform: 'Telegram', url: 'https://t.me/varectra' }])).toEqual([
      { id: 'telegram', key: 't', url: 'https://t.me/varectra' },
    ]);
  });

  it('maps localized labels for the three home chips', () => {
    const labels = { telegram: 'Telegram', mail: 'Почта', discord: 'Discord' };
    expect(quickContactLabel('telegram', labels)).toBe('Telegram');
    expect(quickContactLabel('email', labels)).toBe('Почта');
    expect(quickContactLabel('discord', labels)).toBe('Discord');
  });
});
