<script lang="ts">
  import { onMount } from 'svelte';
  import { initLocale, locale, messages, setLocale } from '../../lib/i18n/store';
  import { localeIds, localeLabels } from '../../lib/i18n/locales';
  import { resolveSectionId, sectionFiles } from '../../lib/sections/files';
  import TuiBox from '../tui/TuiBox.svelte';

  let open = false;
  let currentId = 'home';
  let navElement: HTMLElement;

  $: m = $messages;
  $: links = sectionFiles.map((file) => ({
    href: `#${file.id}`,
    id: file.id,
    label: m.nav[file.menuKey],
  }));
  $: currentLabel = links.find((link) => link.id === currentId)?.label ?? m.nav.home;

  const close = () => {
    open = false;
  };

  onMount(() => {
    initLocale();
    const sync = () => {
      currentId = resolveSectionId(window.location.hash);
    };
    sync();

    const onPointerDown = (event: PointerEvent) => {
      if (!open) return;
      if (event.target instanceof Node && navElement.contains(event.target)) return;
      close();
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('hashchange', sync);
    };
  });
</script>

<nav class="site-nav" bind:this={navElement} aria-label="Primary navigation" data-open={open}>
  <TuiBox title={m.nav.menu}>
    <button
      class="site-nav__toggle"
      type="button"
      aria-expanded={open}
      aria-controls="site-nav-list"
      on:click={() => open = !open}
    >
      <span class="site-nav__current">{currentLabel}</span>
      <span class="sr-only">{m.nav.toggle}</span>
      <span aria-hidden="true">{open ? '[-]' : '[+]'}</span>
    </button>
    <div class="locale-switch" role="group" aria-label={m.nav.locale}>
      {#each localeIds as id}
        <button
          class="locale-switch__option"
          type="button"
          aria-pressed={$locale === id}
          data-active={$locale === id}
          on:click={() => setLocale(id)}
        >
          {localeLabels[id]}
        </button>
      {/each}
    </div>
    <ul id="site-nav-list" class="site-nav__list">
      {#each links as link}
        <li>
          <a
            href={link.href}
            aria-current={currentId === link.id ? 'page' : undefined}
            on:click={close}
          >
            {link.label}
            {#if currentId === link.id}
              <span class="site-nav__mark" aria-hidden="true">✓</span>
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  </TuiBox>
</nav>
