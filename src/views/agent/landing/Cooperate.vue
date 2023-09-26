
<template>
  <div class="agent-coorperate">
    <div class="agent-coorperate-content">
      <div class="agent-nav">
        <span />
        {{ $t('商务合作') }}
        <span />
      </div>
      <div
        v-if="siteInfo.business_cooperation && siteInfo.business_cooperation.length"
        class="agent-coorperate-list"
      >
        <div v-for="(list, index) in siteInfo.business_cooperation" :key="index">
          <el-image :src="list.icon" fit="contain" />
          <p>{{ `${list.name}：${list.contact}` }}</p>
        </div>
      </div>

      <div v-else-if="coorperateData.length" class="agent-coorperate-list">
        <div v-for="(list, index) in coorperateData" :key="index">
          <el-image :src="list.pic" fit="contain" />
          <p>{{ list.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, watch, onMounted,
} from 'vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const siteInfo = ref({});

onMounted(() => {
  $store.dispatch('app/getDict', ['siteinfo']);
});

watch(() => dicts.siteinfo, (info) => {
  siteInfo.value = info;
});

const coorperateData = reactive([
  {
    pic: ('/src/assets/images/landing/skype.png'),
    name: 'Skype:198681681@qq.com',
  },
  {
    pic: ('/src/assets/images/landing/telegram.png'),
    name: 'Telegram:@wanqudaili',
  },
  {
    pic: ('/src/assets/images/landing/whatsApp.png'),
    name: 'WhatsApp:13218765428',
  },
  {
    pic: ('/src/assets/images/landing/qqimg.png'),
    name: 'QQ:198681681',
  },
  {
    pic: ('/src/assets/images/landing/wechat.png'),
    name: global.$t('微信:AAwanqu'),
  },
  {
    pic: ('/src/assets/images/landing/dianhua.png'),
    name: global.$t('手机号：1231232332'),
  },
]);
</script>

<style lang="scss" scoped>
.agent-coorperate {
  width: 100%;
  margin-bottom: 30px;

  .agent-coorperate-content {
    width: 1200px;
    margin: 0 auto;

    .agent-coorperate-list {
      text-align: center;
      justify-content: center;
      display: flex;

      > div {
        margin: 0 30px;
        // cursor: pointer;
      }

      .el-image {
        width: 50px;
        height: 50px;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
