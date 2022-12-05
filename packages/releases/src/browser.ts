/**
 * @file Browser-compatible exports
 */
export { ideFeedUrls, runtimeFeedUrls } from './urls.js';
export { gameMakerReleaseWithNotesSchema } from './feeds.types.js';
export type {
  ArtifactType,
  Channel,
  GameMakerRelease,
  GameMakerReleaseWithNotes,
} from './feeds.types.js';
/**
 * This package is used to generate a releases object, stored
 * as a JSON file for public download. The latest version of this
 * releases object can be downloaded from this URL.
 */
export const releasesUrl =
  'https://github.com/bscotch/gamemaker-info/releases/latest/download/releases-summary.json';
