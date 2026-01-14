<script setup lang="ts"> 
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
 
const todaysAttendance = computed<Record<string, Attendance> | null>(() => employeeAttendance.value);
const todaysSchedule = computed<Record<string, Schedule> | null>(() => employeeSchedule.value);

const selectedDate = ref(todayDate);

onMounted(async () => {
  skeletonLoading.value = true;
  await employeeStore.getEmployee();
  await employeePayslipStore.getEmployeePayslip(true);
  await employeeAttendanceStore.getEmployeeAttendance(true, todayDate, todayDate);
  skeletonLoading.value = false;
});


</script>

<template>
  <div>
    <EmployeeDetailCard :employee="employee" :skeleton-loading="skeletonLoading" />

    <Message
severity="error" :closable="false"
      class="relative mb-3 pr-10">
      Some attendance records need to be resolved.
      <i class="pi pi-arrow-right absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
    </Message>

    <AttendanceLogs
:date-range="dateRange" :employee-attendance="todaysAttendance" :employee-schedule="todaysSchedule"
      :skeleton-loading="skeletonLoading" :selected-date="selectedDate" />

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
        <div class="px-4 pt-4">
          <PayslipCard
:employee-payslip="employeePayslip?.[0]" :show-salary="showSalary"
            :skeleton-loading="skeletonLoading" />
        </div>
      </template>
    </Card>
 



    <Card v-if="false"  class=" mb-6 no-padding-card">
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