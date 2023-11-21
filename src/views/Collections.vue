<template>
  <div class="home">
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
    <div class="collections">
      <div
        v-for="(collection, index) in collections"
        :key="index"
      >
        {{ collection.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import ShelfInput from '@/components/inputs/ShelfInput.vue';
  import { useForm } from 'vee-validate';
  import { db } from '@/firebase';
  import { collection, addDoc, getDocs } from 'firebase/firestore';
  import { object, string, number, ObjectSchema } from 'yup';
  import { ref } from 'vue';

  interface ICollection {
    name: string
    quantity: number
  }

  const collections = ref<ICollection[]>([]);

  const validationSchema: ObjectSchema<ICollection> = object({
    name: string().required(),
    quantity: number().required(),
  });

  const { handleSubmit } = useForm<ICollection>({
    validationSchema,
  });

  const submit = handleSubmit(async (values) => {
    console.log(values);
    const a = await addDoc(collection(db, 'collections'), values);
    await getCollections();
    console.log(a);
  });

  const getCollections = async () => {
    const snapshot = await getDocs(collection(db, 'collections'));
    const data: ICollection[] = [];
    snapshot.forEach((doc) => {
      data.push(doc.data() as ICollection);
    });
    collections.value = data;
  };

  getCollections();

</script>
<style lang="scss" scoped>
  .home {
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
  }
</style>
