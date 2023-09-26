
<template>
            <div class="agent-step">
              <div class="agent-step-content">
                <div class="agent-nav">
                  <span/>{{$t('加入流程')}}<span/>
                </div>
                <div class="step-list">
                  <div v-for="(list, index) in stepData" :key="index">
                    <p class="title">
                      {{ list.title }}
                    </p>
                    <p class="step">
                      {{ list.step }}
                    </p>
                    <p class="content">
                      {{ list.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
</template>

<script setup>
import { inject, reactive } from 'vue';

const global = inject('global');

const stepData = reactive([
  {
    title: global.$t('第一步'),
    step: global.$t('提交申请'),
    content: global.$t('填写代理申请表，一旦申请成功，您将成为最有吸引力的合作计划的一份子。'),
  },
  {
    title: global.$t('第二步'),
    step: global.$t('资格审核'),
    content: global.$t('提交申请后留下联系方式，等待我们的代理专员审核，审核通过后马上联系您成为我们的合作伙伴。'),
  },
  {
    title: global.$t('第三步'),
    step: global.$t('立即推广'),
    content: global.$t('除了运用您本身的资源以外，我们也提供多样化的物料，市场渠道以及推广方式给你进行推广，与您一起开拓市场，让您如虎添翼。'),
  },
  {
    title: global.$t('第四步'),
    step: global.$t('立即盈利'),
    content: global.$t('您的佣金来自每一位您带来的会员，会员越多，投注越多，盈利越多！心动不如行动，马上加入吧！'),
  },
]);
</script>

<style lang="scss" scoped>
.agent-step {
  width: 1200px;
  margin: 0 auto;

  .agent-step-content {
    margin: 0 auto;

    .step-list {
      width: 1200px;
      text-align: center;
      display: flex;
      justify-content: space-between;

      div {
        width: 291px;
        height: 316px;
        text-align: center;
        border-radius: 2px;
        margin-right: 12px;
        color: var(--font-color-fff);
        background: var(--bg-color-353435);

        .title {
          margin-top: 60px;
          font-size: 32px;
        }

        .step {
          margin-top: 30px;
          font-size: 24px;
        }

        .content {
          width: 231px;
          margin: 0 auto;
          font-size: 16px;
          margin-top: 30px;
          line-height: 23px;
        }
      }

      & > div:nth-child(4) {
        margin-right: 0;
      }
    }
  }
}
</style>
