<script lang="ts">
  let className = '';
  export { className as class };
  export let type: 'button' | 'submit' = 'button';
  /** `end` right-aligns the label, used for trailing pager controls. */
  export let align: 'start' | 'end' = 'start';
</script>

<button
  class={`tui-button key-button ${className}`.trim()}
  class:tui-button--end={align === 'end'}
  {type}
  on:click
>
  <slot />
</button>

<style>
  .tui-button {
    display: inline-flex;
    align-items: center;
    width: max-content;
    max-width: 100%;
    min-width: 0;
    min-height: 1.8rem;
    padding: 0.2rem 0.5rem;
    border: 0;
    background: var(--bg-elevated);
    color: var(--fg);
    font: inherit;
    text-align: left;
    white-space: nowrap;
  }

  .tui-button--end {
    justify-content: flex-end;
    text-align: right;
  }

  .tui-button:hover,
  .tui-button:focus-visible {
    background: var(--selection);
    color: var(--accent-secondary);
  }
</style>
