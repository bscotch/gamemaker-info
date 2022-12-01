// TODO
// 1. Add a feed downloader
// 2. Add a feed parser
// 3. Add a changelog downloader
// 4. Add a changelog parser
// 5. Create a "releases" object merging all of the above information
// 6. Add ability to upload the merged release to R2
// 7. Add a GitHub action to run this on a schedule, remotely

import { pathy } from '@bscotch/pathy';
import { defaultCacheDir } from './constants.js';
import { listReleases } from './feeds.js';

export interface CreateKnowledgeBaseOptions {
  /**
   * Directory to store cached data, for reducing network requests.
   *
   * @default `${os.tmpdir()}/@bscotch/gamemaker-releases`
   */
  cacheDir?: string;
}

export async function createKnowledgeBase(
  options?: CreateKnowledgeBaseOptions,
) {
  const cacheDir = options?.cacheDir
    ? pathy(options.cacheDir)
    : defaultCacheDir;

  const releases = await listReleases();
}
