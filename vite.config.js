/* eslint-disable no-restricted-syntax */
import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { createStyleImportPlugin, VantResolve } from 'vite-plugin-style-import';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import AutoImport from 'unplugin-auto-import/vite';
import visual from 'rollup-plugin-visualizer';
import subConfig from './src/current_project/config';

const request = require('request-promise');
const vueJsxPlugin = require('@vitejs/plugin-vue-jsx');
const vuePlugin = require('@vitejs/plugin-vue');

let seoInfo = {};

// 是否开启OSS加速（包含大陆、海外）
// 可选参数类型: Boolean | String
// Boolean: 国内和海外均开启/关闭加速
// String: 指定单项开启加速 可选值: bos | s3 (bos为国内，s3为海外)
const OSSResourceAcceleration = false;

const htmlPlugin = ({
  VITE_APP_MERCHANT_NO, VITE_APP_WEB_API_URL, VITE_APP_ASSET_PATH_BOS, VITE_APP_ASSET_PATH_S3,
}, isDevelopment, isOverseas) => ({
  name: 'html-transform',
  async transformIndexHtml(html) {
    if (!Object.keys(seoInfo).length) {
      seoInfo = await request({
        url: `${VITE_APP_WEB_API_URL}/seoinfo?lang=zh&merchant_no=${VITE_APP_MERCHANT_NO}`,
        json: true,
        headers: {
          'User-Agent': 'Request-Promise',
        },
      });
      console.log(`当前后台配置站点信息为：\n`, `${VITE_APP_WEB_API_URL}/seoinfo?lang=zh&merchant_no=${VITE_APP_MERCHANT_NO}\n`, seoInfo);
    }
    const { title = subConfig.title, keywords = '', description = '' } = seoInfo?.data ?? {};
    html = html.replace(
      /<!--head-tags-->/,
      `<!--head-base--><title>${title}</title><meta name='keywords' content='${keywords}' /><meta name='description' content='${description}' />`,
    );

    if (!isOverseas && !isDevelopment && OSSResourceAcceleration) {
      const ossConfig = {
        s3: `s3="${VITE_APP_ASSET_PATH_S3}"`,
        bos: `bos="${VITE_APP_ASSET_PATH_BOS}"`
      }
      const ossStr = OSSResourceAcceleration === true ? Object.keys(ossConfig).reduce((curr, key, arr) => (curr += `${ossConfig[key]} `, curr), '') : ossConfig[OSSResourceAcceleration]
      html = html.replace(/<!--head-base-->/, `<base ${ossStr} />`);
    }
    if (isOverseas) {
      html = html.replace('<body', '<body overseas')
        .replace('<div id="app"', '<div id="app" overseas');
    }
    if (isDevelopment) {
      html = html.replace(
        /<!--favicon-link-->/,
        `<link rel="alternate icon" type="image/png" href='src/current_project/assets/favico.ico'>`,
      );
    }
    return html;
  },
});
export default defineConfig(async ({ mode }) => {
  const isDevelopment = mode === 'development';
  const envInfo = loadEnv(mode, process.cwd());
  const {
    VITE_APP_PROJECT_NAME = '', VITE_APP_ASSET_PATH_BOS = '/', VITE_APP_ASSET_PATH_S3 = '/', VITE_APP_ASSET_PATH_DIR = `/${VITE_APP_PROJECT_NAME}/h5`,
  } = envInfo;

  if (!envInfo.VITE_APP_ASSET_PATH) {
    envInfo.VITE_APP_ASSET_PATH = VITE_APP_ASSET_PATH;
  }

  const isOverseas = VITE_APP_PROJECT_NAME?.startsWith?.('5');
  const is50001 = VITE_APP_PROJECT_NAME === '50001';

  if (!envInfo.VITE_APP_ASSET_PATH_BOS) {
    envInfo.VITE_APP_ASSET_PATH_BOS = VITE_APP_ASSET_PATH_BOS;
    envInfo.VITE_APP_ASSET_PATH_S3 = VITE_APP_ASSET_PATH_S3;
    envInfo.VITE_APP_ASSET_PATH_DIR = VITE_APP_ASSET_PATH_DIR;
  }

  // 打印当前配置信息，请勿删除
  console.log(envInfo);

  const prePath = is50001 ? '/src' : '/src/current_project';

  return {
    base: isDevelopment ? './' : OSSResourceAcceleration ? isOverseas ? VITE_APP_ASSET_PATH_S3 : VITE_APP_ASSET_PATH_DIR : '/',
    mode: 'production',
    build: {
      // sourcemap: isDevelopment || !!process.env.SOURCE_MAP,
      brotliSize: false,
      minify: 'terser',
    },
    server: {
      port: 3001,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        inject: 'body-first',
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
      }),
      htmlPlugin(envInfo, isDevelopment, isOverseas),
      AutoImport({
        imports: ['vue', 'vue-router'],
        // 可以选择auto-import.d.ts生成的位置，使用ts建议设置为'src/auto-import.d.ts'
        dts: 'src/auto-import.d.ts',
      }),
      vuePlugin(),
      vueJsxPlugin(),
      createStyleImportPlugin({
        resolves: [VantResolve()],
      }),
    ],
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
    },
    resolve: {
      alias: {
        // fs: require.resolve('rollup-plugin-node-builtins'),
        '@': path.resolve(__dirname, 'src'),
        $: path.join(__dirname, prePath),
        '@current': path.join(__dirname, 'src/current_project'),
        '@img': path.join(__dirname, `${prePath}/assets/images`),
        '~assets': path.join(__dirname, 'src/assets'),
      },
    },
  };
});
