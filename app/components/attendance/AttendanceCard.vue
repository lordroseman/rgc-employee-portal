<script setup lang="ts">
import dayjs from 'dayjs';
import type { Attendance } from '~/types/attendance'

const props = defineProps<{
  dateRange: boolean
  employeeAttendance: Record<string, Attendance> | null | undefined;
  skeletonLoading?: boolean | false | undefined
  selectedDate: string | null
}>();

const activeKey = computed(() => props.selectedDate ?? dayjs().format('YYYY-MM-DD'));
const attendanceForSelectedDate = computed<Attendance | null>(
  () => props.employeeAttendance?.[activeKey.value] ?? null
);

const toHoursMinutes = (value: number | string | null | undefined) => {
  const n = Number(value);
  if (!isFinite(n)) return { hours: 0, minutes: 0 };

  let hours = Math.trunc(n);
  let minutes = Math.round((n - hours) * 60);

  // handle rounding edge case (e.g. 7.999 -> 8:00)
  if (minutes === 60) { hours += 1; minutes = 0; }

  return `${hours}hr ${minutes}min` ;
}

</script>

<template>
    <div v-if="!dateRange" class="grid grid-cols-2 gap-3 mb-6 mt-4">
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <!-- Header -->
                    <div class="text-xs uppercase text-gray-500 font-medium mb-2">
                    Rendered Hours
                    </div>
                    <!-- Icon + Value -->
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
                        <i class="pi pi-clock text-blue-600" style="font-size: 18px" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ attendanceForSelectedDate ? toHoursMinutes(attendanceForSelectedDate?.basic) : '0hr 0min' }}
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-medium mb-2">
                    Late
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-amber-50 px-2 pt-2 pb-1">
                        <i class="pi pi-exclamation-triangle text-amber-600" style="font-size: 18px" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ attendanceForSelectedDate ? toHoursMinutes(attendanceForSelectedDate?.late) : '0hr 0min' }}
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-medium mb-2">
                    Undertime
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-red-50 px-2 pt-2 pb-1">
                        <i class="pi pi-angle-double-down text-red-600" style="font-size: 18px" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ attendanceForSelectedDate ? toHoursMinutes(8 - Number(attendanceForSelectedDate?.basic)) : '0hr 0min' }}
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-medium mb-2">
                    Overtime
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-purple-50 px-2 pt-2 pb-1">
                        <i class="pi pi-plus-circle text-purple-600" style="font-size: 18px" />
                    </div>
                    <div class="text-xl font-bold">
                        {{ attendanceForSelectedDate ? toHoursMinutes(attendanceForSelectedDate?.ot) : '0hr 0min' }}
                    </div>
                    </div>
                </div>
            </template>
        </Card>
        </div>
</template>
