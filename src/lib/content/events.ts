export interface DatedEvent {
  date: Date | string;
}

export const splitEvents = <T extends DatedEvent>(
  events: T[],
  now = new Date(),
): { history: T[]; scheduled: T[] } => {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const history = events
    .filter((event) => new Date(event.date) < startOfToday)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  const scheduled = events
    .filter((event) => new Date(event.date) >= startOfToday)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return { history, scheduled };
};
