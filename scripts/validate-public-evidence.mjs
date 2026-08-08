import { readFile } from 'node:fs/promises';
import process from 'node:process';

const document = JSON.parse(await readFile(new URL('../PUBLIC_EVIDENCE.json', import.meta.url), 'utf8'));
const expectedSchema = 'dreamnet.public-evidence-index.v1';
const shaPattern = /^[a-f0-9]{40}$/;
const names = new Set();
const failures = [];

if (document.schemaVersion !== expectedSchema) failures.push(`schemaVersion must be ${expectedSchema}`);
if (!Array.isArray(document.repositories) || document.repositories.length === 0) {
  failures.push('repositories must be a non-empty array');
}

for (const repository of document.repositories ?? []) {
  if (!repository.name) failures.push('repository name is required');
  if (names.has(repository.name)) failures.push(`duplicate repository: ${repository.name}`);
  names.add(repository.name);

  if (!shaPattern.test(repository.commit ?? '')) {
    failures.push(`${repository.name}: commit must be a 40-character lowercase SHA`);
  }
  if (!repository.branch) failures.push(`${repository.name}: branch is required`);
  if (!repository.role) failures.push(`${repository.name}: role is required`);

  const workflow = repository.commitWorkflow;
  if (workflow) {
    if (!['success', 'failure', 'cancelled', 'skipped', 'timed_out'].includes(workflow.conclusion)) {
      failures.push(`${repository.name}: unsupported workflow conclusion`);
    }
    const expectedPrefix = `https://github.com/${document.owner}/${repository.name}/actions/runs/`;
    if (!workflow.url?.startsWith(expectedPrefix)) {
      failures.push(`${repository.name}: workflow URL does not match repository`);
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Validated ${document.repositories.length} commit-pinned public repositories.`);
