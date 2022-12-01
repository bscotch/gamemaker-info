import { assert, literal } from '@bscotch/utility/browser';
import { default as axios } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { findPairedRuntime } from './feeds.lib.js';
import {
  ArtifactType,
  Channel,
  channels,
  GameMakerArtifact,
  gameMakerArtifactSchema,
  GameMakerRelease,
  rawReleaseNotesCacheSchema,
  rawReleaseNoteSchema,
  RssFeedEntry,
  rssFeedSchema,
} from './feeds.types.js';
import { defaultCacheDir } from './constants.js';
import { Pathy } from '@bscotch/pathy';

export function ideFeedUrls() {
  const prefix = `https://gms.yoyogames.com/update-win`;
  return literal({
    lts: `${prefix}-LTS.rss`,
    stable: `${prefix}.rss`,
    beta: `${prefix}-NuBeta.rss`,
    unstable: `${prefix}-NuBeta-I.rss`,
  }) satisfies { [c in Channel]: string };
}

export function runtimeFeedUrls() {
  const prefix = `https://gms.yoyogames.com/Zeus-Runtime`;
  return literal({
    lts: `${prefix}-LTS.rss`,
    stable: `${prefix}.rss`,
    beta: `${prefix}-NuBeta.rss`,
    unstable: `${prefix}-NuBeta-I.rss`,
  }) satisfies { [c in Channel]: string };
}

export async function listReleaseNotes(
  releases: GameMakerRelease[],
  cache: Pathy | string = defaultCacheDir.join('notes-cache.json'),
) {
  const cachePath = Pathy.asInstance(cache).withValidator(
    rawReleaseNotesCacheSchema,
  );
  assert(
    cachePath.hasExtension('json'),
    `Cache path must have a .json extension`,
  );
  const cacheData = await cachePath.read({ fallback: {} });
  const failures: string[] = [];
  for (const release of releases) {
    if (cacheData[release.notesUrl]) {
      continue;
    }
    const res = await axios(release.notesUrl);
    try {
      cacheData[release.notesUrl] = rawReleaseNoteSchema.parse(res.data);
      await cachePath.write(cacheData);
    } catch (err) {
      failures.push(`${release.type} ${release.channel} ${release.notesUrl}`);
    }
  }
  console.log(failures);
}

export async function listReleases(): Promise<GameMakerRelease[]> {
  const ideArtifacts = await listArtifacts('ide');
  const runtimeArtifacts = await listArtifacts('runtime');
  const releases: GameMakerRelease[] = [];
  for (let i = 0, r = 0; i < ideArtifacts.length; i++) {
    const ide = ideArtifacts[i];
    if (!ide.publishedAt) {
      continue;
    }
    const nextR = findPairedRuntime(runtimeArtifacts, ide, r);
    r = nextR === -1 ? r : nextR;
    if (nextR === -1) {
      continue;
    }
    releases.push({
      ...ide,
      runtime: runtimeArtifacts[nextR],
    });
  }
  return releases;
}

async function listArtifacts(type: ArtifactType): Promise<GameMakerArtifact[]> {
  const entries: GameMakerArtifact[] = [];
  const urls = type === 'ide' ? ideFeedUrls() : runtimeFeedUrls();
  const feeds = await Promise.all(
    channels.map((channel) => downloadRssFeed(urls[channel])),
  );
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const feed = feeds[i];
    for (const entry of feed) {
      entries.push(
        gameMakerArtifactSchema.parse({
          type,
          channel,
          publishedAt: new Date(entry.pubDate),
          version: entry.title.match(/^Version (.*)/)![1],
          link: entry.link,
          feedUrl: urls[channel],
          notesUrl: entry.comments,
        }),
      );
    }
  }
  return entries;
}

async function downloadRssFeed(url: string): Promise<RssFeedEntry[]> {
  const data = (await axios(url)).data as string;
  assert(data, `Got no data back from ${url}`);
  // Try to parse the data before saving it to make sure we aren't
  // saving nonsense garbage.
  const asJson = new XMLParser().parse(data);
  return rssFeedSchema.parse(asJson).rss.channel.item;
}
