import { defineStore } from 'pinia';
import { useUserStore } from './user';
import { UserStore } from '@/models/userStore';
import { Store } from '@/models/store';

export interface IStore {
  id: string
  name: string
}

export interface IStoreStore {
  defaultStores: IStore[]
  userStores: IStore[]
}

export const useStoreStore = defineStore({
  id: 'store',
  state: (): IStoreStore => ({
    defaultStores: [],
    userStores: [],
  }),
  getters: {
    stores: (state) => ([...state.defaultStores, ...state.userStores]),
  },
  actions: {
    async createUserStore(data: Omit<IStore, 'id'>): Promise<IStore> {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      const userStore = await new UserStore(uid).create(data);

      this.userStores.push(userStore);

      return userStore;
    },
    async getDefaultStores() {
      this.defaultStores = await new Store().fetch();
    },
    async getUserStores() {
      const uid = useUserStore().uid;

      if (!uid) throw new Error('user doesnt exists');

      this.userStores = await new UserStore(uid).fetch();;
    },
  },
});
