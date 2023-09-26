<template>
  <div class="help-nav-wrap">
    <el-menu
      :default-active="defaultActive"
      @open="handleOpen"
      @close="handleClose"
      :default-openeds="defaultOpeneds"
    >
      <template
        v-for="(item,index) in helpNav"
        :key="index"
      >
        <el-submenu
          :index="index"
          v-if="index === 0"
        >
          <template v-slot:title>
            <!-- <svg-icon :name="item.icon" /> -->
            <QuestionSvg v-show="index === 0" />
            <GameSvg v-show="index === 2" />
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(child,cindex) in item.children"
              :key="cindex"
              :index="`${index}-${cindex}`"
              @click="goItem(item, index, cindex)"
            >{{ child.title ?? child.game_cate_name }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          :index="index"
          v-else-if="index === 1"
          @click="goItem(item, index, -1)"
        >
          <template v-slot:title>
            <BrandSvg />
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
        <el-submenu
          :index="index"
          v-else-if="index === 2"
        >
          <template v-slot:title>
            <!-- <svg-icon :name="item.icon" /> -->
            <QuestionSvg v-show="index === 0" />
            <GameSvg v-show="index === 2" />
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(child,cindex) in item.children"
              :key="cindex"
              :index="`${index}-${cindex}`"
              @click="goItem(item, index, cindex)"
            >{{ child.game_cate_name }}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          :index="index"
          v-else
          @click="goItem(item, index, -1)"
        >
          <template v-slot:title>
            <SafeSvg />
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import {
  inject, ref, reactive, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useRoute, useRouter } from 'vue-router';
// import { gamemanual } from '@/api/help';
import createHelpRoutes from '@/router/modules/help';
import QuestionSvg from '@/views/help/components/QuestionSvg.vue';
import BrandSvg from '@/views/help/components/BrandSvg.vue';
import GameSvg from '@/views/help/components/GameSvg.vue';
import SafeSvg from '@/views/help/components/SafeSvg.vue';

const helpRoutes = createHelpRoutes();

const global = inject('global');
const $store = inject('store');
const { app, user } = $store.state;
const { dicts } = app;

const routesPath = helpRoutes[0].children;
const route = useRoute();
const $router = useRouter();

const defaultActive = ref('0-0');
const defaultOpeneds = [0, 1];

watch($router.currentRoute, (val) => {
  defaultActive.value = val.query.id;
}, { immediate: true });

const helpNav = reactive([
  {
    title: global.$t(`常见问题`), icon: 'wenti', path: 'helpQuestion', children: [],
  },
  {
    title: global.$t(`品牌实力`), icon: 'pinp', path: 'helpBrand',
  },
  {
    title: global.$t(`游戏手册`), icon: 'youxi', path: 'helpManual', children: [],
  },
  { title: global.$t(`安全保障`), icon: 'anquan', path: 'helpSecurity' },
]);

onMounted(() => {
  $store.dispatch('app/getDict', ['aplist', 'gamemanual']);
  watch(dicts, (result) => {
    helpNav[0].children = result?.aplist?.list ?? [];
    helpNav[2].children = result?.gamemanual ?? [];
  }, { immediate: true });
});

function goItem(item, index, cindex) {
  if (cindex !== -1) {
    $router.push({ name: item.path, query: { id: `${index}-${cindex}` } });
  } else {
    $router.push({ name: item.path, query: { id: index } });
  }
}

</script>

<style lang="scss" scoped>
.help-nav-wrap {
  margin-right: 15px;
  width: 200px;
  background-color: var(--dark-bg-color-191919, var(--bg-color-fff));
  box-shadow: 0px 3px 15px 0px rgba(0, 34, 80, 0.1);

  .el-menu {
    :deep() {
      > .el-menu-item {
        text-align: left;
        font-size: 14px;
        color: var(--font-color-333);
        font-weight: bold;
        display: flex;
        align-items: center;
        position: relative;

        &:hover,
        &:focus {
          background-color: var(--help-nav-hover-bg);
        }

        &.is-active {
          span {
            color: var(--theme-color);
          }

          &::before {
            content: '';
            width: 3px;
            height: 21px;
            background: var(--theme-color);
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        img {
          width: 20px;
          margin-right: 8px;
        }
      }

      .el-submenu__title {
        text-align: left;
        font-size: 14px;
        color: var(--font-color-333);
        font-weight: bold;
        display: flex;
        align-items: center;

        &:hover {
          background-color: var(--help-nav-hover-bg);
        }

        img {
          width: 20px;
          margin-right: 8px;
        }
      }

      .el-menu-item-group {
        &__title {
          display: none;
        }

        .el-menu-item {
          text-align: left;
          padding-left: 48px !important;
          color: var(--font-color-666);
          position: relative;
          height: 38px;
          line-height: 38px;

          &:hover,
          &:focus {
            background-color: transparent;
          }

          &.is-active {
            color: var(--theme-color);

            &::before {
              content: '';
              width: 3px;
              height: 21px;
              background: var(--theme-color);
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            }

            // .help-icon-circle {
            //   fill: var(--theme-color) !important;
            // }
          }
        }
      }

      .svg-icon {
        width: 20px;
        height: 20px;
        margin-right: 16px;
      }
    }
  }
}
</style>
