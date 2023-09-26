<template>
  <div id="threeGift">
    <div class="button" v-login @click="handleGetspreadmoney">{{ $t('立即领取') }}</div>
    <div class="gift-get">
      <div class="gift-get1">
        <span class="tit">{{ $t(`已领取福利`) }}</span>
        <p>
          {{ data.detail.has_get_benefits ?? 0 }} <span>{{ $t('元') }}</span>
        </p>
      </div>
      <div class="gift-get2">
        <span class="tit">{{ $t(`待领取福利`) }}</span>
        <p>
          {{ data.detail.no_get_benefits ?? 0 }} <span>{{ $t('元') }}</span>
        </p>
      </div>
    </div>
    <div class="gift-link">
      <div class="gift-count">
        <p>{{ $t('累计') }}<br />{{ $t('邀请好友') }}</p>
        <span>{{ data.detail.invit_users ?? 0 }}</span>
        <p>{{ $t('累计') }}<br />{{ $t('福利礼金') }}</p>
        <span>{{ data.detail.total_benefits ?? 0 }}{{ $t('元') }}</span>
      </div>
      <p class="gift-link-tit">{{ $t('- 【我的专属好友邀请链接和推广码】 -') }}</p>
      <p class="gift-link-code">{{ data.detail.spread_url }}?code={{ data.detail.spread_code }}</p>
    </div>
    <div class="invite-rule">
      <div class="invite-rule-wrap">
        <p class="tit">{{ $t('邀请规则') }}</p>
        <table>
          <tr>
            <th>{{ $t('会员等级') }}</th>
            <th>{{ $t('新手福利（新人）') }}</th>
            <th>{{ $t('拉新福利（自己）') }}</th>
            <th>{{ $t('享有时长（周）') }}</th>
          </tr>
          <tr v-for="(item, index) in data.memberList" :key="index">
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
      <div class="invite-rule-det">
        <p class="tit">{{ $t('邀请好友明细') }}</p>
        <table>
          <tr>
            <th>{{ $t('好友账号') }}</th>
            <th>{{ $t('总投注金额') }}</th>
            <th>{{ $t('拉新福利礼金') }}</th>
            <th>{{ $t('日期') }}</th>
          </tr>
          <tr v-for="(item, index) in data.list" :key="index">
            <td>{{ item.start_time }}</td>
            <td>{{ item.new_username }}</td>
            <td>{{ item.valid_bet }}</td>
            <td>{{ item.benefit_money }}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="invite-steps">
      <h2>{{ $t('- 【邀请流程】 -') }}</h2>
      <div class="steps">
        <p>
          <span>{{ $t('第一步：') }}</span>
          <span>{{ $t('获取专属邀请码') }}<br />{{ $t('登录并进入“我的好友”获取邀请码') }}</span>
        </p>
        <p>
          <span>{{ $t('第二步：发送给好友复制链接发送好友') }}</span>
        </p>
        <p>
          <span>{{ $t('第三步：注册成功推荐人和被推荐人同时获得福利') }}</span>
        </p>
      </div>
      <div class="invite-desc">
        <h3>{{ $t('活动细则：') }}</h3>
        <p>{{ $t('此平台所有会员均可享受。') }}</p>
        <p>{{ $t('新手福利需要完成4倍流水才能取款，拉新福利只需2倍流水即可取款。') }}</p>
        <p>{{ $t('新手会员如果已经超过享有时长，系统将不再给介绍人发放拉新福利。') }}</p>
        <p>{{ $t('拉新福利必须是新人在有存款的情况下才计算，如果只用注册礼金打的流水系统将不会发放拉新福利。') }}</p>
        <p>{{ $t('系统判断单周如果有效拉新人数超过10人，将会自动发放神秘彩金。') }}</p>
        <p>{{ $t('每月系统挑选出有效拉新人数最多的3组好友（每组好友包含所有新人和自 己），并对整个好友线发放神秘彩金。') }}</p>
        <p>
          {{
            $t(
              '本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户，包括同一姓名，同一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为， 一经发现我们将保留冻结帐户以及没收所有余额的权利。'
            )
          }}
        </p>
        <p>{{ $t('为本公司保留对该活动的最终解释权。') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { spreadinfo, spreadrecord, getspreadmoney, specialdetail } from '@/api/activity';

const $route = useRoute();

const data = reactive({
  list: [],
  memberList: [],
  detail: {},
  totalPage: 0
});

// 领取福利
const handleGetspreadmoney = () => {
  getspreadmoney({
    id: $route.query.id
  }).then(() => {
    this.$alert(this.$t('领取成功'), {
      confirmButtonText: this.$t('确定'),
      center: true
    })
      .then(() => {
        getInfo();
        getList();
      })
      .catch(() => {
        getInfo();
        getList();
      });
  });
};

const getDetail = () => {
  specialdetail({
    id: $route.query.id
  }).then((res) => {
    let list = res.condition_setting;
    data.memberList = list.map((val) => {
      return {
        ...val,
        name: this.memberLevel[val.level].name || ''
      };
    });
  });
};

const getInfo = () => {
  spreadinfo({
    id: $route.query.id
  }).then((res) => {
    data.detail = res;
  });
};

const currentPage = ref(1);
const getList = (page) => {
  currentPage.value = page;
  spreadrecord({
    id: $route.query.id,
    page: currentPage.value
  }).then((res) => {
    data.list = res.data;
    data.totalPage = res.last_page;
  });
};

onMounted(() => {
  getDetail();
  getInfo();
  getList();
});
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#threeGift {
  margin-top: 85px;
  background: #fff4db url('./img/banner_img1.png') center top no-repeat;
  padding: 745px 0 0;
  .button {
    width: 450px;
    height: 66px;
    background: #fd0733;
    border-radius: 66px;
    border: 10px solid #f8e0b8;
    margin: 0 auto 49px;
    text-align: center;
    line-height: 66px;
    color: #fff;
    font-size: 30px;
    box-sizing: content-box;
    cursor: pointer;
  }
  .gift-get {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 45px;
    > div {
      width: 318px;
      height: 483px;
      position: relative;
      margin: 0 46px;
      &:first-child {
        background: url('./img/img_yiling.png') center top no-repeat;
      }
      &:last-child {
        background: url('./img/img_dailing.png') center top no-repeat;
      }
      .tit {
        position: absolute;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: #b00200;
        top: 290px;
        left: 0;
      }
      p {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 59px;
        font-size: 50px;
        color: #f9f0b0;
        span {
          font-size: 30px;
        }
      }
    }
  }
  .gift-link {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px 0 73px;
    background-color: #ffe2c1;
    .gift-count {
      width: 1104px;
      height: 155px;
      background: url('./img/img_fuli.png') no-repeat;
      position: relative;
      font-size: 30px;
      color: #e8343e;
      span {
        position: absolute;
        width: 225px;
        height: 62px;
        line-height: 62px;
        text-align: center;
        top: 78px;
      }
      p {
        position: absolute;
        width: 122px;
        top: 88px;
        font-size: 20px;
        color: #fff;
      }
      p:first-child {
        left: 190px;
      }
      p:nth-child(3) {
        left: 690px;
      }
      span:nth-child(2) {
        left: 312px;
        width: 218px;
      }
      span:last-child {
        right: 77px;
      }
    }
    .gift-link-tit {
      font-size: 28px;
      color: #b06800;
      margin: 92px 0 35px;
    }
    .gift-link-code {
      width: 470px;
      height: 70px;
      background: #ffedd0;
      font-size: 24px;
      color: #fd0733;
      line-height: 70px;
    }
  }
  .invite-rule {
    padding: 70px 0;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .tit {
      height: 67px;
      line-height: 67px;
      text-align: center;
      font-size: 28px;
    }

    .invite-rule-wrap {
      width: 660px;
      margin-right: 15px;
      border: 2px solid #e9d1b1;
      .tit {
        background-color: #ffe2c1;
        color: #ff3537;
        border-bottom: 2px solid #e9d1b1;
      }
      table {
        width: 100%;
        table-layout: fixed;
        text-align: center;
        th {
          height: 35px;
          font-size: 16px;
          color: #b06800;
          font-weight: bold;
        }
        td {
          height: 35px;
          font-size: 14px;
          color: #333;
        }
        tr:nth-child(odd) {
          background-color: #fff;
        }
      }
    }
    .invite-rule-det {
      width: 326px;
      border: 2px solid #ff3537;
      .tit {
        background-color: #ff3537;
        color: #fff;
      }
      table {
        width: 100%;
        table-layout: fixed;
        text-align: center;
        font-size: 12px;
        color: #333;
        th {
          height: 35px;
          &:first-child {
            color: #ff3537;
          }
        }
        td {
          height: 35px;
          &:first-child {
            color: #ff3537;
          }
        }
      }
    }
  }
  .invite-steps {
    padding: 60px 0 130px;
    background-color: #e8343e;
    h2 {
      text-align: center;
      font-size: 28px;
      color: #fff;
    }
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 50px 0 100px;
      > p {
        width: 366px;
        height: 60px;
        background: url('./img/steps-bg.png') no-repeat;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #e8343e;
        &:first-child span:last-child {
          text-align: left;
        }
      }
    }
    .invite-desc {
      width: 1000px;
      margin: 0 auto;
      color: #fff;
      text-align: left;
      counter-reset: count;
      h3 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        font-size: 20px;
        line-height: 40px;
        padding-left: 34px;
        position: relative;
        &:before {
          content: counters(count, '') ' ';
          counter-increment: count;
          position: absolute;
          left: 0;
          top: 10px;
          width: 24px;
          height: 24px;
          border: 1px solid #fff;
          border-radius: 50%;
          margin-right: 10px;
          line-height: 24px;
          text-align: center;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
