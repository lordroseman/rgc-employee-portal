import { defineStore } from "pinia";

export const useAppStore = defineStore('app', () => {

    const pageTitle = ref('My Portal');

    const sidebarOpen = ref(false);
    const toggleSidebar = () => {
        sidebarOpen.value = !sidebarOpen.value;
    }

    return {
        sidebarOpen,
        pageTitle,
        toggleSidebar
    }

})