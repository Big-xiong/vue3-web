<template>
  <div id="sixGift">
    <div class="top">
      <img class="bg" src="./assets/bg_1.jpg" alt="" />
      <div class="limit-active">
        <div class="new-vip">
          <p class="money">
            {{ sixInfo.money }}
          </p>
          <p class="counts">
            {{ sixInfo.user }}
          </p>
        </div>
      </div>
      <div class="active-profit">
        <div class="profit-box">
          <p v-if="isLogin" class="no-login">
            {{ btnText }}
          </p>
          <p v-else class="no-login">
            {{ $t('请您登录后查看活动剩余时间!您的优惠正在慢慢流失啦!') }}
          </p>
          <p class="get-profit" @click="handlerProfit">
            {{ $t('立即存款') }}
          </p>

          <ul class="red-bag">
            <li v-for="(item, index) in profit_arr" :key="index">
              <img src="./assets/red_bag.png" alt="" />
              <div class="content">
                <p style="font-size: 30px; font-weight: 600; line-height: 40px">
                  {{ item.benefit_money }}
                  <span style="font-size: 20px">{{ $t('元') }}</span>
                </p>
                <p style="font-size: 16px; line-height: 40px">{{ $t('免费彩金') }}{{ item.flow }}倍流水</p>
                <p style="font-size: 16px">{{ $t('单笔存款') }}{{ item.recharge_money }}元</p>
                <p style="font-size: 16px">
                  {{ $t('以上即可派发') }}
                </p>
              </div>
              <div v-if="item.haveReceive" class="already-received">
                <img src="./assets/lingqu.png" alt="" />
                <p>{{ $t('已领取') }}</p>
              </div>
              <button v-else class="get-btn" @click="handleClickGetRedPacket(index)">
                {{ $t('领取') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="middle">
      <img class="bg" src="./assets/bg_2.jpg" alt="" />
      <div class="withdraw-log">
        <table>
          <thead>
            <tr>
              <td>{{ $t('领取时间') }}</td>
              <td>{{ $t('游戏账号') }}</td>
              <td>{{ $t('领取状态') }}</td>
              <td>{{ $t('领取金额') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td>{{ item.created_at }}</td>
              <td>{{ item.username }}</td>
              <td>{{ $t('成功') }}</td>
              <td :class="{ red: item.money * 1 > 1000 }">
                {{ item.money }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="page-box" style="text-align: center">
          <el-pagination
            :current-page="page"
            :page-size="8"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <img class="bg" src="./assets/bg_3.jpg" alt="" />
      <img class="active-detail" src="./assets/active_detail.png" alt="" />
      <div class="content">
        <p>1. {{ $t(title) }}所有新手会员均可享受。</p>
        <p>{{ $t('2. 会员需要达成每次存款最低要求即可获得存款礼金。') }}</p>
        <p>
          {{
            $t(
              '3. 如果单次存款金额达到多个层级，按照最高可以领取层级领取。流水倍数公式：（本金+礼金）*当前层级流水倍数=提款所需流水。'
            )
          }}
        </p>
        <p>{{ $t('4. 新手任务从会员注册日起，只保留7天。') }}</p>
        <p>{{ $t('5. 每个层级礼金均只能领取一次。') }}</p>
        <p>{{ $t('6. 本活动不与返水活动共享。') }}</p>
        <p>
          7.
          本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，一经发现我们将保留冻结账户以及没收所有余额的权利。
        </p>
        <p>8. {{ $t(title) }}拥有最终解释权。</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import dayjs from 'dayjs';
import subconfig from '@current/config';
import { paytype } from '@/api/center';
import { sixinforecord, sixinfo, specialdetail, getsixinfoReward } from '@/api/activity';

const projectName = import.meta.env.VITE_APP_PROJECT_NAME;

export default defineComponent({
  name: 'sixGift',
  inject: ['store'],
  data() {
    return {
      title: subconfig.title,
      profit_arr: [],
      tableData: [],
      page: 1,
      total: 1,
      timer: null,
      types: [
        {
          name: ''
        }
      ],
      sixInfo: {},
      detail: [],
      btnText: this.$t('请您登录后查看活动剩余时间!您的优惠正在慢慢流失啦!')
    };
  },
  computed: {
    isLogin() {
      return this.store.state.user.isLogin;
    },
    userInfo() {
      return this.store.state.user.userInfo;
    }
  },
  async created() {
    if (this.isLogin) {
      paytype().then((res) => {
        this.types = res;
      });
    }
    sixinforecord().then((res) => {
      this.tableData = res.list;
      this.total = res.total;
    });

    // 六重礼信息，需要同步获取，后面接口有用到
    this.init();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    async init() {
      this.sixInfo = await sixinfo();
      this.getDetail(this.$route.query.id);
    },
    // 六重礼领取记录 分页
    async handleCurrentChange(val) {
      await sixinforecord({
        page: val
      }).then((res) => {
        this.tableData = res.list;
        this.total = res.total;
      });
    },
    // 立即领取
    handlerProfit() {
      if (this.isLogin) {
        const name = this.types[0].name === this.$t('客服支付') ? this.types[1].name : this.types[0].name;
        this.$router.push({
          name: 'centerDeposit',
          query: {
            name
          }
        });
      } else {
        this.$alert(this.$t('请先登录账号'), {
          confirmButtonText: this.$t('确定'),
          center: true
        }).then(() => {
          switch (projectName) {
          case '10025':
          case '10029':
          case '10064':
          case '10059':
          case '10060':
            this.$router.push('/login');
            break;
          default:
            this.$login.open();
          }
        });
      }
    },
    // 领取新手六重礼
    handleClickGetRedPacket(index) {
      if (this.isLogin) {
        getsixinfoReward({ step: index + 1 }).then((res) => {
          this.$message({
            message: `领取第${index + 1}重礼成功`,
            type: 'success'
          });
          this.init();
        });
      }
    },
    // 获取优惠详情
    getDetail(id) {
      specialdetail({
        id
      }).then((res) => {
        this.detail = res.condition_setting;
        const { get_status } = this.sixInfo;
        this.profit_arr = res.condition_setting.condition.map((item, index) => {
          let haveReceive = false;
          if (get_status && get_status[index + 1]) {
            haveReceive = true;
          }
          return {
            ...item,
            haveReceive
          };
        });

        // 账户创建时间
        const { created_at } = this.userInfo;
        if (created_at) {
          // 活动到期时间
          const endDay = dayjs(created_at).add(this.detail.save_days, 'day');
          this.timer = setInterval(() => {
            // 当前时间
            const newDay = dayjs(new Date());
            // 活动到期时间-当前时间
            if (endDay - newDay < 0) {
              this.btnText = this.$t('七天倒计时新手活动已结束，感谢您的参与！');
            } else {
              const days = endDay.diff(newDay, 'day');
              const hours = endDay.diff(newDay, 'hour') % 24;
              const minutes = endDay.diff(newDay, 'minute') % 60;
              const seconds = endDay.diff(newDay, 'second') % 60;

              this.btnText = `${days}天${hours}小时${minutes}分${seconds}秒`;
            }
          }, 1000);
        }
      });
    }
  }
});
</script>

<style src="./style.scss" lang="scss" scoped></style>
