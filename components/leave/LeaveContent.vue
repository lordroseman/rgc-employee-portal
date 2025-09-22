<script setup lang="ts">
import { useDateFormat, useDebounceFn } from "@vueuse/core";
import dayjs from "dayjs";
const authStore = useAuthStore();
// const loading = useLoading()
const skeletonLoading = ref(false);

const config = useRuntimeConfig();
const stage = config.public.stage;

const emit = defineEmits(["add", "update:modelValue", "openBottomDrawer"]);

const employeeLeaveStore = useEmployeeLeaveStore();
const { employeeLeaves } = storeToRefs(employeeLeaveStore);

const calcDuration = (from: string, to: string) => {
  if (!from || !to) return 0;

  const start = dayjs(from);
  const end = dayjs(to);

  // +1 to include both start and end dates
  return end.diff(start, "day") + 1;
};

const leaveTypeVariant  = [// VL, SL, PL, ML
    {
        bg: "bg-[#01633C]",
        value: "SL"
    },
    {
        bg: "bg-[#544991]",
        value: "VL"
    },
]

const loadEmployeeLeaves = useDebounceFn(async () => {
    await employeeLeaveStore.getLeaveByEmployee();
}, 300);

onMounted(async () => {
    skeletonLoading.value = true;
    await loadEmployeeLeaves();
    skeletonLoading.value = false;
});

// onBeforeRouteLeave(() => {
//   employeeLeaveStore.reset()
// })
</script>

<template>
<div class="flex items-center justify-between mb-4">
    <div class="pt-2 pb-2 w-full" v-if="stage == 'development'">
      <Button 
        icon="pi pi-plus" 
        severity="primary"
        style="font-size: 14px;" 
        label="Apply Leave"
        class="w-full"
        @click="emit('openBottomDrawer')"
      />
    </div>

    <!-- <div class="flex gap-4 pt-2 pb-2">
      <Button 
        severity="warn" 
        icon="pi pi-download" 
        style="font-size: 14px;"
      />
    </div> -->
    </div>

    <div class="grid grid-cols-2 gap-3 mb-6 mt-4">
        <!-- Remaining Leave Credits -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Remaining Leave Credits
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
                        <i class="pi pi-clock text-blue-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        <div v-if="skeletonLoading"><Skeleton width="5rem" class="mb-2"></Skeleton></div>
                        <div v-else>{{ employeeLeaves?.rejected.length }}</div>
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Pending -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Leave Pending
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-amber-50 px-2 pt-2 pb-1">
                        <i class="pi pi-hourglass text-amber-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        <div v-if="skeletonLoading"><Skeleton width="5rem" class="mb-2"></Skeleton></div>
                        <div v-else>{{ employeeLeaves?.pending.length }}</div>
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Approved -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Leave Approved
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-green-50 px-2 pt-2 pb-1">
                        <i class="pi pi-check-circle text-green-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        <div v-if="skeletonLoading"><Skeleton width="5rem" class="mb-2"></Skeleton></div>
                        <div v-else>{{ employeeLeaves?.approved.length }}</div>
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Rejected -->
        <Card>
            <template #content>
            <div class="py-0 text-center">
                <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                Leave Rejected
                </div>
                <div class="flex items-center gap-3">
                <div class="rounded-full bg-red-50 px-2 pt-2 pb-1">
                    <i class="pi pi-times-circle text-red-600" style="font-size: 18px"></i>
                </div>
                    <div class="text-xl font-bold">
                        <div v-if="skeletonLoading"><Skeleton width="5rem" class="mb-2"></Skeleton></div>
                        <div v-else>{{ employeeLeaves?.rejected.length }}</div>
                    </div>
                </div>
            </div>
            </template>
        </Card>
    </div>

    <div class="mt-4">
       <Tabs value="0" class="w-full">
  <!-- full width container -->
        <TabList
            class="flex w-full bg-gray-100 rounded-lg"
            style="
                --p-tabs-tab-active-color:#0b8390;
                --p-tabs-inkbar-background:#0b8390;
                --p-tabs-tab-active-border-color:#0b8390;
                --p-tabs-tab-active-background:transparent;
            "
            >
            <Tab value="0" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition">
                Pending
            </Tab>
            <Tab value="1" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition" :disabled="skeletonLoading">
                Approved
            </Tab>
            <Tab value="2" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition" :disabled="skeletonLoading">
                Rejected
            </Tab>
        </TabList>

  <TabPanels class="!p-0">
    <TabPanel value="0">
        <div v-if="skeletonLoading" class="p-4">
            <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                <div class="flex items-start justify-between gap-6 basis-1/2">
                    <!-- Left column -->
                    <div class="flex items-start gap-3">
                    <div>
                        <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date From</div>
                        <div class="text-sm font-bold text-gray-900 uppercase"><Skeleton /></div>

                        <div class="mt-4 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date To</div>
                        <div class="text-sm font-bold text-gray-900 uppercase"><Skeleton /></div>
                    </div>
                    </div>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-3 basis-1/2">
                        <div>
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Apply Days</div>
                            <div class="text-sm font-bold text-gray-900">
                            <Skeleton />
                            </div>
                        </div>

                        <div>
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Leave Type</div>
                            <div class="text-sm font-bold text-gray-900">
                               <Skeleton />
                            </div>
                        </div>

                        <div class="col-span-2">
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date Applied</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">
                                <Skeleton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <div v-if="employeeLeaves?.pending.length">
                <div v-for="leave in employeeLeaves.pending" :key="leave.id as number">
                    <div class="border-t border-gray-300"></div>
                    <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                        <div class="flex items-start justify-between gap-6 basis-1/2">
                            <!-- Left column -->
                            <div class="flex items-start gap-3">
                            <div>
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date From</div>
                                <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_from as string, "MMM DD, YYYY") }}</div>

                                <div class="mt-4 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date To</div>
                                <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_to as string, "MMM DD, YYYY") }}</div>
                            </div>
                            </div>

                            <div class="grid grid-cols-2 gap-x-8 gap-y-3 basis-1/2">
                                <div>
                                    <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Apply Days</div>
                                    <div class="text-sm font-bold text-gray-900">
                                    {{ calcDuration(leave.date_from as string, leave.date_to as string) }} <span class="font-semibold text-gray-500">days</span>
                                    </div>
                                </div>

                                <div>
                                    <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Leave Type</div>
                                    <div class="text-sm font-bold text-gray-900">
                                    <span 
                                        class="inline-flex items-center px-2 pt-0.5 pb-1 rounded text-white"
                                        :class="leaveTypeVariant[leave.leave_type].bg"
                                    >
                                        {{ leaveTypeVariant[leave.leave_type].value }}
                                    </span>
                                    </div>
                                </div>

                                <div class="col-span-2">
                                    <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date Applied</div>
                                    <div class="text-sm font-bold text-gray-900 uppercase">
                                        {{ useDateFormat(leave.created_at, "MMM DD, YYYY") }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="p-4 text-center">
                No data to display.
            </div>
        </div>
    </TabPanel>
    <TabPanel value="1">
        <div v-if="employeeLeaves?.approved.length">
            <div v-for="leave in employeeLeaves.approved" :key="leave.id as number">
                <div class="border-t border-gray-300"></div>
                <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-start justify-between gap-6 basis-1/2">
                        <!-- Left column -->
                        <div class="flex items-start gap-3">
                        <div>
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date From</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_from as string, "MMM DD, YYYY") }}</div>

                            <div class="mt-4 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date To</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_to as string, "MMM DD, YYYY") }}</div>
                        </div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-8 gap-y-3 basis-1/2">
                            <div>
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Apply Days</div>
                                <div class="text-sm font-bold text-gray-900">
                                {{ calcDuration(leave.date_from as string, leave.date_to as string) }} <span class="font-semibold text-gray-500">days</span>
                                </div>
                            </div>

                            <div>
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Leave Type</div>
                                <div class="text-sm font-bold text-gray-900">
                                <span 
                                    class="inline-flex items-center px-2 pt-0.5 pb-1 rounded text-white"
                                    :class="leaveTypeVariant[leave.leave_type].bg"
                                >
                                    {{ leaveTypeVariant[leave.leave_type].value }}
                                </span>
                                </div>
                            </div>

                            <div class="col-span-2">
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date Applied</div>
                                <div class="text-sm font-bold text-gray-900 uppercase">
                                    {{ useDateFormat(leave.created_at, "MMM DD, YYYY") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-4 text-center">
            No data to display.
        </div>
    </TabPanel>
    <TabPanel value="2">
        <div v-if="employeeLeaves?.rejected.length">
            <div v-for="leave in employeeLeaves.rejected" :key="leave.id as number">
                <div class="border-t border-gray-300"></div>
                <div class="p-4 hover:bg-gray-50 transition cursor-pointer">
                    <div class="flex items-start justify-between gap-6 basis-1/2">
                        <!-- Left column -->
                        <div class="flex items-start gap-3">
                        <div>
                            <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date From</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_from as string, "MMM DD, YYYY") }}</div>

                            <div class="mt-4 text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date To</div>
                            <div class="text-sm font-bold text-gray-900 uppercase">{{ useDateFormat(leave.date_to as string, "MMM DD, YYYY") }}</div>
                        </div>
                        </div>

                        <div class="grid grid-cols-2 gap-x-8 gap-y-3 basis-1/2">
                            <div>
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Apply Days</div>
                                <div class="text-sm font-bold text-gray-900">
                                {{ calcDuration(leave.date_from as string, leave.date_to as string) }} <span class="font-semibold text-gray-500">days</span>
                                </div>
                            </div>

                            <div>
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Leave Type</div>
                                <div class="text-sm font-bold text-gray-900">
                                <span 
                                    class="inline-flex items-center px-2 pt-0.5 pb-1 rounded text-white"
                                    :class="leaveTypeVariant[leave.leave_type].bg"
                                >
                                    {{ leaveTypeVariant[leave.leave_type].value }}
                                </span>
                                </div>
                            </div>

                            <div class="col-span-2">
                                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Date Applied</div>
                                <div class="text-sm font-bold text-gray-900 uppercase">
                                    {{ useDateFormat(leave.created_at, "MMM DD, YYYY") }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="p-4 text-center">
            No data to display.
        </div>
    </TabPanel>
  </TabPanels>
</Tabs>

    </div>
</template>