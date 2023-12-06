<template>
  <div class="store-items">
    <v-list>
      <v-list-item v-for="(storeItem, index) in storeItems" :key="index" class="store-item">
        <template #append>
          <div class="actions">
            <ShelfIconButton icon="mdi-pencil" @click="updateStoreItem(storeItem, index)" />
            <ShelfIconButton icon="mdi-delete" @click="deleteStoreItem(index)" />
          </div>
        </template>
        <span>{{ storeItem.store }}</span>
        <span v-if="storeItem.price">{{ storeItem.price }}</span>
      </v-list-item>
    </v-list>
    <ShelfButton @click="newStoreItem">
      Adicionar
    </ShelfButton>
    <v-dialog v-model="dialog">
      <StoreItemForm :store-item="storeItemFormData" @submit="(values) => saveStoreItem(values)" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
  import StoreItemForm from '@/components/volumes/StoreItemForm.vue';
  import { ref } from 'vue';
  import ShelfButton from '../ShelfButton.vue';
  import ShelfIconButton from '../ShelfIconButton.vue';
  import { IStoreItem, useVolumeStore } from '@/store/volume';
  import { watch } from 'vue';

  const props = defineProps<{
    volumeIndex: number
    storeItems: IStoreItem[]
  }>();

  const volumeStore = useVolumeStore();

  const dialog = ref(false);
  const storeItemFormData = ref<IStoreItem>();
  const storeItemIndex = ref<number>();

  const newStoreItem = () => {
    storeItemFormData.value = { store: '' };
    dialog.value = true;
  };

  const updateStoreItem = (currentData: IStoreItem, index: number) => {
    storeItemIndex.value = index;
    storeItemFormData.value = currentData;
    dialog.value = true;
  };

  const saveStoreItem = async (storeItem: IStoreItem) => {
    if (!storeItemIndex.value) {
      volumeStore.createStoreItem(props.volumeIndex, storeItem);
    } else {
      volumeStore.updateStoreItem(props.volumeIndex, storeItemIndex.value, storeItem);
    }
    dialog.value = false;
  };

  const deleteStoreItem = async (index: number) => {
    volumeStore.deleteStoreItem(props.volumeIndex, index);
  };

  watch(dialog, () => {
    if (!dialog.value) {
      storeItemIndex.value = undefined;
      storeItemFormData.value = undefined;
    }
  });


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
