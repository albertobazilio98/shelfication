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
  import { IVolume, useVolumeStore } from '@/store/volume';
  import StoreItemList from './StoreItemList.vue';

  const props = defineProps<{
    volume: IVolume
    collectionId: string
  }>();

  const volumeStore = useVolumeStore();

  const setObtained = async (obtained: boolean) => {
    await volumeStore.updateVolume({
      ...props.volume,
      obtained,
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
