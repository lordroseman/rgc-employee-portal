<script setup lang="ts">
import { useDateFormat, useDebounceFn } from "@vueuse/core";
import type { Payslip } from '~/types/payslip'

const { format } = useCurrencyFormat('en-PH', 'PHP')

const props = defineProps<{
  employeePayslip: Payslip | null | undefined
}>()

</script>  

<template>
    <div class="mb-6 mt-2">
        <div class="flex items-start justify-between gap-6 basis-1/2 mb-4">
            <div>
                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Period Cover</div>
                <div class="text-sm font-bold text-gray-900 uppercase">
                    {{ props.employeePayslip && useDateFormat(props.employeePayslip?.period_from, "MMM DD, YYYY") }} - {{ props.employeePayslip && useDateFormat(props.employeePayslip?.period_to, "MMM DD, YYYY") }}
                </div>
            </div>
            <div>
                <div class="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Pay Day</div>
                <div class="text-sm font-bold text-gray-900">{{ props.employeePayslip && useDateFormat(props.employeePayslip?.payroll_date, "MMM DD, YYYY") }}</div>
            </div>
        </div>
        <Card class="mb-4"
            :pt="{
                body: { style: 'padding: 0 !important;' }
            }"
        >
            <template #content>
                <div class="px-6 py-4 text-right">
                    <div class="flex items-center justify-between">
                        <!-- Left icon -->
                        <i class="pi pi-wallet text-gray-600 !text-4xl" aria-hidden="true"></i>

                        <!-- Right content -->
                        <div class="text-right">
                            <div class="text-sm font-semibold text-gray-500">NET PAY</div>
                            <div class="text-xl font-bold text-gray-800">{{ props.employeePayslip && format(props.employeePayslip?.net_pay) }}</div>
                        </div>
                    </div>
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
                        <div class="flex items-center justify-between">
                            <!-- Left icon -->
                            <i class="pi pi-sort-up-fill text-teal-600 !text-2xl" aria-hidden="true"></i>

                            <!-- Right content -->
                            <div class="text-right">
                                <div class="text-xs font-semibold text-gray-500">TOTAL INCOME</div>
                                <div class="text-xl font-bold text-green-700">{{ props.employeePayslip && format(props.employeePayslip?.payslip_details?.income?.total) }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-300"></div>
                    <div class="px-6 py-4 text-right">
                        <div
                            v-for="(item, index) in props.employeePayslip?.payslip_details?.income?.details || []"
                            :key="item.id ?? index"
                            class="mb-2"
                        >
                            <div class="text-xs text-gray-500 uppercase">{{ item.label || item.item_label }}</div>
                            <div class="text-[14px] font-bold">{{ format(item.amount) }}</div>
                        </div>
                        <!-- <div class="mb-2">
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
                        </div> -->
                    </div>
                    
                </template>
            </Card>

            <Card class="flex-1"
                :pt="{
                    body: { style: 'padding: 0 !important;' }
                }"
            >
                <template #content>
                    
                    <div class="px-6 py-4 text-right">
                        <div class="flex items-center justify-between">
                            <!-- Left icon -->
                            <i class="pi pi-sort-down-fill text-red-600 !text-2xl" aria-hidden="true"></i>

                            <!-- Right content -->
                            <div class="text-right">
                                <div class="text-xs font-semibold text-gray-500">TOTAL DEDUCTION</div>
                                 <div class="text-xl font-bold text-red-600">{{ props.employeePayslip && format(props.employeePayslip?.payslip_details?.deduction?.total) }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-gray-300"></div>
                    <div class="px-6 py-4 text-right">
                        <div
                            v-for="(item, index) in props.employeePayslip?.payslip_details?.deduction?.details || []"
                            :key="item.id ?? index"
                            class="mb-2"
                        >
                            <div class="text-xs text-gray-500 uppercase">{{ item.label || item.item_label }}</div>
                            <div class="text-[14px] font-bold">{{ format(item.amount) }}</div>
                        </div>
                        <!-- <div class="mb-2">
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
                        </div> -->
                    </div>
                    
                </template>
            </Card>
        </div>
    </div>
</template> 