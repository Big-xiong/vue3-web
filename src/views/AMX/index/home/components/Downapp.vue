<template>
  <div class="downapp-wrap">
    <div class="l">
      <div class="l-main">
        <p class="chi">{{ $t(`极速稳定 指尖畅享`) }}</p>
        <p class="eng">{{ $t(`EXTREMELY FAST AND STABLE AT YOUR FINGERTIPS`) }}</p>
        <p class="tips">{{ $t(`手机投注平台面向全网玩家，提供近万款电子游艺、老虎机、百家乐以及彩票游戏、体育投注，线上存款及线上取款，一键操作，运用3D即时运算创造真实场景结合立体影像，完整规划的跨系统娱乐平台，整合同步账号和资料传输，达到随时随地不间断娱乐的享受概念，方寸之间，从容尽显，娱乐信手拈来，财富一键在手。`) }}</p>
        <div class="down-det">
          <div>
            <div class="er-code">
              <img
                :src="er_pic"
                alt
              />
            </div>
            <p>{{ $t(`扫码下载APP`) }}</p>
            <p>
              <span>iOS&Android</span>
              {{ $t(`全部移动设备`) }}
            </p>
          </div>
          <div>
            <img
              src="/src/current_project/assets/images/channel/html5.png"
              alt
            />
            <p>{{ $t(`手机无需下载`) }}</p>
            <p>{{ $t(`浏览器输入网址即可访问`) }}</p>
            <p @click="downApp">{{ downAppUrl }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="r"></div>
  </div>
</template>
<script setup>
import { inject, ref } from 'vue';
import qrcode from 'qrcode';

const er_pic = ref('');
const global = inject('global');
const downAppUrl = ref('');
const subConfig = inject('subConfig');
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};

pageInit();
function pageInit() {
  const host = window.location.host.split('.');
  if (host.length > 2) {
    host.shift();
    downAppUrl.value = `${window.location.protocol}//m.${host.join('.')}`;
  } else {
    downAppUrl.value = `${window.location.protocol}//m.${window.location.host}`;
  }
  qRCodeRender();
}
function qRCodeRender() {
  let link = `https://m.${window.location.host}/appDownload`;
  if (sessionStorage.getItem('agentCode')) {
    link = `${link}?id=${sessionStorage.getItem('agentCode')}`;
  }
  qrcode.toDataURL(link, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
}
function downApp() {
  window.open(downAppUrl.value, '_blank');
}
</script>

<style lang="scss" scoped>
.downapp-wrap {
  background-color: var(--bg-color-1d153d);
  font-size: 0;
  overflow: hidden;
  .l,
  .r {
    display: inline-block;
    vertical-align: top;
    width: 50%;
    height: 480px;
  }
  .l {
    overflow: hidden;

    .l-main {
      width: 600px;
      float: right;
      padding-right: 25px;

      .chi {
        text-align: center;
        font-size: 32px;
        color: var(--font-color-fff);
        font-weight: bold;
        margin: 70px 0 12px;
        line-height: 45px;
      }

      .eng {
        font-size: 10px;
        color: #666;
      }

      .tips {
        font-size: 12px;
        color: var(--font-color-b3b3b3);
        line-height: 20px;
        margin-top: 18px;
        text-align: left;
        letter-spacing: 1px;
      }

      .down-det {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        margin-top: 25px;

        > div:first-child {
          margin-right: 40px;

          .er-code {
            width: 110px;
            height: 110px;
            opacity: 1;
            background: var(--theme-color);
            margin: 0 auto;
            padding: 5px;
            background: url('/src/current_project/assets/images/channel/code-bg.png') center no-repeat;
            background-size: 100% auto;

            img {
              display: block;
              width: 100%;
            }
          }

          p:nth-child(2) {
            font-size: 10px;
            color: var(--font-color-b3b3b3);
            line-height: 14px;
          }

          p:nth-child(3) {
            font-size: 10px;
            color: var(--font-color-b3b3b3);
            line-height: 28px;
            border: 1px solid var(--border-color-284d7c);
            border-radius: 28px;
            padding: 0 10px;
            margin-top: 5px;

            span {
              color: var(--theme-color);
            }
          }
        }

        > div:last-child {
          img {
            width: 110px;
          }

          p:nth-child(2) {
            font-size: 10px;
            color: var(--font-color-333);
            line-height: 14px;
          }

          p:nth-child(3) {
            font-size: 10px;
            color: var(--font-color-333);
            line-height: 14px;
            margin: 6px 0 2px;
          }

          p:nth-child(4) {
            font-size: 10px;
            color: var(--theme-color);
            line-height: 14px;
            cursor: pointer;
          }
        }
      }
    }
  }

  .r {
    background: url('/src/current_project/assets/images/channel/r.png') center no-repeat;
    background-size: 100% 100%;
    line-height: 480px;
    text-align: center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: url('/src/current_project/assets/images/channel/r-pic.png') center no-repeat;
      background-size: auto 433px;
    }

    img {
      height: 433px;
    }
  }
}
</style>
