import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../docs');
const catalog=JSON.parse(fs.readFileSync(path.join(site,'catalog.json'),'utf8'));
const names=new Set();
const pages=['index.html'];
for(const project of catalog.projects){
  assert(/^[A-Za-z0-9_-]+$/.test(project.name),'Unsafe project path');
  assert(!names.has(project.name),'Duplicate project');names.add(project.name);
  assert(project.title&&project.description&&project.kind,'Missing project metadata');
  assert.equal(new URL(project.repo).hostname,'github.com','Invalid source destination');
  for(const u of [project.homepage,project.demo].filter(Boolean))assert.equal(new URL(u).protocol,'https:','Non-HTTPS destination');
  pages.push('projects/'+project.name+'/index.html');
}
let internalLinks=0;
for(const relative of pages){
  const file=path.join(site,relative),html=fs.readFileSync(file,'utf8');
  for(const token of ['<title>','name="description"','rel="canonical"','<h1>','og:image'])assert(html.includes(token),relative+' missing '+token);
  const preview=html.match(/property="og:image" content="([^"]+)"/)?.[1];
  assert(preview,'Missing sharing preview');
  const previewPath=new URL(preview).pathname.replace(/^\/BrandonDucar\//,'');
  assert(fs.existsSync(path.join(site,previewPath)),relative+' missing preview file');
  assert(!/\b(?:undefined|null)\b/.test(html),relative+' unresolved value');
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const value=match[1];if(/^(https?:|#)/.test(value))continue;
    const target=path.resolve(path.dirname(file),value.split('#')[0]);
    assert(target.startsWith(site+path.sep),relative+' escapes site');
    assert(fs.existsSync(target),relative+' broken link '+value);internalLinks++;
  }
}
console.log(JSON.stringify({ok:true,pages:pages.length,internalLinks}));
