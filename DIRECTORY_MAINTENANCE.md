# Public Directory Maintenance

The GitHub Pages source is `main:/docs`. The static directory requires no API
keys, application backend, external fonts, model calls, or build dependencies.
It does not replace the linked applications or certify their runtimes.

## Update

1. Edit public project metadata in `docs/catalog.json`.
2. Keep project names aligned with repository names. Preserve fork attribution.
3. Update actual screenshot files in `docs/assets/` only with public-safe captures.
4. Run `node scripts/build-directory.mjs` (Node.js 20+).
5. Run `node scripts/check-directory.mjs`.
6. Run `node --test scripts/visitor-paths.test.mjs`.
7. Review generated changes and inspect desktop/mobile layouts before merging.

The generator owns the HTML, CSS, search script, sitemap, and robots file.
The catalog owns titles, descriptions, type labels, source links, and destinations.
Capture dates and editorial copy are in the generator; update them when evidence
changes. Do not turn a prototype label into a production claim without evidence.

`scripts/visitor-paths.mjs` constructs project-prefilled public intake links.
The form files in `.github/ISSUE_TEMPLATE/` must retain the `product` field ID.
Every directory page links to help, integration proposals and page corrections.
This shared intake is a fallback for visitors, not a shared product runtime or a
promise of support for every upstream fork. Product-specific trackers remain
owned by their respective maintainers. Do not link disabled fork issue trackers.

GitHub About metadata is managed separately; changing the catalog does not
silently change another repository's description, topics, or homepage.

## Evidence Boundaries

- The directory is an October 9, 2026 inventory, not a live fleet monitor.
- Actual screenshots can contain synthetic example data; captions must say so.
- Source availability does not imply an unrestricted open-source license.
- A frontend HTTP 200 does not verify authenticated backend operations.
- Do not add private inventories, traffic reports, credentials, or internal paths.

Rollback a directory change with a reviewed Git revert. Do not overwrite
concurrent contributions or delete the Pages site to undo a content change.

## Reproducible Example

The profile and Cerberus/Memory Weaver directory pages link the existing public
tools through `scripts/reproduce-evidence.mjs`, not a new hosted runtime. Read
[the reproduction guide](REPRODUCIBLE_DEMO.md). Tool revisions and LF-normalized
entry-file SHA-256 values live in `scripts/demo-sources.json`. Changing either
requires review and new test evidence; the loader fails closed on source drift.

`docs/evidence/bundle.json`, `capsule.md` and `workspace.weave.json` are generated public-safe artifacts
from one local execution. They contain synthetic sources and unsigned receipts,
not private inventories or a production claim. To refresh, generate into a new
directory, verify it, review it for privacy, then replace only those generated
artifacts. Never invent result counters in the HTML. The directory generator
reads the artifact's time, counts and verdicts.

Run `node --experimental-strip-types --test scripts/reproduce-evidence.test.mjs`
with the pinned public checkouts available. CI checks both Node 22 and Node 24,
without installing dependencies or fetching private code. Reproduction means
matching semantic results; random receipt IDs, times and filesystem modes are
not promised to be byte-identical across machines.
