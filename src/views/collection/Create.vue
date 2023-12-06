<template>
  <form class="collection-form" @submit="submit">
    <h2 class="title">Criar uma coleção</h2>
    <ShelfInput
      name="name"
      label="Nome da coleção"
    />
    <ShelfInput
      name="quantity"
      type="number"
      label="Quantidade de items"
    />
    <ShelfButton type="submit" size="large">
      Criar
    </ShelfButton>
  </form>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import ShelfInput from '@/components/inputs/ShelfInput.vue';
  import { useForm } from 'vee-validate';
  import { db } from '@/db/firebase';
  import { collection, addDoc } from 'firebase/firestore';
  import { object, string, number, ObjectSchema } from 'yup';
  import { useRouter } from 'vue-router';

  interface ICollection {
    name: string
    quantity: number
  }

  const router = useRouter();

  const validationSchema: ObjectSchema<ICollection> = object({
    name: string().required(),
    quantity: number().required(),
  });

  const { handleSubmit } = useForm<ICollection>({
    validationSchema,
  });

  const submit = handleSubmit(async (values) => {
    console.log(values);
    await addDoc(collection(db, 'collections'), {
      ...values,
      quantity: +values.quantity,
    });
    router.push({ name: 'list-collections' });
  });

</script>
<style lang="scss" scoped>
  .collection-form {
    display: flex;
    flex-direction: column;
    gap: 12px 0;
    max-width: 512px;

    .title {
      margin-bottom: 12px;
    }
  }

  .collections {
    padding: 32px 0;
  }
</style>
