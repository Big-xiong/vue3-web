# 3.0架构

------


> 本仓库最先应用于海外版架构，故此取名 `overseas-web`。

## 技术栈 
- [x] Vue3 全家桶
- [x] Axios + ElementPlus + Scss + I18n国际化
- [ ] 乾坤 (已停用)
- [ ] SSR (已停用)

------

## 目录结构释义（部分文件/夹名语义强的未做释义）
```bash
> overseas-web
├── .github // github action配置
│   ├── workflows
│   │   ├── dev-build.yml // 测试环境手动部署脚本
│   │   ├── dev-deploy.yml // 测试环境自动部署脚本
├── patches // 补丁目录（patch-package）
├── public // 静态资源，将直接移动至dist（不参与打包）
│   ├── data // 配置数据
│   ├── font // 字体
│   ├── images // 图片
│   ├── lang_bak // 多语言备份
│   ├── language // 多语言字典文件
│   ├── libs // 插件
│   ├── seo // SEO数据
│   ├── vi_ // 特殊语种设置（暂时注释）
│   ├── favicon.ico // 网站favicon
│   └── kefu.html // 客服静态html
├── **scripts** // 语法脚本（部分释义）
│   ├── ast.js // AST语法脚本
│   ├── autoGit.js // 子库批处理脚本
│   ├── build.js // 线上环境打包脚本
│   ├── buildTest.mjs // 测试环境打包脚本
│   ├── cli.mjs // 开发环境启动脚本
│   ├── init.js // 初始化脚本
│   ├── seo.js // SEO脚本
│   ├── spawn.js // node执行命令行功能封装
│   ├── submodule.js // 子库切换分支脚本（已废弃）
│   ├── tinypng.js // 图片压缩脚本
├── **src** // 主目录
│   ├── api // 接口文件
│   ├── assets // 静态资源文件
│   │   ├── dark // 暗色系文件目录
│   │   ├── data // 数据文件目录
│   │   ├── images // 图片目录
│   │   ├── style // 样式目录
│   │   ├── svg // SVG目录
│   ├── components // 公共封装组件
│   ├── config // 数据配置目录
│   ├── **current_project** // 子库目录
│   │   ├── config
│   │   │   ├── index.js // 子库配置文件（重要）
│   ├── directives // 指令
│   ├── plugins // 插件
│   ├── router // 路由
│   │   ├── modules // 理由模块文件
│   ├── store // 数据流
│   │   ├── modules // 数据流模块文件 
│   ├── utils // 工具方法
│   ├── views // 页面组件
│   ├── App.vue // 入口文件
├── subReplace // 子库批处理目录
├── translate // 全局翻译脚本
├── .env // 大陆版配置
├── .env.overseas // 海外版配置
```
### 1. 拉取项目代码（SSH方式）

一定要使用SSH方式拉取代码；github ssh配置可以百度。

### 2. 启动项目 (需要有overseas-web-common仓库拉取权限。确保node版本在v14,推荐v14.17.0)

 `npm i` // 安装依赖

 `npm start merchantNo env` // 请注意，不要直接运行这条命令，此命令 merchantNo env为配置项，具体使用方式请参照下面表格

| 参数 | 类型 | 必填 |可选项 | 释义 |
| :-: | :-: | :-: | :-: | :-: |
| merchantNo | number | 否 | 10001\|10029\|... |  `5位纯数字`，决定子库current_project目录拉取，对应common仓库分支名；大陆版商户`1开头`，如`10001`、`10029`；海外版商户`5开头`，如：`50001`。例：`npm start 10001` |
| env | string | 否 | dev \| prod | 单次运行指定使用线上或测试环境服务，与`src/current_project/config/index.js` 里 `testUseProdInterface` 配置关联，`当 testUseProdInterface: true` 值为true或具体商户号 `testUseProdInterface: 10029`时，使用`dev`将本次运行使用测试环境19001服务，prod 则反之。例：`npm start 10001 dev`。

