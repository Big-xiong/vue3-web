/* eslint-disable no-param-reassign */
// import store from '@/store';
// import router from '@/router';
import { ElMessage, ElLoading } from 'element-plus';
import Cookies from 'js-cookie';
import { createSocket, onCloseWS } from '@/plugins/socket';
import { openGame } from '@/api/app';

export default (app, router, store, $t) => {
  // 进游戏相关
  let gamePlayWin;
  let gamePlayId;
  let gameCheckTimer;

  // 定时器函数
  const gameCheck = () => {
    store.dispatch('user/getWalletInfo');
    if (gameCheckTimer) {
      clearInterval(gameCheckTimer);
    }
    gameCheckTimer = setInterval(() => {
      if (gamePlayWin.closed && gamePlayId) {
        // 窗口关闭，且存在gamePlayId，表明是进了游戏再关闭了
        // 调用 backtrans
        // store.dispatch('game/gameBacktrans', {
        //   game_id: gamePlayId,
        //   merchant_no: import.meta.env.VITE_APP_MERCHANT_NO
        // }).then(res => {
        //   // Notify('game back transfer successful')
        //   store.dispatch('user/getWallet')
        // })
        store.dispatch('user/getWalletInfo');
        // 再关闭定时器
        clearInterval(gameCheckTimer);
        // onCloseWS();
      }
    }, 5000);
  };

  const getTargetGameInfo = (target, game) => target.code === game.name?.toLowerCase() // 首页sports接口返回的对战没有game.name
    || target.name.toLowerCase() === game.name?.toLowerCase()
    || target.name.toLowerCase() === game.title
    || target.default_game_id === game.default_game_id;

  app.config.globalProperties.$getGameStatus = (game, type, pageType) => {
    const { platformGameIdsv3 } = store.state.game;
    type = type ?? game?.game_cate_id;
    let targetArr = platformGameIdsv3.format?.[type];
    if (pageType) {
      targetArr = targetArr.filter((item) => item.page_type === pageType);
    }

    if (targetArr) {
      const target = targetArr.find((item) => getTargetGameInfo(item, game));
      return target?.status === 2;
    }
    return false;
  };

  app.config.globalProperties.$playGame = async (game, type, index, tag) => {
    const { isLogin, walletInfo = {} } = store.state.user;
    const { dicts } = store.state.app;
    const { platformGameIdsv3 } = store.state.game;
    const token = Cookies.get('access_token');
    if (isLogin) {
      if (game?.id === 147) {
        // JDB捕鱼就弹框展示数据
        app.config.globalProperties.$dialog({
          tpl: 'JdbFishing',
          id: game?.id,
        });
        return;
      }

      let gameId = game?.default_game_id ?? game?.game_id ?? game?.id;
      let platformId = game?.game_platform_id ?? game?.platform_id;
      let cateId = game?.game_cate_id; // bug: #19592 点击彩票、体育底部进入游戏，无法正确显示额度转账的转入钱包名称
      let status = game.status;

      if (!game.created_at) {
        if (!cateId) {
          cateId = cateId ?? platformGameIdsv3.all.find((item) => item.game_cate_id === type || item.name === type)?.game_cate_id;
        }
        if (type === 'v2') {
          // 澳门系、万趣彩票内页“热门彩种”处理
          const v2GameIds = dicts.platformgameidsv2;
          const target = v2GameIds.find((item) => item.game_cate_id === 5)?.list_data?.find?.((item) => item.name.toLowerCase() === game.name.toLowerCase());
          const defaultGameids = target?.default_game_id?.split?.(',') ?? [];
          // console.log(88, defaultGameids)
          if (defaultGameids.includes(String(gameId))) {
            status = target?.status;
          } else {
            ElMessage.error($t('该游戏暂不可用'));
            return;
          }
        } else {
          const target = platformGameIdsv3.format?.[cateId]?.find?.((item) => getTargetGameInfo(item, game));
          if (target) {
            const { status: targetStatus, default_game_id, platform_id } = target;
            status = targetStatus;
            gameId = default_game_id;
            platformId = platform_id;
          } else {
            console.log('not found');
            status = 2;
          }
        }
      }

      if (typeof gameId === 'undefined' || typeof platformId === 'undefined') {
        ElMessage.error($t('该游戏暂不可用'));
        return;
      }

      if (status === 2) {
        ElMessage.error($t('该游戏正在维护中'));
        return;
      }

      const goGame = async () => {
        const loadingInstance = ElLoading.service({
          lock: true,
          background: 'rgba(0, 0, 0, 0.7) !important',
        });
        let gameData = '';
        try {
          gameData = await openGame({
            game_id: gameId,
            cate_id: cateId,
            platform_id: platformId,
          });
          sessionStorage.setItem('openGameData', JSON.stringify(gameData));
          loadingInstance.close();
        } catch (e) {
          loadingInstance.close();
          console.error(e);
          return;
        }
        if (gameData.open_mode === 2 || walletInfo.is_auto_trans === 2) {
          app.config.globalProperties.$dialog({
            tpl: 'TransferPop',
            at: token,
            gameId,
            platformId,
            cateId,
            code: game.code,
            gameData,
            tag,
          });
          return false;
        }
        store.dispatch('user/getWalletInfo');
        const routeUrl = router.resolve({
          name: 'gamePlay',
          query: {
            gameData,
            at: token,
            game_id: gameId,
            platform_id: platformId,
            cate_id: cateId,
            url: encodeURIComponent(gameData.url),
            open_mode: gameData.open_mode,
          },
        });
        // 处理vr游戏 电子游戏
        if (([2].includes(cateId) && [3, 121].includes(platformId)) || store.state.game.allPlatforms[platformId] === 'PT') {
          gamePlayWin = window.open(routeUrl.href, 'gamePlayWin');
          gamePlayId = gameId;
        } else {
          gamePlayWin = window.open(routeUrl.href, 'gamePlayWin');
          gamePlayId = gameId;
        }
        gameCheck(token);
      };

      // 判断余额
      if (walletInfo.money - 0 + (walletInfo.all_platform_money - 0) + (walletInfo.financing_money - 0) <= 20) {
        app.config.globalProperties.$dialog({
          tpl: 'MoneyPop',
          gameId,
          platformId,
          cateId,
          at: token,
        });
        // moneyPop.methods.goPlay = () => {
        //   goGame()
        // }
        return;
      }
      // TODO 本地判断是否新手
      // let str = userInfo.id
      // let isFirstTime = JSON.parse(window.localStorage.getItem(str) || '[]')
      // if (isFirstTime.indexOf(gameId) < 0) {
      //   isFirstTime.push(gameId)
      //   window.localStorage.setItem(str, JSON.stringify(isFirstTime))
      //   firstPop.install({
      //     gameId,
      //     platformId,
      //     cateId,
      //     at: token
      //   })
      //   return
      // }
      goGame();

      // let routeUrl = router.resolve({
      //   path: '/play',
      //   query: {
      //     game_id: gameId,
      //     platform_id: platformId,
      //     at: token
      //   }
      // })
      // window.open(routeUrl.href, '_blank')
    } else {
      // gamePop.install();
      app.config.globalProperties.$dialog({ tpl: 'GamePop' });
    }
  };

  app.config.globalProperties.$openKefu = () => {
    const {
      app: {
        dicts: { siteinfo },
      },
      user: { userInfo },
    } = store.state;
    let url = siteinfo?.pc_kf;
    if (url) {
      const macted = url.match(/(src=")(.+?)(")/);

      if (userInfo?.username && url.includes('aichat')) {
        url = `${url}${url.includes('referrer') ? '?' : '&'}params={"username":"${userInfo.username}"}`;
      } else if (macted) {
        url = macted[2];
      }
      const href = `/kefu.html?link=${encodeURIComponent(url)}`;
      window.open(href, '_blank');
    }
  };
};
