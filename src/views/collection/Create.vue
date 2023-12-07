<template>
  <CollectionForm @submit="submit" />
</template>

<script lang="ts" setup>
  import CollectionForm from '@/components/collections/CollectionForm.vue';
  import { ICollection, useCollectionStore } from '@/store/collection';
  import { useRouter } from 'vue-router';


  const router = useRouter();
  const collectionStore = useCollectionStore();

  const submit = async (values: Omit<ICollection, 'id'>) => {
    await collectionStore.createCollection(values);
    router.push({ name: 'list-collections' });
  };

</script>
<style lang="scss" scoped>
  .collection-form {
    display: flex;
    flex-direction: column;
    gap: 12px 0;
    max-width: 512px;

    .title {
      margin-bottom: 12px;
    }
  }

  .collections {
    padding: 32px 0;
  }
</style>
