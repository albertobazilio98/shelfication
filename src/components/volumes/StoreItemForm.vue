<template>
  <v-card class="mx-auto form" tag="form" @submit="submit" width="512">
    <v-card-item>
      <v-card-title>
        Loja do item
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <div class="row">
        <ShelfInput
          name="store"
          label="loja"
        />
        <ShelfInput
          name="price"
          label="preço"
        />
      </div>
      <ShelfInput
        name="link"
        label="link"
      />
    </v-card-text>
    <v-card-actions class="actions">
      <ShelfButton type="submit">
        Adicionar loja
      </ShelfButton>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import ShelfInput from '../inputs/ShelfInput.vue';
  import { useForm } from 'vee-validate';
  import { object, string } from 'yup';
  import { watchEffect } from 'vue';

  export interface IStoreItemData {
    id?: string
    store: string
    link?: string
    price?: number
  }

  interface IRawStoreItem {
    store: string,
    link?: string,
    price?: string
  }

  const props = defineProps<{
    storeItem?: IStoreItemData
  }>();

  const emit = defineEmits<{
    submit: [values: IStoreItemData]
  }>();

  const { handleSubmit, resetForm, setValues } = useForm<IRawStoreItem>({
    validationSchema: object({
      store: string().required(),
      link: string().optional(),
      price: string().matches(/^([0-9]+(,\d{1,2})?)?$/, 'deve ser um número!').optional(),
    }),
  });

  const submit = handleSubmit((values) => {
    emit('submit', {
      ...values,
      price: values.price ? parseFloat(values.price.replace(',', '.')): undefined,
    });
    resetForm();
  });

  watchEffect(() => {
    if (props.storeItem) {
      setValues({
        link: props.storeItem.link,
        price: props.storeItem.price ? `${props.storeItem.price}` : undefined,
        store: props.storeItem.store,
      });
    } else {
      resetForm();
    }
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
