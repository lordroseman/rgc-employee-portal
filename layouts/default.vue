<script lang="ts" setup>
const appStore = useAppStore();

</script>

<template>
  <div class="antialiased bg-gray-50">
    <AppTopbar />
    <div class="hidden md:block">
      <AppSidebar />
    </div>

    <main
      class="mt-[54px] transition-all duration-300 h-full min-h-[calc(100vh-4rem)] p-4 pb-30 bg-slate-100"
      :class="{
        'md:ml-64': !appStore.sidebarOpen,
        'md:ml-0': appStore.sidebarOpen,
      }"
    >
      <slot />
    </main>

    <AppBottomNav />
  </div>
</template>
