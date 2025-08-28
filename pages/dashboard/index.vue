<script setup lang="ts">

const dateRange = ref(false);

</script>

<template>
  <Card class="mb-6" style="border-radius: 6px;">
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
  </Card>

  <Card class="mb-2"
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

  <AttendanceCard :date-range="dateRange" />
  
  <Card class="border border-gray-300 mb-6 no-padding-card" style="border-radius: 6px;">
    <template #header>
      <div class="flex items-center justify-between px-4 py-2 border-b border-gray-300">
        <div class="flex items-center gap-2">
          <div class="pt-1">
            <i class="pi pi-receipt text-[#05B34D]"></i>
          </div>
          <div>
            <h2 class="text-lg font-semibold">Payslip Overview</h2>
          </div>
        </div>

        <div class="cursor-pointer">
          <i class="pi pi-eye text-gray-500 hover:text-gray-700 pt-1" style="font-size: 18px"></i>
        </div>
      </div>
    </template>

    <template #content>
      <div class="p-4">

        <div class="text-sm text-gray-500 mb-3 text-right">
          <span class="font-medium text-gray-700">AUGUST 26, 2025</span>
        </div>

        <Card class="mb-4" style="border-radius: 4px;">
          <template #content>
            <div class="p-3 text-right">
              <div class="text-xs font-semibold text-gray-500">NET PAY</div>
              <div class="text-xl font-bold text-gray-800">₱3,000.53</div>
            </div>
          </template>
        </Card>

        <div class="flex gap-4">
          <!-- Total Salary -->
          <Card class="flex-1" style="border-radius: 6px;">
            <template #content>
              <div class="p-3 text-right">
                <div class="text-xs font-semibold text-gray-500">TOTAL SALARY</div>
                <div class="text-xl font-bold text-green-700">₱5,000.12</div>
              </div>
            </template>
          </Card>

          <!-- Total Deduction -->
          <Card class="flex-1" style="border-radius: 6px;">
            <template #content>
              <div class="p-3 text-right">
                <div class="text-xs font-semibold text-gray-500">TOTAL DEDUCTION</div>
                <div class="text-xl font-bold text-red-600">₱2,000.55</div>
              </div>
            </template>
          </Card>
        </div>

      </div>

      <div class="border-t border-gray-300"></div>
      <div class="flex items-center p-4 gap-3">
        
        <div class="w-12 flex flex-col items-center pt-1">
          <div class="text-xs font-semibold text-gray-500">AUG</div>
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

      <div class="border-t border-gray-300"></div>
      <div class="flex items-center p-4 gap-3">
        
        <div class="w-12 flex flex-col items-center pt-1">
          <div class="text-xs font-semibold text-gray-500">AUG</div>
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
      </div>


    </template>
  </Card>


  

  <Card class="border border-gray-300 mb-6 no-padding-card" style="border-radius: 6px;">
    <template #header>
      <div class="flex items-center gap-2 px-4 py-2 border-b border-gray-300">
        <div class="pt-1">
          <i class="pi pi-send text-[#A30542]"></i>
        </div>
        <div>
          <h2 class="text-lg font-semibold">Pending Request</h2>
        </div>
      </div>
    </template>

    <template #content>

      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-1">
          <div class="font-bold text-xs">AUGUST 27, 2025</div>
          <Tag :style="{ backgroundColor: '#544991', color: '#fff' }" value="Official Business" style="font-size: 10px;" />
        </div>
        <div class="text-[#4D4D4D] text-sm">
          Thursday
        </div>
      </div>

      <div class="border-t border-gray-300"></div>
      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-1">
          <div class="font-bold text-xs">AUGUST 28, 2025</div>
          <Tag :style="{ backgroundColor: '#544991', color: '#fff' }" value="Official Business" style="font-size: 10px;" />
        </div>
        <div class="text-[#4D4D4D] text-sm">
          Friday
        </div>
      </div>
      
      <div class="border-t border-gray-300"></div>
      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-1">
          <div class="font-bold text-xs">AUGUST 29, 2025</div>
          <Tag :style="{ backgroundColor: '#852F01', color: '#fff' }" value="Overtime" style="font-size: 10px;" />
        </div>
        <div class="text-[#4D4D4D] text-sm">
          Saturday
        </div>
      </div>
      
      <div class="border-t border-gray-300"></div>
      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-1">
          <div class="font-bold text-xs">SEPTEMBER 03, 2025</div>
          <Tag :style="{ backgroundColor: '#544991', color: '#fff' }" value="Official Business" style="font-size: 10px;" />
        </div>
        <div class="text-[#4D4D4D] text-sm">
          Saturday
        </div>
      </div>
      
      <div class="border-t border-gray-300"></div>
      <div class="flex items-start justify-between p-4">
        <div class="flex flex-col items-start gap-1">
          <div class="font-bold text-xs">SEPTEMBER 05, 2025</div>
          <Tag :style="{ backgroundColor: '#057BA3', color: '#fff' }" value="Leave" style="font-size: 10px;" />
        </div>
        <div class="text-[#4D4D4D] text-sm">
          Monday
        </div>
      </div>

      
      <div class="border-t border-gray-300"></div>
      <div class="flex items-start justify-center">
        <Button label="See More" severity="info" variant="text" />
      </div>

    </template>
  </Card>
</template>

<style scoped>
  .no-padding-card :deep(.p-card-body) {
    padding: 0 !important;
  }
</style>