<template>
  <div id="welfare">
    <div :class="[
      'top',
      {'top-wanqu':['10001', '10046'].includes(projectName),'top-other':['10001', '10046'].indexOf(projectName) == -1}
    ]">
      <div class="promotion">
        <div class="promotionMechanism">
          <img
            src="./assets/title.png"
            alt=""
          >
          <ul v-if="note.length > 0">
            <li>
              <div>{{ $t(`四品官员`) }}</div>
              <P>{{$t('有效投注额')}}{{ note[0].money.valid_bet }}W+</P>
              <P>{{$t('月存款')}}{{ note[0].money.deposite_money }}W+</P>
            </li>
            <img
              src="./assets/arrow.png"
              alt=""
            >
            <li>
              <div>{{ $t(`三品官员`) }}</div>
              <P>{{$t('有效投注额')}}{{ note[1].money.valid_bet }}W+</P>
              <P>{{$t('月存款')}}{{ note[1].money.deposite_money }}W+</P>
            </li>
            <img
              src="./assets/arrow.png"
              alt=""
            >
            <li>
              <div>{{ $t(`二品官员`) }}</div>
              <P>{{$t('有效投注额')}}{{ note[2].money.valid_bet }}W+</P>
              <P>{{$t('月存款')}}{{ note[2].money.deposite_money }}W+</P>
            </li>
            <img
              src="./assets/arrow.png"
              alt=""
            >
            <li>
              <div>{{ $t(`一品官员`) }}</div>
              <P>{{$t('有效投注额')}}{{ note[3].money.valid_bet }}W+</P>
              <P>{{$t('月存款')}}{{ note[3].money.deposite_money }}W+</P>
            </li>
            <img
              src="./assets/arrow.png"
              alt=""
            >
            <li>
              <div>{{ $t(`乾隆大帝`) }}</div>
              <P>{{$t('有效投注额')}}{{ note[4].money.valid_bet }}W+</P>
              <P>{{$t('月存款')}}{{ note[4].money.deposite_money }}W+</P>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="bottom">
      <img
        src="./assets/titlecopy.png"
        alt=""
      >
      <div class="welfare-table">
        <table>
          <tr class="welfare-title">
            <th>{{ $t(`品职`) }}</th>
            <th>{{ $t(`酒店`) }}</th>
            <th>{{ $t(`美女`) }}</th>
            <th>{{ $t(`年龄`) }}</th>
            <th>{{ $t(`服务周期`) }}</th>
          </tr>
          <tr
            v-for="(item, index) in list"
            :key="index"
          >
            <td>{{ item.starClass }}</td>
            <td>{{ item.hotel }}</td>
            <td>{{ item.beauty }}</td>
            <td>{{ item.age }}</td>
            <td>{{ item.cycle }}</td>
          </tr>
        </table>

        <!-- 温馨提示 -->
        <div class="tishi">
          <div class="text">
            {{ $t(`温馨提示`) }}：
          </div>
          <div class="tishi-content">
            <p class="tishi-p">
              ① {{ $t(`会员提前联系客服专员，选取美女服务，只针对有机场直达的城市，AA集团承担交通服务费用；`) }}
            </p>
            <p class="tishi-p">
              ② {{ $t(`相关隐私请参考当地法律，AA集团不干涉，为避免文字差异，AA集团保留最终解释权`) }}
            </p>
          </div>
        </div>
        <!-- 活动规则 -->
        <div class="rule">
          <img
            src="./assets/Activity.png"
            alt=""
          >
          <div>
            <p><span>1</span>{{ $t(`本活动{0}所有二星及以上会员均可享受；`, [$t(subConfig.title)]) }}</p>
            <p><span>2</span>{{ $t(`会员需要提前联系客服/专员，选取美女服务；`) }}</p>
            <p><span>3</span>{{ $t(`只针对有机场直达的城市，AA集团承担交`) }}</p>
            <template v-if="projectName === '10001' || projectName === '10029'">
              <p><span>4</span>{{ $t(`本活动数据按月累计，转月之后自动清零；`) }}</p>
              <p><span>5</span>{{
              $t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户、包括同一姓名、同一姓名、统一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，已经发现我们将保留冻结账户以及没收所有余额的权利；`)
              }}</p>
              <p><span>6</span>{{ $t(`关于本活动{0}拥有最终解释权。`, [$t(subConfig.title)]) }}</p>
            </template>
            <template v-else>
              <p><span>4</span>{{ $t(`本存款金额只限线下存款(银行卡转账)，微信，支付宝，在线支付等不计算在内；`) }}</p>
              <p><span>5</span>{{ $t(`本活动数据按月累计，转月之后自动清零；`) }}</p>
              <p><span>6</span>{{
              $t(`本优惠活动只限娱乐性质的会员参加，如发现用户拥有超过一个账户、包括同一姓名、同一姓名、统一邮箱，同一/相似IP地址，同一住址，同一银行卡，同一电脑，禁止多开窗口进行投注，软件投注和套免费游戏等其他任何不正常投注行为，已经发现我们将保留冻结账户以及没收所有余额的权利；`)
              }}</p>
              <p><span>7</span>{{ $t(`关于本活动{0}拥有最终解释权。`, [$t(subConfig.title)]) }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue';
import { specialdetail } from '@/api/activity';

const merchant_no = import.meta.env.VITE_APP_MERCHANT_NO;
const projectName = import.meta.env.VITE_APP_PROJECT_NAME;

export default defineComponent({
  data() {
    return {
      projectName,
      id: 0, // 活动id
      note: [], // 规则
      list: [
        {
          starClass: this.$t('四品官员'),
          hotel: this.$t('三星酒店'),
          beauty: this.$t('模特'),
          age: this.$t('18-25周岁'),
          cycle: this.$t('1次/6个月'),
        },
        {
          starClass: this.$t('三品官员'),
          hotel: this.$t('四星酒店'),
          beauty: this.$t('模特'),
          age: this.$t('18-25周岁'),
          cycle: this.$t('1次/3个月'),
        },
        {
          starClass: this.$t('二品官员'),
          hotel: this.$t('五星酒店'),
          beauty: this.$t('模特,空姐,学生'),
          age: this.$t('18-25周岁'),
          cycle: this.$t('1次/1个月'),
        },
        {
          starClass: this.$t('一品官员'),
          hotel: this.$t('五星豪华酒店'),
          beauty: this.$t('二线明星'),
          age: this.$t('18-25周岁'),
          cycle: this.$t('1次/1个月'),
        },
        {
          starClass: this.$t('乾隆大帝'),
          hotel: this.$t('顶级豪华酒店'),
          beauty: this.$t('二线明星'),
          age: this.$t('18-25周岁'),
          cycle: this.$t('2次/1个月'),
        },
      ],
    };
  },
  inject: ['subConfig'],
  async created() {
    this.id = this.$route.query.id;
    await this.getDetail();
  },
  methods: {
    // 获取优惠详情
    getDetail() {
      specialdetail({
        merchant_no,
        id: this.id,
      }).then((res) => {
        this.note = res.condition_setting;
      });
    },
  },
});
</script>

<style src="./style.scss" lang="scss" scoped>

</style>
