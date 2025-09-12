<script setup lang="ts">


</script>

<template>
    <div class="relative mx-auto mt-14">
        <!-- Avatar wrapper with fixed size -->
        <span
            class="absolute left-1/2 -translate-x-1/2 -top-12 z-10
                h-24 w-24 rounded-full ring-4 ring-white overflow-hidden bg-gray-200"
        >
            <img
                src="https://i.pravatar.cc/200?img=12"
                alt="Profile"
                class="h-full w-full object-cover"
            />
        </span>

        <Card class="shadow-lg pt-12">
            <template #content>
            <div class="px-6 pb-4">
                <h3 class="text-center text-xl font-semibold text-gray-900">Firstname Middlename Lastname</h3>
                <div class="mt-1 flex justify-center text-sm text-gray-700">
                <span>#003-021</span>
                </div>
                <div class="mt-1 flex justify-center text-sm text-gray-700">
                <span>System Developer</span>
                </div>
            </div>
            </template>
        </Card>
    </div>

    <div class="mt-6">
        <!-- My Profile -->
        <Card class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
            <template #content>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
                        <i class="pi pi-user text-blue-600" style="font-size: 18px"></i>
                    </div>
                    <span class="text-gray-800 font-medium">My Profile</span>
                </div>
                <i class="pi pi-angle-right text-gray-400"></i>
            </div>
            </template>
        </Card>

        <!-- My Work Request -->
        <Card class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
            <template #content>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-teal-50 px-2 pt-2 pb-1">
                        <i class="pi pi-briefcase text-teal-600" style="font-size: 18px"></i>
                    </div>
                    <span class="text-gray-800 font-medium">My Work Request</span>
                </div>
                <i class="pi pi-angle-right text-gray-400"></i>
            </div>
            </template>
        </Card>

        <!-- Certificate of Attendance -->
        <Card class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
            <template #content>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-pink-50 px-2 pt-2 pb-1">
                        <i class="pi pi-calendar-times text-pink-600" style="font-size: 18px"></i>
                    </div>
                    <span class="text-gray-800 font-medium">Certificate of Attendance</span>
                </div>
                <i class="pi pi-angle-right text-gray-400"></i>
            </div>
            </template>
        </Card>

        <!-- Change Password -->
        <Card class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
            <template #content>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-orange-50 px-2 pt-2 pb-1">
                        <i class="pi pi-lock text-orange-600" style="font-size: 18px"></i>
                    </div>
                    <span class="text-gray-800 font-medium">Change Password</span>
                </div>
                <i class="pi pi-angle-right text-gray-400"></i>
            </div>
            </template>
        </Card>

        <!-- Contact Support -->
        <Card class="shadow cursor-pointer hover:bg-gray-50 transition mt-4">
            <template #content>
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="rounded-full bg-cyan-50 px-2 pt-2 pb-1">
                        <i class="pi pi-envelope text-cyan-600" style="font-size: 18px"></i>
                    </div>
                    <span class="text-gray-800 font-medium">Contact Support</span>
                </div>
                <i class="pi pi-angle-right text-gray-400"></i>
            </div>
            </template>
        </Card>
    </div>
</template>
