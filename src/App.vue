<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import { useUserStore } from './store/user';

  const auth = getAuth();
  const userStore = useUserStore();
  const router = useRouter();

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
