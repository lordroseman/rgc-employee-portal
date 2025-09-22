<script setup lang="ts">
import AttendanceResolveDrawer from '~/components/attendance/AttendanceResolveDrawer.vue';


const dateRange = ref(false);
const showModal = ref(false);
const showCalendar = ref(false);
const showResolveDrawer = ref(false);

const modalType = ref("");

function openDownloadModal() {
  modalType.value = "download"
  showModal.value = true
}

function openFilterModal() {
  modalType.value = "filter_range"
  showModal.value = true
}

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

const config = useRuntimeConfig();
const dateHolder = ref([null, null]);

</script>

<template>
  
  <Message severity="error" :closable="false" class="relative mb-3 pr-10 pointer" @click="showResolveDrawer = true" v-if="config.public.stage === 'development'">
    Some attendance records need to be resolved.
    <i
      class="pi pi-arrow-right absolute right-3 top-1/2 -translate-y-1/2"
      aria-hidden="true"
    />
  </Message>


  <div class="flex items-center justify-between mb-4" v-if="config.public.stage === 'development'">
    <div class="pt-2 pb-2">
      <Button 
        icon="pi pi-briefcase" 
        severity="primary"
        style="font-size: 14px;" 
        label="Work Request"
      />
    </div>

    <div class="flex gap-4 pt-2 pb-2">
      <Button 
        severity="secondary" 
        icon="pi pi-download" 
        variant="text"
        style="font-size: 14px;"
        @click="openDownloadModal" 
      />
      <Button 
        severity="secondary" 
        icon="pi pi-sliders-h" 
        variant="text"
        style="font-size: 14px;"
        @click="showCalendar = true"
        v-if="!dateRange"
      />
      <!-- @click="openFilterModal" -->
      <Button 
        severity="secondary"
        icon="pi pi-calendar"
        variant="text"
        style="font-size: 14px;"
        @click="dateRange = false"
        v-else
      />
    </div>
  </div>

  <!-- <div v-if="dateRange"
    class="flex items-center justify-between mb-6 text-[#FFF] font-bold bg-[#088492] py-1 px-4 rounded"
  >
    <span>AUG 12, 2025 - SEP 25, 2025</span>
    <Button class="!text-[#FFF]" variant="text" label="X"
      @click="dateRange = false"
    />
  </div> -->

  <Message severity="success" :closable="false" class="relative mb-3 pr-10" v-if="dateRange">
    <span>AUG 12, 2025 - SEP 25, 2025</span>
    <i
      class="pi pi-times absolute right-3 top-1/2 -translate-y-1/2"
      aria-hidden="true"
      @click="dateRange = false"
    />
  </Message>

  <SwipeCalender v-if="!dateRange" />  

  <div v-if="!dateRange" class="grid grid-cols-2 gap-3 mb-6 mt-4">
    <Card>
      <template #content>
        <div class="py-0 text-center">
          <!-- Header -->
          <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
            Rendered Hours
          </div>
          <!-- Icon + Value -->
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
              <i class="pi pi-clock text-blue-600" style="font-size: 18px"></i>
            </div>
            <div class="text-xl font-bold">
              8hr 2min
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="py-0 text-center">
          <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
            Late
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-amber-50 px-2 pt-2 pb-1">
              <i class="pi pi-exclamation-triangle text-amber-600" style="font-size: 18px"></i>
            </div>
            <div class="text-xl font-bold">
              0min
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="py-0 text-center">
          <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
            Undertime
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-red-50 px-2 pt-2 pb-1">
              <i class="pi pi-angle-double-down text-red-600" style="font-size: 18px"></i>
            </div>
            <div class="text-xl font-bold">
              3min
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #content>
        <div class="py-0 text-center">
          <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
            Overtime
          </div>
          <div class="flex items-center gap-3">
            <div class="rounded-full bg-purple-50 px-2 pt-2 pb-1">
              <i class="pi pi-plus-circle text-purple-600" style="font-size: 18px"></i>
            </div>
            <div class="text-xl font-bold">
              0min
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
  
  <!-- <AttendanceCard :date-range="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" /> -->


  <Teleport to="body">
      <AttendanceDateModal v-model="showModal" :type="modalType"
        @filter="handleFilter"
        @download="handleDownload"
      />
  </Teleport>

  
  <Drawer v-model:visible="showCalendar" position="bottom" style="height: auto" header="View Data by Date Range" :block-scroll="true">
    <DateRangePicker
      label="Custom Range"
      v-model:start="dateHolder[0]"
      v-model:end="dateHolder[1]"
    />

    <Button label="Apply" class="w-full mt-2" @click="handleFilter" />
  </Drawer>

  <Drawer class="rounded-2xl rounded-b-none" :pt="{ content: { style: 'padding:0' } }" v-model:visible="showResolveDrawer" :dismissable="false" position="bottom" style="height: auto" header="Attendance Request" :block-scroll="true" :style="{ maxHeight: '90vh' }">
      <AttendanceResolveDrawer />
  </Drawer>

</template>
