<template>
  <ShelfButton @click="login" prepend-icon="mdi-google">
    Entrar com o google
  </ShelfButton>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { GoogleAuthProvider, getAuth, getRedirectResult, signInWithRedirect } from 'firebase/auth';
  import ShelfButton from '@/components/ShelfButton.vue';
  import { useUserStore } from '@/store/user';
  import { useLoaderStore } from '@/store/loader';

  const router = useRouter();
  const userStore = useUserStore();
  const loaderStore = useLoaderStore();

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const login = () => signInWithRedirect(auth, provider);

  loaderStore.awaitGlobalLoading(getRedirectResult(auth).then((result) => {
    if (!result) {
      userStore.destroyUser();
    } else {
      userStore.setUser(result.user);
      router.push({ name: 'list-collections' });
    }
  }));
</script>
<style lang="scss" scoped>
  .home {
    .collection-form {
      display: flex;
      flex-direction: column;
      gap: 12px 0;
      max-width: 512px;

      .title {
        margin-bottom: 12px;
      }
    }

    .collections {
      padding: 32px 0;
    }
  }
</style>
