<script setup lang="ts">
const authStore = useAuthStore();

const route = useRoute()

const bottomNavItems = [
  { label: "Home", icon: "pi pi-home", to: "/dashboard" },
  { label: "Attendance", icon: "pi pi-clock", to: "/attendance" },
  { label: "Leave", icon: "pi pi-calendar-clock", to: "/leaves" },
  { label: "Payslip", icon: "pi pi-receipt", to: "/payslips" },
  { label: "Settings", icon: "pi pi-cog", to: "/settings" },
];

console.log('-- route:', route.path);

</script>

<template>
    <div 
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-4 border border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.15)]"
    >
      <div class="flex justify-around">
        <router-link
          v-for="item in bottomNavItems"
          :key="item.label"
          :to="item.to"
          class="flex flex-col items-center py-2"
          :class="route.path === item.to 
          ? 'text-[#c62a35] font-bold' 
          : 'text-gray-600'"
        >
        <div>
            <i :class="item.icon"  style="font-size: 20px;"></i>
        </div>
        <span class="text-xs">{{ item.label }}</span>
        </router-link>
      </div>
    </div>
</template>
