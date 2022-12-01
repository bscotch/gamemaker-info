import { pathy } from '@bscotch/pathy';
import { listReleaseNotes, listReleases } from './feeds.js';

const notesCache = pathy('notes-cache.json');

describe('Release Feeds', function () {
  it('can create a centralized GameMaker Releases database', async function () {
    const releases = await listReleases();
    const notes = await listReleaseNotes(releases, notesCache);
  });
});
