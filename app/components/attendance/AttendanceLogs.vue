<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
import type { Attendance, Schedule } from '~/types/attendance'
dayjs.extend(customParseFormat)
const config = useRuntimeConfig();

const route = useRoute()

const props = defineProps<{
  dateRange: boolean
  employeeAttendance: Record<string, Attendance> | null | undefined;
  employeeSchedule: Record<string, Schedule>   | null | undefined;
  skeletonLoading?: boolean | false | undefined
  selectedDate: string | null
}>();

const to12h = (time24?: string) =>
  time24 && dayjs(time24, ['HH:mm:ss', 'HH:mm']).isValid()
    ? dayjs(time24, ['HH:mm:ss', 'HH:mm']).format('hh:mm A')
    : ''

const todaysDate = () => {
  const key = props.selectedDate;
  return key ? `${dayjs(props.selectedDate).format('MMMM D, YYYY')} [${dayjs(props.selectedDate).format('ddd')}]`.toUpperCase() : '';
}

// // Direct lookup—no filtering, no mapping
const scheduleForSelectedDate = computed<Schedule | null>(() => {
  const map = props.employeeSchedule as Record<string, Schedule> | undefined;
  const key = props.selectedDate;
  return key ? map?.[key] ?? null : null;
//   return map?.[props.selectedDate] ?? null;
});

const activeKey = computed(() => props.selectedDate ?? dayjs().format('YYYY-MM-DD'));
const attendanceForSelectedDate = computed<Attendance | null>(
  () => props.employeeAttendance?.[activeKey.value] ?? null
);

</script>

<template>
    <Card 
        class="rounded mb-6"
        :pt="{
            body: { style: 'padding: 0 !important;' }
        }"
    >
    
        <template v-if="route.path === '/dashboard'" #header>
            <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
                <div class="pt-1">
                <i class="pi pi-clock text-[#008AAD]"/>
                </div>
                <div>
                <h2 class="text-lg font-medium">Today's Attendance</h2>
                </div>
            </div>

        </template>

        <template #content>
            <div class="flex justify-center">
                <div class="flex items-center p-4">
                    <div class="flex flex-col items-center font-bold">
                        <div class="text-sm text-[#036985]">{{ todaysDate() }}</div>
                        <div v-if="scheduleForSelectedDate">
                            <div class="text-sm">{{  to12h(scheduleForSelectedDate?.time_in)  }} - {{  to12h(scheduleForSelectedDate?.time_out)  }}</div>
                        </div>
                        <div v-else class="text-gray-300">
                            <div class="text-sm">- - -</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="skeletonLoading">
                <div
                    v-for="i in 3"
                    :key="i"
                    class=""
                >
                    <div class="border-t border-slate-200"/>
                    <div class="flex items-center p-4 gap-2">
                        <div class="w-12 flex justify-center">
                            <Skeleton class="mb-2 rounded-full"/>
                        </div>
                        <div class="flex-1 text-left font-bold">
                            <Skeleton width="10rem" class="mb-2"/>
                        </div>
                        <div class="text-[#852F01] text-sm"/>
                    </div>
                </div>
            </div>

            <div v-else>
                <div v-if="!attendanceForSelectedDate">
                    <div class="border-t border-slate-200"/>
                    <div class="flex items-center p-4 gap-2">
                        <div class="flex-1 text-left font-bold text-sm text-slate-500">
                        No attendance record found.
                        </div>
                        <div class="text-[#852F01] text-sm"/>
                    </div>
                </div>

                <div v-else>
                    <!-- TT4 -->
                    <div v-if="attendanceForSelectedDate?.tt4_out">
                        <div class="border-t border-slate-200"/>
                        <div class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="warn" value="OUT" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt4_out) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>

                    <div v-if="attendanceForSelectedDate?.tt4_in">
                        <div class="border-t border-slate-200"/>
                        <div class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="success" value="IN" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt4_in) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>
                    <!-- TT4 -->

                    <!-- TT3 -->
                    <div v-if="attendanceForSelectedDate?.tt3_out">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt3_out" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="warn" value="OUT" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt3_out) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>

                    <div v-if="attendanceForSelectedDate?.tt3_in">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt3_in" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="success" value="IN" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt3_in) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>
                    <!-- TT3 -->

                    <!-- TT2 -->
                    <div v-if="attendanceForSelectedDate?.tt2_out">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt2_out" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="warn" value="OUT" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt2_out) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>

                    <div v-if="attendanceForSelectedDate?.tt2_in">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt2_in" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="success" value="IN" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt2_in) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>
                    <!-- TT2 -->

                    <!-- TT1 -->
                    <div v-if="attendanceForSelectedDate?.tt1_out">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt1_out" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="warn" value="OUT" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt1_out) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>

                    <div v-if="attendanceForSelectedDate?.tt1_in">
                        <div class="border-t border-slate-200"/>
                        <div v-if="attendanceForSelectedDate?.tt1_in" class="flex items-center p-4 gap-2">
                            <div class="w-12 flex justify-center">
                            <Tag severity="success" value="IN" class="text-sm" />
                            </div>
                            <div class="flex-1 text-left font-bold">
                            {{ to12h(attendanceForSelectedDate?.tt1_in) }}
                            </div>
                            <div class="text-[#852F01] text-sm"/>
                        </div>
                    </div>
                    <!-- TT1 -->
                </div>
            </div>

            <!-- <div class="border-t border-slate-200"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                    <Tag class="!bg-indigo-50 !text-indigo-500" value="IN"/>
                </div>
                <div class="flex-1 text-left font-bold">
                06:45 PM
                </div>
                <div class="text-indigo-500 text-sm">
                Overtime
                </div>
            </div>

            <div class="border-t border-slate-200"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                    <Tag class="!bg-indigo-50 !text-indigo-500" value="OUT"/>
                </div>
                <div class="flex-1 text-left font-bold">
                06:45 PM
                </div>
                <div class="text-indigo-500 text-sm">
                Overtime
                </div>
            </div> -->

            <div v-if="dateRange">
                <div class="border-t border-slate-200"/>
                <div class="flex items-start justify-center">
                    <Button label="View Details" severity="info" variant="text" />
                </div>
            </div>
        </template>
    </Card>
</template>
