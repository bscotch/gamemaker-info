import { dateDifferenceDays } from '@bscotch/utility/browser';
import { type GameMakerArtifact } from './feeds.types.js';

export function findPairedRuntime(
  runtimeFeed: GameMakerArtifact[],
  ide: GameMakerArtifact,
  searchIndex: number,
) {
  // Go backwards until the dateDiff starts growing
  let dateDiff = Infinity;
  for (let r = searchIndex; r >= 0; r--) {
    const runtime = runtimeFeed[r];
    if (!runtime.publishedAt || runtime.channel !== ide.channel) {
      continue;
    }
    const diff = Math.abs(
      dateDifferenceDays(runtime.publishedAt, ide.publishedAt),
    );
    if (diff < dateDiff) {
      dateDiff = diff;
      searchIndex = r;
    } else {
      break;
    }
  }
  // Go forwards until the dateDiff starts growing
  dateDiff = Infinity;
  for (let r = searchIndex; r < runtimeFeed.length; r++) {
    const runtime = runtimeFeed[r];
    if (!runtime.publishedAt || runtime.channel !== ide.channel) {
      continue;
    }
    const diff = Math.abs(
      dateDifferenceDays(runtime.publishedAt, ide.publishedAt),
    );
    if (diff < dateDiff) {
      dateDiff = diff;
      searchIndex = r;
    } else {
      break;
    }
  }
  const runtime = runtimeFeed[searchIndex];
  if (
    !runtime ||
    Math.abs(dateDifferenceDays(runtime.publishedAt, ide.publishedAt)) > 1
  ) {
    return -1;
  }
  return searchIndex;
}
