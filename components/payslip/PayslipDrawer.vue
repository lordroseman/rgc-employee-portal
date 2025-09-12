<script setup lang="ts">
import type { Payslip } from '~/types/payslip'

const props = defineProps<{
  modelValue: boolean
  payslip: Payslip | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function closeDrawer() {
  emit('update:modelValue', false)
}

</script>

<template>
    <div class="p-4">
        <PayslipCard :employeePayslip="payslip" />
    </div>

    <!-- Actions -->
    <div class="mt-8 w-full sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <Button label="Download Payslip" severity="info" class="w-full" icon="pi pi-download" />
    </div>

</template>