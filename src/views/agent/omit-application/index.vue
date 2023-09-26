<template>
  <div class="omit-application-wrap">
    <div class="form-card-wrap">
      <header>{{ $t('遗漏申请') }}</header>
      <ApplicationFormSection @apply="onApply" />
      <QueryFormSection ref="queryForm" @searching="data => tableData = data" />
    </div>
    <OmitTable v-bind="tableData" :loading="queryForm?.loading" :onDialogClose="onApply" />
  </div>
</template>

<script setup>
import ApplicationFormSection from './ApplicationFormSection.vue';
import OmitTable from './OmitTable.vue';
import QueryFormSection from './QueryFormSection.vue';

const queryForm = ref(null);
const tableData = ref({});

function onApply() {
  queryForm.value.search();
}
</script>

<style lang="scss" scoped>
.form-card-wrap {
  margin-top: 20px;
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 30px;

  header {
    font-weight: 600;
    font-size: 20px;
    color: var(--font-color-000);
    margin: 0 0 20px;
    text-align: left;
  }
}
</style>
