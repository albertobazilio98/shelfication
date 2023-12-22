<template>
  <v-app>
    <v-main class="main">
      <GlobalLoader />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useUserStore } from './store/user';
  import GlobalLoader from './components/GlobalLoader.vue';
  import { useStoreStore } from './store/store';

  const auth = getAuth();
  const router = useRouter();
  const userStore = useUserStore();
  const storeStore = useStoreStore();

  storeStore.getDefaultStores();
  storeStore.getUserStores();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      userStore.destroyUser();
      router.push({ name: 'login' });
    } else {
      userStore.setUser(user);
    }
  });
</script>
<style lang="scss" scoped>
.main {
  padding: 32px;
}
</style>
