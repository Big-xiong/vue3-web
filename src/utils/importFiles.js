/* eslint-disable indent */
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import { i18n } from '@/init';
import config from '@/current_project/config/index';

let moduleRes;

function replaceStr({
  arr, txt, prefix, surfix,
}, fn) {
  const len = prefix.length;
  if (!surfix) surfix = prefix;
  arr.forEach((str) => {
    if (prefix !== surfix) {
      const [title, link] = str.split(')[');
      txt = txt.replaceAll(`${prefix}${str}${surfix}`, `<a style="color: #2d64b3" href="${link}">${title}</a>`);
    } else {
      const txtIndex = txt.indexOf(str);
      if (txtIndex !== -1) {
        let strTemp = txt.substr(txtIndex - len);
        strTemp = strTemp.replace(`${prefix}${str}${surfix}`, `<b>${str}</b>`);
        txt = `${txt.substr(0, txtIndex - len)}${strTemp}`;
      }
    }
  });
  return txt;
}
// seo
export async function getSeoProtocol() {
  try {
    let res;
    switch (i18n.global.locale) {
      case 'zh-CN':
        res = await import(`/public/seo/footer/50001/zh-CN.txt?raw`);
        break;
      case 'en':
        res = await import(`/public/seo/footer/50001/en.txt?raw`);
        break;
      case 'th':
        res = await import(`/public/seo/footer/50001/th.txt?raw`);
        break;
      case 'vi':
        res = await import(`/public/seo/footer/50001/vi.txt?raw`);
        break;
    }
    // -- xxx 高亮效果
    let txt = res.default.replace(/^--(.*)\n/gm, ($0) => `<span style="color: var(--theme-color)">${$0.replace('-- ', '')}</span>`);
    // ** xxx ** 加粗效果
    const txtWeightMatches = txt.match(/(?<=\*\*)[^**]+/gm).filter((_, index) => index % 2 === 0);
    txt = replaceStr({ arr: txtWeightMatches, txt, prefix: '**' });
    // (link标题)(link地址) link效果
    const txtLinkMatches = txt.match(/(?<=\()[^)[]+(.*)(?=\])/gm);// .filter((_, index) => index % 2 === 0 && index);
    txt = replaceStr({
      arr: txtLinkMatches, txt, prefix: '(', surfix: ']',
    });
    txt = txt.replaceAll('\n', '<br />');
    return Promise.resolve(txt);
  } catch (error) {

  }
}

// 代理注册条款
export async function getProtocol() {
  switch (i18n.global.locale) {
    case 'zh-CN':
      moduleRes = await import(`/public/data/protocol/agentCN.txt?raw`);
      break;
    case 'en':
      moduleRes = await import(`/public/data/protocol/agentEN.txt?raw`);
      break;
    case 'th':
      moduleRes = await import(`/public/data/protocol/agentTH.txt?raw`);
      break;
    case 'vi':
      moduleRes = await import(`/public/data/protocol/agentVI.txt?raw`);
      break;
  }
  const txt = moduleRes.default.replace(/\{{2}(.+?)\}{2}/g, (_, $1) => {
    $1 = $1.trim();
    return $1.startsWith('window') ? eval($1) : config[$1];
  });
  return Promise.resolve(txt);
}

// 会员注册条款
export async function getMemberProtocol() {
  switch (i18n.global.locale) {
    case 'zh-CN':
      moduleRes = await import(`/public/data/protocol/memberCN.txt?raw`);
      return Promise.resolve(moduleRes.default);
    case 'en':
      moduleRes = await import(`/public/data/protocol/memberEN.txt?raw`);
      return Promise.resolve(moduleRes.default);
    case 'th':
      moduleRes = await import(`/public/data/protocol/memberTH.txt?raw`);
      return Promise.resolve(moduleRes.default);
    case 'vi':
      moduleRes = await import(`/public/data/protocol/memberVI.txt?raw`);
      return Promise.resolve(moduleRes.default);
  }
}
