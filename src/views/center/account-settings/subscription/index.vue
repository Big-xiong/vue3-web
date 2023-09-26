<template>
  <div
    class="subsctription-wrap"
    v-loading="subscribeLoading"
  >
    <div
      class="layout-flex-center subsctription-wrap-item"
      v-for="(item, index) in data.list"
      :key="index"
    >
      <div class="layout-flex-center icon">
        <!-- <i :class="item.icon"></i> -->
        <svg-icon :name="item.icon" />
      </div>
      <p class="title">{{ $t(item.title) }}</p>
      <el-switch
        v-model="item.isOpen"
        @change="doSubsMain(item.name)"
      ></el-switch>
      <p
        v-for="child in data.tips"
        :key="child"
        class="tips"
      >{{ $t(child) }}</p>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';
import { useRequest } from 'ahooks-vue';
import { getsubscribemsg, subscribemsg } from '@/api/center';

const global = inject('global');

const data = reactive({
  smsMain: true,
  list: [
    {
      title: global.$t('短信服务'),
      icon: 'dy-msg',
      name: 'sms',
      isOpen: true,
      sms: {
        deposit_notify: true,
        withdraw_notify: true,
        login_notify: true,
        activity_notify: true,
        domain_notify: true,
        password_notify: true,
      },
    }, {
      title: global.$t('邮件服务'),
      icon: 'dy-mail',
      name: 'mail',
      isOpen: true,
      mail: {
        deposit_notify: true,
        withdraw_notify: true,
        login_notify: true,
        activity_notify: true,
        domain_notify: true,
        password_notify: true,
      },
    }, {
      title: global.$t('站内信'),
      icon: 'dy-notice',
      name: 'site_notice',
      isOpen: true,
      site_notice: {
        deposit_notify: true,
        withdraw_notify: true,
        login_notify: true,
        activity_notify: true,
        domain_notify: true,
        password_notify: true,
      },
    },
  ],
  tips: [
    global.$t('存款到账通知'),
    global.$t('取款到账通知'),
    global.$t('优惠活动通知'),
    global.$t('域名更换通知'),
    global.$t('密码修改通知'),
  ],
});

const { data: subscribeInfo, loading: subscribeLoading } = useRequest(getsubscribemsg, {
  onSuccess: (res) => {
    if (res.sms && res.mail && res.site_notice) {
      data.list.forEach((item, index) => {
        item.isOpen = res[item.name]?.activity_notify ?? false;
      });
      data.list = JSON.parse(JSON.stringify(data.list));
    }
  },
});

const { run: subsRun } = useRequest((params) => subscribemsg({ subscribe_switch: params }), { manual: true });

function doSubsMain(type) {
  const { list } = data;
  if (type === 'sms') {
    Object.keys(list[0].sms).forEach((child) => {
      list[0].sms[child] = list[0].isOpen;
    });
  }

  if (type === 'mail') {
    Object.keys(list[1].mail).forEach((child) => {
      list[1].mail[child] = list[1].isOpen;
    });
  }

  if (type === 'site_notice') {
    Object.keys(list[2].site_notice).forEach((child) => {
      list[2].site_notice[child] = list[2].isOpen;
    });
  }
  // Object.keys(subscribeInfo.value[type]).forEach((item) => {
  //   subscribeInfo.value[type][item] = !subscribeInfo.value[type][item];
  // });
  const obj = {
    sms: data.list[0].sms,
    mail: data.list[1].mail,
    site_notice: data.list[2].site_notice,
  };
  subsRun(JSON.stringify(obj));
}
</script>

<style lang="scss" scoped>
.subsctription-wrap {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  color: var(--font-color-000);
  font-size: 14px;

  &-item {
    border: 1px solid var(--border-color-000-2);
    width: 260px;
    text-align: center;
    flex-direction: column;
    border-radius: 10px;

    .icon {
      color: var(--theme-color);
      width: 80px;
      height: 80px;
      line-height: 75px;
      border: 1px solid var(--theme-color);
      border-radius: 50%;
      margin-top: 50px;
      font-size: 30px;
      background-color: var(--service-icon-bg-color);

      .svg-icon-wrap {
        width: auto;
        height: 30px;
      }
    }

    .title {
      margin: 30px 0 15px;
      font-size: 20px;
    }

    .el-switch {
      margin-bottom: 30px;
    }

    .tips {
      line-height: 22px;
      margin: 0 0 30px;
    }
  }
}
</style>
