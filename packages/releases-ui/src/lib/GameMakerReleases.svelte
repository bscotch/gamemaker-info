<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';
  import type Fuse from 'fuse.js';
  import { channels, type Channel } from './constants.js';
  import NoteGroup from './NoteGroup.svelte';
  import {
    createSearchIndex,
    debounce,
    toDateIso,
    toDateLocal,
  } from './utils.js';

  export let showChannels: Channel[] = ['lts', 'stable'];
  export let releases: GameMakerReleaseWithNotes[];

  let showingReleases: GameMakerReleaseWithNotes[] = [];
  let searchQuery = '';
  let searchIndex: Fuse<GameMakerReleaseWithNotes> | undefined;

  function updateShowingChannels() {
    showingReleases = releases.filter((release) =>
      showChannels.includes(release.channel),
    );
    searchIndex = createSearchIndex(showingReleases);
  }

  function filterBySearch() {
    if (searchQuery) {
      const index = searchIndex || createSearchIndex(showingReleases);
      const searchResults = index.search(searchQuery);
      console.log(searchResults);
      showingReleases = searchResults.map((result) => result.item);
    } else {
      updateShowingChannels();
    }
    return showingReleases;
  }

  const debouncedSearch = debounce(filterBySearch, 200);

  updateShowingChannels();
</script>

<section id="gamemaker-releases-component">
  <form>
    <h2 class="sr-only">Filter display GameMaker Releases</h2>
    <input
      aria-label="Display releases that match search terms"
      type="search"
      placeholder="Search"
      bind:value={searchQuery}
      on:keyup={() => debouncedSearch()}
      on:change={() => debouncedSearch()}
    />
    {#each channels as channel}
      <label data-channel={channel}>
        <input
          type="checkbox"
          bind:group={showChannels}
          value={channel}
          on:change={() => {
            updateShowingChannels();
          }}
        />
        {channel}
      </label>
    {/each}
  </form>

  {#each showingReleases as release}
    <article data-channel={release.channel}>
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
        <summary> Summary </summary>
        {@html release.summary}
      </details>
      <details>
        <summary>Runtime Changes</summary>
        {#each release.runtime.notes.groups as group}
          <NoteGroup {group} />
        {/each}
      </details>
      <details>
        <summary>IDE Changes</summary>
        {#each release.ide.notes.groups as group}
          <NoteGroup {group} />
        {/each}
      </details>
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

  article header {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
  }

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

  article header time {
    color: var(--color-text-muted);
  }

  details {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  summary {
    cursor: pointer;
    user-select: none;
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
