<template>
  <div id="interestRate">
    <div
      :class="[
        'top',
        { 'top-wanqu': ['10001', '10046'].includes(projectName), 'top-other': ['10001', '10046'].indexOf(projectName) == -1 }
      ]"
    />
    <!-- 福利升级 -->
    <div
      :class="[
        'welfare',
        {
          'welfare-wanqu': ['10001', '10046'].includes(projectName),
          'welfare-other': ['10001', '10046'].indexOf(projectName) == -1
        }
      ]"
    />
    <!-- 操作简单 -->
    <div class="operational" />
    <!-- 等级介绍 -->
    <div class="grade">
      <div class="gradeList">
        <table>
          <tr class="grade-title">
            <th>{{ $t(`会员等级`) }}</th>
            <th>{{ $t(`七日年化(%)`) }}</th>
            <th>{{ $t(`最大保持(天数)`) }}</th>
            <th>{{ $t(`转入金额上限(万元)`) }}</th>
          </tr>
          <tr v-for="(item, index) in list" :key="index" style="background: #fff">
            <td>
              <!-- <span></span> -->
              {{ item.name }}
            </td>
            <td>{{ item.condition.rate }}%</td>
            <td>{{ item.condition.day }}{{ $t('天') }}</td>
            <td>{{ item.condition.up_money }}{{ $t('万') }}</td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 利益计算器 -->
    <div class="calculator">
      <p>{{ $t(`利益计算器`) }}</p>
      <div class="calculatorInput">
        <div class="form-item">
          <label class="form-item-label">
            {{ $t(`转入金额`) }}
          </label>
          <div class="form-item-content">
            <input v-model="money" type="number" :placeholder="$t(`请输入100或以上的金额`)" />
            <span class="yuan">{{ $t(`元`) }}</span>
          </div>
        </div>
        <div class="form-item">
          <div class="block time times">
            <span class="demonstration">{{ $t(`转入日期`) }}</span>
            <el-date-picker v-model="value1" type="date" :placeholder="$t('选择日期')" />
          </div>
          <div class="block times">
            <span class="demonstration">{{ $t('转出日期') }}</span>
            <el-date-picker v-model="value2" type="date" :placeholder="$t('选择日期')" />
          </div>
        </div>
        <div class="form-item">
          <label class="form-item-label">
            {{ $t(`收入利益`) }}
          </label>
          <div class="form-item-content">
            <input v-model="num" type="text" disabled />
          </div>
        </div>
        <p class="incomeAmount">
          {{ $t(`*收益金额以最高年利率13%计算`) }}
        </p>
        <router-link v-if="!isLogin" :to="{ name: 'register' }" tag="div" class="calculatorBtn">
          {{ $t(`注册`) }}
        </router-link>
        <div v-if="isLogin" class="calculatorBtn" @click="go">
          {{ $t('立即转入') }}
        </div>
      </div>
    </div>
    <!-- 常见问题 -->
    <div class="problem">
      <div class="problemDetail">
        <div class="problemTitle">
          <div @click="activeTab = 0">
            {{ $t(`什么是聚宝盆?`) }}
          </div>
          <div @click="activeTab = 1">
            {{ $t(`活动规则`) }}
          </div>
          <div @click="activeTab = 2">
            {{ $t(`服务条款`) }}
          </div>
        </div>
        <div class="problemContent">
          <div v-if="activeTab === 0">
            {{ $t('聚宝盆是') }}{{ $t(title) }}娱乐打造的一种理财服务， {{ $t('把您存款进入游戏账号的钱转入')
            }}{{ $t(title) }}所提供的过夜利息钱包满足12小时；存入的资金越高，获得的利润会更高，最高可获得利率13%。
          </div>
          <div v-if="activeTab === 1">
            <p>1. {{ $t(title) }}所有一星及以上会员均可享受。</p>
            <p>{{ $t('2. 聚宝盆金额无法直接投注，但是可以直接转入其它游戏进行投注。') }}</p>
            <p>3. 聚宝盆所产生优惠只需要1倍流水即可取款，优惠额100元以内无流水要求可以直接取款。</p>
            <p>4. 聚宝盆会在转入资金的12小时后开始计算利息，每日计算一次。发放时间为每日下午6点。</p>
            <p>
              5.
              聚宝盆在根据不同的VIP等级存满7~9天之后，必须取出来一次才能继续计算利息。否则聚宝盆在存满天数达到后将不会继续为您提供利息。
            </p>
          </div>
          <div v-if="activeTab === 2">
            <p>
              1.
              本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结帐户以及没收所有余额的权利。
            </p>
            <p>2. {{ $t(title) }}拥有最终解析权。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject } from 'vue';
import dayjs from 'dayjs';
import subconfig from '@current/config';

import { specialdetail } from '@/api/activity';

const merchant_no = import.meta.env.VITE_APP_MERCHANT_NO;
const projectName = import.meta.env.VITE_APP_PROJECT_NAME;

export default defineComponent({
  inject: ['store', 'global'],
  data() {
    return {
      projectName,
      title: subconfig.title,
      id: 0, // 活动id
      value1: '',
      value2: '',
      list: [],
      activeTab: 0, // 底部切换
      money: '', // 输入金额
      memberLevel: [],
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.store.dispatch('app/getDict', ['memberlevellist']);
  },
  watch: {
    'store.state.app.dicts.memberlevellist': {
      handler: function (nval) {
        this.memberLevel = nval;
        this.getDetail();
      },
      deep: true,
    }
  },
  computed: {
    // 计算利息
    num() {
      if (this.value1 && this.value2 && this.money) {
        console.log(this.money)
        let date1 = dayjs(this.value1);
        let date2 = dayjs(this.value2);
        let day = date2.diff(date1, 'day');
        let num = this.money ? ((parseInt(this.money, 10) * 0.13) / 365) * day : 0;
        return num.toFixed(2);
      }
      return '0.0';
    },
    isLogin() {
      return this.store.state.user.isLogin
    },
    userInfo() {
      return this.store.state.user.userInfo
    },
  },
  methods: {
    // 获取详情
    getDetail() {
      specialdetail({
        merchant_no,
        id: this.id,
      }).then((res) => {
        const { condition_setting } = res;
        this.list = condition_setting.map((val) => {
          return {
            ...val,
            name: this.$t(this.memberLevel[val.level].name) || ''
          };
        });
      });
    },
    // 立即转入
    go() {
      const { list, userInfo, money } = this;
      if (money < 100 || money > list[userInfo.level * 1].condition.up_money * 1 * 10000) {
        this.global.$message.error(`请输入100～${list[userInfo.level * 1].condition.up_money * 1 * 10000}之间的金额`);
      } else {
        this.$router.push({
          name: 'centerFinancial',
        });
      }
    }
  },
});
</script>

<style src="./style.scss" lang="scss" scoped></style>
