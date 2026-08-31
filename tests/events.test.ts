import { describe, expect, it } from 'vitest';
import { splitEvents } from '../src/lib/content/events';

describe('event routing', () => {
  it('splits and sorts historical and scheduled events', () => {
    const events = [
      { id: 'past-old', date: '2026-05-01' },
      { id: 'future-late', date: '2026-12-01' },
      { id: 'past-new', date: '2026-08-20' },
      { id: 'future-near', date: '2026-09-02' },
    ];

    const result = splitEvents(events, new Date('2026-08-30T12:00:00'));
    expect(result.history.map((event) => event.id)).toEqual(['past-new', 'past-old']);
    expect(result.scheduled.map((event) => event.id)).toEqual(['future-near', 'future-late']);
  });
});
