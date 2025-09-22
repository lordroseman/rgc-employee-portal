<script setup lang="ts">
import { useDateFormat, useDebounceFn } from "@vueuse/core";

const config = useRuntimeConfig();
const loading = useLoading()
const skeletonLoading = ref(false);
const { format } = useCurrencyFormat('en-PH', 'PHP')

const employeePayslipStore = useEmployeePayslipStore();
const { employeePayslip } = storeToRefs(employeePayslipStore);

const loadEmployeePayslip = useDebounceFn(async () => {
    await employeePayslipStore.getEmployeePayslip(false);
}, 300);

onMounted(async () => {
    skeletonLoading.value = true;
    await loadEmployeePayslip();
    skeletonLoading.value = false;
});
const showSalary = ref(false)          // start hidden

function toggleSalary() {
  showSalary.value = !showSalary.value
}
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
    <div class="flex items-center justify-between py-2 gap-4">
        <div>
            <Button label="Download Payslip" severity="info" icon="pi pi-download" v-if="config.public.stage === 'development'" />
        </div>
      
        <Button
            class="inline-flex items-center rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring"
            variant="text"
            :aria-pressed="showSalary ? 'true' : 'false'"
            :title="showSalary ? 'Hide amounts' : 'Show amounts'"
            @click="toggleSalary"
        >
            <i :class="['pi', showSalary ? 'pi-eye' : 'pi-eye-slash', '!text-[20px] text-gray-500']"></i>
        </Button>
    </div>

    <!-- <PayslipCard :employeePayslip="employeePayslip?.[0]" :show-salary="showSalary" :skeleton-loading="skeletonLoading" />

    <PayslipHistory :employeePayslip="employeePayslip" :show-salary="showSalary" :skeleton-loading="skeletonLoading" /> -->

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1">
            <PayslipCard
            :employeePayslip="employeePayslip?.[0]"
            :show-salary="showSalary"
            :skeleton-loading="skeletonLoading"
            />
        </div>
        <div class="md:col-span-2">
            <PayslipHistory
            :employeePayslip="employeePayslip"
            :show-salary="showSalary"
            :skeleton-loading="skeletonLoading"
            />
        </div>
    </div>
</template>
