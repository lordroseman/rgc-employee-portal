<script setup lang="ts">
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { AttendanceDetail } from '~/types/attendance';
import { useAttendanceApi } from '~/composables/api/useAttendanceApi';

dayjs.extend(customParseFormat);

const props = defineProps<{
  modelValue: {
    request_type: string;
    att_date: Date | null;
    destination: string;
    purpose: string;
    tt1_in: string;
    tt1_out: string;
    tt2_in: string;
    tt2_out: string;
    tt3_in: string;
    tt3_out: string;
    tt4_in: string;
    tt4_out: string;
    ot_in: string;
    ot_out: string;
    remarks: string;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: {
    request_type: string;
    att_date: Date | null;
    destination: string;
    purpose: string;
    tt1_in: string;
    tt1_out: string;
    tt2_in: string;
    tt2_out: string;
    tt3_in: string;
    tt3_out: string;
    tt4_in: string;
    tt4_out: string;
    ot_in: string;
    ot_out: string;
    remarks: string;
  }): void;
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
  () => Boolean(createForm.value.att_date) || attendanceLoading.value,
);

const formattedSelectedDate = computed(() => {
  if (!createForm.value.att_date) {
    return '';
  }

  return dayjs(createForm.value.att_date).format('MMMM DD, YYYY');
});

const logFieldLabels = [
  { key: 'tt1_in', label: 'Time In 1' },
  { key: 'tt1_out', label: 'Time Out 1' },
  { key: 'tt2_in', label: 'Time In 2' },
  { key: 'tt2_out', label: 'Time Out 2' },
  { key: 'tt3_in', label: 'Time In 3' },
  { key: 'tt3_out', label: 'Time Out 3' },
  { key: 'tt4_in', label: 'Time In 4' },
  { key: 'tt4_out', label: 'Time Out 4' },
  { key: 'ot_in', label: 'OT In' },
  { key: 'ot_out', label: 'OT Out' },
] as const satisfies ReadonlyArray<{ key: keyof AttendanceDetail; label: string }>;

type LogFieldKey = (typeof logFieldLabels)[number]['key'];

const attendanceLogEntries = computed(() => {
  if (!attendanceDetail.value) {
    return [] as Array<{ key: LogFieldKey; label: string; value: string | null | undefined }>;
  }

  const detail = attendanceDetail.value;

  return logFieldLabels.map(({ key, label }) => ({
    key,
    label,
    value: detail[key as LogFieldKey] as string | null | undefined,
  }));
});

const populatedLogEntries = computed(() =>
  attendanceLogEntries.value.filter((entry) => !!entry.value),
);

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
      <Card class="border border-slate-200" :pt="{ body: { style: 'padding: 0 !important;' } }">
        <template #header>
          <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-200">
            <div>
              <i class="pi pi-clock text-[#A30542]" />
            </div>
            <div>
              <h2 class="text-lg font-medium">Logs</h2>
            </div>
          </div>
        </template>

        <template #content>
          <div v-if="createForm.request_type === 'OT'" class="px-4 py-3 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium">OT In</label>
              <InputText v-model="createForm.ot_in" type="time" class="w-full" placeholder="08:00" />
            </div>
            <div>
              <label class="block text-sm font-medium">OT Out</label>
              <InputText v-model="createForm.ot_out" type="time" class="w-full" placeholder="17:30" />
            </div>
          </div>
        </template>
      </Card>
    </div>

  </div>
</template>