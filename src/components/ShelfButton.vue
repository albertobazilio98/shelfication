<template>
  <v-btn
    class="button"
    color="primary"
    :size="size"
    :prepend-icon="prependIcon"
    :type="type"
    :loading="loading"
    :variant="variant"
    :href="href"
    :to="to"
    @click="emit('click')"
  >
    <slot></slot>
  </v-btn>
</template>

<script lang="ts" setup>
  import { RouteLocationRaw } from 'vue-router';

  export interface TrkButtonProps {
    type?: string
    variant?: 'outlined' | 'elevated'
    size?: 'x-small' | 'small' | 'large' | 'x-large'
    prependIcon?: string
    loading?: boolean
    href?: string
    to?: RouteLocationRaw
  }

  const emit = defineEmits<{
    (e: 'click'): void
  }>();

  withDefaults(defineProps<TrkButtonProps>(), {
    variant: 'elevated',
  });

</script>
<style lang="scss" scoped>
  .button {
    :deep(.v-btn__content) {
      text-transform: none;
    }
  }
</style>
