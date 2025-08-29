<script setup lang="ts">

const dateRange = ref(false);
const showModal = ref(false);

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
  showModal.value = false;
  // put your filter logic here
}

function handleDownload() {
  console.log("Download clicked")
  // put your download logic here
}
</script>

<template>
  <Card class="mb-4"
    :pt="{
      body: { style: 'padding: 0 !important;background: #BF1D00; border-radius: 6px; color: #fff' }
    }"
  >
    <template #content>
      <div class="flex items-center justify-between gap-3 px-4">
        <span class="text-sm font-semibold">
          Some attendance records need to be resolved.
        </span>

        <Button
          icon="pi pi-arrow-right"
          text
          rounded
          aria-label="Go"
          class="!text-white !shadow-none hover:!bg-white/10"
        />
      </div>
    </template>
  </Card>


  <div class="flex items-center justify-between mb-4">
    <div class="pt-2 pb-2">
      <Button 
        icon="pi pi-send" 
        severity="primary"
        style="font-size: 14px;" 
        label="Work Request"
      />
    </div>

    <div class="flex gap-4 pt-2 pb-2">
      <Button 
        severity="warn" 
        icon="pi pi-download" 
        style="font-size: 14px;"
        @click="openDownloadModal" 
      />
      <Button 
        severity="help" 
        icon="pi pi-sliders-h" 
        style="font-size: 14px;"
        @click="openFilterModal"
        v-if="!dateRange"
      />
      <Button 
        class="!bg-[#088492] !text-white"
        icon="pi pi-calendar" 
        style="font-size: 14px;"
        @click="dateRange = false"
        v-else
      />
    </div>
  </div>

  <div v-if="dateRange"
    class="flex items-center justify-between mb-6 text-[#FFF] font-bold bg-[#088492] py-1 px-4 rounded"
  >
    <span>AUG 12, 2025 - SEP 25, 2025</span>
    <Button class="!text-[#FFF]" variant="text" label="X"
      @click="dateRange = false"
    />
  </div>
  <SwipeCalender v-if="!dateRange" />
    

  <div v-if="!dateRange" class="grid grid-cols-2 gap-3 mb-6 mt-4">
    <Card>
      <template #content>
        <div class="py-0 text-center">
          <!-- Header -->
          <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
            Total Rendered Hours
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
            Total Late
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
            Total Undertime
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
            Total Overtime
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
  
  <AttendanceCard :date-range="dateRange" /><!-- pass dateRange variable here -->
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />
  <AttendanceCard :date-range="dateRange" v-if="dateRange" />


  <Teleport to="body">
      <AttendanceDateModal v-model="showModal" :type="modalType"
        @filter="handleFilter"
        @download="handleDownload"
      />
  </Teleport>
</template>
