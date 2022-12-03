# GameMaker Releases Summary UI

**🔥 IN ACTIVE DEVELOPMENT  🔥** Expect breaking changes.

## Contents

- Data loading functionality for fetching summaries GameMaker releases
- SvelteKit component for displaying that data

## Usage

### Adding to a Svelte project

**🚧🚧 UNDER CONSTRUCTION 🚧🚧**

### Development

+ Install [Node.js 16+](https://nodejs.org/)
+ [Enable Corepack](https://nodejs.org/api/corepack.html#corepack) or [install yarn](https://yarnpkg.com/getting-started/install)
+ Clone the repo containing this package
+ In the repo root, run `yarn install`
+ Run: `cd packages/releases-ui`
+ Run: `yarn dev`
+ The console should provide a local URL to visit the demo page.

## TODO

1. ✅ Create component for a single Release
2. ✅ Display all Releases
3. ✅ Add toggleable filters for each channel
4. ✅ Add search filter
5. ✅ Add some basic styling, with CSS variables to expose customization
6. Figure out how to style inner HTML
7. Highlight search result ranges
8. Add "highlighted" option for separately styling a particular release
9. Add "highlight" button to non-highlighted releases
  - Add option to customize that text
  - Emit an event when that button is clicked, and changed the highlighted value to match
1. Figure out how to [get it packaged](https://kit.svelte.dev/docs/packaging) for use in Stitch Desktop
2.  Create a GitHub Pages or CloudFlare Pages to host
