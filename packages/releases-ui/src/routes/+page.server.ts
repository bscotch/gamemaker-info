import { fetchReleasesSummary } from '$lib/fetchReleasesSummary.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
  const releases = await fetchReleasesSummary();
  return {
    releases,
  };
};
