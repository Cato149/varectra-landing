<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { cycleIndex, routeShortcut } from '../../lib/keyboard/router';
  import CheckerImage from '../media/CheckerImage.svelte';
  import TuiBox from '../tui/TuiBox.svelte';
  import TuiButton from '../tui/TuiButton.svelte';
  import { messages } from '../../lib/i18n/store';
  import { publicUrl } from '../../lib/paths';

  interface GalleryItem {
    image: string;
    alt: string;
    caption?: string;
    date?: string;
    category?: string;
    width: number;
    height: number;
  }

  export let items: GalleryItem[] = [];

  $: copy = $messages;

  let open = false;
  let index = 0;
  let focusIndex = 0;
  let desktop = true;
  let dialog: HTMLElement;
  let returnFocus: HTMLElement | null = null;

  const show = async (itemIndex: number, trigger: HTMLElement) => {
    index = itemIndex;
    returnFocus = trigger;
    open = true;
    await tick();
    dialog?.focus();
  };

  const close = () => {
    open = false;
    returnFocus?.focus();
  };

  const move = (direction: 1 | -1) => {
    index = (index + direction + items.length) % items.length;
  };

  const download = () => {
    const item = items[index];
    if (!item) return;
    const filename = item.image.split('/').filter(Boolean).at(-1) ?? 'varectra-image';
    const link = document.createElement('a');
    link.href = publicUrl(item.image);
    link.download = filename;
    link.rel = 'noopener';
    document.body.append(link);
    link.click();
    link.remove();
  };

  const handleAction = (action: ReturnType<typeof routeShortcut>) => {
    switch (action) {
      case 'next':
        move(1);
        return;
      case 'previous':
        move(-1);
        return;
      case 'close':
        close();
        return;
      case 'download':
        download();
        return;
      case 'focus-next':
        if (open) move(1);
        else focusIndex = cycleIndex(focusIndex, items.length, 1);
        return;
      case 'focus-previous':
        if (open) move(-1);
        else focusIndex = cycleIndex(focusIndex, items.length, -1);
        return;
      case 'activate':
        if (!open) {
          const trigger = document.querySelector<HTMLElement>('.gallery-item.focused');
          void show(focusIndex, trigger ?? document.body);
        }
        return;
      case 'order':
      case 'next-file':
      case 'previous-file':
      case 'open-terminal':
      case 'none':
        return;
      default: {
        const _never: never = action;
        return _never;
      }
    }
  };

  onMount(() => {
    const compactQuery = window.matchMedia('(max-width: 760px)');
    const syncChrome = () => {
      desktop = !compactQuery.matches;
    };
    syncChrome();
    compactQuery.addEventListener('change', syncChrome);

    const onKeydown = (event: KeyboardEvent) => {
      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: open,
        sectionActive: true,
      });
      if (open && (action === 'none' || action === 'open-terminal') && event.key === 'Tab') {
        const focusable = [...dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
        return;
      }
      if (action === 'none' || action === 'open-terminal') return;
      if (!open && action !== 'focus-next' && action !== 'focus-previous' && action !== 'activate') {
        return;
      }
      event.preventDefault();
      handleAction(action);
    };
    window.addEventListener('keydown', onKeydown);
    return () => {
      compactQuery.removeEventListener('change', syncChrome);
      window.removeEventListener('keydown', onKeydown);
    };
  });
</script>

<div class="gallery-shell" class:is-open={open}>
  {#if !open}
    <div class="gallery-grid">
      {#each items as item, itemIndex}
        <button
          class="gallery-item"
          class:focused={focusIndex === itemIndex}
          type="button"
          aria-label={`${copy.gallery.open} ${item.alt}`}
          on:click={(event) => show(itemIndex, event.currentTarget)}
        >
          <TuiBox title={item.caption ?? item.alt} meta={item.category ?? 'media'}>
            <CheckerImage
              src={publicUrl(item.image)}
              alt={item.alt}
              width={item.width}
              height={item.height}
              fit="cover"
            />
            {#if item.date}
              <span class="gallery-meta"><small>{item.date}</small></span>
            {/if}
          </TuiBox>
        </button>
      {/each}
    </div>
  {:else}
    <div
      class="gallery-viewer"
      class:gallery-viewer--embed={desktop}
      class:gallery-viewer--overlay={!desktop}
      role="dialog"
      aria-modal="true"
      aria-label={`${copy.gallery.item} ${index + 1} of ${items.length}`}
      tabindex="-1"
      bind:this={dialog}
      on:click={(event) => !desktop && event.target === event.currentTarget && close()}
    >
      <TuiBox
        title={`STATIC/${items[index]?.category ?? 'media'}`}
        meta={`[${String(index + 1).padStart(2, '0')}/${String(items.length).padStart(2, '0')}]`}
      >
        <CheckerImage
          src={publicUrl(items[index]?.image ?? '')}
          alt={items[index]?.alt ?? ''}
          width={items[index]?.width ?? 0}
          height={items[index]?.height ?? 0}
          fit="contain"
          loading="eager"
          play={String(index)}
        />
        <svelte:fragment slot="bar">
          <div class="lightbox-bar">
            <TuiButton on:click={() => move(-1)}><span class="key">[P]</span> {copy.pager.previous}</TuiButton>
            <span>{items[index]?.caption}</span>
            <TuiButton on:click={() => move(1)}><span class="key">[N]</span> {copy.pager.next}</TuiButton>
            <TuiButton on:click={download}><span class="key">[D]</span> {copy.pager.download}</TuiButton>
            <TuiButton on:click={close}><span class="key">[Q]</span> {copy.pager.close}</TuiButton>
          </div>
        </svelte:fragment>
      </TuiBox>
    </div>
  {/if}
</div>

<style>
  .gallery-shell {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
  }

  .gallery-shell.is-open {
    flex: 1 1 0;
    height: 100%;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
  }

  .gallery-item {
    grid-column: span 4;
    padding: 0;
    overflow: hidden;
    color: var(--fg);
    text-align: left;
  }

  .gallery-item.focused {
    outline: 1px dotted var(--accent);
    outline-offset: 2px;
  }

  .gallery-item:nth-child(3n + 2) {
    transform: none;
  }

  .gallery-meta {
    display: grid;
    gap: 0.25rem;
    padding: 0.8rem;
  }

  .gallery-meta small {
    color: var(--fg-muted);
  }

  .gallery-viewer--embed {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    min-height: 0;
    height: 100%;
  }

  .gallery-viewer--embed :global(.tui-box) {
    flex: 1 1 0;
    height: 100%;
    min-height: 0;
  }

  .gallery-viewer--embed :global(.tui-box__mid--main) {
    flex: 1 1 0;
    overflow: hidden;
  }

  .gallery-viewer--embed :global(.tui-box__mid--main > .tui-box__slot) {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .gallery-viewer--embed :global(.checker-image) {
    flex: 1 1 0;
    min-height: 0;
  }

  .gallery-viewer--overlay {
    position: fixed;
    z-index: 950;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: transparent;
  }

  .gallery-viewer--overlay :global(.tui-box) {
    width: min(100%, 68rem);
    max-width: 100%;
    max-height: calc(100dvh - 2rem);
    overflow: auto;
  }

  .gallery-viewer--overlay :global(.checker-image) {
    max-height: min(48vh, 22rem);
  }

  .lightbox-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .lightbox-bar span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  @media (max-width: 760px) {
    .gallery-item {
      grid-column: span 6;
    }

    .gallery-item:nth-child(3n + 2) {
      transform: none;
    }

    .gallery-viewer--overlay {
      padding: 0.45rem;
    }

    .gallery-viewer--overlay :global(.tui-box) {
      max-height: calc(100dvh - 0.9rem);
    }
  }

  @media (max-width: 460px) {
    .gallery-item {
      grid-column: 1 / -1;
    }
  }
</style>
