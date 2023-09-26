<template>
  <div id="invitation">
    <!-- 头部 -->
    <div class="top">
      <div class="welfare">
        <div class="received">
          <span>{{ $t(`已领取福利`) }}：</span>
          <div>{{ detail.has_get_benefits }}</div>
        </div>
        <div class="unclaimed">
          <span>{{ $t(`待领取福利`) }}：</span>
          <div>{{ detail.no_get_benefits }}</div>
        </div>
        <div class="welfareBtn" @click="handleGetspreadmoney">
          {{ $t(`立即领取`) }}
        </div>
      </div>
      <div class="clativeNum">
        <div class="goodFriendNum">
          <h3>{{ $t(`累计邀请好友`) }}</h3>
          <p>{{ detail.invit_users }}</p>
        </div>
        <div class="cashGiftNum">
          <h3>{{ $t(`累计福利礼金`) }}</h3>
          <p>{{ detail.total_benefits }}</p>
        </div>
      </div>
      <div class="extensionCode">
        <p>{{ $t(`我的专属好友邀请链接和推广码`) }}</p>
        <div class="codeBtn">
          <p @click="copy($event, detail)">{{ detail.spread_url }}?code={{ detail.spread_code }}</p>
        </div>
      </div>
    </div>
    <!-- 我的好友，邀请规则 -->
    <div class="invitationList">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t(`我的好友`)" name="first">
          <div class="goodFriendList">
            <p>
              <i class="el-icon-arrow-left" />
              {{ $t(`邀请好友明细`) }}
              <i class="el-icon-arrow-right" />
            </p>
            <div class="gradeList">
              <table>
                <tr class="grade-title">
                  <th>{{ $t(`日期`) }}</th>
                  <th>{{ $t(`好友账号`) }}</th>
                  <th>{{ $t(`总投注金额`) }}</th>
                  <th>{{ $t(`拉新福利礼金`) }}</th>
                </tr>
                <tr v-for="(item, index) in list" :key="index">
                  <td>{{ item.start_time }}</td>
                  <td>{{ item.new_username }}</td>
                  <td>{{ item.valid_bet }}</td>
                  <td>{{ item.benefit_money }}</td>
                </tr>
              </table>
            </div>
            <el-pagination
              v-show="list.length > 0 && activeName == 'first'"
              background
              layout="prev, pager, next"
              :page-count="totalPage"
              :current-page="currentPage"
              @current-change="getList"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t(`邀请规则`)" name="second">
          <div class="memberList">
            <p>
              <i class="el-icon-arrow-left" />
              {{ $t(`会员等级介绍`) }}
              <i class="el-icon-arrow-right" />
            </p>
            <table>
              <tr class="memberList-title">
                <th>{{ $t(`会员等级`) }}</th>
                <th>{{ $t(`新手福利（新人）`) }}</th>
                <th>{{ $t(`拉新福利（自己）`) }}</th>
                <th>{{ $t(`享有时长（周）`) }}</th>
              </tr>
              <tr v-for="(item, index) in memberList" :key="index">
                <td v-if="item.name">
                  {{ item.name }}
                </td>
                <td v-if="item.condition">{{ item.condition.new_profite_money }}元额外注册礼金</td>
                <td v-if="item.condition">{{ $t('新人投注额 ') }}{{ item.condition.get_new_benefit }}</td>
                <td v-if="item.condition">
                  {{ item.condition.druing_week }}
                </td>
              </tr>
            </table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 邀请流程 -->
    <div class="invitationProcess">
      <p>
        <i class="el-icon-arrow-left" />
        {{ $t(`邀请流程`) }}
        <i class="el-icon-arrow-right" />
      </p>
      <div class="process">
        <div>
          <img src="./assets/process1.png" />
          <p>{{ $t(`第一步：获取专属邀请码`) }}</p>
          <p>{{ $t(`登录并进入“我的好友”获取邀请码`) }}</p>
        </div>
        <img src="./assets/arrow.png" />
        <div>
          <img src="./assets/process2.png" />
          <p>{{ $t(`第二步：发送给好友`) }}</p>
          <p>{{ $t(`复制链接发送好友`) }}</p>
        </div>
        <img src="./assets/arrow.png" />
        <div>
          <img src="./assets/process3.png" />
          <p>{{ $t(`第三步：注册成功`) }}</p>
          <p>{{ $t(`推荐人和被推荐人同时获得福利`) }}</p>
        </div>
      </div>
    </div>
    <!-- 活动说明 -->
    <div class="activities">
      <div>
        <div><span>1</span>{{ $t(`{0}所有会员均可享受。`, [$t(subConfig.title)]) }}</div>
        <div><span>2</span>{{ $t(`新手福利需要完成4倍流水才能取款，拉新福利只需2倍流水即可取款。`) }}</div>
        <div><span>3</span>{{ $t(`新手会员如果已经超过享有时长，系统将不再给介绍人发放拉新福利。`) }}</div>
        <div><span>4</span>{{ $t(`拉新福利必须是新人在有存款的情况下才计算，如果只用注册礼金打的流水系统将不会发放拉新福利。`) }}</div>
        <div><span>5</span>{{ $t(`系统判断单周如果有效拉新人数超过10人，将会自动发放神秘彩金。`) }}</div>
        <div><span>6</span>{{ $t(`每月系统挑选出有效拉新人数最多的3组好友（每组好友包含所有新人和自己），并对整个好友线发放神秘彩金。`) }}</div>
        <div><span>7</span>{{ $t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为， 一经发现我们将保留冻结帐户以及没收所有余额的权利。`) }}</div>
        <div><span>8</span>{{ $t(`{0}拥有最终解析权。`, [$t(subConfig.title)]) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Clipboard from 'clipboard';

import { spreadinfo, spreadrecord, getspreadmoney, specialdetail } from '@/api/activity';

const merchant_no = import.meta.env.VITE_APP_MERCHANT_NO;

export default defineComponent({
  name: 'invitation',
  inject: ['store'],
  data() {
    return {
      id: 0, // 活动id
      account: localStorage.getItem('account'), // 是否试玩账号
      detail: {}, // 页面信息
      // 邀请好友列表
      list: [],
      // 会员等级
      memberList: [],
      // 时间
      activeName: 'first',
      currentPage: 1, // 当前页
      totalPage: 1, // 总页数
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: this.$t('今天'),
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: this.$t('昨天'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: this.$t('一周前'),
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      },
      value1: '',
      value2: '',
      memberLevel: [] // 全部等级
    };
  },
  computed: {
    isLogin() {
      return this.store.state.user.isLogin;
    }
  },
  async created() {
    this.id = this.$route.query.id;
    this.getInfo();
    this.getList();
    this.store.dispatch('app/getDict', 'memberlevellist').then((res) => {
      this.memberLevel = res;
      this.getDetail();
    });
  },
  methods: {
    // 获取优惠详情
    getDetail() {
      specialdetail({
        merchant_no,
        id: this.id
      }).then((res) => {
        const list = res.condition_setting;
        list.sort((a, b) => a.level - b.level);
        this.memberList = list.map((val) => {
          return {
            ...val,
            name: this.$t(this.memberLevel[val.level].name) || ''
          };
        });
      });
    },
    // 打开其他链接
    goOther(link) {
      window.open(`${link.spread_url}?code=${link.spread_code}`);
    },
    // 复制链接
    copy(e, detail) {
      if (!this.isLogin) {
        this.$alert(this.$t('请先登录账号'), {
          confirmButtonText: this.$t(`确定`),
          center: true
        }).then(() => {
          this.$login.open();
        });
        return;
      }
      const text = `${detail.spread_url}?code=${detail.spread_code}`;
      const clipboard = new Clipboard(e.target, { text: () => text });
      clipboard.on('success', () => {
        this.$message({ type: 'success', message: this.$t('复制成功') });
        clipboard.destroy();
      });
      clipboard.on('error', () => {
        this.$message({ type: 'waning', message: '该浏览器不支持自动复制' });
        clipboard.destroy();
      });
      clipboard.onClick(e);
    },
    // 获取优惠信息
    getInfo() {
      if (this.isLogin) {
        spreadinfo({
          merchant_no,
          id: this.id
        }).then((res) => {
          this.detail = res;
        });
      } else {
        this.detail = {
          has_get_benefits: '0',
          no_get_benefits: '0',
          invit_users: '0',
          total_benefits: '0',
          spread_url: 'http://',
          spread_code: ''
        };
        this.$alert(this.$t('请先登录账号'), {
          confirmButtonText: this.$t(`确定`),
          center: true
        }).then(() => {
          // this.$router.push({
          //   name: 'signin-account'
          // })
          this.$login.open();
        });
      }
    },
    // 邀请记录
    getList(page) {
      if (this.isLogin) {
        this.currentPage = page;
        spreadrecord({
          merchant_no,
          id: this.id,
          page: this.currentPage
        }).then((res) => {
          this.list = res.data;
          this.totalPage = res.last_page;
        });
      }
    },
    // 领取福利
    handleGetspreadmoney() {
      if (this.isLogin) {
        getspreadmoney({
          merchant_no,
          id: this.id
        }).then(() => {
          this.$alert(this.$t('领取成功'), {
            confirmButtonText: this.$t(`确定`),
            center: true
          })
            .then(() => {
              this.getInfo();
              this.getList();
            })
            .catch(() => {
              this.getInfo();
              this.getList();
            });
        });
      } else {
        this.$alert(this.$t('请先登录账号'), {
          confirmButtonText: this.$t(`确定`),
          center: true
        }).then(() => {
          this.$login.open();
        });
      }
    }
  }
});
</script>

<style src="./style.scss" lang="scss" scoped></style>
<style lang="scss">
body {
  line-height: 1;
}
</style>
