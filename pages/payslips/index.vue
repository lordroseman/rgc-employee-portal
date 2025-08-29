<script setup lang="ts">

const dateHolder = ref([null, null]);
</script>

<template>
    <!-- <div class="w-full flex pt-2 pb-2">
            <DateRangePicker
                label="Custom Range"
                v-model:start="dateHolder[0]"
                v-model:end="dateHolder[1]"
                class="w-full"
            />
    </div> -->

    <div class="mb-6 mt-2">
        <div class="flex items-start justify-between gap-6 basis-1/2 mb-4">
            <div>
                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Period Cover</div>
                <div class="text-sm font-bold text-gray-900">AUG 16, 2025 - AUG 31, 2025</div>
            </div>
            <div>
                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Pay Day</div>
                <div class="text-sm font-bold text-gray-900">SEP 21, 2025</div>
            </div>
        </div>
        <Card class="mb-4"
            :pt="{
                body: { style: 'padding: 0 !important;' }
            }"
        >
            <template #content>
                <div class="px-6 py-4 text-right">
                    <div class="text-sm font-semibold text-gray-500">NET PAY</div>
                    <div class="text-xl font-bold text-gray-800">₱3,000.53</div>
                </div>
            </template>
        </Card>

        <div class="flex gap-4">
            <Card class="flex-1" 
                :pt="{
                    body: { style: 'padding: 0 !important;' }
                }"
            >
                <template #content>
                    
                    <div class="px-6 py-4 text-right">
                        <div class="text-xs font-semibold text-gray-500">TOTAL INCOME</div>
                        <div class="text-xl font-bold text-green-700">₱5,000.12</div>
                    </div>

                    <div class="border-t border-gray-300"></div>
                    <div class="px-6 py-4 text-right">
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Basic Salary</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Overtime</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Night Differential</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Holiday</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                    </div>
                    
                </template>
            </Card>

            <Card class="flex-1" style="border-radius: 6px;" 
                :pt="{
                    body: { style: 'padding: 0 !important;' }
                }"
            >
                <template #content>
                    
                    <div class="px-6 py-4 text-right">
                        <div class="text-xs font-semibold text-gray-500">TOTAL DEDUCTION</div>
                        <div class="text-xl font-bold text-red-600">₱2,000.55</div>
                    </div>

                    <div class="border-t border-gray-300"></div>
                    <div class="px-6 py-4 text-right">
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Late</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">Pag-Ibig</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-xs text-gray-500 uppercase">PhilHealth</div>
                            <div class="text-[14px] font-bold">₱5,000.12</div>
                        </div>
                    </div>
                    
                </template>
            </Card>
        </div>
    </div>

    <div class="w-full mb-6">
        <Button label="Download Payslip" severity="info" class="w-full" />
    </div>

    <Card class="border border-gray-300 mb-6" 
        :pt="{
                    body: { style: 'padding: 0 !important;' }
        }"
    >
        <template #header>
            <div class="flex items-center justify-between px-4 py-2 border-b border-gray-300">
                <div class="flex items-center gap-2">
                <div class="pt-1">
                    <i class="pi pi-receipt text-[#05B34D]"></i>
                </div>
                <div>
                    <h2 class="text-lg font-semibold">Payslip History</h2>
                </div>
                </div>
            </div>
        </template>

        <template #content>
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
</template>
