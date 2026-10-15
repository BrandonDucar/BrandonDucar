import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {requestUrl} from './visitor-paths.mjs';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const catalog = JSON.parse(read('docs/catalog.json'));
const templates = ['01-product-help.yml', '02-integration.yml', '03-directory.yml'];

test('request URLs preserve project names without query injection', () => {
  for (const project of ['Darkhalo', 'two tools & privacy?#', '<script>']) {
    const url = new URL(requestUrl('integration', project));
    assert.equal(url.origin, 'https://github.com');
    assert.equal(url.pathname, '/BrandonDucar/BrandonDucar/issues/new');
    assert.equal(url.searchParams.get('product'), project);
    assert.equal(url.searchParams.get('template'), templates[1]);
    assert.equal([...url.searchParams].length, 2);
    assert.equal(url.hash, '');
  }
  assert.throws(() => requestUrl('delete'), /Unknown request/);
  assert.throws(() => requestUrl('__proto__'), /Unknown request/);
});

test('default intake identifies the public directory', () => {
  assert.equal(new URL(requestUrl('help')).searchParams.get('product'), 'Public directory');
});

test('every generated page has correctly scoped help, integration and correction links', () => {
  const pages = [{name: 'Public directory', file: 'docs/index.html'}, ...catalog.projects.map(p => ({...p, file: `docs/projects/${p.name}/index.html`}))];
  for (const page of pages) {
    const html = read(page.file);
    for (const [kind, template] of ['help', 'integration', 'directory'].map((k, n) => [k, templates[n]])) {
      const match = html.match(new RegExp(`data-action="${kind}" href="([^"]+)"`));
      assert(match, `${page.name}: missing ${kind}`);
      const url = new URL(match[1].replaceAll('&amp;', '&'));
      assert.equal(url.searchParams.get('product'), page.name);
      assert.equal(url.searchParams.get('template'), template);
      assert.equal(url.pathname, '/BrandonDucar/BrandonDucar/issues/new');
    }
    assert(html.includes('public GitHub conversations'));
    if (page.isFork) {
      assert(html.includes('follow its upstream contribution guidance'));
      assert(!html.includes(`href="${page.repo}/issues"`), 'Do not send visitors to a disabled fork issue tracker');
    }
  }
});

test('all form links refer to existing templates with a required product field', () => {
  for (const template of templates) {
    const text = read(`.github/ISSUE_TEMPLATE/${template}`);
    assert.match(text, /id: product\s+attributes:\s+label: [^\n]+(?:\s+placeholder: [^\n]+)?\s+validations:\s+required: true/);
    assert(text.includes('name:'));
    assert(text.includes('description:'));
  }
});

test('public support copy preserves independence and private reporting boundaries', () => {
  const support = read('SUPPORT.md');
  assert(support.includes('independently scoped'));
  assert(support.includes('Do not assume a confidential channel exists'));
  assert(!support.includes('C:/Users/'));
  assert(fs.existsSync(fileURLToPath(new URL('CONTRIBUTING.md', root))));
});

test('flagship visitor paths expose the actual evidence with its limits', () => {
  const evidence = JSON.parse(read('docs/evidence/bundle.json'));
  for (const page of ['docs/index.html', 'docs/projects/dreamnet-cerberus/index.html', 'docs/projects/memory-weaver/index.html']) {
    const html = read(page);
    assert(html.includes('id="verified-example"'));
    assert(html.includes(evidence.generatedAt));
    assert(html.includes(`${evidence.sources.length} source records`));
    assert(html.includes('Synthetic inputs. Actual tool execution. Unsigned receipts.'));
    assert(html.includes('ORANGE / denied'));
    assert(html.includes('RED / denied'));
    assert(html.includes('REPRODUCIBLE_DEMO.md'));
    assert(html.includes('evidence/bundle.json'));
  }
  assert(read('docs/index.html').indexOf('id="verified-example"') < read('docs/index.html').indexOf('Inside the tools'));
  assert(read('README.md').includes('REPRODUCIBLE_DEMO.md'));
});
