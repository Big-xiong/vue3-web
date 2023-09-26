<template>
  <div class="agent-landing-wrap">
    <MainContent />
    <DataTable />
    <ExcellentAgent />
    <Commission />
    <Step />
    <Protocol />
    <Cooperate />
  </div>
</template>

<script setup>
import MainContent from './MainContent.vue';
import DataTable from './DataTable.vue';
import ExcellentAgent from './ExcellentAgent.vue';
import Commission from './Commission.vue';
import Step from './Step.vue';
import Protocol from './Protocol.vue';
import Cooperate from './Cooperate.vue';
</script>

<style scoped lang="scss">
.agent-landing-wrap {
  margin-top: calc(90px - var(--header-height));
  background-color: var(--bg-color-061422);
}
:deep(.agent-nav) {
  width: 100%;
  height: 135px;
  line-height: 135px;
  font-size: 32px;
  color: var(--theme-color);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  // span {
  //   width: 80px;
  //   height: 6px;
  //   background: var(--bg-color-2f2f2f);
  //   border-radius: 2px;
  //   display: inline-block;
  //   position: relative;
  //   margin: 0 10px;
  // }
}
</style>
