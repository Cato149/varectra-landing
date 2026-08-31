<script lang="ts">
  import { onMount } from 'svelte';
  import { desktopSectionHint, promptPlaceholder, resolveSectionId } from '../../lib/sections/files';
  import {
    executeCommand,
    getCommandSuggestions,
  } from '../../lib/terminal/registry';
  import {
    LEG_FRAME_HEIGHT,
    LEG_FRAME_MS,
    LEG_FRAME_WIDTH,
    LEG_HOLD_MS,
    legFrames,
  } from '../../lib/terminal/leg-animation';
  import { currentLocale, initLocale, messages, setLocale } from '../../lib/i18n/store';
  import { routeShortcut } from '../../lib/keyboard/router';
  import {
    persistTheme,
    readStoredTheme,
    themeLabels,
    type ThemeName,
  } from '../../lib/themes';
  import TuiBox from '../tui/TuiBox.svelte';

  let input = '';
  let output = '';
  let focused = false;
  let ready = false;
  let history: string[] = [];
  let historyIndex = 0;
  let currentSection = 'home';
  let currentTheme: ThemeName = 'default';
  let legActive = false;
  let legFrame = '';
  let legTimer: ReturnType<typeof setTimeout> | undefined;
  let legRaf = 0;
  let inputElement: HTMLInputElement;
  let overlayElement: HTMLDivElement;
  let suggestionsOpenedAt = 0;
  let returnFocus: HTMLElement | null = null;
  let scrollPosition = 0;
  let compactChrome = false;

  $: suggestions = getCommandSuggestions(input);
  $: copy = $messages;

  const setTheme = (theme: ThemeName) => {
    currentTheme = theme;
    document.documentElement.dataset.theme = theme;
    persistTheme(theme, localStorage);
  };

  const navigate = (section: string) => {
    const id = section === 'connect' ? 'home' : section;
    if (id === 'home') {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      window.location.hash = id;
    }
    output = `${copy.terminal.navigationComplete}: ~/${id}`;
  };

  const stopLeg = () => {
    if (!legActive) return;
    if (legTimer) clearTimeout(legTimer);
    if (legRaf) cancelAnimationFrame(legRaf);
    legTimer = undefined;
    legRaf = 0;
    legActive = false;
    document.body.classList.remove('leg-active');
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    returnFocus?.focus();
  };

  const launchLeg = () => {
    returnFocus = document.activeElement as HTMLElement;
    scrollPosition = window.scrollY;
    const lastFrame = legFrames.at(-1) ?? '';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (legTimer) clearTimeout(legTimer);
    if (legRaf) cancelAnimationFrame(legRaf);

    legActive = true;
    document.body.classList.add('leg-active');

    if (reduced || legFrames.length === 0) {
      legFrame = lastFrame;
      legTimer = setTimeout(stopLeg, LEG_HOLD_MS);
      return;
    }

    let frameIndex = 0;
    let lastTick = performance.now();
    legFrame = legFrames[0] ?? lastFrame;

    const tick = (now: number) => {
      if (now - lastTick < LEG_FRAME_MS) {
        legRaf = requestAnimationFrame(tick);
        return;
      }

      lastTick = now;
      frameIndex += 1;
      const next = legFrames[frameIndex];
      if (next === undefined) {
        legFrame = lastFrame;
        legTimer = setTimeout(stopLeg, LEG_HOLD_MS);
        return;
      }

      legFrame = next;
      legRaf = requestAnimationFrame(tick);
    };

    legRaf = requestAnimationFrame(tick);
  };

  const run = async () => {
    const value = input.trim();
    if (!value) return;
    history = [...history, value];
    historyIndex = history.length;
    input = '';
    await executeCommand(value, {
      navigate,
      setTheme,
      setLocale,
      locale: currentLocale(),
      output: (message) => output = message,
      clear: () => output = '',
      launchLeg,
    });
  };

  const showSuggestions = () => {
    focused = true;
    suggestionsOpenedAt = performance.now();
  };

  const hideSuggestions = () => {
    focused = false;
    output = '';
  };

  const isPromptInput = (target: EventTarget | null) =>
    Boolean(inputElement && target instanceof Node && inputElement.contains(target));

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      historyIndex = Math.max(0, historyIndex - 1);
      input = history[historyIndex] ?? '';
      showSuggestions();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input = history[historyIndex] ?? '';
      showSuggestions();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      if (suggestions[0]) input = suggestions[0].name;
      showSuggestions();
    } else if (event.key === 'Escape') {
      inputElement.blur();
      hideSuggestions();
    } else {
      showSuggestions();
    }
  };

  onMount(() => {
    initLocale();
    currentTheme = readStoredTheme(localStorage);
    ready = document.body.dataset.bootComplete === 'true';
    const compactQuery = window.matchMedia('(max-width: 760px)');
    const syncChrome = () => {
      compactChrome = compactQuery.matches;
    };
    syncChrome();
    compactQuery.addEventListener('change', syncChrome);

    const onBootComplete = () => ready = true;
    const openPrompt = () => {
      inputElement.focus();
      showSuggestions();
    };
    const onWindowKeydown = (event: KeyboardEvent) => {
      if (legActive && event.key === 'Escape') {
        event.preventDefault();
        stopLeg();
        return;
      }

      if (!ready || legActive || event.metaKey || event.ctrlKey || event.altKey) return;

      const action = routeShortcut(event.key, {
        target: event.target,
        dialogOpen: Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')),
        sectionActive: false,
      });
      if (action !== 'open-terminal') return;

      event.preventDefault();
      openPrompt();
    };
    const onPageAction = (event: Event) => {
      if (isPromptInput(event.target)) {
        showSuggestions();
        return;
      }
      if (event.target instanceof Node && overlayElement?.contains(event.target)) return;
      hideSuggestions();
      if (document.activeElement === inputElement) inputElement.blur();
    };
    const onPageScroll = (event: Event) => {
      if (!focused || performance.now() - suggestionsOpenedAt < 200) return;
      const target = event.target;
      if (
        target instanceof Node &&
        (inputElement.contains(target) || overlayElement?.contains(target))
      ) {
        return;
      }
      hideSuggestions();
      if (document.activeElement === inputElement) inputElement.blur();
    };

    window.addEventListener('varectra:boot-complete', onBootComplete);
    window.addEventListener('keydown', onWindowKeydown);
    window.addEventListener('pointerdown', onPageAction, true);
    window.addEventListener('wheel', onPageScroll, { capture: true, passive: true });
    window.addEventListener('touchmove', onPageScroll, { capture: true, passive: true });
    window.addEventListener('scroll', onPageScroll, true);

    const syncSection = () => {
      currentSection = resolveSectionId(window.location.hash);
    };
    syncSection();
    window.addEventListener('hashchange', syncSection);

    return () => {
      compactQuery.removeEventListener('change', syncChrome);
      window.removeEventListener('hashchange', syncSection);
      window.removeEventListener('varectra:boot-complete', onBootComplete);
      window.removeEventListener('keydown', onWindowKeydown);
      window.removeEventListener('pointerdown', onPageAction, true);
      window.removeEventListener('wheel', onPageScroll, true);
      window.removeEventListener('touchmove', onPageScroll, true);
      window.removeEventListener('scroll', onPageScroll, true);
      if (legTimer) clearTimeout(legTimer);
      if (legRaf) cancelAnimationFrame(legRaf);
    };
  });
</script>

<aside class="global-terminal" data-ready={ready} aria-label="Global command terminal">
  <div class="global-terminal__frame">
  {#if focused && output}
    <div class="terminal-overlay" bind:this={overlayElement}>
      <TuiBox title={copy.terminal.cmd} meta="help">
        <pre class="terminal-output" aria-live="polite">{output}</pre>
      </TuiBox>
    </div>
  {/if}
  <TuiBox
    title={compactChrome ? `~/${currentSection}` : `varectra@home:~/${currentSection}`}
    meta={compactChrome ? '' : `[${themeLabels[currentTheme]}]`}
  >
    <form class="terminal-form" on:submit|preventDefault={run}>
      <label class="terminal-label" for="global-terminal-input">$</label>
      <input
        id="global-terminal-input"
        class="terminal-input"
        bind:this={inputElement}
        bind:value={input}
        type="text"
        inputmode="text"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        aria-label={copy.terminal.prompt}
        placeholder={promptPlaceholder(
          currentSection,
          compactChrome,
          desktopSectionHint(currentSection, {
            arrows: copy.terminal.arrowsHint,
            exec: copy.terminal.execHint,
          }),
        )}
        on:focus={showSuggestions}
        on:input={showSuggestions}
        on:keydown={onKeydown}
        on:blur={() => {
          if (document.activeElement !== inputElement) hideSuggestions();
        }}
      />
      <button class="terminal-submit" type="submit" aria-label={copy.terminal.enter}>[enter]</button>
    </form>
  </TuiBox>
  </div>
</aside>

<div class="leg-overlay" aria-hidden={!legActive} role="dialog" aria-label="ASCII leg extension">
  <pre
    class="leg-ascii"
    style={`--leg-cols: ${LEG_FRAME_WIDTH}; --leg-rows: ${LEG_FRAME_HEIGHT}`}
    aria-hidden="true"
  >{legFrame}</pre>
  <p class="leg-hint">{copy.boot.abort}</p>
</div>
