<script setup lang="ts">
import dayjs from "dayjs";

const daysList = inject("daysList") as Ref<
  { date: Date; dayType: number; paid: boolean }[]
>;

const { leaveDayType, leaveBalance } = useEmployeeLeaveStore();

const PREVIEW_COUNT = 3;
const showManage = ref(false);

const previewDays = computed(() => daysList.value.slice(0, PREVIEW_COUNT));
const extraCount = computed(() => Math.max(0, daysList.value.length - PREVIEW_COUNT));

// Auto-assign paid based on remaining SIL balance.
// Whole Day (1) consumes 1 day, Half Day (2) consumes 0.5 days.
function recomputePaid() {
  const remaining = leaveBalance?.sil_balance?.remaining_days ?? 0;
  let consumed = 0;
  for (const day of daysList.value) {
    const cost = day.dayType === 2 ? 0.5 : 1;
    day.paid = consumed + cost <= remaining;
    consumed += cost;
  }
}

watch(
  () => [daysList.value.map((d) => d.dayType), leaveBalance?.sil_balance?.remaining_days],
  () => recomputePaid(),
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="px-4 py-2">
    <Card
      class="border border-slate-200 !shadow-none"
      :pt="{ body: { style: 'padding: 0 !important;' } }"
    >
      <!-- Header -->
      <template #header>
        <div
          class="flex items-center justify-between px-4 py-2 border-b border-slate-200"
        >
          <div class="flex items-center gap-2">
            <i class="pi pi-sliders-h text-[#A30542]" />
            <h2 class="text-base font-medium">Leave Breakdown</h2>
            <span
              v-if="daysList.length > 0"
              class="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full"
            >
              {{ daysList.length }} day{{ daysList.length !== 1 ? "s" : "" }}
            </span>
          </div>
          <Button
            v-if="daysList.length > 0"
            label="Manage Dates"
            icon="pi pi-pencil"
            size="small"
            text
            @click="showManage = true"
          />
        </div>
      </template>

      <!-- Summary content -->
      <template #content>
        <!-- Empty state -->
        <div
          v-if="daysList.length === 0"
          class="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 italic"
        >
          <i class="pi pi-calendar text-gray-300" />
          Select a date range above to set up your leave days.
        </div>

        <template v-else>
          <!-- Column headers -->
          <div class="grid grid-cols-3 px-4 py-1.5 border-b border-slate-100 bg-slate-50">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >Date</span
            >
            <span
              class="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center"
              >Duration</span
            >
            <span
              class="text-xs font-semibold text-slate-400 uppercase tracking-wide text-center"
              >Pay</span
            >
          </div>

          <!-- Preview rows -->
          <div
            v-for="(item, index) in previewDays"
            :key="index"
            class="grid grid-cols-3 items-center px-4 py-2 border-b border-slate-100 last:border-b-0"
            :class="{
              'bg-[#f7f7f7]': index % 2 === 0,
              'bg-white': index % 2 !== 0,
              'last:rounded-b-lg': index === previewDays.length - 1 && extraCount === 0,
            }"
          >
            <div>
              <span class="text-xs font-semibold text-slate-500 uppercase">{{
                dayjs(item.date).format("ddd")
              }}</span>
              <span class="ml-1 text-sm font-medium text-gray-900">{{
                dayjs(item.date).format("MMM DD")
              }}</span>
            </div>
            <div class="text-center">
              <span class="text-xs font-medium text-slate-600">
                {{ item.dayType === 1 ? "Whole Day" : "Half Day" }}
              </span>
            </div>
            <div class="text-center">
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="
                  item.paid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                "
              >
                {{ item.paid ? "With Pay" : "No Pay" }}
              </span>
            </div>
          </div>

          <!-- +X more -->
          <button
            v-if="extraCount > 0"
            type="button"
            class="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-[#A30542] bg-red-50 hover:bg-red-100 transition-colors rounded-b-lg"
            @click="showManage = true"
          >
            <i class="pi pi-plus text-[10px]" />
            {{ extraCount }} more day{{ extraCount !== 1 ? "s" : "" }} — tap to manage
          </button>
        </template>
      </template>
    </Card>
  </div>

  <!-- Manage Dates Dialog -->
  <Dialog
    v-model:visible="showManage"
    modal
    header="Manage Leave Dates"
    :style="{ width: '95vw', maxWidth: '560px' }"
    :pt="{
      header: { class: 'border-b border-slate-200 pb-3' },
      content: { class: 'p-0' },
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-sliders-h text-[#A30542]" />
        <span class="font-semibold text-base">Manage Leave Dates</span>
        <span
          class="text-xs bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded-full"
        >
          {{ daysList.length }} day{{ daysList.length !== 1 ? "s" : "" }}
        </span>
      </div>
    </template>

    <!-- Desktop column headers -->
    <div
      class="hidden sm:grid sm:grid-cols-[1fr_auto_auto] items-center gap-x-3 px-4 py-2 border-b border-slate-100 bg-slate-50"
    >
      <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
        >Date</span
      >
      <span
        class="text-xs font-semibold text-slate-400 uppercase tracking-wide w-[152px] text-center"
        >Duration</span
      >
      <span
        class="text-xs font-semibold text-slate-400 uppercase tracking-wide w-[80px] text-center"
        >Pay</span
      >
    </div>

    <!-- Editable rows -->
    <div class="max-h-[60vh] overflow-y-auto">
      <div
        v-for="(item, index) in daysList"
        :key="index"
        class="px-4 py-2.5 border-b border-slate-100 last:border-b-0 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-x-3"
        :class="index % 2 === 0 ? 'bg-[#f7f7f7]' : 'bg-white'"
      >
        <!-- Date -->
        <div class="mb-2 sm:mb-0">
          <span class="text-xs font-semibold text-slate-500 uppercase">{{
            dayjs(item.date).format("ddd")
          }}</span>
          <span class="ml-1 text-sm font-medium text-gray-900">{{
            dayjs(item.date).format("MMM DD, YYYY")
          }}</span>
        </div>

        <!-- Duration -->
        <div class="flex items-center justify-between gap-2 mb-2 sm:mb-0 sm:block">
          <span class="text-xs text-slate-400 font-medium sm:hidden">Duration</span>
          <SelectButton
            v-model="item.dayType"
            :options="leaveDayType"
            option-label="title"
            option-value="id"
            :pt="{
              root: { class: 'flex' },
              button: {
                class: 'text-xs px-3 py-1.5 flex-1 sm:flex-none sm:px-2.5 sm:py-1',
              },
            }"
          />
        </div>

        <!-- Pay (read-only) -->
        <div class="flex items-center justify-between gap-2 sm:justify-center">
          <span class="text-xs text-slate-400 font-medium sm:hidden">Pay</span>
          <span
            class="text-xs font-medium px-2 py-0.5 rounded-full"
            :class="
              item.paid ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            "
          >
            {{ item.paid ? "With Pay" : "No Pay" }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <Button
        label="Done"
        icon="pi pi-check"
        class="w-full"
        @click="showManage = false"
      />
    </template>
  </Dialog>
</template>
