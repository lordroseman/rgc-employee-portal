<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";



definePageMeta({
    title: 'Payslips'
})

useHead({
    title: 'Payslips | My Portal'
})

const config = useRuntimeConfig();
const skeletonLoading = ref(false);


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
    <div class="relative">
        <!-- <div class="w-full flex pt-2 pb-2">
            <DateRangePicker
                label="Custom Range"
                v-model:start="dateHolder[0]"
                v-model:end="dateHolder[1]"
                class="w-full"
            />
    </div> -->


        <!-- <PayslipCard :employeePayslip="employeePayslip?.[0]" :show-salary="showSalary" :skeleton-loading="skeletonLoading" />

    <PayslipHistory :employeePayslip="employeePayslip" :show-salary="showSalary" :skeleton-loading="skeletonLoading" /> -->

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="md:col-span-1 ">
                <Card>

                    <template #header>
                        <div class="flex items-center justify-between px-4 pt-4 gap-4">

                            <Button
v-if="config.public.stage === 'development'" label="Download Payslip"
                                severity="contrast" variant="text" icon="pi pi-download" />

                            <Button
                                class="inline-flex items-center rounded p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring"
                                variant="text" :aria-pressed="showSalary ? 'true' : 'false'"
                                :title="showSalary ? 'Hide amounts' : 'Show amounts'" @click="toggleSalary">
                                <i
                                    :class="['pi', showSalary ? 'pi-eye' : 'pi-eye-slash', '!text-[20px] text-gray-500']" />
                            </Button>
                        </div>
                    </template>

                    <template #content>
                        <PayslipCard
:employee-payslip="employeePayslip?.[0]" :show-salary="showSalary"
                            :skeleton-loading="skeletonLoading" />
                    </template>
                </Card>
            </div>



            <div class="md:col-span-2">
                <PayslipHistory
:employee-payslip="employeePayslip" :show-salary="showSalary"
                    :skeleton-loading="skeletonLoading" />
            </div>
        </div>
    </div>
</template>
