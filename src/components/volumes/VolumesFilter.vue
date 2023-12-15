<template>
  <div class="filters">
    <ShelfSelect
      v-model="obtained"
      class="obtained-filter"
      name="filter-obtained"
      label="obtido?"
      clearable
      :options="filterOptions"
    />
  </div>
</template>

<script lang="ts" setup>
  import ShelfSelect from '@/components/inputs/ShelfSelect.vue';
  import { useVolumeStore } from '@/store/volume';
  import { watch, ref } from 'vue';

  const filterOptions = [
    { text: 'sim', value: true },
    { text: 'não', value: false },
  ];

  const obtained = ref<boolean>();

  const volumeStore = useVolumeStore();

  watch([obtained], () => volumeStore.setFilters({
    obtained: obtained.value,
  }));
</script>
<style lang="scss" scoped>
  .filters {
    padding: 12px 0 0 0;

    .obtained-filter {
      width: 124px;
    }
  }
</style>
