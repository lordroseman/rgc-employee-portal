<script setup lang="ts">
import type { FormSubmitEvent } from "@primevue/forms/form";
// import { zodResolver } from "@primevue/forms/resolvers/zod";
import { EmployeeLeaveSchema, type EmployeeLeave } from "~/types/leaves";
import dayjs from "dayjs";

const toast = useToast();
const loading = useLoading()

defineProps<{
  modelValue: boolean;
}>();

const formRef = ref()
const submitted = ref(false)

const emit = defineEmits(["update:modelValue", "close"]);

const employeeLeaveStore = useEmployeeLeaveStore()
const { leaveDayType, leaveType } = employeeLeaveStore

const dateRange = ref<[Date | null, Date | null] | null>(null)
const daysList = ref<{ date: Date; dayType: number | null }[]>([])

watch(dateRange, (val) => {
  if (!val || !val[0] || !val[1]) {
    // daysList.value = []
    // formRef.value?.setFieldValue?.('date_from', null)
    // formRef.value?.setFieldValue?.('date_to', null)
    return
  }

//   formRef.value?.setFieldValue?.('date_from', val[0])
//   formRef.value?.setFieldValue?.('date_to', val[1])

  const start = new Date(val[0])
  const end = new Date(val[1])
  const days: { date: Date; dayType: number | null }[] = []

  const current = new Date(start)
  while (current <= end) {
    const currentDateStr = dayjs(current).format("YYYY-MM-DD")

    // 1️⃣ find from existing daysList (preserve user selection)
    const existing = daysList.value.find(
      (d) => dayjs(d.date).format("YYYY-MM-DD") === currentDateStr
    )

    // 2️⃣ if not in daysList but exists in selectedEmployeeLeave (initial load), preserve that too
    const dayType = existing ? existing.dayType : null
    // if (!dayType && props.selectedEmployeeLeave) {
    //   const fromSelected = props.selectedEmployeeLeave.leave_breakdown?.find(
    //     (d) => d.date === currentDateStr
    //   )
    //   if (fromSelected) {
    //     dayType = fromSelected.duration
    //   }
    // }

    days.push({
      date: new Date(current),
      dayType
    })

    current.setDate(current.getDate() + 1)
  }

  submitted.value = false
  daysList.value = days

  formRef.value?.setFieldValue?.(
    "leave_breakdown",
    days.map((d) => ({
      date: dayjs(d.date).format("YYYY-MM-DD"),
      duration: d.dayType ?? null, // keep selected type if available
    }))
  )
});

watch(daysList, (val) => {
  formRef.value?.setFieldValue?.(
    "leave_breakdown",
    val.map((d) => ({
      date: dayjs(d.date).format("YYYY-MM-DD"),
      duration: d.dayType, // map directly
    }))
  );
}, { deep: true });

const onFormSubmit = async ({ valid, values, errors } : FormSubmitEvent) => {
  
    const mergedValues = {
        ...values,
        leave_breakdown: values?.leave_breakdown ?? daysList.value.map((d) => ({
        date: dayjs(d.date).format("YYYY-MM-DD"),
        duration: d.dayType,
        })),
        date_from: dateRange.value?.[0] ? new Date(dateRange.value[0]) : null,
        date_to: dateRange.value?.[1] ? new Date(dateRange.value[1]) : null
    }

    console.log('-- valid --', valid);
    console.log('-- values --', values);
    console.log('-- errors --', errors);
    console.log('-- mergedValues --', mergedValues);
    // console.log('-- errors --', backendError);

    const result = EmployeeLeaveSchema.safeParse(mergedValues)

    // console.log("result", result)
    if (!result.success) {
        console.log('error', result.error);
        return
    }

    let response = null
    loading.value = true;
    // if(props.selectedEmployeeLeave) {
    //     const changes : Partial<EmployeeLeave> = useDifference<EmployeeLeave>(result.data as EmployeeLeave, form.value);
    //     // console.log('-- changes --', changes)
    //     response = await employeeLeaveStore.updateEmployeeLeave(props.selectedEmployeeLeave!.id!, changes);
    // } else {
    response =  await employeeLeaveStore.createEmployeeLeave(result.data as EmployeeLeave)
    // }

    if(response && response.error) {
        const { error } = response;
        console.log(error)
        // backendError.value = error.data?.errors
    } else {
         toast.add({
            severity: 'success',
            summary: 'Success',
            detail: `Employee Leave has been saved successfully`,
            life: 3000
        })
        // close modal
        emit("update:modelValue", false);
    }

    loading.value = false;
};
</script>

<template>
    <Form class="" @submit="onFormSubmit">
        <div class="formgrid">
            <div class="field px-4 py-2">
                <label for="leave_date" class="block font-medium">Leave Date</label>
                <DatePicker 
                    v-model="dateRange"
                    class="w-full"
                    selection-mode="range" 
                    date-format="MM dd, yy" 
                    :manual-input="false" 
                    show-icon
                    placeholder="Select Date Range"
                    hide-on-range-selection
                />
            </div>

            <div class="field px-4 py-2">
                <label for="leave_type" class="block font-medium">Leave Type</label>
                <Select
                    id="leaveType"
                    class="w-full"
                    name="leave_type"
                    :options="leaveType"
                    option-label="title"
                    option-value="id"
                    placeholder="Select Leave Type"
                />
                <!-- v-model="form.lastName" -->
            </div>

            <div class="field px-4 py-2">
                <label for="reason" class="block font-medium">Reason</label>
                <Textarea
                    id="reason"
                    name="reason"
                    rows="2"
                    auto-resize
                    placeholder=""
                    class="w-full"
                />
            </div>
            
            <div class="px-4 py-2">
                <Card
class="border border-slate-200"
                    :pt="{
                        body: { style: 'padding: 0 !important;' }
                    }"
                >
                    <template #header>
                    <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-200">
                        <div>
                            <i class="pi pi-sliders-h text-[#A30542]"/>
                        </div>
                        <div>
                            <h2 class="text-lg font-medium">Leave Breakdown</h2>
                        </div>
                    </div>
                    </template>

                    <template #content>
                        <div v-if="daysList.length === 0" class="flex p-4 text-gray-500 italic">
                            Please select a date range to break down your leave days.
                        </div>

                        <div
                            v-for="(item, index) in daysList"
                            v-else
                            :key="index"
                            class="flex items-center justify-between gap-6 basis-1/2 px-4 py-2"
                            :class="[
                                index % 2 === 0 ? 'bg-[#f7f7f7]' : '',
                                submitted && (item.dayType == null || item.dayType === 0) ? 'border-l-2 border-red-500' : ''
                            ]"
                            >
                            <!-- Left column -->
                            <div class="flex">
                                <div class="text-sm font-bold text-gray-900">{{ dayjs(item.date).format('MMMM DD, YYYY') }}</div>
                            </div>

                            <div class="flex basis-1/2">
                                <Select
                                    id="leaveType"
                                    v-model="item.dayType"
                                    class="w-full"
                                    :options="leaveDayType"
                                    option-label="title"
                                    option-value="id"
                                    placeholder="Select Day Type"
                                />
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Actions -->
            <div class="mt-8 w-full sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
                <Button type="submit" label="Submit" icon="pi pi-send" class="w-full" />
            </div>
        </div>
    </Form>
</template>