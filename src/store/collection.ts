import { defineStore } from 'pinia';

export interface ICollection {
  id: string
  name: string
  quantity: number
}

export interface ICollectionStore {
  collection?: ICollection
  collections: ICollection[]
}

export const useCollectionStore = defineStore({
  id: 'collection',
  state: (): ICollectionStore => ({
    collection: undefined,
    collections: [],
  }),
  actions: () => {

  },
});
