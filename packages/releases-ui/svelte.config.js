import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
  },
  package: {
    exports(filePath) {
      return ['index.ts', 'GameMakerReleases.svelte'].includes(filePath);
    },
  },
};

export default config;
