<script lang="ts" setup>

import { useDateFormat } from '@vueuse/core';
// import { set } from 'lodash';
import { computed, ref, useTemplateRef, watch } from 'vue';



interface Props {
    start?: string | Date |  null,
    end?: string | Date | null,
    error?: string | string[] | null,
    label?: string,
    id?: string
}

const props = withDefaults(defineProps<Props>(), {
    error: null,
    label: 'Date Period',
    id: 'company'
})
const emit = defineEmits(["update:start", "update:end", "dateSelectChange"])



const dates = ref()

watch(dates, (val) => {
    if(Array.isArray(val)) {
        emit('update:start', val[0])
        emit('update:end', val[1])
    }

})

watch([() => props.start, () => props.end], () => {
    dates.value = [
        props.start,
        props.end
    ]
})


// const op = useTemplateRef('op')

const selectedDate = computed(() => {

    if(Array.isArray(dates.value)) {
        const date1 = useDateFormat(dates.value[0], 'MM/DD/YYYY').value
        const date2 = useDateFormat(dates.value[1], 'MM/DD/YYYY').value


        return `${date1} - ${date2.includes('NaN') ? '' : date2}`
    }
    return ''
})

const selectedDateOption = ref();
const dateOptions = ref([
    { name: 'Payroll cut-off for the 15th of the Month', code: 'payroll15th' },
    { name: 'Payroll cut-off for the End of the Month', code: 'payrollEnd' },
    { name: 'This Month', code: 'thisMonth' },
    { name: 'Custom Date range', code: 'custom' },
]);

watch(selectedDateOption, (val) => {
    if(val.code === 'payroll15th') {

        let month = new Date().getMonth() - 1
        let year = new Date().getFullYear()
        if(month < 0) {
            month = 11
            year = year - 1
        }

        dates.value = [
            new Date(year, month, 21),
            new Date(new Date().getFullYear(), new Date().getMonth(), 5)
        ]
    } else if(val.code === 'payrollEnd') {
        dates.value = [
            new Date(new Date().getFullYear(), new Date().getMonth(), 6),
            new Date(new Date().getFullYear(), new Date().getMonth(), 20)
        ]
    } else if(val.code === 'thisMonth') {
        dates.value = [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
        ]
    } else {
        dates.value = null
    }
})



const setToCustom = () => {
    selectedDateOption.value = dateOptions.value.find((option) => option.code === 'custom')
}

</script>


<template>
    <InputWrapper
        class="flex flex-col gap-2 w-full"
        :field="id"
        :label="label"
        :error-message="error"
      >
        <!-- <div class="border border-gray-300 px-3 py-2 bg-white rounded-md hover:cursor-pointer hover:border-gray-400" @click="op?.toggle" >
             {{ selectedDate || 'Select Date' }}
        </div> -->

        <!-- <Popover ref="op"> -->
            <div class="flex gap-2 ">
                <div>
                    <Listbox v-model="selectedDateOption" :options="dateOptions" optionLabel="name" :pt="{ root: '!border-0 !shadow-none', listContainer: '!overflow-visible' }" class="w-full" />
                </div>
                <DatePicker
                    v-model="dates"
                    selectionMode="range"
                    :numberOfMonths="1"
                    :manualInput="false"
                    :invalid="!!error"
                    :inline="true"
                    @value-change="setToCustom"
                    @date-select="emit('dateSelectChange')"
                />
            </div>

        <!-- </Popover> -->

      </InputWrapper>
</template>
