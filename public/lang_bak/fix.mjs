/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';
import glob from 'glob';
import enFix from './en-fix.mjs';

glob('./*.mjs', async (err, files) => {
  const module = await import('./en.mjs');
  let write = false;
  for (const key in enFix) {
    if (module.default[key] !== enFix[key]) {
      write = true;
      module.default[key] = enFix[key];
    }
  }
  if (write) fs.writeFileSync(file, `export default ${JSON.stringify({ ...module.default })};`);
  files.forEach(async (file) => {
    if (['./en-fix.mjs', './fix.mjs', './en.mjs'].some((item) => item === file) || file.includes('en_')) return;
    const otherModule = await import(file);
    // console.log(file, Object.keys(otherModule.default).length, [...new Set(Object.keys(otherModule.default))].length);
    for (const key in module.default) {
      otherModule.default[module.default[key]] = otherModule.default[key];
      delete otherModule.default[key];
    }
    fs.writeFileSync(`${file.replace('./', './en_')}`, `export default ${JSON.stringify({ ...otherModule.default })};`);
  });
});
