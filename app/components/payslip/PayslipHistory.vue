<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import type { Payslip } from '~/types/payslip'
import PayslipDrawer from "./PayslipDrawer.vue";
const { format } = useCurrencyFormat('en-PH', 'PHP')
const maskChar = '•'

// defineProps tells Vue this component accepts a prop
const props = defineProps<{
  employeePayslip: Payslip[] | null,
  showSalary?: boolean | false | undefined
  skeletonLoading?: boolean | false | undefined
}>()

function display(value: string): string {
  const s = String(value)
  if (props.showSalary) return s

  return s
    .replace(/\d/g, maskChar) // mask digits
    .replace(/[.,]/g, '')     // remove comma and dot
}

const historyItems = computed(() => (props.employeePayslip ?? []).slice(1))
const showResolveDrawer = ref(false)
const selectedPayslip = ref<Payslip | null>(null)

function openSlip(slip: Payslip) {
  selectedPayslip.value = slip
  showResolveDrawer.value = true
}

</script>

<template>
    <Card
class="mb-6" 
        :pt="{
                    body: { style: 'padding: 0 !important;' }
        }"
    >
        <template #header>
            <div class="flex items-center justify-between px-4 py-2 border-b border-slate-200">
                <div class="flex items-center gap-2">
                <div class="pt-1">
                    <i class="pi pi-receipt text-[#05B34D]"/>
                </div>
                <div>
                    <h2 class="text-lg font-medium">Payslip History</h2>
                </div>
                </div>
            </div>
        </template>

        <!-- <template #content>
        <div class="border-t border-slate-200"></div>
        <div class="flex items-center p-4 gap-3">
            
            <div class="w-12 flex flex-col items-center pt-1">
                <div class="text-xs font-medium text-gray-500">AUG</div>
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
            <div v-if="skeletonLoading" class="p-4">
                <div
                    v-for="i in 3"
                    :key="i"
                    class=""
                >
                    <div v-if="i !== 1" class="border-t border-slate-200"/>
                    <div class="flex items-center p-4 gap-3 border-b border-slate-200 last:border-b-0">
                        <div class="w-12 flex flex-col items-center pt-1">
                            <Skeleton class="mb-2 rounded-full"/>
                        </div>

                        <!-- Right: amounts -->
                        <div class="flex-1 text-left">
                        <div class="text-lg font-bold text-gray-800">
                            <Skeleton width="5rem" class="mb-2"/>
                        </div>

                        <div class="flex items-center mt-1 text-sm gap-5">
                            <div class="flex items-center text-green-600">
                                <span class="font-medium">
                                    <Skeleton width="5rem" class="mb-2"/>
                                </span>
                            </div>

                            <div class="flex items-center text-red-600">
                                <span class="font-medium">
                                <Skeleton width="5rem" class="mb-2"/>
                                </span>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-for="(slip, index) in historyItems"
                v-else
                :key="slip.payslip_id ?? index"
                @click="openSlip(slip)"
            >
                <div v-if="index !== 0" class="border-t border-slate-200" />
                <div class="flex items-center p-4 gap-3 border-b border-slate-200 last:border-b-0">
                    <div class="w-12 flex flex-col items-center pt-1">
                    <div class="text-xs font-medium text-gray-500">
                        {{ useDateFormat(slip.payroll_date, 'MMM').value.toUpperCase() }}
                    </div>
                    <div class="text-lg font-bold text-gray-800">
                        {{ useDateFormat(slip.payroll_date, 'DD').value }}
                    </div>
                    </div>

                    <!-- Right: amounts -->
                    <div class="flex-1 text-left">
                    <div class="text-lg font-bold text-gray-800">
                        {{ display(format(slip.net_pay ?? 0)) }}
                    </div>

                    <div class="flex items-center mt-1 text-sm gap-5">
                        <div class="flex items-center text-green-600">
                        <i class="pi pi-sort-up-fill mr-1" style="font-size: 10px" />
                        <span class="font-medium">
                            {{ display(format(slip.payslip_details?.income?.total ?? 0)) }}
                        </span>
                        </div>

                        <div class="flex items-center text-red-600">
                        <i class="pi pi-sort-down-fill mr-1" style="font-size: 10px" />
                        <span class="font-medium">
                            {{ display(format(slip.payslip_details?.deduction?.total ?? 0)) }}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <Drawer    v-model:visible="showResolveDrawer"  class="rounded-t-2xl   max-w-[768px]     " :pt="{ content: { style: 'padding:0' } }" :dismissable="false" position="bottom" style="height: auto" header="Payslip Details" :block-scroll="true" :style="{ maxHeight: '90vh' }">
        <PayslipDrawer v-model="showResolveDrawer" :payslip="selectedPayslip" />
    </Drawer>
</template>