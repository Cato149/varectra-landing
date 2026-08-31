<script lang="ts">
  import { onMount } from 'svelte';
  import { cycleIndex, routeShortcut } from '../../lib/keyboard/router';
  import ProtocolIcon from '../tui/ProtocolIcon.svelte';
  import TuiBox from '../tui/TuiBox.svelte';
  import { messages } from '../../lib/i18n/store';

  interface Protocol {
    platform: string;
    label: string;
    username?: string;
    url: string;
    symbol: string;
  }

  export let protocols: Protocol[] = [];

  $: copy = $messages;

  let focusIndex = 0;

  const openFocused = () => {
    const protocol = protocols[focusIndex];
    if (!protocol) return;
    if (protocol.url.startsWith('mailto:')) {
      window.location.href = protocol.url;
      return;
    }
    window.open(protocol.url, '_blank', 'noopener,noreferrer');
  };

  onMount(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: false,
        sectionActive: true,
      });
      switch (action) {
        case 'focus-next':
        case 'focus-previous':
          event.preventDefault();
          focusIndex = cycleIndex(focusIndex, protocols.length, action === 'focus-next' ? 1 : -1);
          return;
        case 'activate':
          event.preventDefault();
          openFocused();
          return;
        case 'next':
        case 'previous':
        case 'next-file':
        case 'previous-file':
        case 'close':
        case 'download':
        case 'order':
        case 'open-terminal':
        case 'none':
          return;
        default: {
          const _never: never = action;
          return _never;
        }
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
</script>

<TuiBox class="protocols-window" title="protocols/" meta={`${protocols.length} links`}>
  <ul class="protocol-links">
    {#each protocols as protocol, protocolIndex}
      <li class="protocol-link" class:focused={focusIndex === protocolIndex}>
        <span class="protocol-link__icon" aria-hidden="true">
          <ProtocolIcon platform={protocol.platform} />
        </span>
        <strong>{protocol.platform.toLowerCase().replace(/\s+/g, '')}.link</strong>
        <span class="protocol-link__meta">{protocol.label}{protocol.username ? ` :: ${protocol.username}` : ''}</span>
        <a
          href={protocol.url}
          target={protocol.url.startsWith('mailto:') ? undefined : '_blank'}
          rel="me noreferrer"
        >
          {copy.protocols.connect} {protocol.symbol}
          <span class="sr-only">{copy.protocols.opens} {protocol.platform}</span>
        </a>
      </li>
    {/each}
  </ul>
</TuiBox>
