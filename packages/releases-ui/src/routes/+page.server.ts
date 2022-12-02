import { loadReleasesSummary } from '$lib/loadReleasesSummary.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
  const releases = await loadReleasesSummary();
  return {
    releases,
  };
};
