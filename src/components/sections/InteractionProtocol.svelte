<script lang="ts">
  import TuiBox from '../tui/TuiBox.svelte';
  import { messages } from '../../lib/i18n/store';

  interface Protocol {
    title: string;
    state: string;
    description: string;
    severity: 'allowed' | 'ask' | 'warning' | 'forbidden' | 'info';
  }

  export let protocols: Protocol[] = [];

  $: copy = $messages;
</script>

<div class="warning-panel">
  <TuiBox title={copy.interaction.title} tone="danger">
    <ul class="protocol-list">
      {#each protocols as protocol}
        <li class="protocol-row" data-severity={protocol.severity}>
          <div class="protocol-head">
            <strong>{protocol.title}</strong>
            <span class="protocol-state">[{protocol.state}]</span>
          </div>
          <p class="protocol-desc">{protocol.description}</p>
        </li>
      {/each}
    </ul>
  </TuiBox>
</div>
