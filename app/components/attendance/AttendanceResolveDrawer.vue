<script setup lang="ts">
import { ref } from "vue";
import Draggable from 'vuedraggable'
import type { FormSubmitEvent } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { type Attendance, AttendanceSchema } from "~/types/attendance";

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

// const date = ref<Date | null>(null)
const resolver = ref(zodResolver(AttendanceSchema));

// interface CalendarDate {
//   day: number
//   month: number
//   year: number
//   today: boolean
//   selectable: boolean
// }

const form = ref<Attendance>({
  date: null, //replace by first date of descripancy later
  logs: [],
  reason: "",
  status: 0,
});

// // Map dates to CSS classes
// const markedDates: Record<string, string> = {
//   "2025-09-01": "px-4 rounded bg-red-200 font-bold",
//   "2025-09-03": "px-4 rounded bg-red-200 font-bold",
//   "2025-09-05": "px-4 rounded bg-red-200 font-bold",
//   "2025-09-10": "px-4 rounded bg-red-200 font-bold",
// }

// const getDateClass = (dateObj: CalendarDate): string => {
//   const key = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`
//   return markedDates[key] ?? ""
// }

type Item = { id: number, time: string }
const items = ref<Item[]>([
  { id: 1, time: '' },
  { id: 2, time: '' },
  { id: 3, time: '' },
  { id: 4, time: '' }
])
const labels = ['IN', 'BREAK OUT', 'BREAK IN', 'OUT'];

const TIME_FORMATS = [
  'hh:mm A', 'h:mm A',
  'hh:mm:ss A', 'h:mm:ss A',
  'HH:mm', 'HH:mm:ss'
];

function to24h(time: string): string {
  const d = dayjs(time, TIME_FORMATS, true); // strict parsing
  if (!d.isValid()) throw new Error(`Invalid time: "${time}"`);
  return d.format('HH:mm:ss');
}

const onFormSubmit = async ({  values, errors } : FormSubmitEvent) => {
  console.log('values', values)
  console.log('errors', errors)

  const mergedValues = {
    ...values,
    logs: items.value.map(l => ({ ...l, time: to24h(l.time) })),
    date: "2025-09-06"
  }

  console.log('mergedValues', mergedValues)
  const res = AttendanceSchema.safeParse(mergedValues)
  if (!res.success) {
    console.error(res.error.format())
    return
  }


  // safe validated data
  console.log('submit data:', res.data)
}
const time = ref('07:00 AM') // initial value
const showPicker = ref(false);
const activeIndex = ref<number | null>(null)

function openPicker(i: number) {
  activeIndex.value = i
  time.value = items.value[i]?.time || '07:00 AM'
  showPicker.value = true
}

function applyInputTime(val: string) {
  if (activeIndex.value == null) return
    items.value[activeIndex.value]!.time = val 
}

</script>

<template>

  <Form
    id="attendance_request_form" 
    :initial-values="form"
    :resolver="resolver"
    @submit="onFormSubmit"
  >
    <!-- <div class="flex justify-center">
        <Calendar 
            v-model="date" 
            inline
        >
            <template #date="slotProps">
            <div
                :class="[
                  'p-2 rounded-md',
                  getDateClass(slotProps.date) ? getDateClass(slotProps.date) : ''
                ]"
            >
                {{ slotProps.date.day }}
            </div>
            </template>
        </Calendar>
    </div> -->

    <div class="px-4 py-2">
      <div>
          <Select
              id="leaveType"
              class="w-full"
              name="leave_type"
              :options="[
                { id: '1', title: 'SEPTEMBER 01, 2025' },
                { id: '2',  title: 'SEPTEMBER 03, 2025' },
                { id: '3',  title: 'SEPTEMBER 05, 2025' },
                { id: '4',  title: 'SEPTEMBER 06, 2025' }
              ]"
              option-label="title"
              option-value="id"
              placeholder="Select Date"
          />
      </div>

      <div class="mt-8 text-center">
          <p class="mb-4 text-sm text-gray-500 italic">
              💡 Reorder your attendance by dragging the inputs on the left.
          </p>
          <div class="flex justify-center mb-2 gap-4 w-full items-center">
              <!-- LEFT: draggable list -->
              <Draggable
                  v-model="items"
                  item-key="id"
                  ghost-class="drag-ghost"
                  chosen-class="drag-chosen"
                  drag-class="drag-dragging"
                  class="flex-1 pr-2"
              >
                  <template #item="{ element, index }">
                      <div class="mb-3 border border-gray-400 rounded-md bg-white cursor-grab touch-pan-y select-none">
                          <InputText v-model="element.time" class="w-full" readonly="true" @click="openPicker(index)" />
                      </div>
                  </template>
              </Draggable>

              <!-- RIGHT: fixed labels -->
              <div class="flex flex-col whitespace-nowrap">
                  <div
                      v-for="text in labels"
                      :key="text"
                      class="h-11 flex items-center mb-3 font-medium text-gray-800"
                  >
                      <i class="pi pi-angle-double-right text-gray-400 pr-4"/> {{ text }}
                  </div>
              </div>
          </div>
      </div>

      <div class="mt-4">
        <div class="field">
            <label for="reason" class="block font-medium">Reason</label>
            <Textarea
                id="reason"
                name="reason"
                rows="2"
                auto-resize
                placeholder=""
                class="w-full"
            />
        </div>
      </div>

      <div>
        <TimePicker v-model="time" v-model:visible="showPicker" @update:model-value="applyInputTime" />
      </div>
    </div>

    <div class="mt-4 sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <div class="w-full">
            <Button type="submit" label="Submit" icon="pi pi-send" class="w-full" form="attendance_request_form" />
        </div>
    </div>
  </Form>
</template>

<style scoped>
/* Make text bigger */
:deep(.p-datepicker td > span) {
  font-size: 1.2rem;
  font-weight: 600;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
}

/* Highlight selected dates */
:deep(.p-datepicker td.p-highlight > span) {
  background-color: #16a34a; /* green-600 */
  color: #fff !important;
}

/* Hover effect */
:deep(.p-datepicker td > span:hover) {
  background-color: #22c55e; /* lighter green */
  color: #fff;
  cursor: pointer;
}

/* Header style */
:deep(.p-datepicker-title) {
  font-size: 1.4rem;
  font-weight: bold;
}
</style>