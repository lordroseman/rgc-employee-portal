<script setup lang="ts">
import { ref, useAttrs, watch } from "vue";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    disabled?: boolean;
  }>(),
  {
    modelValue: null,
    disabled: false,
  }
);
const emit = defineEmits<{
  (event: "update:modelValue", value: string | null): void;
  (event: "focus" | "blur", value: FocusEvent): void;
}>();

const attrs = useAttrs();
const displayValue = ref("");

const formatForDisplay = (value: string | null): string => {
  if (!value) return "";
  const [hr = "", minRaw = "00"] = value.split(":");
  if (!hr) return "";
  const hour = Number.parseInt(hr, 10);
  if (!Number.isFinite(hour)) return "";
  const safeMinutes = Number.parseInt(minRaw, 10);
  if (!Number.isFinite(safeMinutes)) return "";
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const paddedHour = hour12.toString().padStart(2, "0");
  const paddedMin = safeMinutes.toString().padStart(2, "0");
  return `${paddedHour}:${paddedMin} ${period}`;
};

const parseInput = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();
  const periodMatch = lower.match(/(am|pm)$/);
  const period = periodMatch ? periodMatch[1] : null;
  let core = period ? lower.slice(0, -period.length) : lower;
  core = core.replace(/\s+/g, "");
  if (!core) return null;

  let hourPart = "";
  let minutePart = "";

  if (core.includes(":")) {
    const segments = core.split(":");
    hourPart = segments[0] ?? "";
    minutePart = segments[1] ?? "";
  } else {
    if (core.length <= 2) {
      hourPart = core;
      minutePart = "";
    } else if (core.length === 3) {
      hourPart = core.slice(0, 1);
      minutePart = core.slice(1);
    } else if (core.length === 4) {
      hourPart = core.slice(0, 2);
      minutePart = core.slice(2);
    } else {
      return null;
    }
  }

  if (!hourPart) return null;
  let hour = Number.parseInt(hourPart, 10);
  if (!Number.isFinite(hour)) return null;
  const minute = minutePart ? Number.parseInt(minutePart, 10) : 0;
  if (!Number.isFinite(minute)) return null;
  if (minute < 0 || minute > 59) return null;

  if (period) {
    if (hour < 1 || hour > 12) return null;
    if (period === "am" && hour === 12) {
      hour = 0;
    } else if (period === "pm" && hour !== 12) {
      hour += 12;
    }
  } else {
    if (hour < 0 || hour > 23) return null;
  }

  const normalizedHour = hour.toString().padStart(2, "0");
  const normalizedMinute = minute.toString().padStart(2, "0");
  return `${normalizedHour}:${normalizedMinute}`;
};

const commitValue = () => {
  const parsed = parseInput(displayValue.value);
  emit("update:modelValue", parsed);
  displayValue.value = formatForDisplay(parsed);
};

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | undefined;
  displayValue.value = target?.value ?? "";
};

const onBlur = (event: FocusEvent) => {
  commitValue();
  emit("blur", event);
};

const onEnter = (event: KeyboardEvent) => {
  event.preventDefault();
  commitValue();
};

const onFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement | null;
  target?.select();
  emit("focus", event);
};

watch(
  () => props.modelValue,
  (value) => {
    displayValue.value = formatForDisplay(value ?? null);
  },
  { immediate: true }
);
</script>

<template>
  <InputText
    v-bind="attrs"
    :value="displayValue"
    :disabled="props.disabled"
    :class="['time-input', attrs.class]"
    @input="onInput"
    @blur="onBlur"
    @keydown.enter="onEnter"
    @focus="onFocus"
  />
</template>

<style scoped>
.time-input {
  border: 1px solid transparent;
  background-color: transparent;
  box-shadow: none;
  transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;

  &.has-border {
    border-color: #d1d5db; /* Tailwind slate-300 */
  }
}

.time-input:focus {
  outline: none;
  border-color: rgba(16, 185, 129, 0.45);
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(16, 185, 129, 0.25);
}
</style>
