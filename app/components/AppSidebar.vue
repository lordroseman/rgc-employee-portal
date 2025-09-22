<script lang="ts" setup>
import type { MenuItem } from "~/types/menu";
const authStore = useAuthStore();

const items = ref<MenuItem[]>([
  { label: "Home", icon: "pi pi-home", to: "/dashboard" },
  { label: "Attendance", icon: "pi pi-clock", to: "/attendance" },
  { label: "Leave", icon: "pi pi-calendar-clock", to: "/leaves" },
  { label: "Payslip", icon: "pi pi-receipt", to: "/payslips" },
  { label: "Settings", icon: "pi pi-bars",
    open: false,
    items: [
      {
        label: "Logout",
        onClick: () => authStore.logout(),
      },
    ],
   }
]);


const route = useRoute();
const isActive = (item: MenuItem) => {
  return item.to === route.path;
};

const appStore = useAppStore();

</script>

<template>
    
    <aside
      id="drawer-navigation"
      class="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform duration-300 -translate-x-full   border-r  bg-gray-800 border-gray-700"
      :class="{
        'md:-translate-x-full translate-x-0': appStore.sidebarOpen, 
        'md:translate-x-0': !appStore.sidebarOpen,
      }"
      aria-label="Sidenav"
    >
      <div class="overflow-y-auto py-5 px-3 h-full  bg-gray-800">
        
        <ul class="space-y-2">
          <li v-for="item in items" :key="item.label">
          <template v-if="!item.items"> 
            <MenuLink :item="item" :active="isActive(item)" />
          </template>
            <template v-else>
            <button
              type="button"
              class="flex items-center p-2 w-full text-base   rounded-lg transition duration-75 group  text-white hover:bg-gray-700"
              aria-controls="dropdown-pages"
              data-collapse-toggle="dropdown-pages"
              @click="item.open = !item.open"
            >
           
              <svg
                aria-hidden="true"
                class="flex-shrink-0 w-6 h-6  transition duration-75  text-gray-400 group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="flex-1 ml-3 text-left whitespace-nowrap"
                > {{  item.label }}</span
              >
              <svg
                aria-hidden="true"
                class="w-6 h-6 transition-all duration-300 ease-in-out"
                :class="item.open ? 'rotate-180' : ''"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <ul 
               class="max-h-0 overflow-hidden space-y-2 transition-all duration-300 ease-in-out"
                :class="{
                    'max-h-40': item.open, 
                }"
            >
              <li v-for="subItem in item.items" :key="subItem.label" @click="subItem.onClick && subItem.onClick()">
                <MenuLink :item="subItem"   :active="isActive(subItem)"/> 
              </li>
            </ul>
            </template>       
          </li>
          
          
           
        </ul>
      </div>
      
    </aside>
</template>