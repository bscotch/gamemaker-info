import { pathy } from '@bscotch/pathy';
import { expect } from 'chai';
import { listReleases, listReleasesWithNotes } from './feeds.js';
import { rawReleaseNotesCacheSchema } from './feeds.types.js';

const notesCache = pathy('notes-cache.json').withValidator(
  rawReleaseNotesCacheSchema,
);

describe('Release Feeds', function () {
  it('can create a centralized GameMaker Releases database', async function () {
    const releases = await listReleases();
    const withNotes = await listReleasesWithNotes(releases, notesCache);
    expect(withNotes.length).to.be.greaterThan(0);
    expect(withNotes.every((r) => r.channel)).to.exist;
    for (const type of ['ide', 'runtime'] as const) {
      expect(withNotes.every((r) => r[type])).to.exist;
      expect(withNotes.every((r) => r[type].version)).to.exist;
      expect(withNotes.every((r) => r[type].notes)).to.exist;
      expect(withNotes.every((r) => r[type].notes.groups)).to.exist;
    }
  });
});
