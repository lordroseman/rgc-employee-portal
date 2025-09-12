<script setup lang="ts">
  const authStore = useAuthStore();
  onMounted(async () => {
    authStore.scheduleSilentRefresh();
  });
  const loading = useLoading()
</script>

<template>
  <NuxtLayout>
    <Toast />
    <NuxtPage />

    <Teleport to="body">
      <div
        v-if="loading"
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60"
        aria-live="polite"
        aria-busy="true"
      >
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    </Teleport>
  </NuxtLayout>
</template>