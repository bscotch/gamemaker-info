import {
  gameMakerReleaseWithNotesSchema,
  releasesUrl,
  type GameMakerReleaseWithNotes,
} from '@bscotch/gamemaker-releases/browser';

export { releasesUrl } from '@bscotch/gamemaker-releases/browser';

/**
 * Fetch the releases summary from a provided URL.
 * Note that you'll have CORS issues unless you run
 * this on a server or use a domain-local proxy.
 */
export async function fetchReleasesSummary(
  url = releasesUrl,
): Promise<GameMakerReleaseWithNotes[]> {
  const response = await fetch(url);
  const json: unknown = await response.json();
  if (!Array.isArray(json)) {
    throw new Error('Expected an array of releases');
  }
  return json.map((release) => gameMakerReleaseWithNotesSchema.parse(release));
}
