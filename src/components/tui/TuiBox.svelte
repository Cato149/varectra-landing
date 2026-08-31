<script lang="ts">
  export let title = '';
  export let meta = '';
  export let tone: 'default' | 'danger' = 'default';
  let className = '';
  export { className as class };
</script>

<div class={`tui-box ${className}`.trim()} data-tone={tone}>
  <div class="tui-box__edge" aria-hidden="true">
    <span>┌</span>
    {#if title}<span class="tui-box__label" data-role="title">─ {title} </span>{/if}
    <span class="tui-box__fill"></span>
    {#if meta}<span class="tui-box__label" data-role="meta"> {meta}─</span>{/if}
    <span>┐</span>
  </div>
  <div class="tui-box__mid tui-box__mid--main">
    <span class="tui-box__v" aria-hidden="true"></span>
    <div class="tui-box__slot">
      <slot />
    </div>
    <span class="tui-box__v" aria-hidden="true"></span>
  </div>
  {#if $$slots.bar}
    <div class="tui-box__edge" aria-hidden="true">
      <span>├</span>
      <span class="tui-box__fill"></span>
      <span>┤</span>
    </div>
    <div class="tui-box__mid">
      <span class="tui-box__v" aria-hidden="true"></span>
      <div class="tui-box__slot tui-box__bar">
        <slot name="bar" />
      </div>
      <span class="tui-box__v" aria-hidden="true"></span>
    </div>
  {/if}
  <div class="tui-box__edge" aria-hidden="true">
    <span>└</span>
    <span class="tui-box__fill"></span>
    <span>┘</span>
  </div>
</div>
