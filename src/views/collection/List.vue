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
  import { useCollectionStore } from '@/store/collection';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const collectionStore = useCollectionStore();
  const { collections } = storeToRefs(collectionStore);

  collectionStore.getCollections();

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
