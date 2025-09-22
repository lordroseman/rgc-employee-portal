<script setup lang="ts">
// import type { FormSubmitEvent } from "@primevue/forms/form";
// import { zodResolver } from "@primevue/forms/resolvers/zod";
// import { CompanySchema, type Company } from "~/types/employees";

const props = defineProps<{
  modelValue: boolean;
  type: string;
}>();

const emit = defineEmits(["update:modelValue", "filter", "download"]);

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function onFilterClick() {
  emit("filter") // notify parent
}

function onDownloadClick() {
  emit("download") // notify parent
}

// const toast = useToast();
const dateHolder = ref([null, null]);

</script>

<template>
    <Dialog
      v-model:visible="show"
      :header="type == 'download' ? 'Download DTR' : 'View by Date Range'"
      :modal="true"
      :style="{ width: '90%' }"
    >
      <DateRangePicker
        v-model:start="dateHolder[0]"
        v-model:end="dateHolder[1]"
        label="Custom Range"
      />

      <div class="flex justify-end gap-2 mt-6">
        <Button v-if="type == 'download'" type="submit" label="Download Report" @click="onDownloadClick" />
        <Button v-else type="submit" label="View Data" @click="onFilterClick" />
      </div>
    </Dialog>
</template>