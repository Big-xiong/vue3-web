/* eslint-disable */
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const dayjs = require('dayjs');

axios.defaults.adapter = require('axios/lib/adapters/http');

const isTest = false //process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const isProduction = ['production', 'test'].includes(process.env.NODE_ENV);
async function createServer(root = process.cwd(), isProd = isProduction) {
  const resolve = (p) => path.resolve(__dirname, p);
  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : '';

  // @ts-ignore
  const manifest = isProd ? require('./dist/client/ssr-manifest.json') : {};

  const app = express();
  app.use(cookieParser());

  let vite;
  if (!isProd) {
    vite = await require('vite').createServer({
      root,
      logLevel: 'info', //isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
      },
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(require('compression')());
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false,
      }),
    );
  }

  setInterval(() => {
    var mem = process.memoryUsage();
    var format = function (bytes) {
      return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    };
    console.log('Process: heapTotal ' + format(mem.heapTotal) + ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
  }, 3000)


  let template;
  let render;

  if (!isProd) {
    // always read fresh template in dev
    template = fs.readFileSync(resolve('index.html'), 'utf-8');
    template = await vite.transformIndexHtml('', template);
    render = (await vite.ssrLoadModule('/src/entry-server.js')).render;
  } else {
    template = indexProd;
    // @ts-ignore
    render = require('./dist/server/entry-server.js').render;
  }

  app.use('/heathy', (req, res) => {
    res.status(200).set({ 'Content-Type': 'text/plain' }).end('ok');
  })

  const ipMaps = new Map();
  app.use('*', async (req, res) => {
    try {
      const { ip, originalUrl: url, cookies } = req
      if (ipMaps.has(ip)) {
        clearTimeout(ipMaps.get(ip))
      }
      ipMaps.set(ip, setTimeout(async () => {
        ipMaps.delete(ip)
        const { appHtml, state, links, syncState, headTags, htmlAttrs, bodyAttrs } = await render(url, manifest, cookies);
        const html = template
          .replace(/\[gifHash\]/g, new Date().getTime())
          .replace(`<!--preload-links-->`, links || '')
          .replace(`'<vuex-state>'`, JSON.stringify(state))
          .replace(/\n\ +<\!--app-html-->\n\ +/g, typeof appHtml === 'object' ? url : appHtml)
          .replace('data-html-attrs', htmlAttrs)
          .replace('<!--head-tags-->', headTags)
          .replace('data-body-attrs', bodyAttrs)
          .replace('/*sync-state-outlet*/', `window.__syncState__ = ${JSON.stringify(syncState)}`); // 注入同步数据
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        global.gc()
      }, 200))
    } catch (e) {
      vite?.ssrFixStacktrace?.(e);
      const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      fs.writeFileSync(`./log/runtime_error.log`,
        `${dateTime}\n-----------------------\n${e.stack}}\n-----------------------\n\n\n`,
        { flag: 'a' })
      console.log('\x1b[91m', `Error: 您有一条错误信息已写入日志 ${dateTime}`);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) => app.listen(2001, () => {
    console.log('http://localhost:2001');
  }));
}

exports.createServer = createServer;
