<template>
  <div class="collections-list">
    <h2>{{ currentCollection?.name }}</h2>
    <v-expansion-panels multiple variant="accordion" class="list">
      <VolumeDetails
        v-for="(volume, index) in volumes"
        :volume="volumes[index]"
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
  import { db } from '@/db/firebase';
  import { ICollection } from '@/store/collection';
  import { useVolumeStore } from '@/store/volume';
  import { doc, getDoc } from 'firebase/firestore';
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
  const volumeStore = useVolumeStore();
  const { volumes } = storeToRefs(volumeStore);

  const currentCollection = ref<ICollection>();
  const collectionId = ref<string>(route.params.id as string);

  const addVolume = async () => {
    await volumeStore.addVolume();
  };

  const getCollection = async () => {
    const snapshot = await getDoc(doc(db, 'collections', collectionId.value));
    if (!snapshot.exists()) router.push({ name: 'collections-list' });

    currentCollection.value = {
      id: snapshot.id,
      ...snapshot.data(),
    } as ICollection;

    await volumeStore.fetchVolumes(currentCollection.value.quantity, collectionId.value);
  };

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
