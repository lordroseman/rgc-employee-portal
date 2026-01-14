<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { AttendanceDetail, AttendanceRequestFormState } from '~/types/attendance';
import { useAttendanceApi } from '~/composables/api/useAttendanceApi';

dayjs.extend(customParseFormat);

const props = defineProps<{
  modelValue: AttendanceRequestFormState;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value:  AttendanceRequestFormState): void;
}>();

const createForm = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const { getByDate } = useAttendanceApi();

const attendanceDetail = ref<AttendanceDetail | null>(null);
const attendanceLoading = ref(false);
const attendanceError = ref<string | null>(null);

const showAttendanceSummary = computed(
  () => (Boolean(createForm.value.att_date) || attendanceLoading.value ) && createForm.value.request_type === 'COA',
);

const formattedSelectedDate = computed(() => {
  if (!createForm.value.att_date) {
    return '';
  }

  return dayjs(createForm.value.att_date).format('MMMM DD, YYYY');
});
 
const formatTimeDisplay = (value?: string | null) => {
  if (!value) {
    return '—';
  }

  const parsed = dayjs(value, ['HH:mm:ss', 'HH:mm'], true);
  return parsed.isValid() ? parsed.format('hh:mm A') : value;
};

// Token ensures only the latest request updates the state when dates change quickly.
let attendanceFetchToken = 0;

const fetchAttendanceByDate = async (selectedDate: Date, currentToken: number) => {
  attendanceLoading.value = true;
  attendanceError.value = null;
  attendanceDetail.value = null;

  try {
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const response = await getByDate(formattedDate);

    if (currentToken !== attendanceFetchToken) {
      return;
    }

    if (response.success) {
      attendanceDetail.value = response.data ?? null;
    } else {
      attendanceError.value = 'Unable to load attendance for the selected date.';
    }
  } catch {
    if (currentToken !== attendanceFetchToken) {
      return;
    }

    attendanceError.value = 'Unable to load attendance for the selected date.';
  } finally {
    if (currentToken === attendanceFetchToken) {
      attendanceLoading.value = false;
    }
  }
};

watch(
  () => createForm.value.att_date,
  (attDate) => {
    attendanceFetchToken += 1;
    const currentToken = attendanceFetchToken;

    if (!attDate) {
      attendanceDetail.value = null;
      attendanceError.value = null;
      attendanceLoading.value = false;
      return;
    }

    fetchAttendanceByDate(attDate, currentToken);
  },
  { immediate: true },
);



const timePairs = ref<[string, string][]>([
  ["tt1_in", "tt1_out"],
  ["tt2_in", "tt2_out"],
  ["tt3_in", "tt3_out"],
  ["tt4_in", "tt4_out"],
]);


const isPairLogsComplete = (pair: [string, string]) => {
  if (!attendanceDetail.value) return false;

  const inLog = attendanceDetail.value[pair[0] as keyof AttendanceDetail];
  const outLog = attendanceDetail.value[pair[1] as keyof AttendanceDetail];

  return Boolean(inLog && outLog);
};


const totalBasicHours = computed(() => {
  if (!attendanceDetail.value) return 0;

  const schedule = attendanceDetail.value.schedule;
  if (!schedule) return 0;

  let basic = 0;
  // loop through time pairs to find first time in and last time out
  for (const pair of timePairs.value) {
    if (isPairLogsComplete(pair)) {
      const timeIn = attendanceDetail.value?.[pair[0] as keyof AttendanceDetail];
      const timeOut = attendanceDetail.value?.[pair[1] as keyof AttendanceDetail];

      if (timeIn && timeOut) {
        const inTime = dayjs(`${attendanceDetail.value?.att_date}`);
        const outTime = dayjs(`${attendanceDetail.value?.att_date}T${timeOut}`);

        const diff = outTime.diff(inTime, "hour", true); 
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
  if (!attendanceDetail.value) return null;

  // get last time out
  return (
    (timePairs.value
      .map((pair) => attendanceDetail.value?.[pair[1] as keyof AttendanceDetail])
      .filter((time) => Boolean(time))
      .pop() as string) || null
  );
});

const otIn = computed(() => {
  if (!attendanceDetail.value || !lastTimeout.value) return null;

  return dayjs(`${attendanceDetail.value.att_date}T${lastTimeout.value}`)
    .subtract(otMinutes.value, "minute")
    .format("HH:mm");
});

const extractOvertime = computed(() => {
  if (!attendanceDetail.value) return "No OT";

  // extract OT In and OT Out from attendance record

  return lastTimeout.value
    ? `${formatTimeDisplay(otIn.value)} - ${formatTimeDisplay(
      lastTimeout.value
    )}`
    : "No OT";
});

</script>

<template>
  <div class="px-4 py-2">

    <div class="field py-2">
      <label class="block font-medium">Date</label>
      <DatePicker
v-model="createForm.att_date" class="w-full" date-format="MM dd, yy" :manual-input="false" show-icon
        placeholder="Select Date" />
    </div>

    <div v-if="showAttendanceSummary" class="py-2">

      <div class="flex items-center justify-between gap-2 px-4 py-2  ">
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar-clock text-[#A30542]" />
          <div>
            <h2 class="text-lg font-medium">Attendance Record</h2> 
          </div>
        </div>
      </div>
      <div v-if="attendanceLoading" class="grid grid-cols-4 gap-2">
        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <Skeleton height="1rem" width="40%" class="mb-2" />
          <Skeleton height="1rem" width="80%" />
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <Skeleton height="1rem" width="50%" class="mb-2" />
          <Skeleton height="1rem" width="70%" class="mb-1" />
          <Skeleton height="1rem" width="60%" />
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <Skeleton height="1rem" width="45%" class="mb-2" />
          <Skeleton height="1rem" width="65%" />
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <Skeleton height="1rem" width="40%" class="mb-2" />
          <Skeleton height="1rem" width="55%" />
        </div>
      </div>

      <div v-else-if="attendanceError" class="px-4 py-3 text-sm text-red-600">
        {{ attendanceError }}
      </div>
      <div v-else-if="attendanceDetail" class="grid grid-cols-4 gap-2">
        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <p class="font-semibold text-sm tracking-wide">Schedule</p>
          <p class="text-sm">
            {{ formatTimeDisplay(attendanceDetail.schedule?.timein) }} -
            {{ formatTimeDisplay(attendanceDetail.schedule?.timeout) }}
          </p>
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <p class="font-semibold text-sm tracking-wide">Biometric Logs</p>
          <template v-for="(pairs, index) in timePairs" :key="index">
            <p v-if="isPairLogsComplete(pairs)" class="text-sm">
              {{ formatTimeDisplay(attendanceDetail[pairs[0] as keyof AttendanceDetail] as string) }}
              -
              {{ formatTimeDisplay(attendanceDetail[pairs[1] as keyof AttendanceDetail] as string) }}
            </p>
          </template>
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <p class="font-semibold text-sm tracking-wide">Overtime</p>
          <p class="text-sm">{{ extractOvertime }}</p>
        </div>

        <div class="bg-rose-50 rounded p-2 border border-rose-100">
          <p class="font-semibold text-sm tracking-wide">OT minutes</p>
          <p class="text-sm">{{ otMinutes }} minutes</p>
        </div>
      </div>



      <div v-else class="px-4 py-3 text-sm text-slate-500">
        No attendance logs were found for {{ formattedSelectedDate || 'the selected date' }}.
      </div>

    </div>

    <div class="field py-2">
      <label class="block font-medium">Purpose</label>
      <InputText v-model="createForm.purpose" class="w-full" />
    </div>

    <div class="py-2">
      
    <OTForm v-if="createForm.request_type === 'OT'" v-model="createForm" :attendance="attendanceDetail" :loading-attendance="attendanceLoading" />
    <COAForm v-else-if="createForm.request_type === 'COA'" v-model="createForm" :attendance="attendanceDetail" />
        
    </div>

  </div>
</template>