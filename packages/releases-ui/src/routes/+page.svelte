<script lang="ts">
  import GameMakerReleases from '$lib/GameMakerReleases.svelte';
  import type { PageData } from './$types.js';

  export let data: PageData;
</script>

<main>
  <h1>GameMaker Releases</h1>
  <GameMakerReleases releases={data.releases} />
</main>

<style>
  main {
    --color-lts: rgb(0, 226, 192);
    --color-stable: rgb(0, 217, 255);
    --color-beta: rgb(255, 234, 0);
    --color-unstable: rgb(255, 0, 93);
    --color-text: rgb(213, 213, 213);
    --color-text-muted: rgb(150, 150, 150);
    --color-background: rgb(27, 27, 27);
  }
  h1 {
    color: var(--color-text);
  }
  main {
    width: 100%;
    max-width: 960px;
    padding: 1em 2em;
    margin: auto;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
