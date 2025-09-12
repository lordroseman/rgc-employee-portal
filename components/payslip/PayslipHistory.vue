<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import type { Payslip } from '~/types/payslip'
import PayslipDrawer from "./PayslipDrawer.vue";
const { format } = useCurrencyFormat('en-PH', 'PHP')

// defineProps tells Vue this component accepts a prop
const props = defineProps<{
  employeePayslip: Payslip[] | null
}>()

const historyItems = computed(() => (props.employeePayslip ?? []).slice(1))
const showResolveDrawer = ref(false)
const selectedPayslip = ref<Payslip | null>(null)

function openSlip(slip: Payslip) {
  selectedPayslip.value = slip
  showResolveDrawer.value = true
}

</script>

<template>
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

        <!-- <template #content>
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
                <i class="pi pi-sort-up-fill mr-1" style="font-size: 10px"></i>
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
                <i class="pi pi-sort-up-fill mr-1" style="font-size: 10px"></i>
                <span class="font-medium">₱5,000.12</span>
                </div>

                <div class="flex items-center text-red-600">
                <i class="pi pi-sort-down-fill mr-1" style="font-size: 10px"></i>
                <span class="font-medium">₱2,000.55</span>
                </div>
            </div>
            </div>
        </div>


        </template> -->

        <template #content>
            <div
                v-for="(slip, index) in historyItems"
                :key="slip.payslip_id ?? index"
                @click="openSlip(slip)"
            >
                <div class="border-t border-gray-300" />
                <div class="flex items-center p-4 gap-3 border-b border-gray-300 last:border-b-0">
                    <div class="w-12 flex flex-col items-center pt-1">
                    <div class="text-xs font-semibold text-gray-500">
                        {{ useDateFormat(slip.payroll_date, 'MMM').value.toUpperCase() }}
                    </div>
                    <div class="text-lg font-bold text-gray-800">
                        {{ useDateFormat(slip.payroll_date, 'DD').value }}
                    </div>
                    </div>

                    <!-- Right: amounts -->
                    <div class="flex-1 text-left">
                    <div class="text-lg font-bold text-gray-800">
                        {{ format(slip.net_pay ?? 0) }}
                    </div>

                    <div class="flex items-center mt-1 text-sm gap-5">
                        <div class="flex items-center text-green-600">
                        <i class="pi pi-sort-up-fill mr-1" style="font-size: 10px" />
                        <span class="font-medium">
                            {{ format(slip.payslip_details?.income?.total ?? 0) }}
                        </span>
                        </div>

                        <div class="flex items-center text-red-600">
                        <i class="pi pi-sort-down-fill mr-1" style="font-size: 10px" />
                        <span class="font-medium">
                            {{ format(slip.payslip_details?.deduction?.total ?? 0) }}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <Drawer class="rounded-2xl rounded-b-none" :pt="{ content: { style: 'padding:0' } }" v-model:visible="showResolveDrawer" :dismissable="false" position="bottom" style="height: auto" header="Payslip Details" :block-scroll="true" :style="{ maxHeight: '90vh' }">
        <PayslipDrawer v-model="showResolveDrawer" :payslip="selectedPayslip" />
    </Drawer>
</template>