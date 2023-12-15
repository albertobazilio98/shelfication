import { ref } from 'vue';

export const useLoading = () => {
  const isLoading = ref(false);

  async function awaitLoading<T = unknown>(fn: Promise<T>) {
    isLoading.value = true;
    try {
      return await fn;
    } finally {
      isLoading.value = false;
    }
  };

  return { isLoading, awaitLoading };
};
