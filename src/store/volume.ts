import { db } from '@/db/firebase';
import { addDoc, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useUserStore } from './user';

export interface IVolume {
  id?: string
  index: number
  obtained: boolean
  storeItems: IStoreItem[]
}

export interface IStoreItem {
  store: string
  link?: string
  price?: number
}

export interface IVolumeStore {
  collectionId?: string
  volumes: IVolume[]
}

export const useVolumeStore = defineStore({
  id: 'Volume',
  state: (): IVolumeStore => ({
    volumes: [],
  }),
  actions: {
    async fetchVolumes(quantity: number, collectionId: string) {
      this.collectionId = collectionId;
      this.volumes = new Array(quantity).fill(undefined).map((_, index) => ({
        obtained: false,
        index: index,
        storeItems: [],
      }));
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const snapshot = await getDocs(collection(db, 'users', uid, 'collections', this.collectionId, 'volumes'));
      snapshot.forEach((doc) => {
        const volume = {
          id: doc.id,
          ...doc.data(),
        } as IVolume;
        this.volumes[volume.index] = { ...this.volumes[volume.index], ...volume };
      });
    },
    async addVolume() {
      if (!this.collectionId) throw new Error('collection needs to be defined');
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');


      await updateDoc(doc(db, 'users', uid, 'collections', this.collectionId), {
        quantity: this.volumes.length + 1,
      });

      this.volumes.push({
        obtained: false,
        index: this.volumes.length,
        storeItems: [],
      });
    },
    async updateVolume({ id, ...volumeData }: IVolume) {
      if (!this.collectionId) throw new Error('collection needs to be defined');

      if (!id) {
        await this.createVolume(volumeData.index, volumeData);
      } else {
        const uid = useUserStore().uid;

        if (!uid) throw new Error('user doesnt exists');

        await setDoc(doc(db, 'users', uid, 'collections', this.collectionId, 'volumes', id), volumeData);
        this.volumes[volumeData.index] = {
          ...this.volumes[volumeData.index],
          ...volumeData,
        };
      }
    },
    async createVolume(index: number, volumeData: Partial<IVolume> = {}) {
      if (!this.collectionId) throw new Error('collection needs to be defined');

      const data = {
        ...this.volumes[index],
        ...volumeData,
      };

      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const ref = await addDoc(collection(db, 'users', uid, 'collections', this.collectionId, 'volumes'), data);
      this.volumes[index] = {
        id: ref.id,
        ...data,
      };
    },
    async createStoreItem(index: number, storeItemData: IStoreItem) {
      if (!this.collectionId) throw new Error('collection needs to be defined');
      if (index >= this.volumes.length) throw new Error('volume index not exists');

      this.volumes[index].storeItems.push(storeItemData);
      await this.updateVolume(this.volumes[index]);
    },
    async updateStoreItem(index: number, storeItemIdex: number, storeItemData: IStoreItem) {
      if (!this.collectionId) throw new Error('collection needs to be defined');
      if (index >= this.volumes.length) throw new Error('volume index not exists');
      if (storeItemIdex >= this.volumes[index].storeItems.length) throw new Error('store item index not exists');

      this.volumes[index].storeItems[storeItemIdex] = storeItemData;
      await this.updateVolume(this.volumes[index]);
    },
    async deleteStoreItem(index: number, storeItemIdex: number) {
      if (!this.collectionId) throw new Error('collection needs to be defined');
      if (index >= this.volumes.length) throw new Error('volume index not exists');
      if (storeItemIdex >= this.volumes[index].storeItems.length) throw new Error('store item index not exists');

      this.volumes[index].storeItems.splice(storeItemIdex, 1);
      await this.updateVolume(this.volumes[index]);
    },
  },
});
