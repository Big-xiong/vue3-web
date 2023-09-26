<template>
  <div class="agent-list-wrap">
    <AgentForm @search="data => tableData = data" ref="aform" />
    <AgentTable :onSearch="onSearch" :loading="aform?.loading" :data="tableData" />
  </div>
</template>

<script setup>
import AgentForm from './AgentForm.vue';
import AgentTable from './AgentTable.vue';

const aform = ref(null);

const tableData = ref([])

function onSearch() {
  aform.value.doSearch();
}
</script>
