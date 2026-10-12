export const supportUrl = 'https://github.com/BrandonDucar/BrandonDucar/blob/main/SUPPORT.md';
export const discussionUrl = 'https://github.com/BrandonDucar/Dreamnet/discussions';

const templates = {
  help: '01-product-help.yml',
  integration: '02-integration.yml',
  directory: '03-directory.yml'
};

export function requestUrl(kind, project = 'Public directory') {
  if (!Object.hasOwn(templates, kind)) throw new Error('Unknown request type');
  const url = new URL('https://github.com/BrandonDucar/BrandonDucar/issues/new');
  url.searchParams.set('template', templates[kind]);
  url.searchParams.set('product', project);
  return url.href;
}
