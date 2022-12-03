<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';
  import type Fuse from 'fuse.js';
  import { channels, type Channel } from './constants.js';
  import { createSearchIndex, debounce, type SearchOptions } from './utils.js';

  export let showChannels: Channel[] = ['lts', 'stable'];
  export let releases: GameMakerReleaseWithNotes[];
  export let showingReleases: GameMakerReleaseWithNotes[] = [];
  let searchQuery = '';
  let searchIndex: Fuse<GameMakerReleaseWithNotes> | undefined;
  let searchOptions: SearchOptions = {
    caseSensitive: false,
  };

  function updateSearchIndex() {
    showingReleases = releases.filter((release) =>
      showChannels.includes(release.channel),
    );
    searchIndex = createSearchIndex(showingReleases);
    if (searchQuery) {
      filterBySearch();
    }
  }

  function filterBySearch() {
    if (searchQuery) {
      const index =
        searchIndex || createSearchIndex(showingReleases, searchOptions);
      const searchResults = index.search(searchQuery);
      console.log(searchResults);
      showingReleases = searchResults.map((result) => result.item);
    } else {
      updateSearchIndex();
    }
    return showingReleases;
  }

  const debouncedSearch = debounce(filterBySearch, 200);

  updateSearchIndex();
</script>

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
  <fieldset>
    <legend class="sr-only"> Search options </legend>
    <label>
      <input
        type="checkbox"
        bind:value={searchOptions.caseSensitive}
        on:change={() => {
          updateSearchIndex();
        }}
      />
      match case
    </label>
  </fieldset>
  <fieldset>
    <legend class="sr-only"> Select which channels to display </legend>
    {#each channels as channel}
      <label data-channel={channel}>
        <input
          type="checkbox"
          bind:group={showChannels}
          value={channel}
          on:change={() => {
            updateSearchIndex();
          }}
        />
        {channel}
      </label>
    {/each}
  </fieldset>
</form>

<style>
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
  form label[data-channel] {
    color: var(--channel-color);
  }
  form label[data-channel] {
    background-color: var(--channel-color);
    color: var(--color-background);
    padding: 0em 0.5em;
    border-radius: 0.75em;
    font-weight: bold;
    font-size: 0.75em;
  }

  input:where([type='search'], [type='text']) {
    background-color: var(--color-background);
    color: var(--color-text);
    border: 0.1em solid var(--color-text-muted);
    border-radius: 0.75em;
    padding: 0 0.5em;
  }
  input:where([type='search'], [type='text']):where(:focus, :focus-visible) {
    outline: 0.1em solid var(--color-text);
    /*
      Change the border to the background color so
      it isn't visible but still takes up space.
    */
    border-color: var(--color-background);
  }
  label {
    user-select: none;
  }
  input[type='checkbox'] {
    cursor: pointer;
  }
  label:has(input[type='checkbox']) {
    cursor: pointer;
  }
  form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1em;
  }
  form fieldset {
    display: flex;
    flex-direction: row;
    gap: 0.25em;
    align-items: center;
    margin: 0;
    padding: 0;
    border: none;
  }
  label:has(input[type='checkbox']) {
    display: inline-grid;
    grid-template-columns: 1em auto;
    gap: 0.25em;
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
