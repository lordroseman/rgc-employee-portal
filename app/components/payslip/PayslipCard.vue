<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import type { Payslip } from '~/types/payslip'

const { format } = useCurrencyFormat('en-PH', 'PHP')
const maskChar = '•'

const props = defineProps<{
    employeePayslip: Payslip | null | undefined,
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

const incomeItems = computed(() =>
    (props.employeePayslip?.payslip_details?.income?.details || []).filter(i => Number(i.amount) > 0)
)

const deductionItems = computed(() =>
    (props.employeePayslip?.payslip_details?.deduction?.details || []).filter(i => Number(i.amount) > 0)
)
</script>

<template>
    <div class="space-y-4 pb-2">
        <!-- Period & Pay Day — compact info row -->
        <div class="flex items-center justify-between gap-4 px-1">
            <div class="flex items-center gap-2 min-w-0">
                <i class="pi pi-calendar text-gray-400 !text-sm shrink-0" />
                <div v-if="skeletonLoading">
                    <Skeleton width="9rem" height="0.85rem" />
                </div>
                <span v-else class="text-xs text-gray-500 truncate">
                    {{ props.employeePayslip && useDateFormat(props.employeePayslip.period_from, "MMM DD") }}
                    – {{ props.employeePayslip && useDateFormat(props.employeePayslip.period_to, "MMM DD, YYYY") }}
                </span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
                <i class="pi pi-credit-card text-gray-400 !text-sm" />
                <div v-if="skeletonLoading">
                    <Skeleton width="6rem" height="0.85rem" />
                </div>
                <span v-else class="text-xs text-gray-500">
                    {{ props.employeePayslip && useDateFormat(props.employeePayslip.payroll_date, "MMM DD, YYYY") }}
                </span>
            </div>
        </div>

        <!-- ══════ NET PAY — Hero Section ══════ -->
        <div class="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-indigo-200/60 px-5 py-5 text-center">
            <div class="text-[11px] font-medium uppercase tracking-widest text-indigo-400 mb-1">Net Pay</div>
            <div class="text-3xl font-semibold tracking-tight leading-tight text-indigo-900">
                <Skeleton v-if="skeletonLoading" width="10rem" height="2rem" class="mx-auto" />
                <span v-else>
                    {{ display(props.employeePayslip ? format(props.employeePayslip.net_pay) : '₱ 0.00') }}
                </span>
            </div>
        </div>

        <!-- ══════ Income & Deduction Summary Row ══════ -->
        <div class="grid grid-cols-2 gap-3">
            <!-- Income summary pill -->
            <div class="rounded-lg bg-emerald-50 px-3 py-3 flex flex-col items-center">
                <div class="flex items-center gap-1 mb-0.5">
                    <i class="pi pi-arrow-up text-emerald-600 !text-xs" />
                    <span class="text-[10px] font-medium uppercase tracking-wide text-emerald-700">Income</span>
                </div>
                <div class="text-base font-semibold text-emerald-700">
                    <Skeleton v-if="skeletonLoading" width="4.5rem" height="1.1rem" />
                    <span v-else>
                        {{ display(props.employeePayslip ? format(props.employeePayslip.payslip_details?.income?.total) : '₱ 0.00') }}
                    </span>
                </div>
            </div>
            <!-- Deduction summary pill -->
            <div class="rounded-lg bg-red-50 px-3 py-3 flex flex-col items-center">
                <div class="flex items-center gap-1 mb-0.5">
                    <i class="pi pi-arrow-down text-red-600 !text-xs" />
                    <span class="text-[10px] font-medium uppercase tracking-wide text-red-700">Deductions</span>
                </div>
                <div class="text-base font-semibold text-red-700">
                    <Skeleton v-if="skeletonLoading" width="4.5rem" height="1.1rem" />
                    <span v-else>
                        {{ display(props.employeePayslip ? format(props.employeePayslip.payslip_details?.deduction?.total) : '₱ 0.00') }}
                    </span>
                </div>
            </div>
        </div>

        <!-- ══════ Breakdown Details ══════ -->
        <div v-if="!skeletonLoading" class="space-y-4">
            <!-- Income Breakdown -->
            <div v-if="incomeItems.length" class="rounded-lg border border-emerald-100 overflow-hidden">
                <div class="bg-emerald-50/60 px-4 py-2 flex items-center gap-2">
                    <i class="pi pi-arrow-up text-emerald-600 !text-xs" />
                    <span class="text-xs font-medium uppercase tracking-wide text-emerald-700">Income Breakdown</span>
                </div>
                <div class="divide-y divide-gray-100">
                    <div
                        v-for="(item, index) in incomeItems"
                        :key="item.id ?? index"
                        class="flex items-center justify-between px-4 py-2.5"
                    >
                        <span class="text-xs text-gray-600 uppercase">{{ item.label || item.item_label }}</span>
                        <span class="text-sm font-medium text-gray-800 tabular-nums">{{ display(format(item.amount)) }}</span>
                    </div>
                </div>
            </div>

            <!-- Deduction Breakdown -->
            <div v-if="deductionItems.length" class="rounded-lg border border-red-100 overflow-hidden">
                <div class="bg-red-50/60 px-4 py-2 flex items-center gap-2">
                    <i class="pi pi-arrow-down text-red-600 !text-xs" />
                    <span class="text-xs font-medium uppercase tracking-wide text-red-700">Deduction Breakdown</span>
                </div>
                <div class="divide-y divide-gray-100">
                    <div
                        v-for="(item, index) in deductionItems"
                        :key="item.id ?? index"
                        class="flex items-center justify-between px-4 py-2.5"
                    >
                        <span class="text-xs text-gray-600 uppercase">{{ item.label || item.item_label }}</span>
                        <span class="text-sm font-medium text-gray-800 tabular-nums">{{ display(format(item.amount)) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>