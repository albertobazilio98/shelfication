<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { getAuth } from 'firebase/auth';
  import { onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const auth = getAuth();
  const router = useRouter();

  onMounted(() => {
    if (!auth.currentUser) {
      router.push({ name: 'login' });
    }
  });
</script>
<style lang="scss" scoped>
.main {
  padding: 32px;
}
</style>
