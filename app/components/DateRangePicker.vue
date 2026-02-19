<script lang="ts" setup>

const props = defineProps<{
  modelValue: (Date | null)[];
}>();

const emit = defineEmits(["update:modelValue"]);

const selectedDateOption = ref();
const dateOptions = ref([
    { name: 'Payroll cut-off for the 15th of the Month', code: 'payroll15th' },
    { name: 'Payroll cut-off for the End of the Month', code: 'payrollEnd' },
    { name: 'This Month', code: 'thisMonth' },
    { name: 'Custom Date range', code: 'custom' },
]);

const dateHolder = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(selectedDateOption, (val) => {
    if (!val) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    if (val.code === 'payroll15th') {
        let prevMonth = month - 1;
        let prevYear = year;
        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear = year - 1;
        }
        dateHolder.value = [
            new Date(prevYear, prevMonth, 21),
            new Date(year, month, 5),
        ];
    } else if (val.code === 'payrollEnd') {
        dateHolder.value = [
            new Date(year, month, 6),
            new Date(year, month, 20),
        ];
    } else if (val.code === 'thisMonth') {
        dateHolder.value = [
            new Date(year, month, 1),
            new Date(year, month + 1, 0),
        ];
    } else {
        dateHolder.value = [];
    }
});
 
</script>


<template>
       <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Date Range Preset</label>
        <Select
          v-model="selectedDateOption"
          :options="dateOptions"
          option-label="name"
          placeholder="Select a date range"
          class="w-full"
        />
      </div>

      <DatePicker v-model="dateHolder" inline :number-of-months="2" selection-mode="range" class="w-full" />
</template>
