<script setup lang="ts">
import type { Attendance, Schedule } from '~/types/attendance';
import {  useDebounceFn } from "@vueuse/core";
import dayjs from 'dayjs';
import AttendanceCard from '~/components/attendance/AttendanceCard.vue';

definePageMeta({
  title: 'Attendance'
})

useHead({
  title: 'Attendance | My Portal'
})

const todayDate = dayjs().format('YYYY-MM-DD');

const dateRange = ref(false);
const showModal = ref(false);
const showCalendar = ref(false);
const showResolveDrawer = ref(false);
const skeletonLoading = ref(false);

const modalType = ref("");

function openDownloadModal() {
  modalType.value = "download"
  showModal.value = true
}

// function openFilterModal() {
//   modalType.value = "filter_range"
//   showModal.value = true
// }

function handleFilter() {
  dateRange.value = true;
  // showModal.value = false;
  showCalendar.value = false;
  // put your filter logic here
}

function handleDownload() {
  console.log("Download clicked")
  // put your download logic here
}

const employeeAttendanceStore = useEmployeeAttendanceStore();
const { employeeAttendance, employeeSchedule } = storeToRefs(employeeAttendanceStore);

const loadEmployeeAttendance = useDebounceFn(async (date_from, date_to) => {
  await employeeAttendanceStore.getEmployeeAttendance(false, date_from, date_to);
}, 300);

//return current date
const attendance = computed<Record<string, Attendance> | null>(() => employeeAttendance.value);
const schedule   = computed<Record<string, Schedule>   | null>(() => employeeSchedule.value);

onMounted(async () => {
  skeletonLoading.value = true;
  //default date when page load (today & -15days)
  const dateFrom =  dayjs().subtract(15, 'day').format('YYYY-MM-DD');
  await loadEmployeeAttendance(dateFrom, todayDate);
  skeletonLoading.value = false;
});

const config = useRuntimeConfig();
const dateHolder = ref([null, null]);
const selectedDate = ref(todayDate);

</script>

<template>
  <div class="relative">
    <Message v-if="config.public.stage === 'development'" severity="error" :closable="false"
      class="relative mb-3 pr-10 pointer" @click="showResolveDrawer = true">
      Some attendance records need to be resolved.
      <i class="pi pi-arrow-right absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
    </Message>

    <!-- <div v-if="dateRange"
    class="flex items-center justify-between mb-6 text-[#FFF] font-bold bg-[#088492] py-1 px-4 rounded"
  >
    <span>AUG 12, 2025 - SEP 25, 2025</span>
    <Button class="!text-[#FFF]" variant="text" label="X"
      @click="dateRange = false"
    />
  </div> -->

    <Card>

      <template #header>
        <div v-if="config.public.stage === 'development'" class="flex items-center justify-between px-4">
          <div class="pt-2 pb-2">
            <Button icon="pi pi-briefcase" severity="secondary" variant="contrast" style="font-size: 14px;"
              label="Work Request" />
          </div>

          <div class="flex gap-4 pt-2 pb-2">
            <Button severity="secondary" icon="pi pi-download" variant="text" style="font-size: 14px;"
              @click="openDownloadModal" />
            <Button v-if="!dateRange" severity="secondary" icon="pi pi-sliders-h" variant="text"
              style="font-size: 14px;" @click="showCalendar = true" />
            <!-- @click="openFilterModal" -->
            <Button v-else severity="secondary" icon="pi pi-calendar" variant="text" style="font-size: 14px;"
              @click="dateRange = false" />
          </div>
        </div>
      </template>

      <template #content>

        <Message v-if="dateRange" severity="success" :closable="false" class="relative mb-3 pr-10">
          <span>AUG 12, 2025 - SEP 25, 2025</span>
          <i class="pi pi-times absolute right-3 top-1/2 -translate-y-1/2" aria-hidden="true"
            @click="dateRange = false" />
        </Message>

        <SwipeCalender v-if="!dateRange" v-model:selectedDate="selectedDate" />
      </template>
    </Card>

    <AttendanceCard
      :date-range="dateRange" 
      :employee-attendance="attendance" 
      :skeleton-loading="skeletonLoading"
      :selected-date="selectedDate"
    />

    <!-- <AttendanceLogs :date-range="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" />
  <AttendanceLogs :date-range="dateRange" v-if="dateRange" /> -->
  
    <AttendanceLogs 
      :date-range="dateRange" 
      :employee-attendance="attendance" 
      :employee-schedule="schedule" 
      :skeleton-loading="skeletonLoading" 
      :selected-date="selectedDate"
    />

    <Teleport to="body">
      <AttendanceDateModal v-model="showModal" :type="modalType" @filter="handleFilter" @download="handleDownload" />
    </Teleport>


    <Drawer v-model:visible="showCalendar" position="bottom" style="height: auto" header="View Data by Date Range"
      class="rounded-t-2xl   max-w-[768px]     " :block-scroll="true">
      <DateRangePicker v-model:start="dateHolder[0]" v-model:end="dateHolder[1]" label="Custom Range" />

      <Button label="Apply" class="w-full mt-2" @click="handleFilter" />
    </Drawer>

    <Drawer v-model:visible="showResolveDrawer" class="rounded-t-2xl   max-w-[768px]     "
      :pt="{ content: { style: 'padding:0' } }" :dismissable="false" position="bottom" style="height: auto"
      header="Attendance Request" :block-scroll="true" :style="{ maxHeight: '90vh' }">
      <AttendanceResolveDrawer />
    </Drawer>
  </div>
</template>
