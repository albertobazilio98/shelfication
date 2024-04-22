<template>
  <div class="collections-list" v-if="collection">
    <h2>{{ collection.name }}</h2>
    <LoadingContainer :is-loading="isLoading">
      <v-data-table
        :items-per-page="0"
        :headers="headers"
        :items="parsedVolumes"
      >
        <template #top>
          <VolumesFilter />
        </template>
        <template v-slot:item.actions="{ item }">
          <div class="action">
            <v-checkbox-btn
              :model-value="item.obtained"
              @change="toggleObtained(item)"
              @click="(e: PointerEvent) => e.stopPropagation()"
            />
          </div>
        </template>
        <template #bottom>
          <ShelfButton @click="addVolume">
            Adicionar volume
          </ShelfButton>
        </template>
      </v-data-table>
    </LoadingContainer>
  </div>
</template>

<script lang="ts" setup>
  import LoadingContainer from '@/components/LoadingContainer.vue';
  import ShelfButton from '@/components/ShelfButton.vue';
  import VolumesFilter from '@/components/volumes/VolumesFilter.vue';
  import { useLoading } from '@/composables/useLoading';
  import { useCollectionStore } from '@/store/collection';
  import { IVolume, useVolumeStore } from '@/store/volume';
  import { storeToRefs } from 'pinia';
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const volumeStore = useVolumeStore();
  const collectionStore = useCollectionStore();
  const { awaitLoading, isLoading } = useLoading();

  const { filteredVolumes } = storeToRefs(volumeStore);
  const { collection } = storeToRefs(collectionStore);

  const headers = [
    { title: 'Volume', key: 'name' },
    { title: 'Obtido', key: 'actions', sortable: false, width: 80, align: 'center' as const },
  ];

  const parsedVolumes = computed(() => filteredVolumes.value.map((volume) => ({
    ...volume,
    name: `Volume ${volume.index + 1}`,
  })));

  const collectionId = ref<string>(route.params.id as string);

  const addVolume = async () => {
    await volumeStore.addVolume();
  };

  const getCollection = async () => {
    await collectionStore.getCollection(collectionId.value);

    if (collection.value) {
      await volumeStore.fetchVolumes(collection?.value.quantity, collectionId.value);
    } else {
      router.push({ name: 'list-collections' });
    }
  };

  const toggleObtained = async (volume: IVolume) => {
    await volumeStore.updateVolume({
      ...volume,
      obtained: !volume.obtained,
    });
  };

  awaitLoading(getCollection());

</script>
<style lang="scss" scoped>
  .collections-list {
    .filters {
      padding: 12px 0 0 0;

      .obtained-filter {
        width: 124px;
      }
    }
    .list {
      padding: 16px 0;

      .volume {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }
  }
</style>
