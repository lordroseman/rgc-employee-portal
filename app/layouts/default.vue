<script lang="ts" setup>
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'
 
const route = useRoute()

// Use window scroll; simpler & reliable
const { y } = useWindowScroll()

// Threshold at 10px
const isScrollingDown = computed(() => y.value > 10)
</script>

<template>
  <div class="antialiased bg-slate-200 scrollbar-gutter-stable ">
    <div class="relative max-w-[768px] mx-auto bg-slate-50">

      <!-- Layer 1: HERO BACKGROUND (absolute, animates height) -->
      <div
        class="bg-[#d31145] absolute inset-x-0 top-0 rounded-bl-[52px] shadow-md
               transition-all duration-300 ease-in-out will-change-[height,border-radius]"
        :class="isScrollingDown ? 'h-0 rounded-bl-none' : 'h-[150px]'"
        aria-hidden="true"
      />

      <!-- HERO TITLE (shows only before scroll) -->
      <div
        class="absolute inset-x-0 top-0 z-30 flex justify-center pt-4 transition-opacity duration-200"
        :class="isScrollingDown ? 'opacity-0 pointer-events-none' : 'opacity-100'"
      >
        <div class="text-white font-semibold text-xl">
          {{ route.meta.title }}
        </div>
      </div>

      <!-- Layer 2: STICKY HEADER (always sticky; fades in after 10px) -->
      <div
        class="sticky top-0 z-40 w-full transition-opacity duration-200"
        :class="isScrollingDown ? 'opacity-100' : 'opacity-0 pointer-events-none'"
      >
        <div class="bg-[#d31145] h-16 rounded-bl-none shadow-md flex items-center justify-center">
          <div class="text-white font-semibold text-xl">
            {{ route.meta.title }}
          </div>
        </div>
      </div>

      <!-- Spacer to reserve hero height (prevents jump) -->
      <div
        class="transition-[height] duration-300 ease-in-out"
        :class="isScrollingDown ? 'h-0' : 'h-[130px]'"
      />

      <!-- Sidebar -->
      <!-- <div class="hidden md:block">
        <AppSidebar />
      </div> -->

      <!-- Main content -->
      <main
        class="transition-all duration-300 h-full min-h-[calc(100vh-4rem)] p-4 pb-30 bg-surface-50"
        :class="[
         
          // Overlap the hero when at top; add space under sticky when scrolled
          isScrollingDown ? 'mt-0' : '-mt-[130px]'
        ]"
      >
        <slot />

        
       
      </main>

       <!-- Bottom nav (mobile) -->
        <div class="max-w-[768px] mx-auto h-24 relative">
          <AppBottomNav />
        </div>
    </div>

  </div>
</template>
