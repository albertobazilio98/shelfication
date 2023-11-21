<template>
  <v-text-field
    class="input"
    v-model="value"
    :name="name"
    :error-messages="errorMessage"
    :label="label"
    :type="type"
    variant="outlined"
    color="primary"
    base-color="primary"
    height="40"
    density="compact"
  />
</template>''
<script lang="ts" setup>
  import { useField } from 'vee-validate';

  interface IShelfInput {
    name: string,
    label: string,
    type?: string
  }

  const props = withDefaults(defineProps<IShelfInput>(), {
    type: 'text',
  });

  const { value, errorMessage } = useField(props.name);
</script>
<style scoped lang="scss">
.input {
  :deep(.v-field) {
    height: 44px;
  }
}
</style>
