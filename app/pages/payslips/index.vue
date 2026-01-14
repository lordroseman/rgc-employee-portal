<script setup lang="ts"> 

definePageMeta({
    title: 'Payslips'
})

useHead({
    title: 'Payslips | My Portal'
})
 
const skeletonLoading = ref(false);


const employeePayslipStore = useEmployeePayslipStore();
const { employeePayslip } = storeToRefs(employeePayslipStore);
 

const refresh = async (reload = false) => {
    skeletonLoading.value = true;
   await employeePayslipStore.getEmployeePayslip(false, reload);
    skeletonLoading.value = false;
};

onMounted(async () => {
    await refresh();
});
const showSalary = ref(false)          // start hidden

function toggleSalary() {
    showSalary.value = !showSalary.value
}
</script>

<template>
    <div class="relative">
      <PullToRefresh :disabled="skeletonLoading" @refresh="refresh(true)">

        <div class="grid grid-cols-1 gap-6">
            <div>
                <Card>

                    <template #header>
                        <div class="flex items-center justify-between px-4 pt-4 gap-4">

                            <Button label="Download Payslip" severity="contrast" variant="text" icon="pi pi-download" />

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
        </PullToRefresh>
    </div>
</template>
