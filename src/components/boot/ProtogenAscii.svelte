<script lang="ts">
  import { measureAsciiArt } from '../../lib/boot/ascii';

  export let art: string;

  $: metrics = measureAsciiArt(art);
  $: cols = Math.max(metrics.cols, 1);
  $: rows = Math.max(metrics.rows, 1);
</script>

<div class="protogen-figure">
  <pre
    class="protogen-ascii"
    style={`--ascii-cols: ${cols}; --ascii-rows: ${rows}`}
    aria-hidden="true"
  >{art}</pre>
</div>

<style>
  .protogen-figure {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
  }

  .protogen-ascii {
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    color: var(--accent);
    font-size: min(
      calc((min(58vw, 920px) - 1rem) / (var(--ascii-cols) * 0.62)),
      calc(86vh / (var(--ascii-rows) * 1.05))
    );
    line-height: 1.05;
    letter-spacing: 0;
    text-align: left;
    white-space: pre;
    user-select: none;
  }

  @media (max-width: 1100px) {
    .protogen-ascii {
      font-size: min(
        calc((min(72vw, 720px) - 1rem) / (var(--ascii-cols) * 0.62)),
        calc(70vh / (var(--ascii-rows) * 1.05))
      );
    }
  }

  @media (max-width: 760px) {
    .protogen-ascii {
      font-size: min(
        calc((100vw - 2rem) / (var(--ascii-cols) * 0.62)),
        calc(46vh / (var(--ascii-rows) * 1.05))
      );
    }
  }
</style>
