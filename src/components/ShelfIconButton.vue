<template>
  <v-btn
    flat
    :height="size"
    :width="size"
    :icon="icon"
    :type="type"
    :href="href"
    :to="to"
    @click="emit('click')"
  />
</template>

<script lang="ts" setup>
  import { RouteLocationRaw } from 'vue-router';

  export interface IShelfButtonProps {
    icon: string
    type?: string
    size?: number | string
    href?: string
    to?: RouteLocationRaw
  }

  const emit = defineEmits<{
    (e: 'click'): void
  }>();

  withDefaults(defineProps<IShelfButtonProps>(), {
    size: 32,
  });

</script>
<style lang="scss" scoped>
</style>
