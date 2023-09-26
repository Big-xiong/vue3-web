<template>
  <div class="deposit-dialog">
    <Dialog
      :title="$t('存款流程说明')"
      v-model="dialogVisible"
      titleLeftBorder
      :showBtn="false"
      width="700px"
    >
      <div class="dialoContent">
        <!-- <el-tabs
                  v-model="activeName"
                  @tab-click="handleClick"
                >
                  <el-tab-pane
                    v-for="(list,index) in payments"
                    :key="index"
                    :label="list.name"
                    :name="'active'+index"
                  >
                    <div class="teachimg">
                      {{ list }}
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <div
                  class="left button"
                  @click="changeindex(1)"
                >
                  <i class="el-icon-arrow-left" />
                </div>
                <div
                  class="right button"
                  @click="changeindex(2)"
                >
                  <i class="el-icon-arrow-right" />
                </div>-->
        <img
          :src="$getSrc('/src/assets/images/deposit/deposit-tip.gif')"
          alt=""
        />
        <!-- <el-image
              :src="$getSrc('/src/assets/images/deposit/deposit-tip.gif')"
              lazy
            >
              <template #placeholder>
                <div class="image-slot">
                  <i class="el-icon-loading" />
                </div>
              </template>
            </el-image> -->
      </div>
    </Dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Dialog from '@/components/Dialog/index.vue';

export default defineComponent({
  name: 'DepositTeach',
  components: {
    Dialog,
  },
  props: {
    payments: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'active0',
      activeindex: 0,
    };
  },
  mounted() {
  },
  methods: {
    handleClick(tab) {
      this.activeindex = tab.index;
    },
    changeindex(type) {
      if (type === 1) {
        this.activeindex -= 1;
        if (this.activeindex === -1) this.activeindex = this.payments.length - 1;
        this.activeName = `active${this.activeindex}`;
      } else {
        this.activeindex += 1;
        if (this.activeindex === this.payments.length) this.activeindex = 0;
        this.activeName = `active${this.activeindex}`;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.deposit-dialog {
  :deep(.el-tabs) {
    .el-tabs__content {
      height: 300px;
      margin-top: 20px;
      border-radius: 6px;
      background: var(--border-color-353435);
    }

    .el-tabs__header {
      margin: 0;
    }

    .el-tabs__nav-wrap {
      width: 100%;
    }

    .el-tabs__nav {
      width: 100%;
      display: flex;
      justify-content: space-between;

      & > div {
        flex: 1;
        height: 35px;
        line-height: 35px;
        border-radius: 6px;
      }

      .is-active {
        font-size: 14px;
        color: #191919 !important;
        z-index: 999;
        //background: var(--theme-color);
      }
    }

    .el-tabs__item {
      flex: 1;
      padding: 0;
      text-align: center;
      font-size: 14px;
      color: var(--font-color-ccc);
    }

    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
  }

  .dialoContent {
    position: relative;
  }

  .button {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    margin-top: -40px;
    cursor: pointer;
    text-align: center;
    line-height: 40px;

    i {
      font-size: 40px;
      color: var(--font-color-ccc);
    }
  }

  .left {
    left: -70px;
  }

  .right {
    right: -70px;
  }

  img {
    display: block;
    width: 100%;
  }

  .el-image {
    width: 100%;
    min-height: 300px;

    .image-slot {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      [class*='el-icon'] {
        font-size: 30px;
      }
    }
  }
}
</style>
