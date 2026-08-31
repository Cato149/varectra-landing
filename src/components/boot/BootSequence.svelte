<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    getBootTimings,
    nextBootState,
    shouldAwaitStart,
    type BootState,
  } from '../../lib/boot/machine';
  import ProtogenAscii from './ProtogenAscii.svelte';
  import { initLocale, messages } from '../../lib/i18n/store';

  const bootLogs = [
    '[  0.042] kernel: initializing neural interface',
    '[  OK  ] Mounted /personality.',
    '[  OK  ] Started social-protocols.service.',
    '[  0.811] visor: controller detected at uplink0',
    '[ INFO ] character-profile: loading Varectra',
    '[  OK  ] Reached target Local Network.',
    '[ WARN ] fluff-monitor: density above nominal',
    '[  OK  ] Started varectra.service.',
  ];

  let state: BootState = 'initial';
  let visibleLogs: string[] = [];
  let greeting = '';
  let mounted = false;
  let runToken = 0;
  let logPane: HTMLElement;

  $: copy = $messages;

  const logLevel = (line: string): string => {
    if (line.includes('[  OK  ]')) return 'ok';
    if (line.includes('[ WARN ]')) return 'warn';
    if (line.includes('[ INFO ]')) return 'info';
    return 'kernel';
  };

  const wait = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const followLogs = async () => {
    await tick();
    logPane?.scrollTo({ top: logPane.scrollHeight, behavior: 'auto' });
  };

  const complete = () => {
    runToken += 1;
    state = 'complete';
    localStorage.setItem('varectra-visited', 'true');
    document.body.classList.remove('booting');
    document.body.dataset.bootComplete = 'true';
    window.dispatchEvent(new CustomEvent('varectra:boot-complete'));
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  };

  const run = async () => {
    const token = ++runToken;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deepLink = Boolean(window.location.hash);
    const returningVisitor = localStorage.getItem('varectra-visited') === 'true';
    const preferences = { reducedMotion, deepLink, returningVisitor };
    const timings = getBootTimings(preferences);

    if (deepLink) {
      complete();
      return;
    }

    while (state !== 'complete' && token === runToken) {
      await wait(timings[state]);
      if (token !== runToken) return;
      state = nextBootState(state);

      if (state === 'logs') {
        visibleLogs = [];
        const perLine = timings.logs / bootLogs.length;
        for (const line of bootLogs) {
          await wait(perLine);
          if (token !== runToken) return;
          visibleLogs = [...visibleLogs, line];
          await followLogs();
        }
        state = 'activation';
      } else if (state === 'greeting') {
        const message = copy.boot.greeting;
        if (reducedMotion || returningVisitor) {
          greeting = message;
        } else {
          for (const character of message) {
            await wait(34);
            if (token !== runToken) return;
            greeting += character;
          }
        }
      } else if (state === 'await-start') {
        if (shouldAwaitStart(preferences)) return;
      } else if (state === 'terminal-enter') {
        document.body.classList.remove('booting');
        document.body.dataset.bootComplete = 'true';
        window.dispatchEvent(new CustomEvent('varectra:boot-complete'));
      } else if (state === 'complete') {
        complete();
      }
    }
  };

  onMount(() => {
    initLocale();
    mounted = true;
    run();
    const onKeydown = (event: KeyboardEvent) => {
      if (state === 'complete') return;
      if (state === 'await-start' || event.key === 'Escape' || event.key === 'Enter') {
        event.preventDefault();
        complete();
      }
    };
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });
</script>

<section
  class="boot-screen"
  aria-label={copy.boot.aria}
  aria-hidden={state === 'complete'}
>
  <div class="boot-console">
    <p class="boot-console__prompt">varectra@home:~$ ./boot --identity</p>
    <p class="sr-only">{copy.boot.portrait}</p>

    <div class="boot-stream">
      <ProtogenAscii />

      <div class="boot-output" bind:this={logPane} aria-live="polite">
        {#each visibleLogs as line}
          <div class="boot-line" data-level={logLevel(line)}>{line}</div>
        {/each}
        {#if greeting}
          <div class="boot-line" data-level="say">&gt; {greeting}<span aria-hidden="true">_</span></div>
        {/if}
        {#if visibleLogs.length === 0}
          <div class="boot-line" data-level="kernel">[  0.000] framebuffer: mapping identity raster</div>
        {/if}
      </div>
    </div>

    {#if state === 'await-start'}
      <div class="boot-start">
        <p class="boot-start__prompt">{copy.boot.pressStart}</p>
        <button class="boot-continue" type="button" on:click={complete}>{copy.boot.continue}</button>
      </div>
    {:else if mounted}
      <button class="boot-skip" type="button" on:click={complete}>{copy.boot.skip}</button>
    {/if}
  </div>
</section>
