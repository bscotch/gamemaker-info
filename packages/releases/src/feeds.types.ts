import { z } from 'zod';

export interface RssFeedEntry {
  title: string;
  pubDate: string;
  link?: string;
  comments: string;
}

export type Channel = typeof channels[number];
export const channels = ['lts', 'stable', 'beta', 'unstable'] as const;
export const channelSchema = z.enum(channels);
Object.freeze(channels);

export type ArtifactType = typeof artifactTypes[number];
export const artifactTypes = ['ide', 'runtime'] as const;
Object.freeze(artifactTypes);

export const rssFeedSchema = z.object({
  rss: z.object({
    channel: z.object({
      title: z.string(),
      description: z.string(),
      link: z.string(),
      item: z.preprocess(
        (arg) => {
          if (!Array.isArray(arg)) {
            return [arg];
          }
          return arg;
        },
        z.array(
          z.object({
            title: z.string().regex(/^Version \d+\.\d+\.\d+\.\d+$/),
            pubDate: z.string(),
            link: z.string().optional(),
            comments: z.string(),
          }),
        ),
      ),
    }),
  }),
});

export type GameMakerArtifact = z.infer<typeof gameMakerArtifactSchema>;
export const gameMakerArtifactSchema = z.object({
  type: z.enum(artifactTypes),
  version: z.string().regex(/^\d+\.\d+\.\d+\.\d+$/),
  channel: channelSchema,
  feedUrl: z.string(),
  publishedAt: z.preprocess((arg) => {
    return typeof arg == 'string' || arg instanceof Date ? new Date(arg) : arg;
  }, z.date()),
  link: z.string().optional(),
  notesUrl: z.string(),
});

export type GameMakerArtifactWithNotes = z.infer<
  typeof gameMakerArtifactWithNotesSchema
>;
export const gameMakerArtifactWithNotesSchema = gameMakerArtifactSchema.extend({
  notes: z.object({
    since: z.string().nullable(),
    groups: z.array(
      z.object({
        title: z.string(),
        changes: z.array(z.string()),
      }),
    ),
  }),
});

export type GameMakerReleaseWithNotes = z.infer<
  typeof gameMakerReleaseWithNotesSchema
>;
export const gameMakerReleaseWithNotesSchema = z.object({
  channel: channelSchema,
  ide: gameMakerArtifactWithNotesSchema,
  runtime: gameMakerArtifactWithNotesSchema,
});

export type GameMakerRelease = z.infer<typeof gameMakerReleaseSchema>;
export const gameMakerReleaseSchema = z.object({
  channel: channelSchema,
  ide: gameMakerArtifactSchema,
  runtime: gameMakerArtifactSchema,
});

export type RawReleaseNote = z.infer<typeof rawReleaseNoteSchema>;
export const rawReleaseNoteSchema = z
  .object({
    type: z.enum(artifactTypes).optional(),
    version: z.string(),
    release_notes: z.array(z.string()),
  })
  .strict();

export type RawReleaseNotesCache = Record<string, RawReleaseNote>;
export const rawReleaseNotesCacheSchema = z.record(rawReleaseNoteSchema);
