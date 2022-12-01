import { pathy } from '@bscotch/pathy';
import { listReleasesWithNotes } from '../packages/releases/dist/index.js';

const notesCache = pathy('packages/releases/release-notes-cache.json');
const summaryPath = pathy('packages/releases/releases-summary.json');
const releases = await listReleasesWithNotes(undefined, notesCache);
await summaryPath.write(releases);
console.log(releases[0].ide.version);
