<script setup lang="ts">
import {  useDebounceFn } from "@vueuse/core";
import { ref } from 'vue'
import dayjs from 'dayjs';
import type { Attendance, Schedule } from '~/types/attendance';

definePageMeta({
    title: 'Dashboard'
})
 
useHead({
  title: 'Home | My Portal'
})
 
const dateRange = ref(false);
const config = useRuntimeConfig();
const todayDate = dayjs().format('YYYY-MM-DD');

const showSalary = ref(false)          // start hidden
const skeletonLoading = ref(false);

function toggleSalary() {
  showSalary.value = !showSalary.value
}

const employeePayslipStore = useEmployeePayslipStore();
const { employeePayslip } = storeToRefs(employeePayslipStore);

const employeeAttendanceStore = useEmployeeAttendanceStore();
const { employeeAttendance, employeeSchedule } = storeToRefs(employeeAttendanceStore);

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(employeeStore);

const loadEmployeeDetail = useDebounceFn(async () => {
  await employeeStore.getEmployee();
}, 300);

const loadEmployeePayslip = useDebounceFn(async () => {
  await employeePayslipStore.getEmployeePayslip(true);
}, 300);

const loadEmployeeAttendance = useDebounceFn(async () => {
  await employeeAttendanceStore.getEmployeeAttendance(true, todayDate, todayDate);
}, 300);

const todaysAttendance = computed<Record<string, Attendance> | null>(() => employeeAttendance.value);
const todaysSchedule   = computed<Record<string, Schedule>   | null>(() => employeeSchedule.value);

const selectedDate = ref(todayDate);

onMounted(async () => {
  skeletonLoading.value = true;
  await loadEmployeeDetail();
  await loadEmployeePayslip();
  await loadEmployeeAttendance();
  skeletonLoading.value = false;
});

const { user } = useAuthStore();

</script>

<template>
  <div>
    <!-- <Card class="mb-6">
      <template #title>
        <div class="text-sm text-gray-500 font-bold">
          #003-021
        </div>
        <div class="text-2xl">
          Justine Frange
        </div>
      </template>
<template #content>
        <div class="flex items-center gap-2 text-[#616161]">
          <div>
              <i class="pi pi-user" style="font-size: 12px;"></i>
          </div>
          <span class="text-sm">Manager</span>
        </div>
      </template>
</Card> -->

    <EmployeeDetailCard 
      :employee="employee"
      :skeleton-loading="skeletonLoading"
     />

    <Message v-if="config.public.stage === 'development'" severity="error" :closable="false"
      class="relative mb-3 pr-10">
      Some attendance records need to be resolved.
      <i class="pi pi-arrow-right absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
    </Message>

    <AttendanceLogs 
      :date-range="dateRange" 
      :employee-attendance="todaysAttendance" 
      :employee-schedule="todaysSchedule" 
      :skeleton-loading="skeletonLoading"
      :selected-date="selectedDate"
    />

    <Card class="mb-6 no-padding-card">
      <template #header>
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <div class="pt-1">
              <i class="pi pi-receipt text-[#05B34D]" />
            </div>
            <div>
              <h2 class="text-lg font-medium">Latest Payslip</h2>
            </div>
          </div>

          <div class="cursor-pointer">
            <Button
              class="inline-flex items-center rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring"
              variant="text" :aria-pressed="showSalary ? 'true' : 'false'"
              :title="showSalary ? 'Hide amounts' : 'Show amounts'" @click="toggleSalary">
              <i :class="['pi', showSalary ? 'pi-eye' : 'pi-eye-slash', 'text-[18px] text-gray-700']" />
            </Button>
          </div>
        </div>
      </template>

      <template #content>
        <PayslipCard
          :employee-payslip="employeePayslip?.[0]" 
          :show-salary="showSalary"
          :skeleton-loading="skeletonLoading" />
      </template>
    </Card>

    <!-- <div class="p-4">

        <div class="flex items-start justify-between gap-6 basis-1/2 mb-4">
            <div>
                <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500">Period Cover</div>
                <div class="text-sm font-bold text-gray-900">AUG 16, 2025 - AUG 31, 2025</div>
            </div>
            <div>
                <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500">Pay Day</div>
                <div class="text-sm font-bold text-gray-900">SEP 21, 2025</div>
            </div>
        </div>

        <Card class="mb-4 !bg-transparent !shadow-none !border-0">
          <template #content>
            <div class="pl-2 text-right">
                <div class="flex items-center justify-between">
                    <i class="pi pi-wallet text-gray-600 !text-3xl" aria-hidden="true"></i>

                    <div class="text-right">
                        <div class="text-xs font-medium text-gray-500">NET PAY</div>
                        <div class="text-xl font-bold text-gray-800 font-mono tabular-nums">
                          {{ display('₱100,000.53') }}
                        </div>
                    </div>
                </div>
            </div>
          </template>
        </Card>

        <div class="flex gap-4">
          <Card class="flex-1 !bg-transparent !shadow-none !border-0">
            <template #content>

                <div class="px-2 py-4 text-right">
                    <div class="flex items-center justify-between">
                        <i class="pi pi-sort-up-fill text-teal-600 !text-xl" aria-hidden="true"></i>

                        <div class="text-right">
                          <div class="text-xs font-medium text-gray-500">TOTAL INCOME</div>
                          <div class="text-xl font-bold text-green-700 font-mono tabular-nums">
                            {{ display('₱100,000.12') }}
                          </div>
                        </div>
                    </div>
                </div>
            </template>
          </Card>

          <Card class="flex-1 !bg-transparent !shadow-none !border-0">
            <template #content>
              <div class="px-2 py-4 text-right">
                <div class="flex items-center justify-between">
                    <i class="pi pi-sort-down-fill text-red-600 !text-2xl" aria-hidden="true"></i>

                    <div class="text-right">
                      <div class="text-xs font-medium text-gray-500">TOTAL DEDUCTION</div>
                      <div class="text-xl font-bold text-red-600 font-mono tabular-nums">
                        {{ display('₱100,000.55') }}
                      </div>
                    </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div> 
      -->

    <!-- <div class="border-t border-slate-200"></div>
      <div class="flex items-center p-4 gap-3">
        
        <div class="w-12 flex flex-col items-center pt-1">
          <div class="text-xs font-medium text-gray-500">AUG</div>
          <div class="text-lg font-bold text-gray-800">25</div>
        </div>

        
        <div class="flex-1 text-left">
          <div class="text-lg font-bold text-gray-800">₱3,000.53</div>

          <div class="flex items-center mt-1 text-sm gap-5">
            <div class="flex items-center text-green-600">
              <i class="pi pi-wallet mr-1" style="font-size: 10px"></i>
              <span class="font-medium">₱5,000.12</span>
            </div>

            <div class="flex items-center text-red-600">
              <i class="pi pi-sort-down-fill mr-1" style="font-size: 10px"></i>
              <span class="font-medium">₱2,000.55</span>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200"></div>
      <div class="flex items-center p-4 gap-3">
        
        <div class="w-12 flex flex-col items-center pt-1">
          <div class="text-xs font-medium text-gray-500">AUG</div>
          <div class="text-lg font-bold text-gray-800">24</div>
        </div>

        
        <div class="flex-1 text-left">
          <div class="text-lg font-bold text-gray-800">₱3,000.53</div>

          <div class="flex items-center mt-1 text-sm gap-5">
            <div class="flex items-center text-green-600">
              <i class="pi pi-wallet mr-1" style="font-size: 10px"></i>
              <span class="font-medium">₱5,000.12</span>
            </div>

            <div class="flex items-center text-red-600">
              <i class="pi pi-sort-down-fill mr-1" style="font-size: 10px"></i>
              <span class="font-medium">₱2,000.55</span>
            </div>
          </div>
        </div>
      </div> -->




    <Card v-if="config.public.stage === 'development'" class=" mb-6 no-padding-card">
      <template #header>
        <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
          <div class="pt-1">
            <i class="pi pi-briefcase text-[#A30542]" />
          </div>
          <div>
            <h2 class="text-lg font-medium">Pending Work Request</h2>
          </div>
        </div>
      </template>

      <template #content>

        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col items-start gap-1">
            <div class="font-bold text-xs">AUGUST 27, 2025</div>
            <Tag class="!bg-orange-50 !text-orange-500" value="Official Business" style="font-size: 10px;" />
          </div>
          <div class="text-[#4D4D4D] text-sm">
            Thursday
          </div>
        </div>

        <div class="border-t border-slate-200" />
        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col items-start gap-1">
            <div class="font-bold text-xs">AUGUST 28, 2025</div>
            <Tag class="!bg-orange-50 !text-orange-500" value="Official Business" style="font-size: 10px;" />
          </div>
          <div class="text-[#4D4D4D] text-sm">
            Friday
          </div>
        </div>

        <div class="border-t border-slate-200" />
        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col items-start gap-1">
            <div class="font-bold text-xs">AUGUST 29, 2025</div>
            <Tag class="!bg-indigo-50 !text-indigo-500" value="Overtime" style="font-size: 10px;" />
          </div>
          <div class="text-[#4D4D4D] text-sm">
            Saturday
          </div>
        </div>

        <div class="border-t border-slate-200" />
        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col items-start gap-1">
            <div class="font-bold text-xs">SEPTEMBER 03, 2025</div>
            <Tag class="!bg-orange-50 !text-orange-500" value="Official Business" style="font-size: 10px;" />
          </div>
          <div class="text-[#4D4D4D] text-sm">
            Saturday
          </div>
        </div>

        <div class="border-t border-slate-200" />
        
        <div class="flex items-start justify-between p-4">
          <div class="flex flex-col items-start gap-1">
            <div class="font-bold text-xs">SEPTEMBER 05, 2025</div>
            <Tag class="!bg-amber-50 !text-amber-500" value="Leave" style="font-size: 10px;" />
          </div>
          <div class="text-[#4D4D4D] text-sm">
            Monday
          </div>
        </div>


        <div class="border-t border-slate-200" />
        <div class="flex items-start justify-center">
          <Button label="See More" severity="info" variant="text" />
        </div>

      </template>
    </Card>
  </div>
</template>

<style scoped>
.no-padding-card :deep(.p-card-body) {
  padding: 0 !important;
}
</style>