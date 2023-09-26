<template>
  <div class="lottery">
    <!-- <Banner :src="bannerUrl" /> -->
    <SubBanner id="5" />
    <div class="lottery-main">
      <div
        class="lottery-main-item"
        v-bind:class="{ 'gray-scal': $getGameStatus(arrInfo[0], '彩票') }"
      >
        <div class="align-center-wrap layout-flex-center">
          <Info
            :info="arrInfo[0]"
            class="lottery-main-item-info-top"
            v-login
            @click="$playGame(arrInfo[0], 5)"
            v-bind:isGray="$getGameStatus(arrInfo[0], '彩票')"
          />
          <Slider :list="silderData">
            <template #title>{{ $t(`下一回合`) }}</template>
            <template #item="{ page }">
              <div v-for="item in page" :key="item.title">
                <p
                  :class="`${item.flag ? 'lottery-main-item-slider-info' : 'lottery-main-item-slider-time'}`"
                  v-if="item.name !== '香港六合彩'"
                >
                  <TimeCountDown :time="item.draw_time" :now="serverTime" />
                  <!-- <TimeCountDown
                      :time="'2021-08-31 21:45:21'"
                      :now="serverTime"
                  />-->
                </p>
                <p class="lottery-main-item-slider-info" v-else>{{ item.draw_time }}</p>
                <h1 class="lottery-main-item-slider-title">{{ item.name }}</h1>
              </div>
            </template>
          </Slider>
        </div>
      </div>
      <!-- <div
            class="lottery-main-item"
            :class="{ 'gray-scal': $getGameStatus(arrInfo[1], '彩票') }"
          >
            <div class="align-center-wrap layout-flex-center">
              <Slider
                :list="silderData2"
                class="lottery-main-item-slider-custom"
              >
                <template #title>{{ $t(`下一回合`) }}</template>
                <template #item="{ page }">
                  <div
                    v-for="item in page"
                    :key="item.title"
                  >
                    <p
                      :class="`${item.flag ? 'lottery-main-item-slider-info' : 'lottery-main-item-slider-time'}`"
                      v-if="item.name !== '香港六合彩'"
                    >
                      <CountDown :time="item.time" />
                    </p>
                    <p
                      class="lottery-main-item-slider-info"
                      v-else
                    >{{ item.draw_time }}</p>
                    <h1 class="lottery-main-item-slider-title">{{ item.name }}</h1>
                  </div>
                </template>
              </Slider>
              <Info
                :info="arrInfo[1]"
                class="lottery-main-item-info-bottom"
                v-login
                @click="$playGame(arrInfo[1], 5)"
              />
            </div>
      </div>-->
    </div>
  </div>
</template>

<script setup>
import { inject, ref, toRef } from 'vue';
import { useRequest } from 'ahooks-vue';
import { getlotterytime } from '@/api/lottery';
import { useInterval } from '@/utils/hooks';
import Banner from '@/components/Banner/index.vue';
import Info from './components/Info.vue';
import Slider from './components/Slider.vue';
import TimeCountDown from './components/TimeCountDown.vue';
import SubBanner from '@/components/Banner/sub.vue';

const global = inject('global');

const bannerUrl = '/src/assets/images/lottery/banner.png';

const silderData = ref([[], []]);
const silderData2 = ref([[], []]);
const serverTime = ref(null);

useRequest(getlotterytime, {
  onSuccess(res) {
    silderData.value[0] = [
      { ...res.hongkong, ...{ time: new Date(res.hongkong.draw_time) - new Date(res.server_time) } },
      { ...res.australia_5, ...{ time: new Date(res.australia_5.draw_time) - new Date(res.server_time) } },
      { ...res.cycleracing, ...{ time: new Date(res.cycleracing.draw_time) - new Date(res.server_time) } },
    ];
    silderData.value[1] = [
      { ...res.speed, ...{ time: new Date(res.speed.draw_time) - new Date(res.server_time) } },
      { ...res.speed_happy, ...{ time: new Date(res.speed_happy.draw_time) - new Date(res.server_time) } },
      { ...res.australia_5, ...{ time: new Date(res.australia_5.draw_time) - new Date(res.server_time) } },
    ];

    serverTime.value = new Date(res.server_time);
  },
});

const now = new Date();

const arrInfo = [{
  title: global.$t(`GPI平台 `),
  subtitle: global.$t(`多彩种选择让玩家乐在其中、乐不可言！`),
  content: global.$t(`GPI提供最新的主流彩种游戏，如:北京赛车、PK10、幸运飞艇、六合彩、重庆欢乐生肖、快3、北京快乐8等，丰富的彩种满足各类玩家的博弈需求！`),
  default_game_id: 9704,
  game_platform_id: 141,
  name: 'GPI',
}];

</script>

<style lang="scss">
.lottery {
  &-main {
    display: flex;
    flex-direction: column;
    &-item {
      display: flex;
      background: url("/src/assets/images/lottery/bg-cp.png") no-repeat;
      background-size: 100% 100%;
      height: 390px;
      flex: 1;

      > div {
        flex: 1;
      }
      &-info {
        &-top {
          padding-left: 30px;
          padding-top: 42px;
        }
        &-bottom {
          padding-top: 42px;
          padding-left: 81px;
          padding-right: 78px;
        }
      }
      &-slider {
        &-info {
          width: 122px;
          height: 41px;
          font-size: 19px;
          font-weight: 400;
          text-align: left;
          line-height: 26px;
        }
        &-title {
          margin-top: 42px;
          height: 22px;
          font-size: 22px;
          font-weight: 500;
          text-align: left;
          line-height: 34px;
        }
        &-time {
          width: 131px;
          height: 21px;
          font-size: 47px;
          font-weight: 800;
          text-align: left;
          line-height: 21px;
        }
        &-custom {
          :deep() {
            .lottery-silder-slot-box {
              padding-left: 113px;
              padding-right: 176px;
            }
            .lottery-silder-title {
              top: 53px;
              left: 152px;
            }
          }
        }
      }

      &:last-child {
        .lottery-silder-slot-box {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
