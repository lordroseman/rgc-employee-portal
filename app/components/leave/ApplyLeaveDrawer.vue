<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms/form";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { EmployeeLeaveSchema, type EmployeeLeave } from "~/types/leaves";
import dayjs from "dayjs";

const toast = useToast();
const loading = useLoading()

defineProps<{
  modelValue: boolean;
}>();

const formRef = ref()
const submitted = ref(false)
const formErrors = ref<Record<string, string>>({})

const resolver = zodResolver(EmployeeLeaveSchema)

const emit = defineEmits(["update:modelValue", "close"]);

const employeeLeaveStore = useEmployeeLeaveStore()
const { leaveType } = employeeLeaveStore

const dateRange = ref<[Date | null, Date | null] | null>(null)
const daysList = ref<{ date: Date; dayType: number, paid: boolean }[]>([])
provide("daysList", daysList)

watch(dateRange, (val) => {
  if (!val || !val[0] || !val[1]) {
    return
  }


  const start = new Date(val[0])
  const end = new Date(val[1])
  const days: { date: Date; dayType: number, paid: boolean }[] = []

  const current = new Date(start)
  while (current <= end) {
    const currentDateStr = dayjs(current).format("YYYY-MM-DD")

    // 1️⃣ find from existing daysList (preserve user selection)
    const existing = daysList.value.find(
      (d) => dayjs(d.date).format("YYYY-MM-DD") === currentDateStr
    )

    // 2️⃣ if not in daysList but exists in selectedEmployeeLeave (initial load), preserve that too
    const dayType = existing ? existing.dayType : 1
    const paid = existing ? existing.paid : false

    days.push({
      date: new Date(current),
      dayType,
      paid
    })

    current.setDate(current.getDate() + 1)
  }

  submitted.value = false
  formErrors.value = {}
  daysList.value = days

  formRef.value?.setFieldValue?.('date_from', val[0])
  formRef.value?.setFieldValue?.('date_to', val[1])
  formRef.value?.setFieldValue?.(
    "leave_breakdown",
    days.map((d) => ({
      date: dayjs(d.date).format("YYYY-MM-DD"),
      duration: d.dayType ?? 1,
      paid: d.paid,
    }))
  )
});

watch(daysList, (val) => {
  formRef.value?.setFieldValue?.(
    "leave_breakdown",
    val.map((d) => ({
      date: dayjs(d.date).format("YYYY-MM-DD"),
      duration: d.dayType ?? 1,
      paid: d.paid,
    }))
  );
}, { deep: true });

const onFormSubmit = async ({ values } : FormSubmitEvent) => {
    submitted.value = true
    formErrors.value = {}

    const mergedValues = {
        ...values,
        leave_breakdown: daysList.value.map((d) => ({
            date: dayjs(d.date).format("YYYY-MM-DD"),
            duration: d.dayType ?? 1,
            paid: d.paid,
        })),
        date_from: dateRange.value?.[0] ? new Date(dateRange.value[0]) : null,
        date_to: dateRange.value?.[1] ? new Date(dateRange.value[1]) : null
    }

    const result = EmployeeLeaveSchema.safeParse(mergedValues)

    if (!result.success) {
        const errors: Record<string, string> = {}
        result.error.errors.forEach((err) => {
            const key = err.path.join('.')
            if (!errors[key]) errors[key] = err.message
        })
        formErrors.value = errors
        return
    }

    loading.value = true
    const response = await employeeLeaveStore.createEmployeeLeave(result.data as EmployeeLeave)

    if (response && response.error) {
        const { error } = response
        const backendErrors = error.data?.errors as Record<string, string[]> | undefined
        if (backendErrors) {
            const mapped: Record<string, string> = {}
            Object.entries(backendErrors).forEach(([key, msgs]) => {
                mapped[key] = Array.isArray(msgs) ? (msgs[0] ?? '') : msgs
            })
            formErrors.value = mapped
        }
    } else {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee Leave has been saved successfully',
            life: 3000
        })
        emit("update:modelValue", false)
    }

    loading.value = false
};
</script>

<template>
  <Form ref="formRef" class="" :resolver="resolver" @submit="onFormSubmit">
    <div class="formgrid">
      <div class="field px-4 py-2">
        <label for="leave_date" class="block font-medium">Leave Date</label>
        <DatePicker
          v-model="dateRange"
          class="w-full"
          :class="{
            'p-invalid': submitted && (!dateRange || !dateRange[0] || !dateRange[1]),
          }"
          selection-mode="range"
          date-format="MM dd, yy"
          :manual-input="false"
          show-icon
          placeholder="Select Date Range"
          hide-on-range-selection
        />
        <small
          v-if="submitted && (!dateRange || !dateRange[0] || !dateRange[1])"
          class="text-red-500"
          >Please select a date range</small
        >
        <small v-else-if="formErrors.date_from" class="text-red-500">{{
          formErrors.date_from
        }}</small>
      </div>

      <div class="field px-4 py-2">
        <label for="leave_type" class="block font-medium">Leave Type</label>
        <Select
          id="leaveType"
          class="w-full"
          :class="{ 'p-invalid': formErrors.leave_type }"
          name="leave_type"
          :options="leaveType"
          option-label="title"
          option-value="id"
          placeholder="Select Leave Type"
        />
        <small v-if="formErrors.leave_type" class="text-red-500">{{
          formErrors.leave_type
        }}</small>
      </div>

      <LeaveBreakdown />

      <div class="field px-4 py-2">
        <label for="reason" class="block font-medium">Reason</label>
        <Textarea
          id="reason"
          name="reason"
          rows="2"
          auto-resize
          placeholder=""
          class="w-full"
          :class="{ 'p-invalid': formErrors.reason }"
        />
        <small v-if="formErrors.reason" class="text-red-500">{{
          formErrors.reason
        }}</small>
      </div>

      <!-- Actions -->
      <div
        class="mt-8 w-full sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]"
      >
        <Button type="submit" label="Submit" icon="pi pi-send" class="w-full" />
      </div>
    </div>
  </Form>
</template>
