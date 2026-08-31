<script lang="ts">
  import { protocolIconSrc } from '../../lib/protocols/icons';

  export let platform: string;
</script>

<span
  class="protocol-icon"
  style={`--protocol-icon: url('${protocolIconSrc(platform)}')`}
  aria-hidden="true"
></span>

<style>
  .protocol-icon {
    display: block;
    width: 24px;
    height: 24px;
    background: var(--accent);
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    -webkit-mask: var(--protocol-icon) center / 24px 24px no-repeat;
    mask: var(--protocol-icon) center / 24px 24px no-repeat;
  }
</style>
