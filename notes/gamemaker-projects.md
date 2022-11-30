# GameMaker Studio 2.3+ and GameMaker 2022.+ Project File Structure

This document contains notes about the files that collectively make up
a GameMaker project. It is incomplete and may not be up to
date, so it should be considered a starting point to understand how
projects are put together.

## Notes on Versioning

Since Stitch needs to read, update, and create project files, being able to accurately determine the structure of a given file's content is essential.

<details>

<summary>

Data structures can vary at multiple levels, and it is not clear if there is always a way to determine _for sure_ what the structure is _supposed to be_ for any given IDE version.

</summary>
  
- In `yy` and `yyp` files, their are nested resources (objects) that can each have their own `resourceType` and `resourceVersion` fields.
- A change to the structure of a subresource is not paired with a change to the `resourceType` or `resourceVersion` of the parent.
- A change to a resource may be reflected by a change to *either*, *both*, or *none* of the `resourceType` and `resourceVersion` fields.
- A change to the root (`yyp`) `resourceVersion` field at the same time as a change to a subresource's structure *might* imply that any project with that version or greater will have the same subresource structure, but we assume that these are uncoupled.
- A change to the structure of some subresource is always coupled to a new IDE version, but it is not clear how *other* IDE versions relate to that. For example, if the Beta channel `2022.800.x.y` release changes the Sprite `.yy` file structure, it's not clear if that also means that stable `2022.8+` will have that same change. Nor is it clear if beta `2022.900+` will not revert to the prior structure.

</details>

<details>

<summary>

Given the uncertainty in determining appropriate data structures for any given project version, Stitch must take a conservative approach to make sparse changes and lean on GameMaker to auto-fix outdated structures.

</summary>

- We work _sparsely_ on project files -- only changing fields that we have a reason to change, and leaving everything else as-is.
- We create project files with _sparse fields_ -- only fields that are required or for which we have initial data to provide.
- Where there is uncertainty we fall back on older resource versions since GameMaker is likely to be able to convert them on load.
- We assume variations are independent (when that can make sense), making inferences per field we need to do something about
- We assume that a resource (any object with a `resourceType` field) version (the sibling `resourceVersion` field)

</details>

### 2022.800.x.y Changes

- The `.yyp` resource version bumped to `1.6`
- The "Windows UWP" and "Xbox One" platforms were removed from the `.yyp` `Options` array.
- Across all `.yyp?` files, `tags` fields whose values were an empty array were automatically purged by GameMaker.
  - Experiments with 2022.600.0.153 showed that these fields were optional in prior versions
- Sprite `.yy` files had significant changes, but the overall data structure stayed intact.
  - In general, some combination of the `resourceType` and `resourceVersion` fields were changed for subresources that changed.
  - The exception was `sprite.yy#/sequence`, which had two fields _removed_ but did not have a bump in version.
  - On load, GameMaker immediately converted the existing sprites to the new format.
- The Stitch behavior changes that accomodates these file changes in the safest way are:
  - Mark `tags` fields as optional in the types
  - Skip the `tags` fields when creating new resource files
  - Before creating or updating a sprite, fetch an existing sprite that contains >0 frames
    - Use the sample sprite to infer the correct subresource type
      - Operate on a per-field basis to make minimum assumptions
    - If no sample is available, use the older format (this is an edge case, and this solution is least likely to break anything permanently)

## File types

The main organizational content of a GameMaker project is in JSON-like files,
typically with extensions `.yyp` or `.yy`. In GMS2.3 these files have trailing
commas (meaning standard JSON parsers cannot read them) and can have Int64 values
(depending on parsing language, meaning data will be lost during save/load).

Each resource, of any type, typically includes a `.yy` file and may also include
files of various resource-specific types.

## Folders

- "Groups" (folders) in GMS2.3 do not also create folders in the local
  file structure.
- Every resource ends up in a flat file structure inside a per-resource-type root folder.
- There is one file folder per resource type.
- Organization of resource files within each resource folder seems to be unchanged relative
  to GMS2.2. _Mostly_ consists of `type/name/name.yy`, sometimes with additional files of various types.
- Which folder an asset is in is determined by that asset's `.yy` file via the `"parent"` field.

Examples:

```jsonc
// For assets in the root level (no parent folder)
// (Just refers to the project itself)
"parent": {
  "name": "sample-project",
  "path": "sample-project.yyp",
},
```

```jsonc
// For assets in folders
// (The "name" is the folder name)
// (The "path" is to a non-existent file and the root is always "folders";
//  dropping ^folders and .yy$ yields the visible path in the tree )
// (Exactly matches name/path in an entry in the .yyp file)
"parent": {
  "name": "level3",
  "path": "folders/sample_resources/level2/level3.yy",
},
```

## Tags

In GMS2.3 resources, folders, etc can have tags. These are used for filtering
content in the resource tree. They are always present as a "tags" field with a
simple list of strings.

## Colors

**Colors are not saved.** You can color-code assets, but these are only stored
at the IDE level and therefore are not accessible by Stitch.

## GUIDs

GMS2 projects use Globally Unique Identifiers (<abbr title="Global Unique Identifier">GUID</abbr>s)
-- also called [<abbr title="Universal Unique Identifier">UUID</a>s](https://en.wikipedia.org/wiki/Universally_unique_identifier)
-- in some places when unique
identifiers are needed but user-provided names are not available.

We don't know what algorithm is used to generate these identifiers, but all our experiments show
that as long as they are dash-separated hex strings with the exact same number of characters as
GUIDs created by GMS2 itself they'll work just fine. We can use either random UUIDs (v4) or
generate them based on well-defined parameters (v3), depending on context.

## YYP <a id="yyp"></a>

Each game project has a root `*.yyp` file that describes all of its resources
and some of its high-level metadata. This is the entry point for GameMaker projects.

The root contents of the GMS2.3 `yyp` file are these:

- `resources`: Lists resources of every type except for folders, options, included files, texture groups, and audio groups
  - example entry: `{"id":{"name":"object","path":"objects/object/object.yy",},"order":4,}`
  - (note the complete absence of IDs)
  - (note trailing commas)
  - (note the use of POSIX-style path separators)
- `Options`: Example `{"name":"Amazon Fire","path":"options/amazonfire/options_amazonfire.yy",}`
- `configs`: Example:

```json
{
  "name": "Default",
  "children": [
    { "name": "steam", "children": [] },
    { "name": "ps5", "children": [] }
  ]
}
```

- `RoomOrderNodes`: `[{"name":"the_room","path":"rooms/the_room/the_room.yy",}]`
- `Folders`: `{"folderPath":"folders/sample_resources/level2/level3.yy","order":1,"resourceVersion":"1.0","name":"level3","tags":[],"resourceType":"GMFolder",}`
  - (resourceType is always GMFolder)
  - (resourceVersion is always "1.0")
- `AudioGroups`: Example `{"targets":461609314234257646,"resourceVersion":"1.0","name":"audiogroup_default","resourceType":"GMAudioGroup",}`
  - (always type "GMAudioGroup")
  - (always "resourceVersion":"1.0")
  - The targets list is binary mask of some sort identify platforms
- `TextureGroups`: Example `{"isScaled":true,"autocrop":true,"border":2,"mipsToGenerate":0,"targets":461609314234257646,"resourceVersion":"1.0","name":"Default","resourceType":"GMTextureGroup",}`
  - (always type "GMTextureGroup")
  - (always "resourceVersion":"1.0")
  - The targets list is binary mask of some sort identify platforms
- `IncludedFiles`: Example `{"CopyToMask":-1,"filePath":"datafiles/level_1","resourceVersion":"1.0","name":"discoverable_datafile.txt","resourceType":"GMIncludedFile",}`
  - (always type "GMIncludedFile")
  - (always "resourceVersion":"1.0")
  - "CopyToMask":-1 means "deploy to all targets". We use different masks based on config and target platform.

## Resources

Resources are found in `resourceType/resource_name` folders, always with a file
called `resourceType/resource_name/resource_name.yy`. These are JSON files whose contents
vary by asset type, but that have the common fields:

```jsonc
{
  "name": "resource_name",
  "resourceType": "GMShader",
  "tags": [],
  // Location in the visible heirarchy (not on disk)
  "parent": {
    "name": "sample_resources",
    "path": "folders/sample_resources.yy"
  },
  "resourceVersion": "1.0" // constant
}
```

Each asset type may include additional files and folders besides the `.yy` file.
Naming conventions for these other files varies by resource type.

### Sprites

Sprites are the most complex content within the GMS2 project file structure.
As with all other resources all their data is defined in a `.yy` file.

#### New (simple) Sprites

A brand new sprite (`sampleSprite`), without adding a custom image or changing any details,
results in the following files:

- `sprites/sampleSprite/`
- `sprites/sampleSprite/sampleSprite.yy`
- `sprites/sampleSprite/{frameId1}.png` Composite image (actually rendered by the game)
- `sprites/sampleSprite/layers/`
- `sprites/sampleSprite/layers/{frameId1}/`
- `sprites/sampleSprite/layers/{frameId1}/{layerId1}.png`

(`frameId1`, `layerId1`, <i>etc</i> are placeholders for random GMS2-generated GUIDs.)

For details on what each of these fields mean and their allowed values, see
[the Typescript typings](../src/types/YySprite.ts).

### Modified (complex) sprites

Using the "Import" option in a sprite causes all image files
to be replaced and all GUIDs to be recomputed.

Adding a new subimage via the Editor leaves the original GUIDs
intact and simply adds the new one.

Sorting subimages via the Editor has no impact on the file
structure, but does change the `.yy` file: the objects in the
`frames` array are are sorted to reflect the order seen in
the editor, as are those in `sequence.tracks.keyframes.Keyframes`.

Adding a new layer creates a new GUID for that layer, with
correspondingly-named images in each `layers/{frameId}`
folder.

Creating a "Layer Group" only changes content in the `.yy`
file: the new group is added to the `layers` array basically
as another layer, but with the added "layers" field that
is another array containing the nested layers. The layer
group does have a GUID, but it does not appear to be used
anywhere else.

A complex sprite (`sampleSprite`) with multiple subimages,
multiple layers, and a layer group results in the following
file structure:

- `sprites/sampleSprite/`
- `sprites/sampleSprite/sampleSprite.yy`
- `sprites/sampleSprite/{frameId1}.png`
- `sprites/sampleSprite/{frameId2}.png`
- `sprites/sampleSprite/{frameId3}.png`
- `sprites/sampleSprite/layers/`
- `sprites/sampleSprite/layers/{frameId1}/`
- `sprites/sampleSprite/layers/{frameId1}/{layerId1}.png`
- `sprites/sampleSprite/layers/{frameId1}/{layerId2}.png`
- `sprites/sampleSprite/layers/{frameId2}/`
- `sprites/sampleSprite/layers/{frameId2}/{layerId1}.png`
- `sprites/sampleSprite/layers/{frameId2}/{layerId2}.png`
- `sprites/sampleSprite/layers/{frameId3}/`
- `sprites/sampleSprite/layers/{frameId3}/{layerId1}.png`
- `sprites/sampleSprite/layers/{frameId3}/{layerId2}.png`

(`frameId1`, `layerId1`, _etc._ are placeholders for random GMS2-generated GUIDs.)

### Sprite Sequence

Each sprite `.yy` file includes a `sequence` field, which has the exact
same structure as the `.yy` file of an independent Sequence resource.
This represents the default animation for a sprite, where the frames
are simply looped over.

In our experiments it does not seem that there is a case where these
sequences living inside a sprite resource are changed, with the
following exceptions:

- `playbackSpeed` and `playbackType` are changed when the "FPS" field
  in the sprite editor is modified.
- `length` reflects the current number of frames
- `tracks.keyframes` reflects the current frames and their order (one
  keyframe object per frame).

### Sprites referenced by Sequence resources

Sprites can be used in Sequence Resources, and their frames can
be directly reference by those sequences. The references are by
index only, so the GUID of the linked frames is not used and any
changes to frames (re-ordering, deletion, or addition) are not
reflected by GameMaker in changes to the code/resources that
refer to them.

For example, if a sprite has two frames, a sequence refers
to frame1 of that sprite, and then we delete frame1 via the
GMS2 editor, the sequence still refers to the same index
position as before. GameMaker allows this, at least in the editor,
with out-of-bounds indexes falling back on the last existing
frame.

Collectively, this means that GameMaker does not dynamically
track references to sprite frames in any way, and any change
that causes a specific image to have a different index will
cause all references to that image to be referencing a different
image now.

### Sprites created in Spine

For each sprite created in spine there are typically 3 exported
files. For a sprite named `mySprite`:

- `mySprite.png` The file containing all sprite frames.
- `mySprite.json` The JSON file describing the bones and animations.
- `mySprite.atlas` A YAML-like file describing where the frames are in the Atlas.

_(When importing manually via the GMS2 IDE, you will only see the PNG
and JSON files in the file chooser. However, if the `.atlas` file is
missing, then import will fail.)_

There can be additional source `.png` files, though it's currently unclear what the scenario is wherein this occurs.

The core of a Spine sprite is the same as a regular sprite.
There are a few differences:

- While a layer, with a random `layerId`, is listed in the `.yy` file, it does not actually need to exist as an image/folder.
- No "composite" images are required
- The spine asset is given a random GUID that we'll call `spineId`
  - The atlas and JSON files are stored in the root, with names
    changed to the `spineId` (keeping their extensions)
  - There is a PNG frame also named after the `spineId`, however it is
    a composite that GameMaker uses to display to the user in
    the Sprite editor and sprite thumbnail. It does not need to be created by tools,
    since GameMaker will auto-generate it
- The original `.png`(s) are copied _as-is_ into the root of the sprite's
  resource folder, without changing their names.

GameMaker 2.3 does not support current versions of Spine. The Spine
JSON file export for the supported version is typed in
[types/Spine.ts](../src/types/Spine.ts).

Note that GameMaker completely ignores audio files associated with
a Spine file, so sounds need to be separately managed.

All we have to do to _create_ a sprite resource from Spine exports is:

1.  Create a new sprite as usual. Defaults are all totally fine. Can
    use the same 64x64 blank image that GameMaker uses.
2.  Copy the spritesheet into the sprite's root without changing the name.
3.  Create a `spineId`
4.  Copy the .atlas and .json files over to the root, renaming them with
    the `spineId`
