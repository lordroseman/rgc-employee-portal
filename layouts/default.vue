<script lang="ts" setup>
const appStore = useAppStore();
const route = useRoute()

</script>

<template>
  <div class="antialiased bg-gray-50">
    <AppTopbar
      v-if="!['/dashboard', '/settings'].includes(route.path)"
      class="block md:hidden"
    />
    <AppTopbar class="hidden md:block" />
    <div class="hidden md:block">
      <AppSidebar />
    </div>

    <main
      class="transition-all duration-300 h-full min-h-[calc(100vh-4rem)] p-4 pb-30 bg-surface-50"
      :class="{
        'md:ml-64': !appStore.sidebarOpen,
        'md:ml-0': appStore.sidebarOpen,
        'mt-[54px]': !['/dashboard', '/settings'].includes(route.path)
      }"
    >
      <slot />
    </main>

    <div class="md:hidden h-24">
      <AppBottomNav />
    </div>
  </div>
</template>
