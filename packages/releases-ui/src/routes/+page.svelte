<script lang="ts">
  import GameMakerReleases from '$lib/GameMakerReleases.svelte';
  import type { PageData } from './$types.js';

  export let data: PageData;
</script>

<h1>GameMaker Releases</h1>

<GameMakerReleases releases={data.releases} />
