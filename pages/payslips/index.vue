<script setup lang="ts">
import { useDateFormat, useDebounceFn } from "@vueuse/core";
const loading = useLoading()
const { format } = useCurrencyFormat('en-PH', 'PHP')

const employeePayslipStore = useEmployeePayslipStore();
const { employeePayslip } = storeToRefs(employeePayslipStore);

const loadEmployeePayslip = useDebounceFn(async () => {
    await employeePayslipStore.getEmployeePayslip();
}, 300);

onMounted(async () => {
    loading.value = true;
    await loadEmployeePayslip();
    loading.value = false;
});

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

    <PayslipCard :employeePayslip="employeePayslip?.[0]" />
    
    <div class="w-full mb-6">
        <Button label="Download Payslip" severity="info" class="w-full" icon="pi pi-download" />
    </div>

    <PayslipHistory :employeePayslip="employeePayslip" />
</template>
