<script lang="ts">
  import { onMount } from 'svelte';
  import HeroName from '../hero/HeroName.svelte';
  import TuiBox from '../tui/TuiBox.svelte';
  import TuiButton from '../tui/TuiButton.svelte';
  import Exec from '../sections/Exec.svelte';
  import Gallery from '../sections/Gallery.svelte';
  import InteractionProtocol from '../sections/InteractionProtocol.svelte';
  import License from '../sections/License.svelte';
  import Protocols from '../sections/Protocols.svelte';
  import Router from '../sections/Router.svelte';
  import TechDocs from '../sections/TechDocs.svelte';
  import Whoami from '../sections/Whoami.svelte';
  import { getKeyboardLayer, routeShortcut } from '../../lib/keyboard/router';
  import type { SiteCatalog } from '../../lib/i18n/catalog';
  import { resolveContentLocale } from '../../lib/i18n/locales';
  import { locale, messages } from '../../lib/i18n/store';
  import { pickQuickContacts, quickContactLabel } from '../../lib/protocols/quick';
  import {
    getSectionFile,
    resolveSectionId,
    shiftSectionId,
  } from '../../lib/sections/files';

  export let name: string;
  export let handle: string;
  export let telegramUrl: string;
  export let catalog: SiteCatalog;

  $: pack = catalog[resolveContentLocale($locale)];
  $: m = $messages;
  $: quickContacts = pickQuickContacts(pack.protocols);
  $: quickByKey = Object.fromEntries(quickContacts.map((contact) => [contact.key, contact.url]));
  $: if (typeof document !== 'undefined') {
    document.title = `${name} — ${m.documentTitle}`;
  }

  const HOME_LINES = 4;
  const HOME_LAG_MS = 360;
  const HOME_LINE_MS = 260;

  let currentId = 'home';
  let homeLines = 0;
  let homeTimer: ReturnType<typeof setTimeout> | undefined;
  let compactChrome = false;

  $: current = getSectionFile(currentId);
  $: if (current.id !== 'home') {
    if (homeTimer) clearTimeout(homeTimer);
    homeTimer = undefined;
    homeLines = 0;
  }

  const revealHome = () => {
    if (homeTimer) clearTimeout(homeTimer);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      homeLines = HOME_LINES;
      return;
    }

    homeLines = 0;
    const tick = () => {
      homeLines += 1;
      if (homeLines < HOME_LINES) {
        homeTimer = setTimeout(tick, HOME_LINE_MS);
      }
    };
    homeTimer = setTimeout(tick, HOME_LAG_MS);
  };

  const applyHash = () => {
    currentId = resolveSectionId(window.location.hash);
  };

  const openFile = (id: string) => {
    currentId = id;
    const nextHash = id === 'home' ? '' : `#${id}`;
    if (window.location.hash !== nextHash) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const moveFile = (direction: 1 | -1) => {
    openFile(shiftSectionId(currentId, direction));
  };

  const openQuickContact = (url: string) => {
    if (url.startsWith('mailto:')) {
      window.location.assign(url);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  onMount(() => {
    applyHash();
    const compactQuery = window.matchMedia('(max-width: 760px)');
    const syncChrome = () => {
      compactChrome = compactQuery.matches;
    };
    syncChrome();
    compactQuery.addEventListener('change', syncChrome);
    const onHashChange = () => applyHash();
    const onKeydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const context = {
        target: event.target,
        dialogOpen: Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')),
        sectionActive: true,
      };
      const action = routeShortcut(event.key, context);
      if (action === 'next-file' || action === 'previous-file') {
        event.preventDefault();
        moveFile(action === 'next-file' ? 1 : -1);
        return;
      }

      // T / M / D open home contacts only; D stays download while a dialog is open.
      const layer = getKeyboardLayer(context);
      if (currentId !== 'home' || layer === 'input' || layer === 'dialog') return;
      const url = quickByKey[event.key.toLowerCase()];
      if (!url) return;
      event.preventDefault();
      openQuickContact(url);
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('keydown', onKeydown);
    return () => {
      compactQuery.removeEventListener('change', syncChrome);
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('keydown', onKeydown);
      if (homeTimer) clearTimeout(homeTimer);
    };
  });
</script>

<section class="virtual-terminal" aria-label="Virtual terminal">
  <TuiBox
    class="virtual-terminal__box"
    title={compactChrome ? current.file : `vt ─ ${handle}:~/${current.file}`}
    meta={compactChrome ? '' : current.label}
  >
    <p class="virtual-terminal__command">{current.command}</p>
    <div class="virtual-terminal__screen" id={current.id} data-terminal-context={current.id}>
    {#if current.id === 'home'}
      <header class="system-header">
        <h1>
          <span class="hero-name-static">{name}</span>
          <HeroName {name} on:complete={revealHome} />
        </h1>
        <div class="home-after">
          <div class="home-line home-intro" class:is-on={homeLines >= 1}>
            <p class="system-lead system-lead--tagline">{pack.tagline}</p>
            {#if quickContacts.length}
              <nav class="quick-contacts" aria-label={m.home.quickContacts}>
                {#each quickContacts as contact, index}
                  {#if index > 0}<span class="quick-contacts__sep" aria-hidden="true">{' | '}</span>{/if}<a
                    class="quick-contact"
                    href={contact.url}
                    target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={contact.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  ><span class="key">[{contact.key.toUpperCase()}]</span
                    >{' '}{quickContactLabel(contact.id, {
                      telegram: m.home.quickTelegram,
                      mail: m.home.quickMail,
                      discord: m.home.quickDiscord,
                    })}</a>
                {/each}
              </nav>
            {/if}
          </div>
          <div class="home-line" class:is-on={homeLines >= 2}>
            <InteractionProtocol protocols={pack.interactions} />
          </div>
          <p class="system-lead home-line" class:is-on={homeLines >= 3}>
            {m.home.openHintBefore}<span class="key">[</span> /
            <span class="key">]</span>{m.home.openHintMid}<span class="key">/help</span>.
          </p>
          <p class="system-kicker home-line" class:is-on={homeLines >= 4}>[ EOF ] {name} / {pack.location}</p>
        </div>
      </header>
    {:else if current.id === 'whoami'}
      <Whoami pages={pack.whoami} active />
    {:else if current.id === 'tech-docs'}
      <TechDocs specs={pack.specs} />
    {:else if current.id === 'exec'}
      <Exec projects={pack.projects} {telegramUrl} />
    {:else if current.id === 'router'}
      <Router events={pack.events} />
    {:else if current.id === 'static'}
      <Gallery items={pack.gallery} />
    {:else if current.id === 'protocols'}
      <Protocols protocols={pack.protocols} />
    {:else if current.id === 'license'}
      <License />
    {/if}
    </div>
    <svelte:fragment slot="bar">
      <div class="virtual-terminal__status">
        <TuiButton on:click={() => moveFile(-1)}>
          <span class="key">[</span><span class="virtual-terminal__pager-label">{m.pager.previousFile}</span>
        </TuiButton>
        <TuiButton align="end" on:click={() => moveFile(1)}>
          <span class="virtual-terminal__pager-label">{m.pager.nextFile}</span><span class="key">]</span>
        </TuiButton>
      </div>
    </svelte:fragment>
  </TuiBox>
</section>
