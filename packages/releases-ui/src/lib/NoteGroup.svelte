<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';

  type NoteGroup =
    GameMakerReleaseWithNotes['runtime']['notes']['groups'][number];

  export let group: NoteGroup;
</script>

{#if group.title}
  <h3>{group.title}</h3>
{/if}

<ul>
  {#each group.changes as change}
    <li>{change}</li>
  {/each}
</ul>
