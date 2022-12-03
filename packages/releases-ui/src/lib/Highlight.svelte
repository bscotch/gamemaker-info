<script lang="ts">
  import { highlightText, type Indices } from './highlight.js';

  export let text: string;
  export let indices: Indices | undefined;

  let highlighted: string = text;

  $: highlighted = highlightText(text, indices);
</script>

{@html highlighted}
