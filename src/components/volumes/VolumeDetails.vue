<template>
  <v-expansion-panel>
    <template #title>
      <div class="volume">
        <div>
          <v-checkbox-btn
            :model-value="volume?.obtained"
            @change="setObtained(!volume.obtained)"
            @click="(e: PointerEvent) => e.stopPropagation()"
          />
        </div>
        <div>
          Volume {{ volume.index + 1 }}
        </div>
      </div>
    </template>
    <template #text>
      <StoreItemList :volume-index="volume.index" :store-items="volume.storeItems" />
    </template>
  </v-expansion-panel>
</template>

<script lang="ts" setup>
  import { db } from '@/db/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { ref, watch } from 'vue';
  import { IVolume, useVolumeStore } from '@/store/volume';
  import StoreItemList from './StoreItemList.vue';

  interface IStoreItem {
    id: string
    store: string
    link?: string
    price?: number
  }

  const props = defineProps<{
    volume: IVolume
    collectionId: string
  }>();

  const volumeStore = useVolumeStore();

  const storeItems = ref<IStoreItem[]>([]);

  const setObtained = async (obtained: boolean) => {
    await volumeStore.updateVolume({
      ...props.volume,
      obtained,
    });
  };

  watch(() => props.volume.id, () => {
    getStoreItems();
  });

  const getStoreItems = async () => {
    if (!props.volume.id || storeItems.value.length > 0) return;

    const snapshot = await getDocs(collection(db, 'collections', props.collectionId, 'volumes', props.volume.id, 'storeItems'));

    snapshot.forEach((doc) => {
      const storeItem = {
        ...doc.data(),
        id: doc.id,
      } as IStoreItem;
      storeItems.value.push(storeItem);
    });
  };


</script>
<style lang="scss" scoped>
  .store-items {
    .store-item {
      .actions {
        display: flex;
        column-gap: 16px;
      }
    }
  }

  .volume {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
