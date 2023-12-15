<template>
  <div class="collections-list">
    <h2>{{ collection?.name }}</h2>
    <div class="filters">
      <VolumesFilter />
    </div>
    <v-expansion-panels multiple variant="accordion" class="list">
      <VolumeDetails
        v-for="(volume, index) in filteredVolumes"
        :volume="filteredVolumes[index]"
        :collection-id="collectionId"
        :key="volume.index"
      />
    </v-expansion-panels>
    <ShelfButton @click="addVolume">
      Adicionar volume
    </ShelfButton>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import VolumeDetails from '@/components/volumes/VolumeDetails.vue';
  import VolumesFilter from '@/components/volumes/VolumesFilter.vue';
  import { useCollectionStore } from '@/store/collection';
  import { useVolumeStore } from '@/store/volume';
  import { storeToRefs } from 'pinia';
  import { watch, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const volumeStore = useVolumeStore();
  const collectionStore = useCollectionStore();

  const { filteredVolumes } = storeToRefs(volumeStore);
  const { collection } = storeToRefs(collectionStore);

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

  watch(collection, async () => {
    if (collection.value) {
      await volumeStore.fetchVolumes(collection?.value.quantity, collectionId.value);
    }
  });

  getCollection();

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
