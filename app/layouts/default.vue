<script lang="ts" setup>
 import { useScroll } from '@vueuse/core'

const appStore = useAppStore();
const route = useRoute()
 



const el = window.document; // use the window document to track scroll
const { y } = useScroll(el);


const isScrollingDown = computed(() => {
    return y.value > 10; // Adjust the threshold as needed
});

</script>

<template>
  <div ref="el" class="antialiased bg-surface-50">
    <!-- <AppTopbar
      v-if="!['/dashboard', '/settings'].includes(route.path)"
      class="block md:hidden"
    />
    
    <AppTopbar class="hidden md:block" /> -->

  <div
    class="bg-[#d31145] rounded-bl-[52px] shadow-md absolute top-0 w-full transition-[height]  "
    :class="{
      'h-16 rounded-bl-none z-40 sticky shadow-md': isScrollingDown,
      'h-50 rounded-bl-[52px] z-0 absolute': !isScrollingDown
    }"
  >
        <div class="h-16 text-center text-white flex items-center justify-center font-semibold text-xl sticky top-0 z-10">
            {{  route.meta.title }}
        </div>
    </div>



    <div class="hidden md:block">
      <AppSidebar />
    </div>

    <main
      class="transition-all duration-300 h-full min-h-[calc(100vh-4rem)] p-4 pb-30 bg-surface-50 mt-12"
      :class="{
        'md:ml-64': !appStore.sidebarOpen,
        'md:ml-0': appStore.sidebarOpen
      }"
    >
      <slot />
    </main>

    <div class="md:hidden h-24">
      <AppBottomNav />
    </div>
  </div>
</template>
