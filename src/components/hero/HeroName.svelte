<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    BANNER_LINE_MS,
    HERO_BANNER_MQ,
    revealBannerLines,
    varectraBannerLines,
  } from '../../lib/hero/banner';

  export let name: string;

  const dispatch = createEventDispatcher<{ complete: void }>();

  let typed = '';
  let started = false;
  let finished = false;
  let desktop = false;
  let visibleLineCount = 0;
  let timers: number[] = [];

  $: shownBanner = revealBannerLines(visibleLineCount);

  const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, milliseconds);
      timers.push(id);
    });

  const clearTimers = () => {
    for (const id of timers) window.clearTimeout(id);
    timers = [];
  };

  const snapToMode = () => {
    typed = name;
    visibleLineCount = desktop ? varectraBannerLines.length : 0;
  };

  const finish = () => {
    snapToMode();
    if (finished) return;
    finished = true;
    dispatch('complete');
  };

  const play = async () => {
    if (started) return;
    started = true;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      finish();
      return;
    }

    if (desktop) {
      typed = name;
      visibleLineCount = 1;
      for (let index = 1; index < varectraBannerLines.length; index += 1) {
        await wait(BANNER_LINE_MS);
        if (finished) return;
        visibleLineCount += 1;
      }
      finish();
      return;
    }

    typed = '';
    for (const character of name) {
      await wait(78);
      if (finished) return;
      typed += character;
    }
    finish();
  };

  onMount(() => {
    const query = window.matchMedia(HERO_BANNER_MQ);
    const syncViewport = () => {
      desktop = query.matches;
      if (!started) return;
      clearTimers();
      finish();
    };
    syncViewport();
    query.addEventListener('change', syncViewport);

    const start = () => {
      void play();
    };

    if (document.body.dataset.bootComplete === 'true') {
      start();
    } else {
      window.addEventListener('varectra:boot-complete', start, { once: true });
    }

    return () => {
      query.removeEventListener('change', syncViewport);
      window.removeEventListener('varectra:boot-complete', start);
      clearTimers();
    };
  });
</script>

<span class="hero-name-typed" class:hero-name-typed--banner={desktop}>
  <span class="sr-only">{name}</span>
  {#if desktop}
    <span class="hero-name-ascii" aria-hidden="true">
      {#each shownBanner as line, index}
        <span class="hero-name-ascii__line"
          >{line}{#if index === shownBanner.length - 1}<span class="hero-cursor">█</span>{/if}</span
        >
      {/each}
    </span>
  {:else}
    <span class="hero-name-typed__text" aria-hidden="true">{typed}</span><span class="hero-cursor" aria-hidden="true">█</span>
  {/if}
</span>
