import { pathy } from '@bscotch/pathy';
import { listReleases } from './feeds.js';
import { rawReleaseNotesCacheSchema } from './feeds.types.js';
import { listReleaseNotes, cleanNotes } from './notes.js';

const notesCache = pathy('notes-cache.json').withValidator(
  rawReleaseNotesCacheSchema,
);

describe('Release Feeds', function () {
  it('can create a centralized GameMaker Releases database', async function () {
    const releases = await listReleases();
    const notes = await listReleaseNotes(releases, notesCache);
  });

  it('can clean release notes', async function () {
    const notes = await notesCache.read();
    const cleaned = await cleanNotes(notes);
  });
});
