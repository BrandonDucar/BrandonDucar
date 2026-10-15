# Inspect A Repository, Keep The Evidence

One small integration using two existing public tools: **Cerberus inspects an
inert repository fixture; Memory Weaver turns the inspected material and receipt
context into a portable knowledge bundle.** No private DreamNet code is required.

[View the executed example](docs/evidence/bundle.json) |
[Read the exported Capsule](docs/evidence/capsule.md) |
[Openable weave archive](docs/evidence/workspace.weave.json) |
[Review the runner](scripts/reproduce-evidence.mjs)

## Reproduce Locally

Requires Git and Node.js 22.13 or newer with built-in TypeScript stripping. No
package install, account, API key, wallet or paid request is needed. Review the
runner and pinned source files before executing them. Cloning downloads source;
the demo itself is local and offline.

From an empty working directory, run each command separately:

```bash
git clone https://github.com/BrandonDucar/BrandonDucar.git
git clone https://github.com/BrandonDucar/dreamnet-cerberus.git
git -C dreamnet-cerberus checkout 9d79def5155a7832b43140de82049aeff58b0866
git clone https://github.com/BrandonDucar/memory-weaver.git
git -C memory-weaver checkout a6f2a155bbbeea5d92879811afafa3fe65b6d828
cd BrandonDucar
node --experimental-strip-types scripts/reproduce-evidence.mjs run
node --experimental-strip-types scripts/reproduce-evidence.mjs verify demo-output/bundle.json
node --experimental-strip-types --test scripts/reproduce-evidence.test.mjs
```

`demo-output` must not already exist. Use `--out another-new-directory` to retain
earlier evidence. For existing checkouts, use `--cerberus /path/to/cerberus` and
`--weaver /path/to/memory-weaver`; do not reset or overwrite somebody else's work.
The runner refuses changed engine files using LF-normalized SHA-256 source locks.

## What Is Actually Checked

1. Cerberus reads two synthetic text files without executing the fixture.
2. The scan finds no static findings, but remains **Orange / denied**:
   a generated local fixture has no authenticated publisher or immutable Git
   revision. We do not invent provenance to manufacture a Green result.
3. Changing an input changes the artifact digest, so the earlier receipt no longer
   describes the changed artifact.
4. An inert install-hook fixture produces a **Red / denied** decision. Nothing
   installs it, runs its hook or contacts its illustrative invalid URL.
5. Memory Weaver ingests the original public fixture text and inspection context,
   preserving source references and producing real topics, relationships and a
   Capsule export. These are computed results, not prefilled UI scores.
6. The saved bundle is reopened, its SHA-256 and Cerberus receipt integrity are
   checked, source bytes are matched to the inspected manifest, and Memory Weaver
   is rerun to compare its semantic result. Tests also reject tampering and missing
   provenance, including when someone recomputes the outer bundle digest.

## Inspect The Artifact

`bundle.json` contains the exact tool revisions, normalized source-file hashes,
runner hash, runtime version, execution time, original/changed/blocked inspection
receipts, synthetic input sources, computed weave and verification hashes.
`capsule.md` is Memory Weaver's existing human-readable export. Its accompanying
`workspace.weave.json` uses Memory Weaver's native archive format and can be
loaded using **Open** in the browser app. Every input keeps its `mock: true`
label and the workspace title explicitly identifies the synthetic example.
Verify the JSON bundle; the Markdown and archive are not separate signed
attestations. The tests compare both exports against the verified bundle.

Unique receipt IDs, run timestamps and filesystem modes can differ across runs
and operating systems. The test compares semantics rather than promising
byte-identical bundles. The checked-in example is one local execution, not an
independent audit; GitHub Actions reruns the pipeline on its own runner.

## Limits And Trust

- Synthetic input, actual tool execution. This does not demonstrate arbitrary
  repository correctness, authenticated ingestion, a hosted backend or adoption.
- All Cerberus receipts and this bundle are **unsigned**. Anyone can rewrite data
  and recompute unkeyed hashes. Hash verification detects inconsistency, not a
  trusted signer, safe software or the truth of every statement.
- Memory Weaver browser hashes are FNV-1a change identifiers, not cryptographic
  signatures. The demo adds SHA-256 transport integrity without relabeling them.
- No model/provider is called. This is not a credit-savings or revenue benchmark.
- The runner reads only the two explicitly selected public engine modules and
  its own generated fixture. It does not scan private repositories or credentials.
- The products remain independent with their own licenses and release cycles.

For help use the [product intake](https://github.com/BrandonDucar/BrandonDucar/issues/new?template=01-product-help.yml).
Private operations and the `dream-net` monorepo stay private.
