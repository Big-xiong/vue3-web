/* eslint-disable indent */
/* eslint-disable prefer-const */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { loadEnv } = require('vite');

const args = process.argv.slice(2);
let templateName = args[0];

const langConfig = ['zh-CN', 'en', 'th', 'vi'];

const getPath = (dir) => path.resolve(__dirname, dir);

const html = fs.readFileSync(getPath('../dist/index.html')).toString();

let currentConfig = fs.readFileSync(getPath(`../src/current_project/config/index.js`)).toString();
currentConfig = currentConfig.replace('export default ', '').replace('{', '').replace('};', '');
currentConfig = currentConfig.split('\n').filter(Boolean).reduce((curr, next) => {
  let [key, value] = next.trim().split(',')[0].split(':');
  value = value.trim().replace(/'|"/g, '');
  curr[key] = ['title', 'desktopFileName'].includes(key) ? value : JSON.parse(value);
  return curr;
}, {});

let navPageConfig = {
  __global: {},
};
try {
  navPageConfig = require(`../public/seo/title/${templateName}`);
} catch (error) { }

const { VITE_APP_WEB_API_URL, VITE_APP_MERCHANT_NO } = loadEnv('production', process.cwd());

(async () => {
  const seoResult = await axios(
    `${VITE_APP_WEB_API_URL}seoinfo?merchant_no=${VITE_APP_MERCHANT_NO}`,
  );
  console.log(seoResult);
  const { title_trans = {}, keywords_trans = {}, description_trans = {} } = seoResult;

  if (currentConfig.isI18n) {
    for (let i = 0; i < langConfig.length; i += 1) {
      const lang = langConfig[i];
      const key = lang === 'zh-CN' ? 'zh' : lang;
      const title = title_trans[key];
      const keywords = keywords_trans[key];
      const description = description_trans[key];

      const seoMaps = {
        title,
        keywords,
        description,
        ...navPageConfig.__global,
      };

      let metaHTML = Object.entries(seoMaps).reduce((curr, next) => {
        if (next[0] === 'title') {
          curr += `<${next[0]}>${next[1]}</${next[0]}>`;
        } else {
          curr += `<meta name='${next[0]}' content='${next[1]}' />`;
        }
        return curr;
      }, '');

      const targetPath = getPath(`../dist/${lang}`);
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath);
      }

      if (lang === 'vi') {
        for (const page in navPageConfig) {
          let pageHtml = Object.entries({ ...seoMaps, ...navPageConfig[page] }).reduce((curr, next) => {
            if (next[0] === 'title') {
              curr += `<${next[0]}>${next[1][lang]}</${next[0]}>`;
            } else {
              if (next[0] === 'og:url') seoMaps[next[0]] = `${seoMaps[next[0]]}${lang}`;
              curr += `<meta name='${next[0]}' content='${next[1][lang] || seoMaps[next[0]]}' />`;
            }
            return curr;
          }, '');

          pageHtml += `<link rel="canonical" href="https://blizzwin.com/${lang}/${page}" /><link rel="alternate" hreflang="${lang === 'vi' ? 'vi-vn' : lang
            }" href="https://blizzwin.com/${lang}/${page}">`;

          const pagePath = getPath(`../dist/${lang}/${page}`);
          fs.mkdirSync(pagePath);
          fs.writeFileSync(`${pagePath}/index.html`, html.replace('<!--head-tags-->', pageHtml));
        }
      }

      metaHTML += `<link rel="canonical" href="https://blizzwin.com/${lang}/" /><link rel="alternate" hreflang="${lang === 'vi' ? 'vi-vn' : lang
        }" href="https://blizzwin.com/${lang}/">`;

      const targetHTML = html.replace('<!--head-tags-->', metaHTML);
      // 写入根index.html，无后缀生效
      if (lang === 'en') {
        fs.writeFileSync(getPath(`../dist/index.html`), targetHTML);
      }
      fs.writeFileSync(getPath(`../dist/${lang}/index.html`), targetHTML);
    }
  } else {
    const { title, keywords, description } = seoResult;
    const seoMaps = {
      title,
      keywords,
      description,
      ...navPageConfig.__global,
    };

    let metaHTML = Object.entries(seoMaps).reduce((curr, next) => {
      if (next[0] === 'title') {
        curr += `<${next[0]}>${next[1]}</${next[0]}>`;
      } else {
        curr += `<meta name='${next[0]}' content='${next[1]}' />`;
      }
      return curr;
    }, '');
    const targetHTML = html.replace('<!--head-tags-->', metaHTML);
    fs.writeFileSync(getPath(`../dist/index.html`), targetHTML);
  }
})();
