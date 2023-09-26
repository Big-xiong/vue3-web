<template>
  <div class="site-mail-wrap">
    <div class="site-mail-wrap-btn">
      <el-button type="primary" @click="readAllMessageRun">{{ $t('标记全部为已读') }}</el-button>
      <el-button @click="clearMessageRun" type="grey">{{ $t('清空已读消息') }}</el-button>
    </div>
    <div v-loading="messageLoading" class="site-mail-wrap-table">
      <el-space direction="vertical">
        <ConfigTable
          :data="data.messageList"
          :columns="data.columns"
          :total="data.total"
          :current="data.page"
          :pageSize="data.pageSize"
          :pageUpdate="pageUpdate"
          stripe
          @row-click="rowClick"
          v-if="data.messageList.length && !messageLoading"
        >
          <template #default="{ row }" @click="readMessage(row)">
            <!-- <svg-icon name="important" v-if="row.is_important===1"></svg-icon> -->
            <i :class="row.is_read === 2 ? '' : 'message-unRead'"></i>
            <span>{{ messageTypeList?.[row.type] || '' }}</span>
          </template>
        </ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-show="data.noData">
      <!-- <i class="el-icon-message-solid"></i> -->
      <svg-icon name="bell" />
      <p>{{ $t('暂无任何信息') }}</p>
    </div>
  </div>
</template>

<script setup>
import { inject, reactive, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import ConfigTable from '@/components/Table/index.vue';
import {
  message, messagetypelist, readallmessage, clearmessage, readmessage,
} from '@/api/center';

const global = inject('global');
const $store = inject('store');
const data = reactive({
  page: 1,
  columns: [
    {
      prop: 'type',
      label: global.$t('消息类型'),
      width: '190px',
      slot: 'default',
    },
    { prop: 'content', label: global.$t('站内消息内容') },
    { prop: 'created_at', label: global.$t('时间'), width: '190px' },
  ],
  total: 0,
  messageList: [],
  noData: false,
  pageSize: 0,
});
const { run: messageRun, loading: messageLoading } = useRequest(() => message({ page: data.page, noCancel: true }), {
  manual: true,
  onSuccess: (res) => {
    data.messageList = res.data; // 后端已修改接口 固定会返回res.data
    data.noData = !res.data.length;
    const { total, current_page, per_page } = res;
    data.total = total;
    data.page = current_page;
    data.pageSize = per_page;
  },
});
const { data: messageTypeList } = useRequest(() => messagetypelist({ noCancel: true }), {
  onSuccess: (res) => {
    messageRun();
  },
});

const { run: readAllMessageRun } = useRequest(readallmessage, {
  manual: true,
  onSuccess: (res) => {
    messageRun();
    $store.dispatch('user/getUserInfo');
  },
});

const { run: clearMessageRun } = useRequest(clearmessage, {
  manual: true,
  onSuccess: (res) => {
    messageRun();
  },
});

function pageUpdate(val) {
  data.page = val;
  messageRun();
}
function setClass(r) {
  return r.columnIndex === 0 && r.row.is_read === 2 ? 'isRead' : '';
}

const { run: itemRead, loading: itemReadLoading } = useRequest(readmessage, {
  manual: true,
  onSuccess: (res) => {
    $store.dispatch('user/getUserInfo');
  },
});
function rowClick(row, column, event) {
  const { id, is_read } = row;
  is_read === 1 && itemRead({ id });
  row.is_read = 2;
}
</script>

<style lang="scss" scoped>
.site-mail-wrap {
  position: relative;

  &-btn {
    text-align: left;
    position: absolute;
    right: 0;
    top: -92px;

    .el-button {
      height: 42px;
      font-weight: 500;

      &--default {
        color: var(--font-color-000);
      }
    }
  }

  &-table {
    min-height: 15vh;
  }

  :deep(.el-table) {
    font-size: 16px;
  }

  .record-nodata i {
    color: var(--theme-color);
    font-size: 40px;

    .svg-icon {
      width: 47px;
      height: 60px;
    }
  }

  .message-unRead {
    display: inline-block;
    vertical-align: middle;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--font-color-f66);
    margin-right: 5px;
  }

  .icon-important {
    width: 13px;
    margin-right: 7px;
  }
}
</style>
