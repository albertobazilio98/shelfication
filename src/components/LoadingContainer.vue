<template>
  <div class="loader" v-if="isLoading">
    <v-progress-circular
      indeterminate
      color="white"
      :size="loaderSize"
    />
  </div>
  <slot v-else></slot>
</template>

<script lang="ts" setup>
  export interface ILoadingContainerProps {
    isLoading?: boolean
    loaderSize?: number
  }

  withDefaults(defineProps<ILoadingContainerProps>(), {
    loaderSize: 96,
  });

</script>
<style lang="scss" scoped>
  .loader {
    width: 100%;
    padding: 128px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>
