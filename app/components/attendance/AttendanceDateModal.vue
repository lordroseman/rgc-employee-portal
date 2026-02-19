<script setup lang="ts">
// import type { FormSubmitEvent } from "@primevue/forms/form";
// import { zodResolver } from "@primevue/forms/resolvers/zod";
// import { CompanySchema, type Company } from "~/types/employees";
import dayjs, { type ConfigType } from "dayjs";

const props = defineProps<{
  modelValue: boolean;
  type: string;
}>();

const emit = defineEmits(["update:modelValue", "filter", "download"]);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});



function formatRangeDate(value: ConfigType | null | undefined) {
  if (!value) {
    return "";
  }

  const date = dayjs(value);
  return date.isValid() ? date.format("YYYY-MM-DD") : "";
}

function onFilterClick() {
  emit("filter",  {
    from: formatRangeDate(dateHolder.value[0]),
    to: formatRangeDate(dateHolder.value[1]),
  }) // notify parent
}

function onDownloadClick() {
  emit("download",  {
    from: formatRangeDate(dateHolder.value[0]),
    to: formatRangeDate(dateHolder.value[1]),
  }) // notify parent
}

// const toast = useToast();
const dateHolder = ref<(Date | null)[]>([]);

</script>

<template>
    <Dialog
      v-model:visible="show"
      :header="type == 'download' ? 'Download DTR' : 'View by Date Range'"
      :modal="true"
      :style="{ maxWidth: '700px' }"
    >
      <DateRangePicker v-model="dateHolder" />

      <div class="flex justify-end gap-2 mt-4">
        <Button v-if="type == 'download'" type="submit" label="Download Report" @click="onDownloadClick" />
        <Button v-else type="submit" label="View Data" @click="onFilterClick" />
      </div>
    </Dialog>
</template>