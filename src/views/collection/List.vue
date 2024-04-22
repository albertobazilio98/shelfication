<template>
  <div class="collections-list">
    <h2>Sua Estante</h2>
    <LoadingContainer :is-loading="isLoading">
      <v-data-table
        :items-per-page="0"
        :items="collections"
        :headers="headers"
        @click:row="(_: any, row: any) => goToCollection(row.item)"
      >
        <template #item.progress="{ item }">
          <div class="progress">
            <v-chip>
              {{ item.info?.progress || 0 }}/{{ item.quantity }}
            </v-chip>
          </div>
        </template>
        <template #bottom>
          <ShelfButton :to="{ name: 'create-collection' }" href="/criar">
            Criar nova coleção
          </ShelfButton>
        </template>
      </v-data-table>
    </LoadingContainer>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import { ICollection, useCollectionStore } from '@/store/collection';
  import { useLoading } from '@/composables/useLoading';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import LoadingContainer from '@/components/LoadingContainer.vue';

  const router = useRouter();

  const { awaitLoading, isLoading } = useLoading();

  const goToCollection = (collection: ICollection) => {
    router.push({ name: 'collection-details', params: { id: collection.id } });
  };

  const headers = [
    { title: 'Nome', key: 'name' },
    { title: 'Progresso', key: 'progress', sortable: false, width: 80, align: 'center' as const },
  ];

  const collectionStore = useCollectionStore();
  const { collections } = storeToRefs(collectionStore);

  awaitLoading(collectionStore.getCollections());

</script>
<style lang="scss" scoped>
  .collections-list {
    .list {
      display: flex;
      flex-direction: column;
      padding: 16px 0;

      .collection {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 16px;

        .title {
          font-weight: 500;
        }
      }
    }
  }
</style>
