import type { GameMakerReleaseWithNotes } from '@bscotch/gamemaker-releases';
import Fuse from 'fuse.js';

export function debounce(fn: Function, delay: number) {
  let timeoutId: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  };
}

export function toDateIso(date: string | Date) {
  return new Date(date).toISOString();
}

export function toDateLocal(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

export function createSearchIndex(
  withinReleases: GameMakerReleaseWithNotes[],
  options?: { caseSensitive?: boolean },
) {
  return new Fuse(withinReleases, {
    keys: [
      {
        name: 'ide.notes.groups.changes',
        weight: 2,
      },
      {
        name: 'ide.notes.groups.title',
        weight: 0.5,
      },
      {
        name: 'version',
        weight: 1,
      },
      {
        name: 'summary',
        weight: 0.5,
      },
    ],
    includeMatches: true,
    minMatchCharLength: 3,
    isCaseSensitive: options?.caseSensitive ?? false,
  });
}
