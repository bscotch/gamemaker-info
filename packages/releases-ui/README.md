# GameMaker Releases Summary UI

**🔥 IN ACTIVE DEVELOPMENT  🔥** Expect breaking changes.

## Contents

- Data loading functionality for fetching summaries GameMaker releases
- SvelteKit component for displaying that data

## Usage

### Adding to a Svelte project

Install to project deps: `npm install @bscotch/gamemaker-releases-ui`

Fetching the release notes will need to be done server-side to avoid CORS issues. For SvelteKit, you could use a server-only loader, e.g.:

```ts
/** @file +page.server.ts */

import { loadReleasesSummary } from '@bscotch/gamemaker-releases-ui';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
  const releases = await loadReleasesSummary();
  return {
    releases,
  };
};
```

```html
<!-- +page.svelte -->
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
  /* Available CSS Custom Properties, for specifying colors. */
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

```

### Development

+ Install [Node.js 16+](https://nodejs.org/)
+ [Enable Corepack](https://nodejs.org/api/corepack.html#corepack) or manually install pnpm
+ Clone the repo containing this package
+ In the repo root, run `pnpm install`
+ Run: `cd packages/releases-ui`
+ Run: `pnpm dev`
+ The console should provide a local URL to visit the demo page.

## TODO

1. Figure out how to [get it packaged](https://kit.svelte.dev/docs/packaging) for use in Stitch Desktop
2.  Create a GitHub Pages or CloudFlare Pages to host
