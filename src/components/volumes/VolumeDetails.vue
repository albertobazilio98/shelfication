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
      <div class="store-items">
        <v-list>
          <v-list-item v-for="(storeItem, index) in storeItems" :key="index" class="store-item">
            <template #append>
              <div class="actions">
                <ShelfIconButton icon="mdi-pencil" @click="updateStoreItem(storeItem)" />
                <ShelfIconButton icon="mdi-delete" @click="deleteStoreItem(storeItem.id)" />
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
  </v-expansion-panel>
</template>

<script lang="ts" setup>
  import StoreItemForm, { IStoreItemData } from '@/components/volumes/StoreItemForm.vue';
  import { db } from '@/firebase';
  import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
  import { computed, ref, watch } from 'vue';
  import ShelfButton from '../ShelfButton.vue';
  import ShelfIconButton from '../ShelfIconButton.vue';

  interface IVolume {
    id?: string
    index: number
    obtained: boolean
  }

  interface IStoreItem {
    id: string
    store: string
    link?: string
    price?: number
  }

  const props = defineProps<{
    modelValue: IVolume
    collectionId: string
  }>();

  const storeItems = ref<IStoreItem[]>([]);
  const dialog = ref(false);
  const storeItemFormData = ref<IStoreItem>();

  const emit = defineEmits<{
    'update:modelValue': [value: IVolume]
  }>();

  const volume = computed({
    get() {
      return props.modelValue;
    },
    set(newValue) {
      emit('update:modelValue', newValue);
    },
  });

  const newStoreItem = () => {
    storeItemFormData.value = undefined;
    dialog.value = true;
  };

  const updateStoreItem = (currentData: IStoreItem) => {
    storeItemFormData.value = currentData;
    dialog.value = true;
  };

  const saveStoreItem = async ({ id, ...storeItem }: IStoreItemData) => {
    if (!volume.value.id) {
      await setVolume(volume.value);
    }

    if (id) {
      await setDoc(doc(db, 'collections', props.collectionId, 'volumes', volume.value.id!, 'storeItems', id), storeItem);
      const index = storeItems.value.findIndex((item) => item.id === id);
      storeItems.value[index] = {
        ...storeItem,
        id,
      };
    } else {
      const snapshot = await addDoc(collection(db, 'collections', props.collectionId, 'volumes', volume.value.id!, 'storeItems'), storeItem);
      storeItems.value.push({
        ...storeItem,
        id: snapshot.id,
      });
    }
    dialog.value = false;
  };

  const deleteStoreItem = async (id: string) => {
    await deleteDoc(doc(db, 'collections', props.collectionId, 'volumes', volume.value.id!, 'storeItems', id));
    storeItems.value = storeItems.value.filter((item) => item.id !== id);
  };

  const setObtained = async (obtained: boolean) => {
    await setVolume({
      ...volume.value,
      obtained,
    });
  };

  const setVolume = async (data: IVolume) => {
    const { id, ...newData } = data;
    if (id) {
      await setDoc(doc(db, 'collections', props.collectionId, 'volumes', id), newData);
      volume.value = {
        ...volume.value,
        ...newData,
      };
    } else {
      const ref = await addDoc(collection(db, 'collections', props.collectionId, 'volumes'), newData);
      volume.value = {
        id: ref.id,
        ...volume.value,
        ...newData,
      };
    }
  };

  watch(() => props.modelValue.id, () => {
    getStoreItems();
  });

  const getStoreItems = async () => {
    if (!volume.value.id || storeItems.value.length > 0) return;

    const snapshot = await getDocs(collection(db, 'collections', props.collectionId, 'volumes', volume.value.id, 'storeItems'));

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
