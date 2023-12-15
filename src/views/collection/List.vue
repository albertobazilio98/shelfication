<template>
  <div class="collections-list">
    <h2>Sua Estante</h2>
    <LoadingContainer :is-loading="isLoading">
      <v-list class="list">
        <v-list-item
          v-for="collection in collections"
          :key="collection.id"
          :title="collection.name"
          @click="router.push({ name: 'collection-details', params: { id: collection.id } })"
        >
        </v-list-item>
      </v-list>
    </LoadingContainer>
    <ShelfButton :to="{ name: 'create-collection' }" href="/criar">
      Criar nova coleção
    </ShelfButton>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import { useCollectionStore } from '@/store/collection';
  import { useLoading } from '@/composables/useLoading';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import LoadingContainer from '@/components/LoadingContainer.vue';

  const router = useRouter();

  const { awaitLoading, isLoading } = useLoading();

  const collectionStore = useCollectionStore();
  const { collections } = storeToRefs(collectionStore);

  awaitLoading(collectionStore.getCollections());

</script>
<style lang="scss" scoped>
  .collections-list {
    .loader {
      width: 100%;
      padding: 128px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .list {
      display: flex;
      flex-direction: column;
      padding: 16px 0;
    }
  }
</style>
