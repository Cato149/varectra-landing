<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { cycleIndex, routeShortcut } from '../../lib/keyboard/router';
  import { resolveHotspotGesture } from '../../lib/sections/hotspots';
  import TuiBox from '../tui/TuiBox.svelte';
  import TuiButton from '../tui/TuiButton.svelte';
  import { messages } from '../../lib/i18n/store';
  import { publicUrl } from '../../lib/paths';

  interface Spec {
    id: string;
    title: string;
    x: number;
    y: number;
    output: string[];
    body: string;
  }

  export let specs: Spec[] = [];

  $: copy = $messages;

  const PAGE_SIZE = 7;

  let open = false;
  let index = 0;
  let page = 0;
  let preview = -1;
  let armed = -1;
  let finePointer = true;
  let visibleLines = 0;
  let reducedMotion = false;
  let interval: ReturnType<typeof setInterval> | undefined;
  let panel: HTMLElement;
  let returnFocus: HTMLElement | null = null;

  $: highlighted = armed >= 0 ? armed : preview;

  $: current = specs[index];
  $: pageCount = Math.max(1, Math.ceil(specs.length / PAGE_SIZE));
  $: pageStart = page * PAGE_SIZE;
  $: visibleSpecs = specs
    .map((spec, specIndex) => ({ spec, specIndex }))
    .slice(pageStart, pageStart + PAGE_SIZE);

  const print = () => {
    const selected = specs[index];
    if (interval) clearInterval(interval);
    visibleLines = reducedMotion ? (selected?.output.length ?? 0) : 0;
    if (!selected || reducedMotion) return;
    interval = setInterval(() => {
      visibleLines += 1;
      if (visibleLines >= selected.output.length && interval) {
        clearInterval(interval);
      }
    }, 180);
  };

  const openSpec = async (specIndex: number, trigger?: HTMLElement) => {
    index = specIndex;
    showPage(specIndex);
    returnFocus = trigger ?? document.activeElement as HTMLElement;
    open = true;
    print();
    await tick();
    panel?.focus();
  };

  const close = () => {
    open = false;
    if (interval) clearInterval(interval);
    returnFocus?.focus();
  };

  const showPage = (specIndex: number) => {
    page = Math.floor(specIndex / PAGE_SIZE);
  };

  const highlight = (specIndex: number) => {
    preview = specIndex;
    if (specIndex >= 0) showPage(specIndex);
  };

  const arm = (specIndex: number) => {
    armed = specIndex;
    preview = specIndex;
    if (specIndex >= 0) showPage(specIndex);
  };

  const activateHotspot = (specIndex: number, trigger: HTMLElement, event: MouseEvent) => {
    const keyboard = event.detail === 0;
    const gesture = resolveHotspotGesture(specIndex, armed, finePointer || keyboard);
    switch (gesture) {
      case 'open':
        void openSpec(specIndex, trigger);
        return;
      case 'highlight':
        arm(specIndex);
        return;
      default: {
        const _never: never = gesture;
        return _never;
      }
    }
  };

  const hoverHighlight = (specIndex: number) => {
    if (!finePointer) return;
    highlight(specIndex);
  };

  const clearHover = () => {
    if (!finePointer) return;
    preview = -1;
  };

  const move = (direction: 1 | -1) => {
    index = (index + direction + specs.length) % specs.length;
    showPage(index);
    print();
  };

  const movePage = (direction: 1 | -1) => {
    page = (page + direction + pageCount) % pageCount;
  };

  const showAll = () => {
    if (interval) clearInterval(interval);
    visibleLines = current?.output.length ?? 0;
  };

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const syncPointer = () => {
      finePointer = pointerQuery.matches;
    };
    syncPointer();
    pointerQuery.addEventListener('change', syncPointer);

    const onKeydown = (event: KeyboardEvent) => {
      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: open,
        sectionActive: true,
      });
      if (action === 'none' || action === 'open-terminal') return;

      if (action === 'activate') {
        event.preventDefault();
        if (open) {
          showAll();
          return;
        }
        const specIndex = highlighted >= 0 ? highlighted : 0;
        void openSpec(specIndex);
        return;
      }

      if (action === 'focus-next' || action === 'focus-previous') {
        event.preventDefault();
        const direction = action === 'focus-next' ? 1 : -1;
        if (open) {
          move(direction);
          return;
        }
        const current = highlighted >= 0 ? highlighted : 0;
        arm(cycleIndex(current, specs.length, direction));
        return;
      }

      if (action === 'next' || action === 'previous') {
        event.preventDefault();
        const direction = action === 'next' ? 1 : -1;
        if (open) move(direction);
        else movePage(direction);
        return;
      }

      if (action === 'close' && open) {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', onKeydown);
    return () => {
      pointerQuery.removeEventListener('change', syncPointer);
      window.removeEventListener('keydown', onKeydown);
      if (interval) clearInterval(interval);
    };
  });
</script>

<div class="spec-layout">
  <div class="character-map">
    {#if open && current}
      <TuiBox
        title={`${copy.techDocs.component}: ${current.title}`}
        meta={`[${String(index + 1).padStart(2, '0')}/${String(specs.length).padStart(2, '0')}]`}
      >
        <div
          class="spec-panel"
          bind:this={panel}
          tabindex="-1"
          role="region"
          aria-labelledby="spec-panel-title"
        >
          <h3 id="spec-panel-title" class="sr-only">{copy.techDocs.component}: {current.title}</h3>
          <div class="spec-output" aria-live="polite">
            {#each current.output.slice(0, visibleLines) as line}
              <div class:command-line={line.startsWith('>')}>{line}</div>
            {/each}
            {#if visibleLines < current.output.length}
              <span class="output-cursor" aria-hidden="true">_</span>
              <button class="show-all" type="button" on:click={showAll}>{copy.techDocs.showAll}</button>
            {/if}
          </div>
        </div>
        <svelte:fragment slot="bar">
          <div class="spec-bar">
            <TuiButton on:click={() => move(-1)}>
              <span class="key">[P]</span> {copy.pager.previous}
            </TuiButton>
            <TuiButton on:click={() => move(1)}>
              <span class="key">[N]</span> {copy.pager.next}
            </TuiButton>
            <TuiButton on:click={close}>
              <span class="key">[Q]</span> {copy.pager.close}
            </TuiButton>
          </div>
        </svelte:fragment>
      </TuiBox>
    {:else}
      <TuiBox title={copy.techDocs.mapTitle} meta={copy.techDocs.mapMeta}>
        <div class="map-stage">
          <img
            src={publicUrl('/images/varectra.webp')}
            width="1024"
            height="1536"
            alt="Varectra protogen technical character map"
            decoding="async"
          />
          {#each specs as spec, specIndex}
            <button
              class="hotspot"
              class:lit={highlighted === specIndex}
              style={`--x:${spec.x}%;--y:${spec.y}%`}
              type="button"
              aria-label={`${copy.techDocs.inspect} ${spec.title}`}
              on:mouseenter={() => hoverHighlight(specIndex)}
              on:mouseleave={clearHover}
              on:focus={() => hoverHighlight(specIndex)}
              on:blur={clearHover}
              on:click={(event) => activateHotspot(specIndex, event.currentTarget, event)}
            >
              <span>[+]</span>
            </button>
          {/each}
        </div>
      </TuiBox>
    {/if}
  </div>

  <aside class="spec-index" aria-label="Technical component list">
    <TuiBox
      class="spec-index-box"
      title={copy.techDocs.index}
      meta={`${String(page + 1).padStart(2, '0')}/${String(pageCount).padStart(2, '0')}`}
    >
      <ol>
        {#each visibleSpecs as { spec, specIndex }}
          <li>
            <button
              type="button"
              class:current={open && specIndex === index}
              class:lit={highlighted === specIndex}
              aria-current={open && specIndex === index ? 'true' : undefined}
              on:mouseenter={() => hoverHighlight(specIndex)}
              on:mouseleave={clearHover}
              on:focus={() => hoverHighlight(specIndex)}
              on:blur={clearHover}
              on:click={(event) => activateHotspot(specIndex, event.currentTarget, event)}
            >
              <span>{String(specIndex + 1).padStart(2, '0')}</span>
              {spec.title}
            </button>
          </li>
        {/each}
      </ol>
      <svelte:fragment slot="bar">
        <div class="spec-index-bar">
          <TuiButton on:click={() => movePage(-1)}>
            <span class="key">[P]</span> {copy.pager.previous}
          </TuiButton>
          <span>{visibleSpecs.length}/{specs.length}</span>
          <TuiButton align="end" on:click={() => movePage(1)}>
            <span class="key">[N]</span> {copy.pager.next}
          </TuiButton>
        </div>
      </svelte:fragment>
    </TuiBox>
  </aside>
</div>

<style>
  .spec-layout {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(12rem, 0.8fr);
    align-items: start;
    gap: 1rem;
    width: 100%;
  }

  .character-map,
  .spec-index {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;
  }

  :global(.spec-index-box) {
    width: 100%;
  }

  :global(.spec-index-box > .tui-box__mid--main > .tui-box__slot) {
    display: flex;
    flex-direction: column;
  }

  .map-stage {
    position: relative;
    width: min(100%, 42rem, calc(min(48vh, 28rem) * 2 / 3));
    margin-inline: auto;
    background: transparent;
  }

  .map-stage img {
    display: block;
    width: 100%;
    height: auto;
    background: transparent;
  }

  .hotspot {
    position: absolute;
    top: var(--y);
    left: var(--x);
    display: grid;
    width: 3rem;
    height: 3rem;
    place-items: center;
    color: var(--accent-secondary);
    font-weight: 700;
    transform: translate(-50%, -50%);
  }

  .hotspot span {
    padding: 0.1rem 0.2rem;
  }

  .hotspot:hover span,
  .hotspot:focus-visible span,
  .hotspot.lit span {
    color: var(--accent);
  }

  .spec-index ol {
    flex: 1 1 auto;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .spec-index ol button {
    display: grid;
    width: 100%;
    grid-template-columns: 2.5rem 1fr;
    gap: 0.7rem;
    padding: 0.9rem;
    border: 0;
    background: transparent;
    color: var(--fg);
    text-align: left;
    cursor: var(--cursor-pointer);
  }

  .spec-index ol button:hover,
  .spec-index ol button.current,
  .spec-index ol button.lit {
    color: var(--accent);
  }

  .spec-index ol button span {
    color: var(--accent-secondary);
  }

  :global(.spec-index-box .tui-box__bar) {
    width: 100%;
  }

  .spec-index-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: 0;
    gap: 0.35rem;
    color: var(--fg-muted);
    font-size: 0.78rem;
  }

  .spec-index-bar :global(.tui-button:last-of-type) {
    margin-left: auto;
  }

  .spec-panel {
    min-height: min(48vh, 28rem);
    outline: none;
  }

  .spec-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .spec-output {
    min-height: 19rem;
    padding: clamp(1rem, 4vw, 2rem);
    white-space: pre-wrap;
  }

  .spec-output > div {
    margin-bottom: 0.55rem;
  }

  .command-line {
    color: var(--accent-secondary);
  }

  .output-cursor {
    color: var(--terminal-cursor);
  }

  .show-all {
    display: block;
    margin-top: 1.5rem;
    border: 0;
    background: none;
    color: var(--fg-muted);
    cursor: var(--cursor-pointer);
  }

  @media (max-width: 800px) {
    .spec-layout {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto auto;
    }

    .character-map {
      order: 0;
    }

    .spec-index {
      display: flex;
      order: 1;
    }

    :global(.spec-index-box) {
      height: auto;
    }

    .spec-index ol button {
      padding: 0.55rem 0.35rem;
    }

    .spec-output {
      min-height: 12rem;
      padding: 0.85rem 0.55rem;
    }
  }

  @media (max-width: 520px) {
    .spec-bar :global(.tui-button) {
      flex: 1 1 0;
      width: auto;
    }
  }
</style>
