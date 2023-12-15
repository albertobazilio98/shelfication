<template>
  <v-select
    class="input"
    v-model="vModelValue"
    :clearable="clearable"
    :name="name"
    :error-messages="errorMessage"
    :label="label"
    :items="options"
    item-value="value"
    item-title="text"
    variant="outlined"
    color="primary"
    base-color="primary"
    height="40"
    density="compact"
  />
</template>
<script lang="ts" setup generic="T">
  import { useField } from 'vee-validate';
  import { computed } from 'vue';

  const props = defineProps<{
    name: string,
    label: string,
    options: { text: string, value: T }[]
    clearable?: boolean
    modelValue?: T
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value?: T],
    'change': [value?: T],
  }>();

  const vModelValue = computed({
    get() {
      return value.value;
    },
    set(newValue?: T) {
      setValue(newValue);
      emit('update:modelValue', newValue);
      emit('change', newValue);
    },
  });

  const { value, errorMessage, setValue } = useField<T | undefined>(props.name);
</script>
<style scoped lang="scss">
.input {
  :deep(.v-field) {
    height: 44px;
  }
}
</style>
