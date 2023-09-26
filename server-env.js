/* eslint-disable */
const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const dayjs = require('dayjs');

axios.defaults.adapter = require('axios/lib/adapters/http');

const resolve = (p) => path.resolve(__dirname, p);

async function createServer() {
  const app = express();

  app.use(cookieParser());

  const vite = await require('vite').createServer({
    logLevel: 'info', //isTest ? 'error' : 'info',
    server: {
      middlewareMode: true,
    },
  });
  // use vite's connect instance as middleware
  app.use(vite.middlewares);

  // app.use('*.wq-test.com', async (req, res) => {
  //   const names = ['Orange', 'Apricot', 'Apple', 'Plum', 'Pear', 'Pome', 'Banana', 'Cherry', 'Grapes', 'Peach'];
  //   const list = names.map((name, id) => ({
  //     id: ++id,
  //     name,
  //     price: Math.ceil(Math.random() * 100),
  //   }));
  //   const data = {
  //     data: list,
  //     code: 0,
  //     msg: '',
  //   };
  //   res.end(JSON.stringify(data));
  // });

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      // always read fresh template in dev
      let template = fs.readFileSync(resolve('index.html'), 'utf-8');
      template = await vite.transformIndexHtml('', template);
      const { render } = await vite.ssrLoadModule('/src/entry-server.js');

      const { appHtml, state, links, syncState, headTags, htmlAttrs, bodyAttrs } = await render(url, {});
      // const newState = JSON.parse(state);
      // newState.app.darkTheme = true;
      const html = template
        .replace(`<!--preload-links-->`, links)
        .replace(`'<vuex-state>'`, state)
        .replace(/\n\ +<\!--app-html-->\n\ +/g, appHtml)
        .replace('data-html-attrs', htmlAttrs)
        .replace('<!--head-tags-->', headTags || '')
        .replace('data-body-attrs', bodyAttrs)
        .replace('/*sync-state-outlet*/', `window.__syncState__ = ${JSON.stringify(syncState)}`); // 注入同步数据

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      vite?.ssrFixStacktrace?.(e);
      const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      fs.writeFileSync(`./log/runtime_error.log`,
        `${dateTime}\n-----------------------\n${e.message}}\n-----------------------\n\n\n`,
        { flag: 'a' })
      console.log('\x1b[91m', `Error: 您有一条错误信息已写入日志 ${dateTime}`);
      res.status(500).end(e.message);
    }
  });

  app.listen(2000, () => {
    console.log('http://localhost:2000');
  })
}

createServer()
