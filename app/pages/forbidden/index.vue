<script setup lang="ts">
// const authStore = useAuthStore();
const { can } = useCan();
onMounted(async () => {
  // authStore.scheduleSilentRefresh();
  if(can('portal:accesss')){
    await navigateTo('/');
  };
});

definePageMeta({
  layout: 'errors'
});
</script>

<template>
    <h1>403 - Forbidden</h1>
</template>