<template>
  <div
    v-loading="data.loading"
    class="vip-wrap-activities"
  >
    <div class="align-center-wrap">
      <ul :class="{ anim: data.animate, animR: data.animateR || data.activeList.length <= 4 }">
        <li
          v-for="(item,index) in data.activeList"
          :key="index"
        >
          <div class="img">
            <img
              :src="item.index_pic"
              alt
            />
            <p>{{ item.detail_content }}</p>
          </div>
          <div class="text">
            <div class="left">
              <div class="name">
                <p class="tag">{{ item.tag }}</p>
                <p class="text">{{ item.title }}</p>
              </div>
              <div class="time">{{ $t('截止时间') }}：{{ item.end_time }}</div>
            </div>
            <div
              class="right"
              @click="join(item)"
            >{{ $t('报名参加') }}</div>
          </div>
        </li>
      </ul>
    </div>

    <Dialog
      v-model="joinDia"
      :title="title"
      width="500px"
      center
      blockBtn
      footerBtnWidth="420px"
      :confirmText="$t('保存')"
      @onConfirm="save"
      customeClass="join-wrap"
      :loading="saveLoading"
      :showCancelBtn="false"
      contentPadding="0"
    >
      <Form
        :columns="columns"
        ref="formRef"
        label-position="top"
        theme="dark"
        v-loading="protocalLoading"
      >
        <template #plus>
          <i class="el-icon-plus"></i>
        </template>
      </Form>
    </Dialog>
    <Dialog
      v-model="tipsDia"
      title="温馨提示"
      center
      :confirmText="$t('立即登陆')"
      :cancelText="$t('暂不参与')"
      @onConfirm="onConfirm"
      customeClass="tipsDia-wrap"
      :loading="saveLoading"
    >
      <p class="dialog-tips">{{ $t('登录后参与更多线下活动') }}</p>
    </Dialog>
  </div>
</template>

<script setup>
import {
  inject, reactive, onMounted, ref, watch, nextTick,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { vipactivity, joininactivity } from '@/api/vip';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;
const formRef = ref(null);
const joinDia = ref(false);
const tipsDia = ref(false);
const title = ref('');
const activeID = ref(null);

const data = reactive({
  loading: true,
  activeList: [],
  animate: false,
  animateR: false,
  intObj: {},
  timeObj: {},
});

const columns = reactive([
  {
    label: global.$t('贵姓'),
    placeholder: global.$t('请输入您的贵姓，方便联系您'),
    prop: 'name',
    type: 'input',
    width: '100%',
    rule: [{
      required: true,
      message: global.$t('请输入姓名'),
      trigger: 'blur',
    }],
  },
  {
    label: global.$t('意向时间'),
    placeholder: global.$t('请输入您想去的时间'),
    prop: 'join_time',
    type: 'date-picker',
    'date-picker': 'datetime',
    width: '100%',
    rule: [{
      required: true,
      message: global.$t('请输入参与时间'),
      trigger: 'blur',
    }],
  },
  [
    {
      label: global.$t('区号'),
      prop: 'area',
      type: 'select',
      list: [],
      slot: 'plus',
      prefix: 'el-icon-plus',
      value: 'value',
      optionLabel: 'label',
      defaultValue: '86',
      width: '110px',
      class: 'form-phone-select',
      children_prefix: (h) => h('i', { class: 'el-icon-plus' }),
      renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
    },
    {
      placeholder: global.$t('请输入正确手机号'),
      prop: 'mobile',
      type: 'input',
      input: 'number',
      rule: [{
        required: true,
        message: global.$t('请输入手机号'),
        trigger: 'blur',
      }],
    },
  ],
]);
clearInterval(data.intObj);
clearTimeout(data.timeObj);

onMounted(async () => {
  // 未开始的活动
  const { data: notStartedList } = await vipactivity({ status: 1 });
  // 进行中的活动
  const { data: startedList } = await vipactivity({ status: 2 });
  data.loading = false;
  data.activeList = [...notStartedList, ...startedList];
});

watch(() => dicts.phoneareav3, () => {
  columns[2][0].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
}, { immediate: true });

// 参加活动弹窗
function join(item) {
  if (user?.isLogin) {
    joinDia.value = true;
    title.value = item.title;
    activeID.value = item.id;
    nextTick(() => {
      formRef.value.data.area = '86';
    });
  } else {
    tipsDia.value = true;
  }
}

const { run: saveRun, loading: saveLoading } = useRequest(joininactivity, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('参加成功'));
    joinDia.value = false;
  },
});
function save() {
  formRef.value.form.validate((valid) => {
    if (valid) {
      saveRun({ vip_act_id: activeID.value, type: 2, ...formRef.value.data });
    } else {
      return false;
    }
  });
}

function onConfirm() {
  tipsDia.value = false;
  $store.commit('SET_LOGIN_DIALOG', true);
}
</script>

<style lang="scss" scoped>
.vip-wrap-activities {
  background-color: var(--bg-color-282828);
  padding: 40px 0 0;
  height: 386px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  .align-center-wrap {
    position: relative;
    height: 100%;
  }

  ul {
    width: 2000%;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: -404px;

    li {
      position: relative;
      float: left;
      width: 392px;
      background-color: var(--bg-color-282828);
      margin-right: 12px;

      > .img {
        position: relative;
        height: 220px;
        overflow: hidden;

        > img {
          display: block;
          width: 100%;
          height: 100%;
          transition: all 0.45s ease;
          cursor: pointer;

          &:hover {
            transform: scale(1.1);
          }
        }

        > p {
          position: absolute;
          top: 0;
          left: 0;
          font-size: 12px;
          line-height: 17px;
          padding: 15px;
          color: var(--font-color-fff);
          margin: 0;
        }
      }

      > .text {
        padding: 0 25px 20px;
        overflow: hidden;
        border: 1px solid var(--border-color-525152);
        border-top: none;

        > .left {
          float: left;
          padding-top: 20px;

          > .name {
            overflow: hidden;

            > .tag {
              float: left;
              background-image: linear-gradient(90deg, var(--theme-color) 0%, var(--theme-color) 99%);
              border-radius: 2px;
              color: var(--font-color-fff);
              padding: 0 10px;
              line-height: 22px;
              max-width: 98px;
              margin: 0;
            }

            > .text {
              float: left;
              color: var(--font-color-fff);
              padding: 0 10px;
              height: 22px;
              line-height: 22px;
              max-width: 142px;
              margin: 0;
            }
          }

          > .time {
            margin-top: 10px;
            font-size: 13px;
            color: var(--font-color-666);
            line-height: 18px;
            text-align: left;
          }
        }

        > .right {
          float: right;
          border: 1px solid var(--theme-color);
          border-radius: 4px;
          color: var(--theme-color);
          cursor: pointer;
          width: 90px;
          height: 36px;
          line-height: 36px;
          text-align: center;
          margin-top: 25px;

          &:hover {
            background-color: var(--theme-color);
            color: var(--font-color-fff);
          }
        }
      }
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    &.anim {
      transition: all 0.5s;
      margin: 0;
      left: -808px;
    }

    &.animR {
      transition: all 0.5s;
      left: 0;
    }
  }

  :deep(.el-dialog) {
    .el-button {
      margin-top: 0;
    }
  }
}

:deep(.el-form) {
  .config-form-wrap-group .el-form-item {
    max-width: none;

    &:first-child {
      flex: none;
    }

    .el-select .el-input__inner {
      border-top-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .el-icon-plus {
      position: absolute;
      left: 5px;
      width: 25px;
      line-height: 45px;
      text-align: center;
      color: var(--font-color-fff);
      font-size: 14px;
    }
  }
}

:deep(.dialog-footer-inline-btn) {
  flex-direction: row-reverse;
  padding-bottom: 20px;

  .el-button--default {
    background-color: var(--bg-color-353435);
    color: var(--font-color-fff);
    border: 0;
  }
}
</style>
