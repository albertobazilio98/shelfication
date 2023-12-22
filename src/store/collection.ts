import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { Collection, IcollectionModel } from '@/models/collection';

export interface ICollectionInfo {
  progress: number
}

export interface ICollection extends IcollectionModel {
  info?: ICollectionInfo
}

export interface ICollectionStore {
  collection: ICollection | undefined
  collections: ICollection[]
}

export const useCollectionStore = defineStore({
  id: 'collection',
  state: (): ICollectionStore => ({
    collection: undefined,
    collections: [],
  }),
  actions: {
    async createCollection(data: Omit<IcollectionModel, 'id'>) {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      await new Collection(uid).create({
        ...data,
        quantity: +data.quantity,
      });
    },
    async getCollections() {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const data: ICollection[] = await new Collection(uid).fetch();
      this.collections = await Promise.all(data.map(async collection => {
        const info = await this.getCollectionInfo(collection.id);
        return {
          ...collection,
          info,
        };
      }));
    },
    async getCollectionInfo(collectionId: string): Promise<ICollectionInfo> {
      const uid = useUserStore().uid;
      if (!uid) throw new Error('user doesnt exists');

      const collectionModel = new Collection(uid);
      const progress = await collectionModel.progress(collectionId);

      return {
        progress,
      };
    },
    async getCollection(collectionId: string) {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      this.collection = await new Collection(uid).fetchById(collectionId);
    },
  },
});
