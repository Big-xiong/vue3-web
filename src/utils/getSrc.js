/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { reactive } from 'vue';

const fileMap = reactive({});
const allFiles = import.meta.glob(`/src/assets/**/*.{png,jpg,gif,webp,mp4}`);
const currentFiles = import.meta.glob(`/src/current_project/assets/**/*.{png,jpg,gif,webp,mp4}`);
const mergeFiles = { ...currentFiles, ...allFiles };

const findSrc = (key, path, defaultPath) => {
  if (!defaultPath.includes('/')) {
    let [start, end] = path?.split('.') ?? [];
    start = start?.split('/') ?? [];
    start.pop();
    defaultPath = `${start.join('/')}/${defaultPath}.${end}`;
  }

  const targetPath = mergeFiles[path] ? path : defaultPath;
  if (!fileMap[key]) {
    mergeFiles[targetPath]?.()?.then?.((res) => {
      fileMap[key] = res.default;
    });
  }

  return defaultPath;
};

export const $getSrc = ($store, path, defaultPath = '') => {
  const { lang, darkTheme } = $store.state.app;

  const findPathList = new Set();
  const isLangChanged = lang !== 'zh-CN';
  const isCurrentPath = path.includes('src/current_project/');
  let parsePath = path;

  if (!isCurrentPath) {
    parsePath = parsePath.replace('/assets/', '/current_project/assets/');
  }
  if (darkTheme) {
    if (isLangChanged) {
      findPathList.add(`${parsePath.replace('/images/', `/dark/${lang}/`)}`);
    }
    findPathList.add(`${parsePath.replace('/images/', `/dark/`)}`);
  }
  if (isLangChanged) {
    findPathList.add(`${parsePath.replace('/assets/', `/assets/${lang}/`)}`);
  }

  findPathList.add(parsePath);
  findPathList.add(path);

  for (const itemPath of [...findPathList]) {
    const dPath = findSrc(path, itemPath, defaultPath);
    const resultPath = fileMap[path] || fileMap[dPath];
    if (resultPath) {
      return resultPath;
    }
    if (mergeFiles[itemPath]) break;
  }
};
