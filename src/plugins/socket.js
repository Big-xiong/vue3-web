let Socket = null;
let ReconnectCount = 0;
let ConnectUrl = '';

/** 打开WS */
const onopenWS = (e) => {
  console.log('socket已连接');
  console.log(e);
};

let timer = null;
/** 连接失败重连 */
function onerrorWS() {
  if (ReconnectCount <= 10) {
    ReconnectCount += 1;
    Socket?.close?.();
    console.log('连接失败重连中');
    Socket = null;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      // 先调用上分接口再重连
      window?.openGame?.().then?.(() => {
        createSocket(ConnectUrl);
      });
    }, 2000);
  } else {
    onCloseWS();
    console.log('连接错误');
  }
}

/** WS数据接收统一处理 */
function onmessageWS(e) {
  console.log('正常接收信息', e);
}

/** 断开重连 */
export function onCloseWS(e) {
  console.log('websocket已断开....', e);
  Socket?.close?.();
  Socket = null;
  ReconnectCount = 0;
  if (e) onerrorWS();
}

/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export function createSocket(url) {
  console.log('creating socket');
  ConnectUrl = url;
  Socket?.close?.();
  if (!Socket) {
    console.log('建立websocket连接');
    Socket = new WebSocket(url);
    Socket.onopen = onopenWS;
    Socket.onmessage = onmessageWS;
    Socket.onerror = onerrorWS;
    Socket.onclose = onCloseWS;
  } else {
    console.log('websocket已连接');
  }
}
