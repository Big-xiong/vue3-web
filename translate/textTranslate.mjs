// import shell from "shelljs";
import fs from 'fs';
import glob from 'glob';
// import enLocale from "../src/i18n/en.js";
import clArgs from 'command-line-args';
import path from 'path';
import { translateText, getKeyJson, replaceAll } from './googleTranslate.mjs';

const langs = ['zh', 'vi', 'th', 'en'];

const args = clArgs([
    {
        name: 'file',
        alias: 'f',
        type: String
    },
    {
        name: 'batch',
        alias: 'b',
        type: Number,
        defaultOptions: true,
        defaultValue: 50
    },
    {
        name: 'str',
        alias: 's',
        type: String,
        multiple: true
    },
    {
        name: 'help',
        alias: 'h',
        type: Boolean
    },
    {
        name: 'langFolder',
        alias: 'l',
        type: String,
        defaultOptions: true,
        defaultValue: '../public/language/*.mjs'
    },
    {
        name: 'key',
        alias: 'k',
        type: String,
        defaultOptions: true,
        defaultValue: path.resolve('./key.json')
    },
]);

getKeyJson(args.key);

// async function translateText(text, target) {
//     const res = shell.exec(`./curl.sh ${text} ${target} ${keyFile}`);
//     try {
//         let {translations} = JSON.parse(res.stdout)?.data;
//         translations = Array.isArray(translations) ? translations : [translations];
//         return translations.map(item => item.translatedText)
//             .join('');
//     } catch (error) {
//         console.error('translate error: ', res, text, target);
//         return text
//     }
// }

function writeFile(path, to, objs = [], defaultLocal = {}) {
    if (!objs.length) {
        console.log(`${to} 语种文件没有需要翻译的内容`);
        return;
    }
    const map = {};
    return Promise.all(
        [
            translateText(objs.join('\n'), to)
                .then((res) => {
                    // map[text] = res[0].toUpperCase() + res.slice(1);
                    const result = res.split('\n');
                    objs.forEach((s, i) => {
                        const item = result[i];
                        map[s] = item[0].toUpperCase() + item.slice(1);
                    });
                })
                .catch((err) => {
                    console.error(err);
                })
        ]
    )
        .then(() => {
            const prefix = args.langFolder.includes('mjs') ? 'export default ' : 'module.exports = ';
            fs.writeFileSync(path, `${prefix}${JSON.stringify({ ...defaultLocal, ...map })};`);
            console.log(`${to} 语种翻译完毕，一共 ${objs.length} 条`)
        });
}

const localMap = new Set();
let textToTranslate = [];

// (async () => {
if (args.help) {
    console.log('-f string 使用-f指定一个包含字符串数组的json文件，比如：-f ./test.json');
    console.log('-s string 使用-s指定翻译的字符串，可以输入多个比如: -s 测试1 测试2');
    console.log('-l string 使用-l指定语言文件目录,比如: ../src/i18n/*.js');
    console.log('-k string 使用-k指定谷歌鉴权json,如果不传默认生成一个。比如: ./key.json');
} else if (args.file && fs.existsSync(path.resolve(args.file))) {
    try {
        const json = JSON.parse(fs.readFileSync(path.resolve(args.file))
            .toString());
        if (!Array.isArray(json)) {
            console.error('指定的文件必须是一个字符串数组');
        }
        textToTranslate = json;
    } catch (e) {
        throw new Error('指定的json文件不存在或者不是合法的json');
        // return
    }
} else if (args.str) {
    textToTranslate = args.str;
} else {
    console.error('请用-f指定json文件（包含字符串数组）或者用-s直接指定字符串或者字符串数组');
}

if (textToTranslate.length) {
    // const enFile = glob.sync(args.langFolder.replace('*', 'en'))
    let enLocale = null;
    // if (enFile.length) {
    glob(path.resolve(args.langFolder), (err, files) => {
        files
            .filter((file) => {
                const suffix = file.split('/')
                    .pop()
                    .split('.')
                    .shift();

                return langs.some(item => suffix.includes(item));
            })
            .forEach(async (file) => {
                const suffix = file.split('/')
                    .pop()
                    .split('.')
                    .shift();
                // if (suffix !== 'zh-TW') return;
                if (!enLocale) {
                    try {
                        enLocale = (await import(args.langFolder.replace('*', 'en')))?.default ?? null;
                    } catch (e) {
                        throw new Error('无法找到英文语言文件：' + args.langFolder);
                    }
                    // if (!enLocale) {
                    // }
                }

                let targetLocale = enLocale;
                try {
                    if (suffix !== 'en') {
                        const targetFile = await import(file);
                        targetLocale = targetFile.default;
                    }
                } catch (error) {
                }

                const temp =
                    suffix === 'en' || (targetLocale && Object.keys(targetLocale).length)
                        ? [...textToTranslate]
                        : [...Object.keys(enLocale), ...textToTranslate];

                const objs = [];

                let num = 0;
                let shift = null;
                while ((shift = temp.shift())) {
                    shift = replaceAll('\n', '', shift);
                    const enTarget = enLocale[shift]
                    if ( enTarget && targetLocale[shift]) {
                        continue
                    }
                    if (!Array.isArray(objs[num])) {
                        objs[num] = [shift];
                    } else {
                        objs[num].push(shift);
                    }
                    if (objs[num].length % args.batch === 0) {
                        num += 1;
                    }
                }

                await writeFile(file, suffix, objs, targetLocale ?? {});
            });
    });
    // } else {
    //     console.error('无法找到英文语言文件：', args.langFolder)
    // }
}
