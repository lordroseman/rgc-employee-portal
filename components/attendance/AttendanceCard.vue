<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const config = useRuntimeConfig();

const route = useRoute()
import type { Attendance } from '~/types/attendance'

const props = defineProps<{
  dateRange: boolean
  employeeAttendance: Attendance | null | undefined
  skeletonLoading?: boolean | false | undefined
}>();

const to12h = (time24?: string) =>
  time24 && dayjs(time24, ['HH:mm:ss', 'HH:mm']).isValid()
    ? dayjs(time24, ['HH:mm:ss', 'HH:mm']).format('hh:mm A')
    : ''

const todaysDate = () => {
  const d = dayjs()
  return `${d.format('MMMM D, YYYY')} [${d.format('ddd')}]`.toUpperCase()
}

</script>

<template>
    <Card 
        class="rounded border border-gray-300 mb-6"
        :pt="{
            body: { style: 'padding: 0 !important;' }
        }"
    >
    
        <template #header v-if="route.path === '/dashboard'">
            <div class="flex items-center gap-2 px-4 py-2 border-b border-gray-300">
                <div class="pt-1">
                <i class="pi pi-clock text-[#008AAD]"></i>
                </div>
                <div>
                <h2 class="text-lg font-semibold">Today's Attendance</h2>
                </div>
            </div>

        </template>

        <template #content>
            <div class="flex justify-center">
                <div class="flex items-center p-4">
                    <div class="flex flex-col items-center font-bold">
                        <div class="text-xs text-[#036985]">{{ todaysDate() }}</div>
                        <div  v-if="config.public.stage === 'development'">
                            <div class="text-sm">11:00 AM - 04:00 PM</div>
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
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2">
                        <div class="w-12 flex justify-center">
                            <Skeleton class="mb-2 rounded-full"></Skeleton>
                        </div>
                        <div class="flex-1 text-left font-bold">
                            <Skeleton width="10rem" class="mb-2"></Skeleton>
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>
            </div>

            <div v-else>
                <!-- TT4 -->
                <div v-if="props?.employeeAttendance?.tt4_out">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2">
                        <div class="w-12 flex justify-center">
                        <Tag severity="warn" value="OUT" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt4_out) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>

                <div v-if="props?.employeeAttendance?.tt4_in">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2">
                        <div class="w-12 flex justify-center">
                        <Tag severity="success" value="IN" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt4_in) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>
                <!-- TT4 -->

                <!-- TT3 -->
                <div v-if="props?.employeeAttendance?.tt3_out">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt3_out">
                        <div class="w-12 flex justify-center">
                        <Tag severity="warn" value="OUT" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt3_out) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>

                <div v-if="props?.employeeAttendance?.tt3_in">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt3_in">
                        <div class="w-12 flex justify-center">
                        <Tag severity="success" value="IN" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt3_in) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>
                <!-- TT3 -->

                <!-- TT2 -->
                <div v-if="props?.employeeAttendance?.tt2_out">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt2_out">
                        <div class="w-12 flex justify-center">
                        <Tag severity="warn" value="OUT" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt2_out) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>

                <div v-if="props?.employeeAttendance?.tt2_in">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt2_in">
                        <div class="w-12 flex justify-center">
                        <Tag severity="success" value="IN" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt2_in) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>
                <!-- TT2 -->

                <!-- TT1 -->
                <div v-if="props?.employeeAttendance?.tt1_out">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt1_out">
                        <div class="w-12 flex justify-center">
                        <Tag severity="warn" value="OUT" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt1_out) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>

                <div v-if="props?.employeeAttendance?.tt1_in">
                    <div class="border-t border-gray-300"></div>
                    <div class="flex items-center p-4 gap-2" v-if="props?.employeeAttendance?.tt1_in">
                        <div class="w-12 flex justify-center">
                        <Tag severity="success" value="IN" class="text-sm" />
                        </div>
                        <div class="flex-1 text-left font-bold">
                        {{ to12h(props?.employeeAttendance?.tt1_in) }}
                        </div>
                        <div class="text-[#852F01] text-sm"></div>
                    </div>
                </div>
                <!-- TT1 -->
            </div>

            <!-- <div class="border-t border-gray-300"></div>
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

            <div class="border-t border-gray-300"></div>
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
                <div class="border-t border-gray-300"></div>
                <div class="flex items-start justify-center">
                    <Button label="View Details" severity="info" variant="text" />
                </div>
            </div>
        </template>
    </Card>
</template>
