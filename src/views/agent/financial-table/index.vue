<template>
  <div class="financial-table-wrap">
    <FormSection @searching="data => searchResult = data" ref="form" />
    <TableSection v-bind="searchResult" :loading="form?.loading" />
  </div>
</template>

<script setup>
import FormSection from './FormSection.vue';
import TableSection from './TableSection.vue';

const searchResult = ref({});
const form = ref(null)
</script>
