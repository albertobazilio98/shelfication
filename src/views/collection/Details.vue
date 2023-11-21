<template>
  <div class="collections-list">
    <h2>{{ currentCollection?.name }}</h2>
    <v-expansion-panels multiple variant="accordion" class="list">
      <v-expansion-panel
        v-for="(item, index) in volumes"
        :key="index"
      >
        <template #title>
          <div class="volume">
            <div>
              <v-checkbox-btn
                :model-value="item?.obtained"
                @change="changeObtained(index, !item?.obtained)"
                @click="(e: PointerEvent) => e.stopPropagation()"
              />
            </div>
            <div>
              Volume {{ index + 1 }}
            </div>
          </div>
        </template>
        <template #text>
          oi
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
    <ShelfButton @click="addVolume">
      Adicionar volume
    </ShelfButton>
  </div>
</template>

<script lang="ts" setup>
  import ShelfButton from '@/components/ShelfButton.vue';
  import { db } from '@/firebase';
  import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  interface ICollection {
    id: string
    name: string
    quantity: number
  }

  interface IVolume {
    id: string
    index: number
    obtained: boolean
  }

  const route = useRoute();
  const router = useRouter();

  const currentCollection = ref<ICollection>();
  const collectionId = ref<string>(route.params.id as string);
  const volumes = ref<(IVolume | undefined)[]>([]);

  const changeObtained = async (index: number, obtained: boolean) => {
    const existingData = volumes.value[index] ? omit(volumes.value[index]!, 'id') : {};
    setVolume(index, {
      ...existingData,
      index,
      obtained,
    });
  };

  const setVolume = async (index: number, data: Omit<IVolume, 'id'>) => {
    if (volumes.value[index]) {
      await setDoc(doc(db, 'collections', collectionId.value, 'volumes', volumes.value[index]!.id), data);
      volumes.value[index] = {
        ...data,
        ...volumes.value[index]!,
      };
    } else {
      const ref = await addDoc(collection(db, 'collections', collectionId.value, 'volumes'), data);
      volumes.value[index] = {
        id: ref.id,
        ...data,
      };
    }
  };

  const getCollection = async () => {
    const snapshot = await getDoc(doc(db, 'collections', collectionId.value));
    if (!snapshot.exists()) router.push({ name: 'collections-list' });

    currentCollection.value = {
      id: snapshot.id,
      ...snapshot.data(),
    } as ICollection;
    volumes.value = new Array(+currentCollection.value.quantity).fill(undefined);
    await getItems();
  };

  const addVolume = async () => {
    if (!currentCollection.value) return;

    await updateDoc(doc(db, 'collections', collectionId.value), {
      quantity: +currentCollection.value?.quantity + 1,
    });

    volumes.value.push(undefined);
  };

  const getItems = async () => {
    const snapshot = await getDocs(collection(db, 'collections', collectionId.value, 'volumes'));
    snapshot.forEach((doc) => {
      const volume = {
        id: doc.id,
        ...doc.data(),
      } as IVolume;
      volumes.value[volume.index] = volume;
    });
  };

  function omit<Obj extends object, Key extends string>(obj: Obj, key: Key): Omit<Obj, Key> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _excluded, ...rest } = obj;
    return rest;
  }

  getCollection();

</script>
<style lang="scss" scoped>
  .collections-list {
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
