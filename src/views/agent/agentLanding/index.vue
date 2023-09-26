<template>
  <div class="agentlanding-wrap">
    <!-- {{agent}} -->
    <div class="agentlanding-wrap-head" :class="{ active: isTop }">
      <div class="main">
        <div class="layout-flex-center left">
          <img src="/src/assets/images/header/logo.png" alt @click="$router.push('/')" v-if="!isTop" />
          <img src="/src/assets/images/agent/agentLanding/logo2.png" alt @click="$router.push('/')" v-if="isTop" />
          <p>
            <span @click="to(0)">{{ $t(`为何加入`) }}</span> |
            <span @click="to(1)">{{ $t(`如何加入`) }}</span> |
            <span @click="to(2)">{{ $t(`关于我们`) }}</span> |
            <span @click="to(3)">{{ $t(`佣金制度`) }}</span>
          </p>
        </div>
        <div class="layout-flex-center right">
          <div v-show="!Cookies.get('agent_access_token')">
            <el-input v-model="form.username" autocomplete="off" :placeholder="$t('输入账号')"></el-input>
          </div>
          <div v-show="!Cookies.get('agent_access_token')">
            <el-input v-model="form.password" autocomplete="off" type="password" :placeholder="$t('输入密码')"
              :show-password="true" @keyup.enter="doLogin"></el-input>
          </div>
          <input type="password" hidden autocomplete="new-password" style="opacity: 0" />
          <el-button v-show="!Cookies.get('agent_access_token')" :loading="loginLoading" @click="doLogin">{{ $t(`登入`) }}
          </el-button>
          <el-button v-if="!Cookies.get('agent_access_token')" type="primary" @click="showDialog(1)">{{ $t(`马上加入`) }}
          </el-button>
          <el-button type="primary" @click="$router.push({ name: 'agentHome' })" v-else>{{ $t('代理中心') }}</el-button>

          <!-- <div style="margin: 0 10px;"> -->
          <div class="layout-flex-center lang" v-if="subConfig.isI18n">
            <div lang-select />
          </div>
          <!-- <el-button
                  type="primary"
                  icon="el-icon-headset"
                  @click="$openKefu"
          >Live Chat</el-button>-->
          <!-- </div> -->
        </div>
      </div>
    </div>

    <div class="layout-flex-center agentlanding-wrap-banner"
      :style="{ 'background-image': $store.state.app.darkTheme ? 'none' : `url(${$getSrc('/src/assets/images/agent/agentLanding/bg@2x.jpg')})` }">
      <div class="agentlanding-wrap-banner-pic">
        <img src="@/assets/images/agent/agentLanding/person.png" alt />
      </div>
      <div class="layout-flex-center agentlanding-wrap-info">
        <div>
          <h2>{{ $t(`共赢互惠，坐佣百万`) }}</h2>
          <p>{{ $t(`快速上手，收益有方，财务自由`) }}</p>
          <el-button type="line" @click="$router.push({ name: 'agentHome' })" v-if="Cookies.get('agent_access_token')">
            {{ $t('代理中心') }}</el-button>
          <el-button v-else type="line" @click="showDialog(1)">{{ $t(`马上加入`) }}</el-button>
        </div>
      </div>
    </div>

    <div class="agentlanding-wrap-join"
      :style="{ 'background-image': `url(${$getSrc('/src/assets/images/agent/agentLanding/bg2@2x.png')})` }">
      <h2>{{ $t(`为什么加入{0}`, [subConfig.title]) }}</h2>
      <div class="align-center-wrap layout-flex-center">
        <div v-for="(item, index) in join" :key="index">
          <!-- <svg-icon class="svg-icon-join" :name="`join${index + 1}@2x`"></svg-icon> -->
          <img :src="$getSrc(`/src/assets/images/agent/agentLanding/join${index + 1}@2x.png`)" alt />
          <h2>{{ item.title }}</h2>
          <p v-html="item.desc" />
        </div>
      </div>
      <img class="arrow" @click="to(1)" src="/src/assets/images/agent/agentLanding/arrow1.png" alt />
    </div>

    <div class="agentlanding-wrap-start"
      :style="{ 'background-image': `url(${$getSrc('/src/assets/images/agent/agentLanding/bg3@2x.jpg')})` }">
      <div class="align-center-wrap layout-flex-center">
        <div v-for="(item, index) in steps" :key="index" v-lang:vi="'height:400px'">
          <svg-icon :name="`icon${index + 1}`"></svg-icon>
          <!-- <img :src="$getSrc(`/src/assets/images/agent/agentLanding/icon${index + 1}.png`)" alt/> -->
          <p v-html="item" />
        </div>
      </div>
      <img class="arrow" src="/src/assets/images/agent/agentLanding/arrow2.png" @click="to(2)" alt />
    </div>

    <div class="agentlanding-wrap-detail"
      :style="{ 'background-image': `url(${$getSrc('/src/assets/images/agent/agentLanding/bg-detail.jpg')})` }">
      <div class="align-center-wrap layout-flex-center">
        <img src="/src/assets/images/agent/agentLanding/brand.png" alt />
        <div>
          <p>{{
              $t(`{0}2021年正式成立，致力于打造全新的安全、诚信、合规的国际一流博彩品牌。我们拥有支持中文、英文、泰语、越南多国语种365天24小时在线的最专业的团队，最优秀的技术和最雄厚的资金来实现可持续性长远发展计划。`,
                [subConfig.title])
          }}</p>
          <p>{{
              $t(`产品的丰富性与创造性是我们满足客户对于生活与娱乐需求的核心价值观；与此同时，我们倡导健康游戏与适度博彩。{0}一直秉承用户至上的原则，期待与您一同共创美好的未来。`, [subConfig.title])
          }}
          </p>
        </div>
      </div>
      <img class="arrow" src="/src/assets/images/agent/agentLanding/arrow1.png" @click="to(3)" alt />
    </div>

    <div class="agentlanding-wrap-plan">
      <h2>{{ $t(`佣金计划`) }}</h2>
      <p>
        {{ $t(`{0}联盟佣金是按每月的活跃人数以及净盈`, [subConfig.title]) }}
        <br />
        {{ $t(`利计算的。以下是佣金结构`) }}
      </p>
      <!-- <table v-if="Cookies.get('agent_access_token')"> -->
      <!--   <tr> -->
      <!--     <th>{{$t(`代理盈亏总额`)}}</th> -->
      <!--     <th>{{$t(`佣金占比`)}}</th> -->
      <!--     <th>{{$t(`佣金总额`)}}</th> -->
      <!--   </tr> -->
      <!--   <tr> -->
      <!--     <td>{{ rateData?.profit ?? '0.00' }}</td> -->
      <!--     <td>{{ rateData?.rate ?? '0.00' }}</td> -->
      <!--     <td>{{ rateData?.commission ?? '0.00' }}</td> -->
      <!--   </tr> -->
      <!-- </table> -->
      <table class="table-info">
        <tr>
          <th>{{ $t(`级别`) }}</th>
          <th>{{ $t(`阶梯盈亏要求`) }}</th>
          <th>{{ $t(`层级`) }}</th>
          <!-- <th>{{$t(`层级盈利`)}}</th> -->
          <!-- <th>{{$t(`层级收益`)}}</th> -->
        </tr>
        <tr v-for="(item, index) in planTable[currency]" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ $t('大于') }} {{ item.win }} {{ $t(',且至少') }} {{ item.memeber }} {{ $t('活跃会员') }}</td>
          <td>{{ item.grade }}</td>
          <!-- <td>{{ item.get }}</td> -->
          <!-- <td>{{ item.profit }}</td> -->
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref, toRaw, onBeforeUnmount, onMounted, watch, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { login, register, commissionsummary } from '@/api/agent';
import Lang from '@/components/Layout/header/components/Lang.vue';

const global = inject('global');
const isShowLogin = ref(false);
const subConfig = inject('subConfig');
const form = reactive({
  username: '',
  password: '',
});

const join = [
  { title: global.$t(`信誉团队`), desc: global.$t(`信誉团队-老牌专业团<br>队打造全新国际品牌`) },
  { title: global.$t(`丰富多样化产品`), desc: global.$t(`丰富多样化产品 - 产品质与量的保障<br>可满足国际化和本土化市场需求`) },
  { title: global.$t(`佣金丰厚`), desc: global.$t(`致力于为会员和代理 <br>提供共赢互惠的机制`) },
  { title: global.$t(`专业协助`), desc: global.$t(`24/7小时为您和会员提供专业的服务<br>提供方便快捷的提款方式。`) },
  { title: global.$t(`合规保障`), desc: global.$t(`合法合规的操作流程<br>以及风控团队为您保驾护航。`) },
];

const steps = [
  global.$t(`注册代理，把我身边任何客<br>源立即加入{0}`, [subConfig.title]),
  global.$t(`审核开通-代理专员1对1指导<br>代理操作流程`),
  global.$t(`对外推广-利用自身资源优势<br>与平台专业信誉团队保障进行<br>推广`),
  global.$t(`赚取佣金 - 坐佣百万<br>指日可待`),
];

const $store = inject('store');
const { agent, app } = $store.state;

const currency = computed(() => {
  let id = '';
  if (agent.isLogin) {
    id = agent.userInfo?.inte_currency_id;
  } else {
    id = app.currencyId;
  }
  console.log('currencyId', id);
  console.log('isLogin', agent.isLogin);
  return id;
});

const planTable = reactive({
  3: [
    {
      win: '0', grade: '35%', memeber: '5', profit: '0.00',
    },
    {
      win: '200,000,001', grade: '40%', memeber: '5', profit: '0.00',
    },
    {
      win: '999,000,001', grade: '45%', memeber: '5', profit: '0.00',
    },
    {
      win: '1,500,000,001', grade: '50%', memeber: '5', profit: '0.00',
    },
  ],
  4: [
    {
      win: '0', grade: '30%', memeber: '5', profit: '0.00',
    },
    {
      win: '200,001', grade: '35%', memeber: '10', profit: '0.00',
    },
    {
      win: '900,001', grade: '40%', memeber: '15', profit: '0.00',
    },
    {
      win: '1,500,001', grade: '45%', memeber: '20', profit: '0.00',
    },
    {
      win: '3,000,000', grade: '50%', memeber: '25', profit: '0.00',
    },
  ],
});

const { run: rateRun, data: rateData } = useRequest(commissionsummary, { manual: true });
if (Cookies.get('agent_access_token')) {
  rateRun();
}

const isTop = ref(false);
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop !== 0) {
    isTop.value = true;
  } else {
    isTop.value = false;
  }
}
onMounted(async () => {
  if (Cookies.get('agent_access_token')) {
    await $store.dispatch('agent/getUserInfo');
    rateRun();
  }
  window.addEventListener('scroll', handleScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

const { run: postLogin, loading: loginLoading } = useRequest(
  login,
  {
    manual: true,
    onSuccess(loginResult) {
      Cookies.set('agent_access_token', loginResult.access_token);
      global.$store.commit('agent/SET_LOGIN', true);
      // await $store.dispatch('agent/getUserInfo');
      global.$router.push('/affiliate/home');
    },
  },
);
function doLogin() {
  if (!form.username) {
    global.$message.error(global.$t(`请输入用户名！`));
    return false;
  }
  if (!form.password) {
    global.$message.error(global.$t(`请输入密码！`));
    return false;
  }
  // console.log(toRaw(form));
  postLogin(toRaw(form));
}
function showDialog() {
  global.$dialog({ tpl: 'LoginModal', type: 'register' });
}

function to(i) {
  const config = {
    0: 658,
    1: 1738,
    2: 2617,
    3: 3393,
  };
  window.scrollTo(0, config[i]);
}

</script>

<style lang="scss" scoped>
.agentlanding-wrap {
  margin-top: calc(0px - var(--header-height));
  padding-top: 90px;

  &-head {
    height: 90px;
    background-color: var(--bg-color-222930);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    padding: 0 60px;
    box-sizing: border-box;

    .main {
      height: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin: 0 auto;
      padding-bottom: 20px;
      box-sizing: border-box;

      p {
        margin: 0;
        text-align: left;
        color: var(--font-color-fff);
        white-space: nowrap;
      }

      .left {
        height: 30px;

        img {
          height: 23px;
          margin-right: 20px;
          cursor: pointer;
        }

        p {
          font-size: 18px;

          span {
            cursor: pointer;
          }
        }
      }

      .right {
        align-items: flex-end;
        font-size: 13px;

        p {
          margin-bottom: 4px;
        }

        .el-input {
          line-height: 30px;
          width: 130px;
          margin-right: 10px;
        }

        :deep(.el-input__inner) {
          height: 30px;
          padding: 0 10px;
          border: 1px solid var(--input-border-color);
          background-color: transparent;
          border-radius: 6px;
          color: var(--font-color-fff);

          &:hover,
          &:focus {
            border-color: var(--theme-color);
          }
        }

        :deep(.el-input__icon) {
          height: 30px;
          line-height: 30px;
        }

        .el-button {
          min-height: 30px;
          padding-top: 0;
          padding-bottom: 0;
          padding: 0 10px;
          font-size: 13px;

          &--line {
            border-color: var(--border-color-fff);
          }

          &--default {
            border: 1px solid var(--input-border-color);
            color: var(--font-color-fff);

            &:hover,
            &:focus {
              background-color: transparent;
              border-color: var(--theme-color);
            }
          }
        }

        .lang {
          border: 1px solid var(--input-border-color);
          border-radius: 6px;
          padding: 0 10px;
          height: 30px;
          box-sizing: border-box;
          margin: 0 10px;

          &:hover {
            background-color: transparent;
            border-color: var(--theme-color);
          }

          img {
            width: 26px;
            margin-right: 5px;
          }

          i {
            margin-left: 18px;
          }
        }
      }
    }

    &.active {
      border-bottom: 2px solid var(--theme-color);

      .el-button--primary {
        border-color: var(--input-border-color);
      }

      :deep(.el-input__inner) {
        &::placeholder {
          color: var(--font-color-fff);
        }

        &:hover,
        &:focus {
          border-color: var(--input-border-color) !important;
        }
      }

      .el-button--default,
      .lang {

        &:hover,
        &:focus {
          border-color: var(--input-border-color) !important;
          background: var(--bg-color-51cfae);
          background-color: var(--bg-color-e9f9f5);
        }
      }
    }
  }

  &-banner {
    height: 658px;
    background-size: 100% 100%;
    align-items: flex-end;
    padding: 0 60px;

    &-pic {
      margin-right: 30px;

      img {
        height: 626px;
      }
    }

    >.agentlanding-wrap-info {
      flex-direction: column;
      padding-right: 70px;
      height: 100%;
      color: var(--font-color-fff);
      align-items: flex-end;

      h2 {
        margin: 0;
        font-size: 60px;
        line-height: 84px;
      }

      p {
        font-size: 38px;
        line-height: 53px;
        margin: 0;
      }

      .el-button {
        border-width: 2px;
        font-size: 24px;
        margin-top: 50px;
        min-width: 174px;
        height: 55px;
      }
    }
  }

  &-join {
    height: 1080px;
    background-size: 100% 100%;
    box-sizing: border-box;
    position: relative;

    >h2 {
      font-size: 65px;
      font-weight: 800;
      text-align: center;
      color: var(--font-color-222930);
      line-height: 98px;
      margin: 0;
      padding: 90px 0;
    }

    >div {
      flex-wrap: wrap;
      align-items: flex-start;

      >div {
        width: calc(100% / 3);
        text-align: center;
        margin-bottom: 55px;

        img {
          width: 199px;
        }

        h2 {
          font-size: 24px;
          line-height: 36px;
          color: var(--font-color-222930);
          margin: 10px 0;
        }

        p {
          margin: 0 0 0 0;
          font-size: 18px;
          line-height: 20px;
          color: var(--font-color-666);
        }
      }
    }
  }

  &-start {
    height: 879px;
    background-size: 100% 100%;
    position: relative;

    >div {
      padding-top: 273px;
      counter-reset: count;
      background: url("/src/assets/images/agent/agentLanding/start.png") center center no-repeat;
      background-size: auto 100%;
      height: 100%;
      box-sizing: border-box;
      align-items: flex-start;

      >div {
        width: 270px;
        height: 370px;
        background: var(--bg-color-000-3);
        border: 3px solid var(--border-color-fff);
        margin: 0 20px;
        padding-top: 72px;
        box-sizing: border-box;

        position: relative;

        &::before {
          content: counter(count, decimal) "";
          counter-increment: count;
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: var(--bg-color-fff);
          text-align: center;
          line-height: 72px;
          font-size: 28px;
          color: var(--font-color-000);
          font-weight: bold;
          top: -36px;
          left: 50%;
          margin-left: -36px;
        }

        img {
          width: 100px;
        }

        p {
          color: var(--font-color-fff);
          font-size: 18px;
          line-height: 27px;
          margin: 20px 0 0;
        }
      }
    }
  }

  &-detail {
    height: 776px;
    background-size: 100% 100%;
    position: relative;

    >div {
      padding-top: 115px;
    }

    img {
      width: 412px;
      margin-right: 120px;
    }

    p {
      font-size: 24px;
      line-height: 33px;
      color: var(--font-color-222930);
      margin: 20px 0;
      width: 640px;
      text-align: left;
    }
  }

  &-plan {
    background-color: var(--bg-color-ecf0f6);
    padding: 58px 60px 74px;
    text-align: center;

    h2 {
      font-size: 55px;
      font-weight: 800;
      color: var(--font-color-222930);
      line-height: 83px;
      margin: 0;
    }

    table {
      width: 100%;
      margin: 0 auto;
      border-collapse: collapse;
      table-layout: fixed;
      color: var(--font-color-fff);
      font-size: 28px;
      margin-top: 38px;

      th {
        height: 78px;
        background-color: var(--dark-bg-color-333, var(--bg-color-222930));
        border: 1px solid var(--border-color-222930);

        &:not(:last-child) {
          border-right-color: var(--border-color-fff);
        }
      }

      td {
        text-align: center;
        height: 78px;
        color: var(--font-color-404040);
        border: 1px solid var(--border-color-222930);
      }

      &.table-info {
        td:nth-child(2) {
          font-size: 20px;
        }
      }
    }
  }

  .arrow {
    position: absolute;
    width: 72px;
    bottom: 53px;
    left: 50%;
    transform: translateX(-50%);
    animation: move 1.5s linear infinite;
  }

  :deep(.svg-icon) {
    width: 99px;
    height: 99px;
    fill: var(--font-color-fff) !important;
  }

  .svg-icon-join {
    width: 199px;
    height: 199px;
  }
}

@keyframes move {
  0% {
    transform: translateY(-15px);
  }

  50% {
    transform: translateY(15px);
  }

  100% {
    transform: translateY(-15px);
  }
}
</style>
