<script lang="ts">
  import { onMount } from 'svelte';
  import { countHtmlText, sliceHtmlByText } from '../../lib/content/html-type';
  import { routeShortcut } from '../../lib/keyboard/router';
  import { messages } from '../../lib/i18n/store';
  import TuiBox from '../tui/TuiBox.svelte';
  import TuiButton from '../tui/TuiButton.svelte';

  interface Page {
    title: string;
    label: string;
    body: string;
  }

  export let pages: Page[] = [];
  export let active = false;

  $: copy = $messages;

  const CHAR_MS = 16;
  const CARET = '<span class="whoami-caret" aria-hidden="true">█</span>';

  let index = 0;
  let typedHtml = '';
  let runToken = 0;

  const wait = (milliseconds: number) =>
    new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  const withCaret = (html: string, visible?: number) =>
    sliceHtmlByText(html, visible ?? countHtmlText(html), CARET);

  const typeBody = async () => {
    const token = ++runToken;
    const html = pages[index]?.body ?? '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || html.length === 0) {
      typedHtml = html ? withCaret(html) : '';
      return;
    }

    const total = countHtmlText(html);
    typedHtml = '';
    for (let visible = 1; visible <= total; visible += 1) {
      if (token !== runToken) return;
      typedHtml = withCaret(html, visible);
      await wait(CHAR_MS);
    }
    if (token === runToken) typedHtml = withCaret(html);
  };

  const move = (direction: 1 | -1) => {
    index = (index + direction + pages.length) % pages.length;
    void typeBody();
  };

  onMount(() => {
    void typeBody();
    const onKeydown = (event: KeyboardEvent) => {
      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: false,
        sectionActive: active,
      });
      if (!active || (action !== 'next' && action !== 'previous')) return;
      event.preventDefault();
      move(action === 'next' ? 1 : -1);
    };
    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      runToken += 1;
    };
  });
</script>

<TuiBox
  class="whoami-window"
  title={`${copy.whoami.window} :: ${pages[index]?.title ?? ''}`}
  meta={`[${String(index + 1).padStart(2, '0')}/${String(pages.length).padStart(2, '0')}]`}
>
  <div class="whoami-content" aria-live="polite">
    <p class="eyebrow">{pages[index]?.label}</p>
    <div class="prose whoami-prose">{@html typedHtml}</div>
  </div>
  <svelte:fragment slot="bar">
    <div class="whoami-bar">
      <TuiButton on:click={() => move(-1)}>
        <span class="key">[P]</span> {copy.pager.previous}
      </TuiButton>
      <TuiButton on:click={() => move(1)}>
        <span class="key">[N]</span> {copy.pager.next}
      </TuiButton>
    </div>
  </svelte:fragment>
</TuiBox>

<style>
  :global(.whoami-window) {
    min-height: 0;
    height: 100%;
  }

  .whoami-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .whoami-bar > :last-child {
    margin-left: auto;
  }

  .whoami-content {
    min-height: 12rem;
    padding: clamp(1rem, 3vw, 2rem);
  }

  .eyebrow {
    margin-bottom: 1.2rem;
    color: var(--accent);
  }

  .whoami-prose :global(.whoami-caret) {
    color: var(--terminal-cursor);
    font-weight: 700;
    animation: hero-caret 1s steps(1, end) infinite;
  }

  @media (max-width: 520px) {
    .whoami-bar {
      gap: 0.4rem;
    }
  }
</style>
