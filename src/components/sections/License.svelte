<script lang="ts">
  import { onMount } from 'svelte';
  import { cycleIndex, routeShortcut } from '../../lib/keyboard/router';
  import { licenseArt, licenseArtMetrics } from '../../lib/license/art';
  import { messages } from '../../lib/i18n/store';
  import TuiBox from '../tui/TuiBox.svelte';

  const year = 2026;
  const links = [
    { href: 'https://beerwolf.site', label: 'beerwolf.site', noteKey: 'personalSignal' as const },
    { href: 'https://shop.beerwolf.site', label: 'shop.beerwolf.site', noteKey: 'commissions' as const },
  ];

  $: copy = $messages;

  let focusIndex = 0;

  const openFocused = () => {
    const link = links[focusIndex];
    if (!link) return;
    window.open(link.href, '_blank', 'noopener,noreferrer');
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
          focusIndex = cycleIndex(focusIndex, links.length, action === 'focus-next' ? 1 : -1);
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

<TuiBox class="license-window" title="LICENSE" meta={String(year)}>
  <div class="license">
    <div class="license__copy">
      <p class="license__copyright">Copyright (c) {year} Apollinariy / Beerwolf</p>
      <p>{copy.license.bio}</p>
      <ul class="license__links">
        {#each links as link, index}
          <li class:focused={focusIndex === index}>
            <span aria-hidden="true">{index === links.length - 1 ? '└' : '├'}</span>
            <a href={link.href} target="_blank" rel="me noreferrer">{link.label}</a>
            <span class="license__note">:: {copy.license[link.noteKey]}</span>
          </li>
        {/each}
      </ul>
      <p class="license__sign">{copy.license.sign}</p>
    </div>
    <pre
      class="license__art"
      style={`--ascii-cols: ${licenseArtMetrics.cols}; --ascii-rows: ${licenseArtMetrics.rows}`}
      aria-hidden="true"
    >{licenseArt}</pre>
  </div>
</TuiBox>

<style>
  :global(.license-window) {
    min-height: 0;
    height: 100%;
  }

  .license {
    display: grid;
    grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
    gap: 1.25rem 1.5rem;
    align-items: start;
    min-width: 0;
    padding: clamp(0.75rem, 2vw, 1.25rem);
  }

  .license__copy {
    display: grid;
    gap: 1rem;
    min-width: 0;
  }

  .license__copy p,
  .license__links {
    margin: 0;
  }

  .license__copyright,
  .license__sign {
    color: var(--accent);
  }

  .license__sign {
    margin-top: 0.25rem;
  }

  .license__links {
    display: grid;
    gap: 0.35rem;
    padding: 0;
    list-style: none;
  }

  .license__links li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    min-width: 0;
  }

  .license__links a {
    color: var(--fg);
    overflow-wrap: anywhere;
  }

  .license__links a:hover,
  .license__links a:focus-visible,
  .license__links li.focused a {
    color: var(--accent-secondary);
  }

  .license__note {
    color: var(--fg-muted);
  }

  .license__art {
    margin: 0;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    color: var(--accent);
    font-size: min(
      calc((min(46vw, 640px) - 1rem) / (var(--ascii-cols) * 0.62)),
      calc(70vh / (var(--ascii-rows) * 1.05))
    );
    line-height: 1.05;
    letter-spacing: 0;
    white-space: pre;
    user-select: none;
  }

  @media (max-width: 900px) {
    .license {
      grid-template-columns: minmax(0, 1fr);
    }

    .license__art {
      order: -1;
      font-size: min(
        calc((100vw - 3rem) / (var(--ascii-cols) * 0.62)),
        calc(42vh / (var(--ascii-rows) * 1.05))
      );
    }
  }
</style>
