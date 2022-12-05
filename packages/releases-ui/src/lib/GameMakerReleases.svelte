<script lang="ts">
  import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import {
    ideAnchorId,
    releaseAnchorId,
    runtimeAnchorId,
    type Channel,
  } from './constants.js';
  import FilteredReleases from './FilteredReleases.svelte';
  import NoteGroup from './NoteGroup.svelte';
  import { toDateIso, toDateLocal } from './utils.js';

  // Dispatch an event called 'selected' when a release is selected.
  const dispatch = createEventDispatcher<{
    selected: { release: string; ideVersion: string; runtimeVersion: string };
  }>();

  export let showChannels: Channel[] = ['lts', 'stable', 'beta'];
  export let releases: GameMakerReleaseWithNotes[];

  /**
   * The IDE version of a release that is considered
   * "selected". The selected release is highlighted,
   * and other releases have a button to allow selecting
   * them instead.
   */
  export let selected: string | null = null;
  /**
   * Each non-selected release can have a button
   * to "select" it. When clicked, the `selected`
   * value is updated to the release's version and
   * the "selected" event is fired.
   *
   * Optionally specify the text to display on the button.
   */
  export let selectButtonText = 'select';

  let filteredReleases: GameMakerReleaseWithNotes[] = [];

  onMount(async () => {
    // Scroll to the selected element
    if (!selected) {
      return;
    }
    await tick();
    const anchor = document.querySelector(
      `#gamemaker-releases-component article.release[data-is-selected="true"]`,
    );
    console.log('FOUND', anchor);
    if (!anchor) {
      return;
    }
    anchor.scrollIntoView({ behavior: 'smooth' });
  });
</script>

<section id="gamemaker-releases-component">
  <FilteredReleases bind:showChannels bind:releases bind:filteredReleases />

  {#each filteredReleases as release}
    {@const isSelected = selected === release.ide.version}
    <article
      class="release"
      data-version={release.ide.version}
      data-channel={release.channel}
      data-is-selected={isSelected}
    >
      <header>
        <h2
          id={releaseAnchorId(release)}
          title={`Release ${release.ide.version} (${release.channel} channel)`}
        >
          {release.ide.version}
        </h2>
        <!-- <p data-channel={release.channel}>
          <span class="sr-only">Channel:</span>
          {release.channel}
        </p> -->
        {#if !isSelected}
          <button
            on:click={() =>
              dispatch('selected', {
                release: release.ide.version,
                runtimeVersion: release.runtime.version,
                ideVersion: release.ide.version,
              }) && (selected = release.ide.version)}
          >
            {selectButtonText}
          </button>
        {/if}
        <time datetime={toDateIso(release.publishedAt)}>
          <span class="sr-only">Release Date:</span>
          {toDateLocal(release.publishedAt)}
        </time>
      </header>
      <details>
        <summary><h3>Summary</h3></summary>
        <section class="release-summary">
          {@html release.summary}
        </section>
      </details>
      {#if release.runtime.notes.groups.length}
        <details>
          <summary>
            <h3 id={runtimeAnchorId(release)}>Runtime Changes</h3>
          </summary>
          <section>
            {#each release.runtime.notes.groups as group}
              <NoteGroup {group} />
            {/each}
          </section>
        </details>
      {/if}
      {#if release.ide.notes.groups.length}
        <details>
          <summary>
            <h3 id={ideAnchorId(release)}>IDE Changes</h3>
          </summary>
          <section>
            {#each release.ide.notes.groups as group}
              <NoteGroup {group} />
            {/each}
          </section>
        </details>
      {/if}
    </article>
  {/each}
</section>

<style>
  #gamemaker-releases-component {
    color: var(--color-text);
    background-color: var(--color-background);
    display: flex;
    flex-direction: column;
    gap: 1.5em;
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

  /* SELECTED */
  [data-is-selected='true'] {
    border: 0.1em solid var(--channel-color);
    padding-block-start: 0.25em;
    padding-block-end: 0.75em;
    padding-inline: 0.75em;
    border-radius: 0.5em;
  }

  /* CHANNEL PILLS */

  article header h2 {
    color: var(--channel-color);
  }

  /* article header p {
    background-color: var(--channel-color);
    color: var(--color-background);
    padding: 0em 0.5em;
    border-radius: 0.75em;
    font-weight: bold;
    font-size: 0.75em;
    user-select: none;
  } */

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

  article header button {
    background-color: var(--color-background);
    color: var(--color-text-muted);
    border: 1px solid var(--color-text-muted);
    border-radius: 0.5em;
    padding: 0 0.5em;
    font-size: 0.75em;
    font-weight: bold;
    cursor: pointer;
  }
  article header button:hover {
    color: var(--color-text);
    border-color: var(--color-text);
  }

  details summary {
    cursor: pointer;
    font-size: 1em;
  }
  details summary h3 {
    font-size: 1em;
    user-select: none;
    display: inline;
  }
  details > section {
    padding-left: 1em;
    padding-block: 0.25em 0.75em;
  }
  details > section.release-summary {
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
