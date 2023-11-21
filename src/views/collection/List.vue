<template>
  <div class="collections-list">
    <h2>Sua Estante</h2>
    <v-list class="list">
      <v-list-item
        v-for="collection in collections"
        :key="collection.id"
        :title="collection.name"
        @click="router.push({ name: 'collection-details', params: { id: collection.id } })"
      >
      </v-list-item>
    </v-list>
    <ShelfButton :to="{ name: 'create-collection' }" href="/criar">
      Criar nova coleção
    </ShelfButton>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import { db } from '@/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  interface ICollection {
    id: string
    name: string
    quantity: number
  }

  const collections = ref<ICollection[]>([]);
  const router = useRouter();

  const getCollections = async () => {
    const snapshot = await getDocs(collection(db, 'collections'));
    const data: ICollection[] = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      } as ICollection);
    });
    collections.value = data;
  };

  getCollections();

</script>
<style lang="scss" scoped>
  .collections-list {
    .list {
      display: flex;
      flex-direction: column;
      padding: 16px 0;
    }
  }
</style>
