<template>
  <div class="collections-list">
    <h2>{{ currentCollection?.name }}</h2>
    <v-expansion-panels multiple variant="accordion" class="list">
      <VolumeDetails
        v-for="(volume, index) in volumes"
        v-model="volumes[index]"
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
  import { db } from '@/firebase';
  import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  interface ICollection {
    id: string
    name: string
    quantity: number
  }

  interface IVolume {
    id?: string
    index: number
    obtained: boolean
    // storeItems: IStoreItem[],
  }

  const route = useRoute();
  const router = useRouter();

  const currentCollection = ref<ICollection>();
  const collectionId = ref<string>(route.params.id as string);
  const volumes = ref<IVolume[]>([]);

  const addVolume = async () => {
    if (!currentCollection.value) return;

    await updateDoc(doc(db, 'collections', collectionId.value), {
      quantity: +currentCollection.value?.quantity + 1,
    });

    volumes.value.push({
      obtained: false,
      index: volumes.value.length,
    });
  };

  const getCollection = async () => {
    const snapshot = await getDoc(doc(db, 'collections', collectionId.value));
    if (!snapshot.exists()) router.push({ name: 'collections-list' });

    currentCollection.value = {
      id: snapshot.id,
      ...snapshot.data(),
    } as ICollection;

    const volumesCount = +currentCollection.value.quantity;
    volumes.value = new Array(volumesCount).fill(undefined).map((_, index) => ({
      obtained: false,
      index: index,
    }));
    await getVolumes();
  };

  const getVolumes = async () => {
    const snapshot = await getDocs(collection(db, 'collections', collectionId.value, 'volumes'));
    snapshot.forEach((doc) => {
      const volume = {
        id: doc.id,
        ...doc.data(),
      } as IVolume;
      volumes.value[volume.index] = { ...volumes.value[volume.index], ...volume };
    });
    console.log(volumes.value);
  };

  // function omit<Obj extends object, Key extends string>(obj: Obj, key: Key): Omit<Obj, Key> {
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const { [key]: _excluded, ...rest } = obj;
  //   return rest;
  // }

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
