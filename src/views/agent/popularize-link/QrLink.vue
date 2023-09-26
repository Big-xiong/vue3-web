<template>
  <div class="qr-link-wrap">
    <div class="qr-item-wrap" v-for="(item, index) in info" :key="index">
      <img id="qr-code" v-if="item.qrCode" :src="item.qrCode" />
      <div class="info-wrap">
        <div class="info-name">{{ item.name }}</div>
        <div class="domain-name">{{ item.url }}</div>
      </div>
      <el-button class="copy-btn" v-clipboard:copy="item.url" v-clipboard:success="onSuccess"
        v-clipboard:error="onError" type="primary">{{ $t('复制链接') }}</el-button>
      <el-button class="download-btn" @click="download(item)">{{ $t('下载二维码') }}</el-button>
    </div>

    <div class="qr-item-wrap" v-if="showCode">
      <div class="code-wrap">
        <div class="info-name">{{ $t('代理推荐码') }}</div>
        <div class="domain-name code">{{ agent?.userInfo?.code }}</div>
      </div>

      <el-button class="copy-btn" v-clipboard:copy="agent?.userInfo.code" v-clipboard:success="onSuccess"
        v-clipboard:error="onError" type="primary">{{ $t('复制') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted,
} from 'vue';
import qrcode from 'qrcode';

const $store = inject('store');
const { agent } = $store.state;

const props = defineProps({
  showCode: {
    type: Boolean,
    default: false,
  },
  info: {
    type: Array,
    default: () => ([]),
  },
});
console.log(props.info);
const global = inject('global');
const links = reactive([
  {
    name: global.$t('PC/H5会员注册链接'),
    url: '',
    qrCode: '',
  },
  {
    name: global.$t('全站APP下载链接'),
    qrCode: '',
    url: '',
  },
]);

async function getData(name) {
  const { member_spread_url, app_down_url } = agent.userInfo;
  if (name === 'member' && (member_spread_url && app_down_url)) {
    qrcode.toDataURL(app_down_url).then((data) => {
      links[1].url = app_down_url;
      links[1].qrCode = data;
    });
    qrcode.toDataURL(member_spread_url).then((data) => {
      links[0].url = member_spread_url;
      links[0].qrCode = data;
      links[0].name = global.$t('PC/H5会员注册链接');
    });
  } else if (name === 'agent' && agent_domain && agent_domain.length && agent_domain[0].domain) {
    qrcode.toDataURL(app_down_url).then((data) => {
      links[1].url = app_down_url;
      links[1].qrCode = data;
    });
    qrcode.toDataURL(agent_domain[0]?.domain).then((data) => {
      links[0].url = agent_domain[0]?.domain;
      links[0].qrCode = data;
      links[0].name = global.$t('PC/H5代理注册链接');
    });
  }
  // if (member_spread_url && app_down_url) {
  //   qrcode.toDataURL(app_down_url).then((data) => {
  //     links[1].url = app_down_url;
  //     links[1].qrCode = data;
  //   });
  //   qrcode.toDataURL(member_spread_url).then((data) => {
  //     links[0].url = member_spread_url;
  //     links[0].qrCode = data;
  //   });
  // }
}
// getData('member');

function download(data) {
  const a = document.createElement('a');
  const event = new MouseEvent('click');
  a.download = `${data.name || new Date().getTime()}.png`;
  a.href = data.qrCode;
  a.dispatchEvent(event);
}

function onSuccess() {
  global.$message.success(global.$t('复制成功'));
}

function onError() {
  global.$message.error(global.$t('该浏览器不支持自动复制'));
}

// onMounted(() => {
//   watch(() => agent.userInfo, getData);
// });
</script>

<style lang="scss" scoped>
.qr-item-wrap {
  border: 1px solid var(--border-color-e2e2e2);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 18px 30px;
  justify-content: flex-start;
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  #qr-code {
    height: 55px;
    width: 55px;
  }

  .code-wrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-right: auto;

    .info-name {
      font-size: 16px;
      color: var(--font-color-222930);
      font-weight: bolder;
    }

    .code {
      color: var(--theme-color);
      font-size: 14px;
      margin-top: 4px;
    }
  }

  .info-wrap {
    max-width: 500px;
    margin-left: 20px;
    margin-right: auto;
    text-align: left;

    .info-name {
      color: var(--font-color-000);
    }

    .domain-name {
      color: var(--font-color-999);
    }
  }
}
</style>
