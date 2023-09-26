<template>
  <div class="popularize-link-wrap">
    <header>{{ $t('推广连接') }}</header>

    <el-tabs v-model="menuSelected">
      <el-tab-pane
        :label="$t('会员链接')"
        name="member"
      >
        <QrLink :info="userLinks" />
      </el-tab-pane>

      <el-tab-pane
        :label="$t('代理链接')"
        v-if="agent?.userInfo?.spread_switch === 2"
        name="agent"
      >
        <CommissionRate />
        <QrLink
          :info="agentLinks"
          :show-code="menuSelected === 'agent' && auditSetting?.agent_code_show === 2"
        />
      </el-tab-pane>

      <el-tab-pane
        :label="$t('专属域名')"
        name="domain"
      >
        <div class="domain-wrap">
          <div class="domain">{{ agent?.userInfo?.special_domain || $t('暂无专属域名') }}</div>
          <el-button
            :disabled="!agent?.userInfo?.special_domain"
            class="copy-btn"
            v-clipboard:copy="agent?.userInfo?.special_domain"
            v-clipboard:success="onSuccess"
          >{{ $t('复制链接') }}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {
  inject, ref, onMounted, watch, reactive,
} from 'vue';
import qrcode from 'qrcode';
import { useRequest } from 'ahooks-vue';
import CommissionRate from './CommissionRate.vue';
import QrLink from './QrLink.vue';
import { auditsetting } from '../../../api/agent';

const global = inject('global');

const menuSelected = ref('member');
const $store = inject('store');
const { agent } = $store.state;

const userLinks = reactive([
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
const agentLinks = reactive([
  {
    name: global.$t('PC/H5代理注册链接'),
    url: '',
    qrCode: '',
  },
  {
    name: global.$t('全站APP下载链接'),
    qrCode: '',
    url: '',
  },
]);

const auditSetting = ref({});

const { run: getAuditSetting } = useRequest((params) => auditsetting(params), {
  manual: true,
  onSuccess(result) {
    auditSetting.value = result;
    console.log('setting auditSetting', auditSetting.value);
  },
});

async function getData() {
  const { member_spread_url, app_down_url, agent_domain } = agent.userInfo;
  if (member_spread_url && app_down_url) {
    qrcode.toDataURL(app_down_url).then((data) => {
      userLinks[1].url = app_down_url;
      userLinks[1].qrCode = data;
    });
    qrcode.toDataURL(member_spread_url).then((data) => {
      userLinks[0].url = member_spread_url;
      userLinks[0].qrCode = data;
    });
  }
  if (agent_domain && agent_domain.length && agent_domain[0].domain) {
    qrcode.toDataURL(app_down_url).then((data) => {
      agentLinks[1].url = app_down_url;
      agentLinks[1].qrCode = data;
    });
    qrcode.toDataURL(agent_domain[0]?.domain).then((data) => {
      agentLinks[0].url = agent_domain[0]?.domain;
      agentLinks[0].qrCode = data;
    });
  }
}

getData();

onMounted(() => {
  console.log('on activated');
  watch(() => agent.userInfo, () => {
    if (Object.keys(agent.userInfo).length) {
      getData();
      getAuditSetting();
    }
  }, { immediate: true });
});

function onSuccess() {
  global.$message.success(global.$t('复制成功'));
}
</script>

<style lang="scss" scoped>
.popularize-link-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }

  :deep(.el-tab-pane) {
    width: 100%;
  }
}

.domain-wrap {
  box-sizing: border-box;
  border: 1px solid var(--border-color-e2e2e2);
  width: 100%;
  border-radius: 6px;
  padding: 18px 30px;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  .domain {
    font-size: 14px;
    margin-right: auto;
  }

  .edit-btn {
    background: var(--theme-color);
    color: var(--font-color-000);
  }
}

:deep(.el-tabs__header) {
  margin-bottom: 30px;
}

:deep(.el-tabs__item) {
  color: var(--font-color-0a0a0a);

  &.is-active {
    color: var(--theme-color);
  }
}
</style>
