<script setup lang="ts">
import dayjs from "dayjs";
// import { useAttendanceApi } from "~/composables/api/useAttendanceApi";
import type { AttendanceDetail, AttendanceRequestFormState } from "~/types/attendance";

const props = defineProps<{
  modelValue: AttendanceRequestFormState;
  attendance: AttendanceDetail | null;
  loadingAttendance?: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [AttendanceRequestFormState | null];
}>();

const attendanceRequest = computed({
  get: () => props.modelValue || null,
  set: (value: AttendanceRequestFormState | null) => emit("update:modelValue", value),
});

const attendance = ref<AttendanceDetail | null>(props.attendance);

// const { getByEmployeeDate } = useAttendanceApi();

// const loadingAttendance = ref(false);
// const fetchAttendance = async () => {
//   if (!attendanceRequest.value) {
//     attendance.value = null;
//     loadingAttendance.value = false;
//     return;
//   }

//   const employeeId = attendanceRequest.value.employee_id;
//   const attDate = dayjs(attendanceRequest.value.att_date).format("YYYY-MM-DD");
//   if (!employeeId || !attDate) {
//     attendance.value = null;
//     loadingAttendance.value = false;
//     return;
//   }

//   loadingAttendance.value = true;
//   try {
//     const response = await getByEmployeeDate(employeeId, attDate);
//     attendance.value = response.success ? response.data : null;

//     if (response.success) {
//       await nextTick();
//       attendanceRequest.value!.logs.ot_in =
//         attendanceRequest.value!.logs.ot_in || otIn.value;
//       attendanceRequest.value!.logs.ot_out =
//         attendanceRequest.value!.logs.ot_out || lastTimeout.value;
//     }
//   } catch (e) {
//     console.error(e);
//     attendance.value = null;
//   } finally {
//     loadingAttendance.value = false;
//   }
// };

// onMounted(async () => {
//   await fetchAttendance();
// });

// watch(
//   () => [attendanceRequest.value?.employee_id, attendanceRequest.value?.att_date],
//   async () => {
//     await fetchAttendance();
//   }
// );

const timePairs = ref<[string, string][]>([
  ["tt1_in", "tt1_out"],
  ["tt2_in", "tt2_out"],
  ["tt3_in", "tt3_out"],
  ["tt4_in", "tt4_out"],
]);

const isPairLogsComplete = (pair: [string, string]) => {
  if (!attendance.value) return false;

  const inLog = attendance.value[pair[0] as keyof AttendanceDetail];
  const outLog = attendance.value[pair[1] as keyof AttendanceDetail];

  return Boolean(inLog && outLog);
};

const totalBasicHours = computed(() => {
  if (!attendance.value) return 0;

  const schedule = attendance.value.schedule;
  if (!schedule) return 0;

  let basic = 0;
  // loop through time pairs to find first time in and last time out
  for (const pair of timePairs.value) {
    if (isPairLogsComplete(pair)) {
      const timeIn = attendance.value?.[pair[0] as keyof AttendanceDetail];
      const timeOut = attendance.value?.[pair[1] as keyof AttendanceDetail];

      if (timeIn && timeOut) {
        const inTime = dayjs(`${attendance.value?.att_date}`);
        const outTime = dayjs(`${attendance.value?.att_date}T${timeOut}`);

        const diff = outTime.diff(inTime, "hour", true);
        console.log("diff", pair, diff, timeIn, timeOut);
        basic += diff;
      }
    }
  }

  return basic;
});

const otMinutes = computed(() => {
  return totalBasicHours.value > 8 ? (totalBasicHours.value - 8) * 60 : 0;
});

const lastTimeout = computed<string | null>(() => {
  if (!attendance.value) return null;

  // get last time out
  return (
    (timePairs.value
      .map((pair) => attendance.value?.[pair[1] as keyof AttendanceDetail])
      .filter((time) => Boolean(time))
      .pop() as string) || null
  );
});

const otIn = computed(() => {
  if (!attendance.value || !lastTimeout.value) return null;

  return dayjs(`${attendance.value.att_date}T${lastTimeout.value}`)
    .subtract(otMinutes.value, "minute")
    .format("HH:mm");
});

const extractOvertime = computed(() => {
  if (!attendance.value) return "No OT";

  // extract OT In and OT Out from attendance record

  return lastTimeout.value
    ? `${formatTime(attendance.value.att_date!, otIn.value)} - ${formatTime(
        attendance.value.att_date!,
        lastTimeout.value
      )}`
    : "No OT";
});
</script>

<template>
  <div class="flex flex-col w-full gap-4 col-span-2">
    <section>
      <h3 class="text-lg font-semibold">Attendance Record</h3>
      <div v-if="loadingAttendance" class="grid grid-cols-4 gap-2">
        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <Skeleton height="1rem" width="40%" class="mb-2" />
          <Skeleton height="1rem" width="80%" />
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <Skeleton height="1rem" width="50%" class="mb-2" />
          <Skeleton height="1rem" width="70%" class="mb-1" />
          <Skeleton height="1rem" width="60%" />
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <Skeleton height="1rem" width="45%" class="mb-2" />
          <Skeleton height="1rem" width="65%" />
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <Skeleton height="1rem" width="40%" class="mb-2" />
          <Skeleton height="1rem" width="55%" />
        </div>
      </div>
      <div v-if="attendance" class="grid grid-cols-4 gap-2">
        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <p class="font-semibold text-sm tracking-wide">Schedule</p>
          <p class="text-sm">
            {{ formatTime(attendance.att_date!, attendance.schedule?.timein) }} -
            {{ formatTime(attendance.att_date!, attendance.schedule?.timeout) }}
          </p>
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <p class="font-semibold text-sm tracking-wide">Biometric Logs</p>
          <template v-for="(pairs, index) in timePairs" :key="index">
            <p v-if="isPairLogsComplete(pairs)" class="text-sm">
              {{ formatTime(attendance.att_date!, attendance[pairs[0] as keyof AttendanceDetail]) }}
              -
              {{ formatTime(attendance.att_date!, attendance[pairs[1] as keyof AttendanceDetail]) }}
            </p>
          </template>
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <p class="font-semibold text-sm tracking-wide">Overtime</p>
          <p class="text-sm">{{ extractOvertime }}</p>
        </div>

        <div class="bg-indigo-50 rounded p-2 border border-indigo-100">
          <p class="font-semibold text-sm tracking-wide">OT minute</p>
          <p class="text-sm">{{ otMinutes }} minutes</p>
        </div>
      </div>
      <div v-else>
        <p class="text-sm">No attendance record found for the selected date.</p>
      </div>
    </section>

    <h3 class="text-lg font-semibold">Overtime Details</h3>

    <div class="grid grid-cols-2 gap-4 w-full">
      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-wide text-surface-500">
          Start of OT
        </p>
        <TimeInput
          v-model="attendanceRequest.logs.ot_in"
          class="w-full has-border bg-white px-3 py-2 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div class="space-y-1">
        <p class="text-xs font-semibold uppercase tracking-wide text-surface-500">
          End of OT
        </p>
        <TimeInput
          v-model="attendanceRequest.logs.ot_out"
          class="w-full has-border bg-white px-3 py-2 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  </div>
</template>
