import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {loadTools, runDemo, seal, sha256, toWorkspace, verifyBundle} from './reproduce-evidence.mjs';

const locations = {cerberus: process.env.CERBERUS_DEMO_ROOT, weaver: process.env.WEAVER_DEMO_ROOT};
const tools = await loadTools(locations);
const now = new Date('2026-10-15T20:00:00.000Z');
const sample = runDemo(tools, now);

test('real Cerberus output becomes reproducible Memory Weaver context', () => {
  const result = verifyBundle(sample, tools);
  assert.equal(result.valid, true);
  assert.equal(result.sourceCount, 3);
  assert.equal(result.receiptCount, 3);
  assert(result.relationshipCount > 0);
  assert.equal(sample.receipts.initial.verdict, 'orange');
  assert.equal(sample.receipts.blocked.verdict, 'red');
});

test('semantic weave is reproducible despite unique receipt IDs', () => {
  const replay = runDemo(tools, now);
  assert.equal(replay.weaveSha256, sample.weaveSha256);
  assert.equal(replay.receipts.initial.artifact.digest, sample.receipts.initial.artifact.digest);
  assert.notEqual(replay.weave.receipt.id, sample.weave.receipt.id);
});

test('outer bundle corruption is rejected', () => {
  const changed = structuredClone(sample);
  changed.generatedAt = '2000-01-01T00:00:00.000Z';
  assert.throws(() => verifyBundle(changed, tools), /Bundle SHA-256 mismatch/);
});

test('recomputing the outer digest does not hide receipt tampering', () => {
  const changed = structuredClone(sample);
  changed.receipts.initial.verdict = 'green';
  assert.throws(() => verifyBundle(seal(changed), tools), /receipt integrity mismatch/);
});

test('source body changes cannot reuse an inspected file digest', () => {
  const changed = structuredClone(sample);
  changed.sources[0].content += 'Altered';
  assert.throws(() => verifyBundle(seal(changed), tools), /inspected bytes/);
});

test('missing provenance cannot silently pass', () => {
  const changed = structuredClone(sample);
  changed.sources[0].origin = 'fixture:unrelated.md';
  assert.throws(() => verifyBundle(seal(changed), tools), /Missing source provenance/);
});

test('a forged weave does not pass even when its outer digest is updated', () => {
  const changed = structuredClone(sample);
  changed.weave.topics[0].label = 'Invented result';
  assert.throws(() => verifyBundle(seal(changed), tools), /does not reproduce/);
});

test('synthetic and unsigned labels cannot be promoted', () => {
  for (const [key, value] of [['syntheticInputs', false], ['attestation', 'signed']]) {
    const changed = structuredClone(sample);
    changed.scope[key] = value;
    assert.throws(() => verifyBundle(seal(changed), tools));
  }
});

test('source lock drift fails closed before loading a different engine', () => {
  assert.throws(() => verifyBundle(seal({...sample, tools: {}}), tools), /Tool versions differ/);
});

test('loader refuses modified engine bytes before importing them', async context => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamnet-demo-test-'));
  context.after(() => {
    assert.equal(path.dirname(parent), fs.realpathSync(os.tmpdir()));
    assert(path.basename(parent).startsWith('dreamnet-demo-test-'));
    fs.rmSync(parent, {recursive: true, force: true});
  });
  const entry = path.join(parent, 'packages/cerberus-core/src/index.mjs');
  fs.mkdirSync(path.dirname(entry), {recursive: true});
  fs.writeFileSync(entry, 'throw new Error("This modified engine must never be imported");');
  await assert.rejects(loadTools({cerberus: parent}), /source differs from the reviewed public version/);
});

test('published example verifies with the same real engines', () => {
  const published = JSON.parse(fs.readFileSync(new URL('../docs/evidence/bundle.json', import.meta.url), 'utf8'));
  assert.equal(verifyBundle(published, tools).valid, true);
  const archive = JSON.parse(fs.readFileSync(new URL('../docs/evidence/workspace.weave.json', import.meta.url), 'utf8'));
  assert.equal(archive.format, 'memory-weaver-archive');
  assert.deepEqual(archive.workspace, toWorkspace(published));
  assert.equal(fs.readFileSync(new URL('../docs/evidence/capsule.md', import.meta.url), 'utf8'),
    tools.weaver.toCapsuleMarkdown(archive.workspace));
});

test('CLI persists, reopens and verifies output without overwriting evidence', context => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'dreamnet-demo-test-'));
  context.after(() => {
    assert.equal(path.dirname(parent), fs.realpathSync(os.tmpdir()));
    assert(path.basename(parent).startsWith('dreamnet-demo-test-'));
    fs.rmSync(parent, {recursive: true, force: true});
  });
  const out = path.join(parent, 'evidence');
  const cli = fileURLToPath(new URL('reproduce-evidence.mjs', import.meta.url));
  const options = Object.entries(locations).filter(([, value]) => value).flatMap(([name, value]) => [`--${name}`, value]);
  const invoke = args => spawnSync(process.execPath, ['--experimental-strip-types', cli, ...args, ...options], {encoding: 'utf8'});
  const first = invoke(['run', '--out', out]);
  assert.equal(first.status, 0, first.stderr);
  const receipt = fs.readFileSync(path.join(out, 'bundle.json'));
  assert.equal(invoke(['verify', path.join(out, 'bundle.json')]).status, 0);
  assert(fs.readFileSync(path.join(out, 'capsule.md'), 'utf8').includes('Synthetic Cerberus evidence handoff'));
  const archive = JSON.parse(fs.readFileSync(path.join(out, 'workspace.weave.json'), 'utf8'));
  assert.equal(archive.format, 'memory-weaver-archive');
  assert.deepEqual(archive.workspace.sources, JSON.parse(receipt).sources);
  assert.notEqual(invoke(['run', '--out', out]).status, 0);
  assert.equal(sha256(fs.readFileSync(path.join(out, 'bundle.json'))), sha256(receipt));
  assert.notEqual(invoke(['run', '--force']).status, 0);
});
