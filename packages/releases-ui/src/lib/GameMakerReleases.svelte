<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';
  import type { Channel } from './constants.js';
  import Filter from './Filter.svelte';
  import NoteGroup from './NoteGroup.svelte';
  import { toDateIso, toDateLocal } from './utils.js';

  export let showChannels: Channel[] = ['lts', 'stable'];
  export let releases: GameMakerReleaseWithNotes[];

  let showingReleases: GameMakerReleaseWithNotes[] = [];
</script>

<section id="gamemaker-releases-component">
  <Filter bind:showChannels bind:releases bind:showingReleases />

  {#each showingReleases as release}
    <article data-version={release.ide.version} data-channel={release.channel}>
      <header id={`release-${release.ide.version}`}>
        <h2>{release.ide.version}</h2>
        <p data-channel={release.channel}>
          <span class="sr-only">Channel:</span>
          {release.channel}
        </p>
        <time datetime={toDateIso(release.publishedAt)}>
          <span class="sr-only">Release Date:</span>
          {toDateLocal(release.publishedAt)}
        </time>
      </header>
      <details>
        <summary><h3>Summary</h3></summary>
        <div class="release-summary">{@html release.summary}</div>
      </details>
      {#if release.runtime.notes.groups.length}
        <details>
          <summary><h3>Runtime Changes</h3></summary>
          {#each release.runtime.notes.groups as group}
            <NoteGroup {group} />
          {/each}
        </details>
      {/if}
      {#if release.ide.notes.groups.length}
        <details>
          <summary><h3>IDE Changes</h3></summary>
          {#each release.ide.notes.groups as group}
            <NoteGroup {group} />
          {/each}
        </details>
      {/if}
    </article>
  {/each}
</section>

<style>
  section {
    color: var(--color-text);
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    gap: 2em;
  }
  [data-channel='lts'] {
    --channel-color: var(--color-lts);
  }
  [data-channel='stable'] {
    --channel-color: var(--color-stable);
  }
  [data-channel='beta'] {
    --channel-color: var(--color-beta);
  }
  [data-channel='unstable'] {
    --channel-color: var(--color-unstable);
  }

  /* CHANNEL PILLS */

  article header h2 {
    color: var(--channel-color);
  }

  article header p {
    background-color: var(--channel-color);
    color: var(--color-background);
    padding: 0em 0.5em;
    border-radius: 0.75em;
    font-weight: bold;
    font-size: 0.75em;
  }

  /* RELEASE */
  article header {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
  }

  article header time {
    color: var(--color-text-muted);
  }

  details summary {
    cursor: pointer;
    user-select: none;
  }
  details summary h3 {
    display: inline-block;
  }
  details .release-summary {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  /* https://tailwindcss.com/docs/screen-readers */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
