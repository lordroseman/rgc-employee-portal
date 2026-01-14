<script setup lang="ts">

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(employeeStore);
const loading = ref(true);

onBeforeMount(async () => { 
    loading.value = true;
    await employeeStore.getEmployee();
    loading.value = false;
});


definePageMeta({
    title: 'Settings'
})

useHead({
    title: 'Settings | My Portal'
})

const authStore = useAuthStore(); 

</script>

<template>
    <div>
        <EmployeeDetailCard 
            :employee="employee"
            :skeleton-loading="loading"
        />

        <div class="mt-6">
            <!-- My Profile -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
                            <i class="pi pi-user text-blue-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">My Profile</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>

            <!-- My Work Request -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-teal-50 px-2 pt-2 pb-1">
                            <i class="pi pi-briefcase text-teal-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">My Work Request</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>

            <!-- Certificate of Attendance -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-pink-50 px-2 pt-2 pb-1">
                            <i class="pi pi-calendar-times text-pink-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">Attendance Request</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>

            <!-- Change Password -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-orange-50 px-2 pt-2 pb-1">
                            <i class="pi pi-lock text-orange-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">Change Password</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>

            <!-- Contact Support -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-cyan-50 px-2 pt-2 pb-1">
                            <i class="pi pi-envelope text-cyan-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">Contact Support</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>

            <!-- Logout -->
            <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition mt-4" @click="authStore.logout()">
                <template #content>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="rounded-full bg-purple-50 px-2 pt-2 pb-1">
                            <i class="pi pi-sign-out text-purple-600" style="font-size: 18px"/>
                        </div>
                        <span class="text-gray-800 font-medium">Logout</span>
                    </div>
                    <i class="pi pi-angle-right text-gray-400"/>
                </div>
                </template>
            </Card>
        </div>
    </div>
</template>
