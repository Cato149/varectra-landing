<script lang="ts">
  import { splitEvents } from '../../lib/content/events';
  import TuiBox from '../tui/TuiBox.svelte';
  import { messages } from '../../lib/i18n/store';

  interface EventRecord {
    title: string;
    date: string;
    type: string;
    city: string;
    summary?: string;
  }

  export let events: EventRecord[] = [];

  $: copy = $messages;

  let history: EventRecord[] = [];
  let scheduled: EventRecord[] = [];

  $: ({ history, scheduled } = splitEvents(events));

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(date));
</script>

<TuiBox title={copy.router.history} meta={copy.router.historyMeta}>
  <ol class="event-list">
    {#each history as event}
      <li class="event-row">
        <time class="event-date" datetime={event.date}>{formatDate(event.date)}</time>
        <span class="event-type" data-type={event.type}>[{event.type}]</span>
        <strong>{event.title}</strong>
        <span class="event-summary">{event.summary ? `"${event.summary}"` : ''}</span>
      </li>
    {:else}
      <li class="event-row">{copy.router.emptyHistory}</li>
    {/each}
  </ol>
</TuiBox>

<TuiBox class="scheduled" title={copy.router.scheduled} meta={copy.router.scheduledMeta}>
  <ol class="event-list">
    {#each scheduled as event}
      <li class="event-row">
        <time class="event-date" datetime={event.date}>{formatDate(event.date)}</time>
        <span class="event-type" data-type={event.type}>[{event.type}]</span>
        <span class="event-heading">
          <strong>{event.title}</strong>
          <span class="event-city">{event.city}</span>
        </span>
      </li>
    {:else}
      <li class="event-row">{copy.router.emptyQueue}</li>
    {/each}
  </ol>
</TuiBox>
