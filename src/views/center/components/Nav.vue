<template>
  <div class="center-nav-wrap">
    <el-menu
      router
      :default-active="route.name"
      class="el-menu-vertical-demo"
      :collapse="false"
      :default-openeds="[1, 2, 3]"
    >
      <template v-for="(nav, index) in routerMap" :key="nav.path">
        <template v-if="nav.children">
          <el-submenu :index="index">
            <template #title>
              <i :class="nav.icon" />
              <span v-lang:en="`font-size:12px`">{{ $t(nav.meta.title) }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="child in nav.children"
                :key="child.path"
                :index="child.name"
                :route="{ name: child.name, params: child.meta }" v-lang:en="`font-size:12px`"
              >
                <span class="border-radius-top" />
                {{ $t(child.meta.title) }}
                <span class="border-radius-bottom" />
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="nav.name" :route="{ name: nav.name, params: nav.meta }"  v-lang:en="`font-size:12px`">
            <i :class="nav.icon" />
            <span class="border-radius-top" />
            {{ $t(nav.meta.title) }}
            <span class="border-radius-bottom" />
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import createCenterRouter from '@/router/modules/center';

const centerRouter = createCenterRouter();

const global = inject('global');
const route = useRoute();
let routerMap = centerRouter[0].children ?? [];
routerMap = routerMap.map((item) => {
  if (item.hiddenSelf && item.children.length) {
    return item.children[0];
  }
  return item;
});

// 初始进入时，传入title
global.$router.replace({ params: route.meta });

function goPage({ name, meta }) {
  global.$router.push({ name, params: meta });
}

</script>

<style lang="scss" scoped>
.center-nav-wrap {
  background: var(--center-nav-bg, var(--block-bg-color));
  border-radius: 10px;
  padding: 5px 0;
  overflow: hidden;

  :deep {
    .el-menu {
      background: none;
      border: none;
      .el-submenu__title:hover,
      &-item:not(.is-active):hover {
        background-color: transparent !important;
        color: var(--theme-color);

        > i {
          color: var(--theme-color);
        }
      }

      > .el-menu-item {
        padding-left: 0 !important;

        &:first-child {
          border-bottom: 0;
          border-top: 0;
        }
      }

      .el-menu-item-group__title {
        display: none;
      }

      .el-submenu {
        &:last-child{
          .el-menu-item{
            &:last-child{
              border-bottom: 0;
            }
          }
        }
        .el-submenu__title {
          font-weight: bold;
          color: var(--font-color-222930);
          font-size: 16px;
          line-height: 40px;
          line-height: 50px;
          padding: 0 !important;

          i {
            color: var(--font-color-222930);
          }

          &:hover {
            color: var(--theme-color);
            i {
              color: var(--theme-color);
            }
          }
        }
        .el-menu-item {
          font-weight: normal;
          min-height: 40px;
          padding-left: 14px !important;

          &.is-active {
            margin-top: -1px;
          }
          
        }

        .el-submenu__title i.el-submenu__icon-arrow {
          padding-left: 0 !important;
        }
      }
    }
  }

  .el-menu-item {
    max-width: 180px !important;
    min-width: 180px !important;
    display: flex;
    align-items: center;
    line-height: 1;
    min-height: 50px;
    border-bottom: 1px solid var(--center-nav-sub-border);
    white-space: inherit;
    font-weight: bold;
    color: var(--font-color-222930);
    font-size: 16px;
    height: auto;
    padding-right: 0;

    &:first-child {
      border-top: 1px solid var(--center-nav-sub-border);
    }

    &:hover {
      background-color: transparent;
      color: var(--theme-color);
    }

    .border-radius-top,
    .border-radius-bottom {
      opacity: 0;
      transition: all 0.2s;
    }

    &:focus {
      background-color: transparent;
    }

    &.is-active {
      color: var(--theme-color);
      background-color: var(--center-nav-active-color);
      border-bottom: 0;
      border-top: 0;

      i {
        color: var(--theme-color);
      }

      .border-radius-top,
      .border-radius-bottom {
        opacity: 1;
        position: absolute;
        top: -20px;
        right: 0;
        width: 20px;
        height: 20px;
        background: var(--center-nav-active-color, var(--bg-color-1e1e1e));
      }

      .border-radius-top::before,
      .border-radius-bottom::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(--bg-color-282828);
      }

      .border-radius-top::before {
        border-bottom-right-radius: 20px;
      }

      .border-radius-bottom {
        top: auto;
        bottom: -20px;

        &::before {
          border-top-right-radius: 20px;
        }
      }
    }

    i {
      color: var(--font-color-222930);
    }
  }
}
</style>
