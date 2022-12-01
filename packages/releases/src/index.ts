// TODO
// 1. Add a feed downloader
// 2. Add a feed parser
// 3. Add a changelog downloader
// 4. Add a changelog parser
// 5. Create a "releases" object merging all of the above information
// 6. Add ability to upload the merged release to R2
// 7. Add a GitHub action to run this on a schedule, remotely

export {
  ideFeedUrls,
  runtimeFeedUrls,
  listReleases,
  listReleasesWithNotes,
} from 'feeds.js';
export type {
  ArtifactType,
  Channel,
  GameMakerRelease,
  GameMakerReleaseWithNotes,
} from 'feeds.types.js';
