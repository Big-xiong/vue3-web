import glob from 'fast-glob';
import tinify from 'tinify';
import fs from 'fs';
import path from 'path';

// 修改这个key
tinify.key = 'BhBxX8hkWv6pqXdQLsYths2WvwgZrX6v';

const logFile = './image-compressed.log';
let wroteFils = [];

(async () => {
  const files = glob.sync(`../subReplace/**/*.png`);

  if (fs.existsSync(logFile)) {
    wroteFils = fs.readFileSync(logFile).toString().split('\n');
  }

  console.log(files)

  for (const file of files) {
    if (wroteFils.includes(file) || file.includes("git")) {
      continue;
    }
    console.log('compressing', file);
    const source = tinify.fromFile(file);
    await source.toFile(file);
    fs.appendFileSync(logFile, `${file}\n`);
    wroteFils.push(file);
    console.log('compressed ', file);
  }
})();
