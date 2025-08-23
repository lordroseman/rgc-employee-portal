<template>
  <NuxtLayout>
    <Toast />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
onMounted(async () => {
  authStore.scheduleSilentRefresh();
});
</script>
