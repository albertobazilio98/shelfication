<template>
  <v-overlay
    v-model="isLoading"
    class="global-loader align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      color="white"
      size="128"
    />
  </v-overlay>
</template>
<script setup lang="ts">
  import { storeToRefs } from 'pinia';
  import { useLoaderStore } from '@/store/loader';

  const { isLoading } = storeToRefs(useLoaderStore());

</script>
<style lang="scss" scoped>
  .global-loader {
    background-color: #000000A3;
  }
</style>
