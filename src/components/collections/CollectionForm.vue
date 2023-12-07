<template>
  <v-card class="mx-auto form" tag="form" @submit="submit" width="512">
    <v-card-item>
      <v-card-title>
        Coleção
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <ShelfInput
        name="name"
        label="Nome da coleção"
      />
      <ShelfInput
        name="quantity"
        type="number"
        label="Quantidade de items"
      />
    </v-card-text>
    <v-card-actions class="actions">
      <ShelfButton type="submit">
        Criar
      </ShelfButton>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import ShelfButton from '../ShelfButton.vue';
  import ShelfInput from '../inputs/ShelfInput.vue';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';

  export interface IColletionData {
    name: string
    quantity: number
  }

  interface IRawCollection {
    name: string
    quantity: string
  }

  const emit = defineEmits<{
    submit: [values: IColletionData]
  }>();

  const { handleSubmit, resetForm } = useForm<IRawCollection>({
    validationSchema: object({
      name: string().required(),
      quantity: string().required(),
    }),
  });

  const submit = handleSubmit((values) => {
    emit('submit', {
      ...values,
      quantity: parseInt(values.quantity),
    });
    resetForm();
  });

</script>
<style lang="scss" scoped>
  .form {
    .row {
      display: flex;
      gap: 15px;
    }

    .actions {
      padding: 0 24px 14px;
    }
  }
</style>
