import { defineStore } from 'pinia';

interface ILoaderStore {
  loading: boolean
}

export const useLoaderStore = defineStore({
  id: 'loader',
  state: (): ILoaderStore => ({
    loading: false,
  }),
  getters: {
    isLoading: state => state.loading,
  },
  actions: {
    startGlobalLoading() {
      this.$patch({
        loading: true,
      });
    },
    stopGlobalLoading() {
      this.$patch({
        loading: false,
      });
    },
    async awaitGlobalLoading<T = unknown>(fn: Promise<T>) {
      this.startGlobalLoading();
      try {
        return await fn;
      } finally {
        this.stopGlobalLoading();
      }
    },
  },
});
