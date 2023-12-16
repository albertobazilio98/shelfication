import { db } from '@/db/firebase';
import { addDoc, collection, doc, getCountFromServer, getDoc, getDocs, query, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export interface ICollectionInfo {
  progress: number
}

export interface ICollection {
  id: string
  name: string
  quantity: number
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
    async createCollection(data: Omit<ICollection, 'id'>) {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      await addDoc(collection(db, 'users', uid, 'collections'), {
        ...data,
        quantity: +data.quantity,
      });
    },
    async getCollections() {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const snapshot = await getDocs(collection(db, 'users', uid, 'collections'));
      const data: ICollection[] = [];
      snapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data(),
        } as ICollection);
      });
      this.collections = await Promise.all(data.map(async collection => {
        const info = await this.getCollectionInfo(collection.id);
        return {
          ...collection,
          info,
        };
      }));
      console.log(this.collections);
    },
    async getCollectionInfo(collectionId: string): Promise<ICollectionInfo> {
      const uid = useUserStore().uid;
      if (!uid) throw new Error('user doesnt exists');
      const volumesCollection = collection(db, 'users', uid, 'collections', collectionId, 'volumes');
      const volumesQuery = query(volumesCollection, where('obtained', '==', true));
      const obtainedCount = await getCountFromServer(volumesQuery);

      return {
        progress: obtainedCount.data().count,
      };
    },
    async getCollection(collectionId: string) {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const snapshot = await getDoc(doc(db, 'users', uid, 'collections', collectionId));

      this.collection = {
        id: snapshot.id,
        ...snapshot.data(),
      } as ICollection;
    },
  },
});
