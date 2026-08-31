<script lang="ts">
  import { onMount } from 'svelte';
  import {
    CHECKER_STEP_MS,
    nextCheckerPhase,
    type CheckerPhase,
  } from '../../lib/media/checker';

  export let src: string;
  export let alt: string;
  export let width: number;
  export let height: number;
  export let fit: 'cover' | 'contain' = 'cover';
  export let loading: 'lazy' | 'eager' = 'lazy';
  /** Change this to replay the checkerboard pass (lightbox index, etc.). */
  export let play = '';

  let phase: CheckerPhase = 'empty';
  let picture: HTMLImageElement;
  let runId = 0;
  let mounted = false;
  let timers: number[] = [];

  const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => {
      const id = window.setTimeout(resolve, milliseconds);
      timers.push(id);
    });

  const clearTimers = () => {
    for (const id of timers) window.clearTimeout(id);
    timers = [];
  };

  const run = async () => {
    const token = ++runId;
    clearTimers();
    phase = 'empty';

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      phase = 'full';
      return;
    }

    if (picture) {
      try {
        if (!picture.complete) await picture.decode();
      } catch {
        // Decode can reject on abort; still run the tile pass.
      }
    }
    if (token !== runId) return;

    phase = nextCheckerPhase(phase);
    await wait(CHECKER_STEP_MS);
    if (token !== runId) return;
    phase = nextCheckerPhase(phase);
  };

  $: replayKey = `${src}:${play}`;
  $: if (mounted && replayKey) {
    void run();
  }

  onMount(() => {
    mounted = true;
    return () => {
      mounted = false;
      runId += 1;
      clearTimers();
    };
  });
</script>

<div class="checker-image" data-phase={phase} data-fit={fit}>
  <img
    bind:this={picture}
    {src}
    {alt}
    {width}
    {height}
    {loading}
    decoding="async"
  />
</div>

<style>
  .checker-image {
    --checker-cell: 10px;
    position: relative;
    display: block;
    overflow: hidden;
    background-color: var(--bg);
    background-image: repeating-conic-gradient(var(--bg) 0% 25%, var(--selection) 0% 50%);
    background-size: var(--checker-cell) var(--checker-cell);
  }

  .checker-image[data-fit='cover'] {
    aspect-ratio: 4 / 3;
  }

  .checker-image img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .checker-image[data-fit='cover'] img {
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .checker-image[data-fit='contain'] {
    height: 100%;
    min-height: 0;
  }

  .checker-image[data-fit='contain'] img {
    object-fit: contain;
  }

  .checker-image[data-phase='empty'] img {
    opacity: 0;
  }

  .checker-image[data-phase='odd'] img {
    opacity: 1;
    -webkit-mask-image: repeating-conic-gradient(#000 0% 25%, transparent 0% 50%);
    mask-image: repeating-conic-gradient(#000 0% 25%, transparent 0% 50%);
    -webkit-mask-size: var(--checker-cell) var(--checker-cell);
    mask-size: var(--checker-cell) var(--checker-cell);
  }

  .checker-image[data-phase='full'] {
    background: transparent;
  }

  .checker-image[data-phase='full'] img {
    opacity: 1;
    -webkit-mask-image: none;
    mask-image: none;
  }
</style>
