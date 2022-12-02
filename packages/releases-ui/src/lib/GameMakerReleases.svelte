<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';

  export let releases: GameMakerReleaseWithNotes[];
</script>

{#each releases as release}
  <h2>{release.ide.version}</h2>
{/each}
