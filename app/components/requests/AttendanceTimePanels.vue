<script setup lang="ts">
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat"; 
import type { AttendanceDetail, TimePairUi } from "~/types/attendance";
import { timeToMinutes } from "~/utils/dateFormat";

dayjs.extend(customParseFormat);

type SummaryEntry = { label: string; value: string };

type TimeValidation = {
  fieldErrors: Partial<Record<keyof AttendanceDetail, string>>;
  summaryErrors: string[];
  hasErrors: boolean;
};

const props = withDefaults(
  defineProps<{
    loading: boolean;
    loadError: string | null;
    attendance: AttendanceDetail | null;
    warnOnEmpty?: boolean;
    initialLogs?: Partial<Record<keyof AttendanceDetail, string | null | undefined>>;
  }>(),
  {
    warnOnEmpty: true,
    initialLogs: () => ({}),
  }
);

const emit = defineEmits<{
  "update:attendance": [AttendanceDetail | null];
  "validation-changed": [TimeValidation];
}>();

const runtimeConfig = useRuntimeConfig();
const workingHoursValue = Number(runtimeConfig.public?.constants?.WORKING_HOURS);
const WORKING_HOURS =
  Number.isFinite(workingHoursValue) && workingHoursValue > 0 ? workingHoursValue : 8;

const enabledTimeTables = ref<1 | 2 | 3 | 4>(1);

const createEmptyAttendance = (): AttendanceDetail => ({
  attendance_id: 0,
  company_id: 0,
  employee_id: 0,
  att_date: dayjs().format("YYYY-MM-DD"),
  tt1_in: '',
  tt1_out: '',
  tt2_in: '',
  tt2_out: '',
  tt3_in: '',
  tt3_out: '',
  tt4_in: '',
  tt4_out: '',
  ot_in: '',
  ot_out: '',
  basic: 0,
  ot: 0,
  nd: 0,
  late: 0,
  holiday: 0,
  flag: null,
  tag: null,
  remarks: '',
  schedule: null,
});

const fallbackAttendance = shallowRef<AttendanceDetail>(createEmptyAttendance());

const activeAttendance = computed<AttendanceDetail | null>(() => {
  if (props.attendance) return props.attendance;
  if (props.warnOnEmpty) return null;
  return fallbackAttendance.value;
});

const timeFieldsFromLogs = [
  "tt1_in",
  "tt1_out",
  "tt2_in",
  "tt2_out",
  "tt3_in",
  "tt3_out",
  "tt4_in",
  "tt4_out",
  "ot_in",
  "ot_out",
] as const satisfies readonly (keyof AttendanceDetail)[];

const attendanceForUi = computed<AttendanceDetail | null>(() => {
  const att = activeAttendance.value;
  if (!att) return null;

  let changed = false;
  const next: AttendanceDetail = { ...att };

  for (const field of timeFieldsFromLogs) {
    const currentValue = cleanTime(next[field] as string | null | undefined);
    if (currentValue) continue;

    const fromLogs = cleanTime(props.initialLogs?.[field] as string | null | undefined);
    if (!fromLogs) continue;

    (next[field] as unknown) = fromLogs;
    changed = true;
  }

  return changed ? next : att;
});

const emitAttendanceUpdate = (next: AttendanceDetail | null) => {
  if (!props.attendance && !props.warnOnEmpty) {
    fallbackAttendance.value = next ?? createEmptyAttendance();
  }

  emit("update:attendance", next);
};

const cleanTime = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const parseTime = (value: string | null | undefined) => {
  const cleaned = cleanTime(value);
  if (!cleaned) return null;
  const parsed = dayjs(cleaned, "HH:mm", true);
  return parsed.isValid() ? parsed : null;
};

const toDateTime = (date: string | null | undefined, time: string | null | undefined) => {
  if (!date) return null;
  const parsed = parseTime(time);
  if (!parsed) return null;
  const baseDate = dayjs(date);
  if (!baseDate.isValid()) return null;
  return baseDate
    .set("hour", parsed.hour())
    .set("minute", parsed.minute())
    .set("second", 0)
    .set("millisecond", 0);
};

const diffInMinutes = (
  start: string | null | undefined,
  end: string | null | undefined
) => {
  const startParsed = parseTime(start);
  const endParsed = parseTime(end);
  if (!startParsed || !endParsed) return null;
  let diff = endParsed.diff(startParsed, "minute");
  if (diff < 0) diff += 24 * 60;
  return diff;
};

const hoursFromMinutes = (minutes: number, limit?: number): number => {
  const hours = minutes / 60;
  const limited = typeof limit === "number" ? Math.min(hours, limit) : hours;
  return Number(limited.toFixed(3));
};

const requiredManHoursForAttendance = (att: AttendanceDetail): number => {
  const schedule = att.schedule;
  if (schedule?.timein && schedule?.timeout) {
    const scheduledTimein = toDateTime(att.att_date, schedule.timein);
    let scheduledTimeout = toDateTime(att.att_date, schedule.timeout);
    if (
      scheduledTimein &&
      scheduledTimeout &&
      scheduledTimeout.isBefore(scheduledTimein)
    ) {
      scheduledTimeout = scheduledTimeout.add(1, "day");
    }

    if (scheduledTimein && scheduledTimeout) {
      const intervalMinutes = scheduledTimeout.diff(scheduledTimein, "minutes", true);
      const breakMinutes =
        typeof schedule.break_period === "number" ? schedule.break_period : 0;
      const manhourMinutes = intervalMinutes - breakMinutes;
      return Number((manhourMinutes / 60).toFixed(3));
    }
  }

  return WORKING_HOURS;
};

const timePairsForCalculations = [
  ["tt1_in", "tt1_out"],
  ["tt2_in", "tt2_out"],
  ["tt3_in", "tt3_out"],
  ["tt4_in", "tt4_out"],
] as const;

const calculateBasicHoursForAttendance = (att: AttendanceDetail): number => {
  const requiredHours = requiredManHoursForAttendance(att);
  const schedule = att.schedule;
  const schedTimein = schedule?.timein ? toDateTime(att.att_date, schedule.timein) : null;
  let schedTimeout = schedule?.timeout
    ? toDateTime(att.att_date, schedule.timeout)
    : null;
  if (schedTimein && schedTimeout && schedTimeout.isBefore(schedTimein)) {
    schedTimeout = schedTimeout.add(1, "day");
  }

  let basic = 0;

  for (const [inKey, outKey] of timePairsForCalculations) {
    let login = toDateTime(att.att_date, att[inKey]);
    let logout = toDateTime(att.att_date, att[outKey]);
    if (!login || !logout) continue;

    if (login.isBefore(schedTimein?.subtract(6, "hour"))) {
      login = login.add(1, "day");
      logout = logout.add(1, "day");
    } else {
      if (schedTimein && login.isBefore(schedTimein)) {
        login = schedTimein;
      }
    }

    if (schedTimeout && logout.isAfter(schedTimeout)) {
      logout = schedTimeout;
    }

    if (logout.isBefore(login) || logout.isSame(login)) {
      logout = logout.add(1, "day");
    }

    if (logout.isAfter(login)) {
      basic += logout.diff(login, "hours", true);
    }
  }

  const rounded = Number(basic.toFixed(3));
  return rounded > requiredHours ? requiredHours : rounded;
};

type WorkInterval = { start: ReturnType<typeof dayjs>; end: ReturnType<typeof dayjs> };

const buildWorkIntervals = (
  att: AttendanceDetail,
  options: { clampFirstToScheduleStart?: boolean } = {}
): { intervals: WorkInterval[]; invalid: boolean } => {
  const intervals: WorkInterval[] = [];
  let invalid = false;

  const schedule = att.schedule;
  const scheduleStartDateTime =
    options.clampFirstToScheduleStart && schedule?.timein
      ? toDateTime(att.att_date, schedule.timein)
      : null;

  let scheduleEndDateTime = schedule?.timeout
    ? toDateTime(att.att_date, schedule.timeout)
    : null;
  if (
    scheduleStartDateTime &&
    scheduleEndDateTime &&
    !scheduleEndDateTime.isAfter(scheduleStartDateTime)
  ) {
    scheduleEndDateTime = scheduleEndDateTime.add(1, "day");
  }

  let baseStart = scheduleStartDateTime;

  timePairsForCalculations.forEach(([inKey, outKey], index) => {
    const timeIn = att[inKey];
    const timeOut = att[outKey];

    if (!timeIn && !timeOut) {
      return;
    }

    if (!timeIn || !timeOut) {
      invalid = true;
      return;
    }

    let start = toDateTime(att.att_date, timeIn);
    let end = toDateTime(att.att_date, timeOut);

    if (!start || !end) {
      invalid = true;
      return;
    }

    if (scheduleStartDateTime && index === 0 && start.isBefore(scheduleStartDateTime)) {
      start = scheduleStartDateTime;
    }

    if (index === 0) {
      baseStart = start;
    }

    if (baseStart && start.isBefore(baseStart)) {
      start = start.add(1, "day");
      if (!start.isAfter(baseStart)) {
        invalid = true;
        return;
      }
    }

    if (baseStart && !end.isAfter(baseStart)) {
      end = end.add(1, "day");
      if (!end.isAfter(start)) {
        invalid = true;
        return;
      }
    }

    const isLastSlot = index === timePairsForCalculations.length - 1;
    if (scheduleEndDateTime && isLastSlot && end.isAfter(scheduleEndDateTime)) {
      end = scheduleEndDateTime;
      if (!end.isAfter(start)) {
        invalid = true;
        return;
      }
    }

    intervals.push({ start, end });
  });

  return { intervals, invalid };
};

const calculateNightDifferentialHoursForAttendance = (att: AttendanceDetail): number => {
  const { intervals } = buildWorkIntervals(att, { clampFirstToScheduleStart: true });
  if (!intervals.length) return 0;

  const baseDate = dayjs(att.att_date);
  if (!baseDate.isValid()) return 0;

  const ndStart = baseDate
    .set("hour", 22)
    .set("minute", 0)
    .set("second", 0)
    .set("millisecond", 0);
  const ndEnd = ndStart.add(8, "hour");

  let minutes = 0;
  for (const interval of intervals) {
    const intervalStart = interval.start;
    const intervalEnd = interval.end;

    if (!intervalEnd.isAfter(ndStart) || !ndEnd.isAfter(intervalStart)) {
      continue;
    }

    const overlapStart = intervalStart.isAfter(ndStart) ? intervalStart : ndStart;
    const overlapEnd = intervalEnd.isBefore(ndEnd) ? intervalEnd : ndEnd;

    if (overlapEnd.isAfter(overlapStart)) {
      minutes += overlapEnd.diff(overlapStart, "minute");
    }
  }

  const hours = minutes / 60;
  const rounded = Number(hours.toFixed(3));
  return rounded > 1 ? rounded : 0;
};

const calculateLateHoursForAttendance = (
  att: AttendanceDetail,
  basicHours: number
): number => {
  if (!basicHours) return 0;
  const requiredHours = requiredManHoursForAttendance(att);
  const late = requiredHours - basicHours;
  const rounded = Number(late.toFixed(3));
  return rounded > 0 ? rounded : 0;
};

const recalculateAttendanceDurations = (att: AttendanceDetail): AttendanceDetail => {
  const basicHours = calculateBasicHoursForAttendance(att);
  const ndHours = calculateNightDifferentialHoursForAttendance(att);
  const lateHours = calculateLateHoursForAttendance(att, basicHours);

  const overtimeMinutes = diffInMinutes(att.ot_in, att.ot_out);
  const overtimeHours = overtimeMinutes === null ? 0 : hoursFromMinutes(overtimeMinutes);

  return {
    ...att,
    basic: basicHours,
    ot: overtimeHours,
    nd: ndHours,
    late: lateHours,
  };
};

const highestTimeTableWithData = (att: AttendanceDetail | null): 1 | 2 | 3 | 4 => {
  if (!att) return 1;

  const hasValue = (key: keyof AttendanceDetail) =>
    Boolean(cleanTime(att[key] as string | null | undefined));

  if (hasValue("tt4_in") || hasValue("tt4_out")) return 4;
  if (hasValue("tt3_in") || hasValue("tt3_out")) return 3;
  if (hasValue("tt2_in") || hasValue("tt2_out")) return 2;
  return 1;
};

const visibleTimePairs = computed<TimePairUi[]>(() => {
  const att = attendanceForUi.value;
  if (!att) return [];

  const enabledTables = Math.max(
    enabledTimeTables.value,
    highestTimeTableWithData(att)
  ) as 1 | 2 | 3 | 4;

  const pairs: TimePairUi[] = [];
  const addTimeTable = (index: 1 | 2 | 3 | 4) => {
    pairs.push({
      key: `tt${index}`,
      label: `Time Table ${index}`,
      inField: `tt${index}_in` as keyof AttendanceDetail,
      outField: `tt${index}_out` as keyof AttendanceDetail,
      inLabel: `Time In ${index}`,
      outLabel: `Time Out ${index}`,
    });
  };

  addTimeTable(1);
  if (enabledTables >= 2) addTimeTable(2);
  if (enabledTables >= 3) addTimeTable(3);
  if (enabledTables >= 4) addTimeTable(4);

  const hasOt = Boolean(cleanTime(att.ot_in) || cleanTime(att.ot_out));
  if (hasOt) {
    pairs.push({
      key: "ot",
      label: "Overtime",
      inField: "ot_in",
      outField: "ot_out",
      inLabel: "OT In",
      outLabel: "OT Out",
    });
  }

  return pairs;
});

const swapTimePair = (
  inField: keyof AttendanceDetail,
  outField: keyof AttendanceDetail
) => {
  const current = attendanceForUi.value;
  if (!current) return;

  const inValue = (current[inField] as string | null | undefined) ?? null;
  const outValue = (current[outField] as string | null | undefined) ?? null;

  emitAttendanceUpdate(
    recalculateAttendanceDurations({
      ...current,
      [inField]: outValue,
      [outField]: inValue,
    })
  );
};

const setTimeEntryValue = (field: keyof AttendanceDetail, value: string | null) => {
  const current = attendanceForUi.value;
  if (!current) return;

  const match = String(field).match(/^tt([1-4])_(in|out)$/);
  if (match?.[1]) {
    const index = Number.parseInt(match[1], 10) as 1 | 2 | 3 | 4;
    if (Number.isFinite(index) && index > enabledTimeTables.value) {
      enabledTimeTables.value = index;
    }
  }

  emitAttendanceUpdate(
    recalculateAttendanceDurations({
      ...current,
      [field]: value,
    })
  );
};

const canAddTimeTable = computed(() => {
  return Boolean(attendanceForUi.value) && enabledTimeTables.value < 4;
});

const addNextTimeTable = () => {
  const current = attendanceForUi.value;
  if (!current) return;
  if (enabledTimeTables.value >= 4) return;

  const next = (enabledTimeTables.value + 1) as 2 | 3 | 4;
  const inField = `tt${next}_in` as keyof AttendanceDetail;
  const outField = `tt${next}_out` as keyof AttendanceDetail;

  enabledTimeTables.value = next;
  emitAttendanceUpdate(
    recalculateAttendanceDurations({
      ...current,
      [inField]: null,
      [outField]: null,
    })
  );
};

const formatClock = (value?: string | null) => {
  if (!value) return "--";
  const [hourStr = "00", minuteStr = "00"] = value.split(":");
  const hours = Number.parseInt(hourStr, 10);
  if (Number.isNaN(hours)) {
    return value;
  }
  const normalized = (hours % 12 || 12).toString();
  const paddedHour = normalized.padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  return `${paddedHour}:${minuteStr} ${meridiem}`;
};

const scheduleWindow = (timeIn?: string | null, timeOut?: string | null) => {
  if (!timeIn && !timeOut) {
    return "--";
  }
  if (timeIn && timeOut) {
    return `${formatClock(timeIn)} - ${formatClock(timeOut)}`;
  }
  if (timeIn) {
    return `${formatClock(timeIn)} - --`;
  }
  return `-- - ${formatClock(timeOut)}`;
};

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatHours = (value?: number | null) => `${numberFormatter.format(value ?? 0)} h`;

const summaryEntries = computed<SummaryEntry[]>(() => {
  const att = attendanceForUi.value;
  return [
    { label: "Basic Hours", value: formatHours(att?.basic) },
    { label: "Overtime", value: formatHours(att?.ot) },
    { label: "Night Diff", value: formatHours(att?.nd) },
    { label: "Late", value: formatHours(att?.late) },
    { label: "Holiday", value: formatHours(att?.holiday) },
  ];
});

const hasSchedule = computed(() => !!attendanceForUi.value?.schedule);

const scheduleEntries = computed<SummaryEntry[]>(() => {
  const schedule = attendanceForUi.value?.schedule;
  return [
    { label: "Shift", value: schedule?.shift || "--" },
    { label: "Work Window", value: scheduleWindow(schedule?.timein, schedule?.timeout) },
    {
      label: "Break (mins)",
      value:
        typeof schedule?.break_period === "number"
          ? `${schedule.break_period} min`
          : "--",
    },
    {
      label: "Grace Period",
      value:
        typeof schedule?.grace_period === "number"
          ? `${schedule.grace_period} min`
          : "--",
    },
  ];
});

type TimePairDefinition = {
  key: "tt1" | "tt2" | "tt3" | "tt4" | "ot";
  label: string;
  inField: keyof AttendanceDetail;
  outField: keyof AttendanceDetail;
};

const timePairs: TimePairDefinition[] = [
  { key: "tt1", label: "Time Table 1", inField: "tt1_in", outField: "tt1_out" },
  { key: "tt2", label: "Time Table 2", inField: "tt2_in", outField: "tt2_out" },
  { key: "tt3", label: "Time Table 3", inField: "tt3_in", outField: "tt3_out" },
  { key: "tt4", label: "Time Table 4", inField: "tt4_in", outField: "tt4_out" },
  { key: "ot", label: "Overtime", inField: "ot_in", outField: "ot_out" },
];

const timeValidation = computed<TimeValidation>(() => {
  const fieldErrors: Partial<Record<keyof AttendanceDetail, string>> = {};
  const summaryErrors: string[] = [];
  const att = attendanceForUi.value;
  if (!att) {
    return { fieldErrors, summaryErrors, hasErrors: false };
  }

  const relevantPairs = timePairs
    .filter(
      (pair) =>
        Object.prototype.hasOwnProperty.call(att, pair.inField) ||
        Object.prototype.hasOwnProperty.call(att, pair.outField)
    )
    .filter((pair) => {
      const inValue = cleanTime(att[pair.inField] as string | null | undefined);
      const outValue = cleanTime(att[pair.outField] as string | null | undefined);
      return Boolean(inValue || outValue);
    });

  const intervals: { pair: TimePairDefinition; start: number; end: number }[] = [];
  let baseStartMinutes: number | null = null;

  for (const pair of relevantPairs) {
    const inRaw = att[pair.inField] as string | null | undefined;
    const outRaw = att[pair.outField] as string | null | undefined;

    const inValue = cleanTime(inRaw);
    const outValue = cleanTime(outRaw);

    if ((inValue && !outValue) || (!inValue && outValue)) {
      const message = `${pair.label} requires both Time In and Time Out.`;
      fieldErrors[pair.inField] = message;
      fieldErrors[pair.outField] = message;
      summaryErrors.push(message);
      continue;
    }

    if (!inValue && !outValue) {
      continue;
    }

    const inMinutes = timeToMinutes(inValue);
    const outMinutes = timeToMinutes(outValue);
    if (inMinutes === null || outMinutes === null) {
      const message = `${pair.label} has an invalid time format.`;
      fieldErrors[pair.inField] = message;
      fieldErrors[pair.outField] = message;
      summaryErrors.push(message);
      continue;
    }

    if (inMinutes === outMinutes) {
      const message = `${pair.label} Time In and Time Out cannot be the same.`;
      fieldErrors[pair.inField] = message;
      fieldErrors[pair.outField] = message;
      summaryErrors.push(message);
      continue;
    }

    if (baseStartMinutes === null) {
      baseStartMinutes = inMinutes;
    }

    let start = inMinutes;
    let end = outMinutes;

    if (baseStartMinutes !== null && start < baseStartMinutes) {
      start += 24 * 60;
      end += 24 * 60;
    }

    if (end <= start) {
      end += 24 * 60;
    }

    const duration = end - start;
    if (duration <= 0 || duration > 24 * 60) {
      const message = `${pair.label} has an invalid time range.`;
      fieldErrors[pair.inField] = message;
      fieldErrors[pair.outField] = message;
      summaryErrors.push(message);
      continue;
    }

    intervals.push({ pair, start, end });
  }

  intervals.sort((a, b) => a.start - b.start);
  for (let index = 1; index < intervals.length; index += 1) {
    const previous = intervals[index - 1];
    const current = intervals[index];
    if (!previous || !current) continue;
    if (current.start < previous.end) {
      const message = `${current.pair.label} overlaps with ${previous.pair.label}.`;
      fieldErrors[current.pair.inField] = message;
      fieldErrors[current.pair.outField] = message;
      fieldErrors[previous.pair.inField] = fieldErrors[previous.pair.inField] ?? message;
      fieldErrors[previous.pair.outField] =
        fieldErrors[previous.pair.outField] ?? message;
      summaryErrors.push(message);
    }
  }

  const uniqueSummary = Array.from(new Set(summaryErrors));
  return {
    fieldErrors,
    summaryErrors: uniqueSummary,
    hasErrors: uniqueSummary.length > 0,
  };
});

watch(
  timeValidation,
  (value) => {
    emit("validation-changed", value);
  },
  { immediate: true, deep: true }
);

watch(
  () => props.attendance?.attendance_id,
  () => {
    enabledTimeTables.value = highestTimeTableWithData(attendanceForUi.value);
  },
  { immediate: true }
);
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
    <section class="rounded-lg border border-slate-200 bg-white p-5">
      <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-lg font-semibold text-surface-900">Time In / Time Out</p>
          <p class="text-sm text-surface-500">
            Raw logs for the selected attendance date
          </p>
        </div>
      </header>

      <div v-if="loading" class="space-y-3">
        <Skeleton v-for="state in 6" :key="state" height="1.5rem" class="rounded" />
      </div>
      <Message v-else-if="loadError" severity="error" :closable="false">
        {{ loadError }}
      </Message>
      <div v-else-if="attendanceForUi" class="space-y-3">
        <Message v-if="timeValidation.hasErrors" severity="error" :closable="false">
          {{ timeValidation.summaryErrors.join(" \u2022 ") }}
        </Message>

        <div class="space-y-4">
          <div v-for="pair in visibleTimePairs" :key="pair.key" class="space-y-2">
            <p class="text-xs font-semibold uppercase tracking-wide text-surface-500">
              {{ pair.label }}
            </p>

            <div
              class="grid items-start gap-3"
              style="grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr)"
            >
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wide text-surface-500">
                  {{ pair.inLabel }}
                </p>
                <TimeInput
                  :model-value="
                    (attendanceForUi?.[pair.inField] as string | null | undefined) ?? null
                  "
                  class="w-full has-border bg-white px-3 py-2 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  @update:model-value="(value) => setTimeEntryValue(pair.inField, value)"
                />
                <p
                  v-if="timeValidation.fieldErrors[pair.inField]"
                  class="text-xs text-red-500"
                >
                  {{ timeValidation.fieldErrors[pair.inField] }}
                </p>
              </div>

              <div class="flex items-center justify-center pt-6">
                <Button
                  icon="pi pi-arrows-h"
                  severity="secondary"
                  text
                  size="small"
                  aria-label="Swap time in/out"
                  @click="swapTimePair(pair.inField, pair.outField)"
                />
              </div>

              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-wide text-surface-500">
                  {{ pair.outLabel }}
                </p>
                <TimeInput
                  :model-value="
                    (attendanceForUi?.[pair.outField] as string | null | undefined) ?? null
                  "
                  class="w-full has-border bg-white px-3 py-2 text-surface-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  @update:model-value="(value) => setTimeEntryValue(pair.outField, value)"
                />
                <p
                  v-if="timeValidation.fieldErrors[pair.outField]"
                  class="text-xs text-red-500"
                >
                  {{ timeValidation.fieldErrors[pair.outField] }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2">
          <Button
            v-if="canAddTimeTable"
            label="<< Add Time Table >>"
            severity="secondary"
            class="w-full"
            @click="addNextTimeTable"
          />
        </div>
      </div>
      <Message v-else-if="warnOnEmpty" severity="warn" :closable="false">
        No attendance data returned by the backend for this date.
      </Message>
    </section>

    <div class="flex flex-col gap-4">
      <section class="rounded-lg border border-slate-200 bg-white p-5">
        <header class="mb-3">
          <p class="text-lg font-semibold text-surface-900">Daily Hour Summary</p>
          <p class="text-sm text-surface-500">Totals computed from the fetched record</p>
        </header>

        <div v-if="loading" class="space-y-2">
          <Skeleton v-for="state in 4" :key="state" height="1.5rem" class="rounded" />
        </div>
        <Message v-else-if="loadError" severity="error" :closable="false">
          {{ loadError }}
        </Message>
        <dl v-else-if="attendanceForUi" class="space-y-2 text-sm text-surface-600">
          <div
            v-for="metric in summaryEntries"
            :key="metric.label"
            class="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <dt class="font-medium text-surface-500">{{ metric.label }}</dt>
            <dd class="font-semibold text-surface-900">{{ metric.value }}</dd>
          </div>
        </dl>
        <Message v-else severity="info" :closable="false">
          Waiting for computed hours from the attendance engine.
        </Message>
      </section>

      <section class="rounded-lg border border-slate-200 bg-white p-5">
        <header class="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-lg font-semibold text-surface-900">Schedule Reference</p>
            <p class="text-sm text-surface-500">
              Shift window used when flagging this issue
            </p>
          </div>
        </header>

        <div v-if="loading" class="space-y-2">
          <Skeleton
            v-for="state in 3"
            :key="`sched-${state}`"
            height="1.5rem"
            class="rounded"
          />
        </div>
        <Message v-else-if="loadError" severity="warn" :closable="false">
          Unable to load schedule details.
        </Message>
        <dl v-else-if="hasSchedule" class="space-y-2 text-sm text-surface-600">
          <div
            v-for="item in scheduleEntries"
            :key="item.label"
            class="flex items-center justify-between rounded border border-slate-100 bg-slate-50 px-3 py-2"
          >
            <dt class="font-medium text-surface-500">{{ item.label }}</dt>
            <dd class="font-semibold text-surface-900">{{ item.value }}</dd>
          </div>
        </dl>
        <Message v-else severity="info" :closable="false">
          No schedule information was returned for this employee on the selected date.
        </Message>
      </section>
    </div>
  </div>
</template>
