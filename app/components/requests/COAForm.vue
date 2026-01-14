<script setup lang="ts"> 
import type { AttendanceDetail, AttendanceRequestFormState } from "~/types/attendance";

const props = defineProps<{
  modelValue: AttendanceRequestFormState;
}>();

const emit = defineEmits<{
  "update:modelValue": [AttendanceRequestFormState | null];
}>();

const attendanceRequest = computed({
  get: () => props.modelValue || null,
  set: (value: AttendanceRequestFormState | null) => emit("update:modelValue", value),
});

const attendance = ref<AttendanceDetail | null>(null);
const loading = ref(false);
const loadError = ref<string | null>(null);

type TimeValidation = {
  fieldErrors: Partial<Record<keyof AttendanceDetail, string>>;
  summaryErrors: string[];
  hasErrors: boolean;
};

const panelValidation = ref<TimeValidation>({
  fieldErrors: {},
  summaryErrors: [],
  hasErrors: false,
});
 

const timeFields = [
  "tt1_in",
  "tt1_out",
  "tt2_in",
  "tt2_out",
  "tt3_in",
  "tt3_out",
  "tt4_in",
  "tt4_out",
] as const;

watch(
  () => timeFields.map((f) => attendance.value?.[f]),
  (newVals, oldVals) => {
    if (!attendanceRequest.value) return;

    const nextLogs = { ...attendanceRequest.value.logs };
    let changed = false;

    timeFields.forEach((field, idx) => {
      if (newVals[idx] !== oldVals[idx]) {
        nextLogs[field] = attendance.value?.[field] ?? null;
        changed = true;
      }
    });

    if (changed) {
      attendanceRequest.value.logs = nextLogs;
    }
  }
);

const handleValidationChanged = (value: TimeValidation) => {
  panelValidation.value = value;
};
</script>

<template>
  <AttendanceTimePanels
    v-model:attendance="attendance"
    :initial-logs="attendanceRequest?.logs || {}"
    :loading="loading"
    :load-error="loadError"
    :warn-on-empty="false"
    @validation-changed="handleValidationChanged"
  />
</template>
