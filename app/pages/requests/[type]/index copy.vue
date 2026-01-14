<script setup lang="ts">
import dayjs from 'dayjs';
import type { PaginationMeta } from '~/types/common';
import type { AttendanceRequest } from '~/types/attendanceRequests';

import { useAttendanceRequestsApi } from '~/composables/api/useAttendanceRequestsApi';

definePageMeta({
  title: 'Certificate of Attendance'
})

useHead({
  title: 'Certificate of Attendance | My Portal'
})

const skeletonLoading = ref(false);
const loadingMore = ref(false);
const errorMessage = ref<string | null>(null);

const showCreateDrawer = ref(false);
const creating = ref(false);

type CreateAttendanceRequestPayload = {
  request_type: string;
  att_date: string;
  destination?: string | null;
  purpose?: string | null;
  logs?: {
    time_in?: string;
    break_out?: string;
    break_in?: string;
    time_out?: string;
    [k: string]: string | undefined;
  };
  remarks?: string | null;
};

const createForm = ref<{
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
}>({
  request_type: 'COA',
  att_date: null,
  destination: '',
  purpose: '',
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
  remarks: '',
});

const requests = ref<AttendanceRequest[]>([]);
const meta = ref<PaginationMeta | null>(null);

const { get, create } = useAttendanceRequestsApi();

const toast = useToast();

const hasMore = computed(() => {
  if (!meta.value) return false;
  return meta.value.current_page < meta.value.last_page;
});

const formatDate = (date: string) => dayjs(date).format('MMMM DD, YYYY').toUpperCase();
const dayLabel = (date: string) => dayjs(date).format('dddd');

const requestTypeLabel = (code: string) => {
  const normalized = (code ?? '').toUpperCase();
  const map: Record<string, string> = {
    OT: 'Overtime',
    COA: 'Certificate of Attendance',
  };
  return map[normalized] ?? normalized;
};

const requestTypeTagClass = (code: string) => {
  const normalized = (code ?? '').toUpperCase();
  if (normalized === 'OT') return '!bg-orange-50 !text-orange-500';
  if (normalized === 'COA') return '!bg-indigo-50 !text-indigo-500';
  return '!bg-orange-50 !text-orange-500';
};

const statusSeverity = (status: string) => {
  const normalized = (status ?? '').toLowerCase();
  if (normalized === 'approved') return 'success';
  if (normalized === 'rejected') return 'danger';
  return 'warn';
};

const statusLabel = (status: string) => {
  const normalized = (status ?? '').toLowerCase();
  if (!normalized) return '';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const fetchPage = async (page: number, append = false) => {
  errorMessage.value = null;

  if (page === 1 && !append) skeletonLoading.value = true;
  if (append) loadingMore.value = true;

  try {
    const response = await get<AttendanceRequest[]>({ page });

    if (response.success) {
      requests.value = append ? [...requests.value, ...(response.data ?? [])] : (response.data ?? []);
      meta.value = response.meta ?? null;
      return;
    }

    errorMessage.value = 'Unable to load attendance requests.';
  } catch {
    errorMessage.value = 'Unable to load attendance requests.';
  } finally {
    skeletonLoading.value = false;
    loadingMore.value = false;
  }
};

const refresh = async (_reload = false) => {
  requests.value = [];
  meta.value = null;
  await fetchPage(1, false);
};

const resetCreateForm = () => {
  createForm.value = {
    request_type: '',
    att_date: null,
    destination: '',
    purpose: '',
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
    remarks: '',
  };
};

const submitCreate = async () => {
  if (!createForm.value.att_date) {
    toast.add({ severity: 'warn', summary: 'Missing field', detail: 'Please select a date.', life: 3000 });
    return;
  }

  const payload: CreateAttendanceRequestPayload = {
    request_type: createForm.value.request_type,
    att_date: dayjs(createForm.value.att_date).format('YYYY-MM-DD'),
    destination: createForm.value.destination?.trim() || null,
    purpose: createForm.value.purpose?.trim() || null,
    remarks: createForm.value.remarks?.trim() || null,
    logs: {
      tt1_in: createForm.value.tt1_in?.trim() || undefined,
      tt1_out: createForm.value.tt1_out?.trim() || undefined,
      tt2_in: createForm.value.tt2_in?.trim() || undefined,
      tt2_out: createForm.value.tt2_out?.trim() || undefined,
      tt3_in: createForm.value.tt3_in?.trim() || undefined,
      tt3_out: createForm.value.tt3_out?.trim() || undefined,
      tt4_in: createForm.value.tt4_in?.trim() || undefined,
      tt4_out: createForm.value.tt4_out?.trim() || undefined,
      ot_in: createForm.value.ot_in?.trim() || undefined,
      ot_out: createForm.value.ot_out?.trim() || undefined,
    },
  };

  creating.value = true;
  try {
    const response = await create(payload as unknown as AttendanceRequest);
    if (response.success) {
      toast.add({ severity: 'success', summary: 'Success', detail: 'Attendance request submitted.', life: 3000 });
      showCreateDrawer.value = false;
      resetCreateForm();
      await refresh(true);
      return;
    }

    toast.add({ severity: 'error', summary: 'Error', detail: 'Unable to submit request.', life: 3500 });
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Unable to submit request.', life: 3500 });
  } finally {
    creating.value = false;
  }
};

const loadMore = async () => {
  if (!hasMore.value || !meta.value) return;
  await fetchPage(meta.value.current_page + 1, true);
};

onMounted(async () => {
  await refresh(false);
});

</script>

<template>
  <div class="relative">
    <PullToRefresh :disabled="skeletonLoading || loadingMore" @refresh="refresh(true)">
      <Card class="mb-6 no-padding-card">
        <template #header>
          <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-200">
            <div class="pt-1">
              <i class="pi pi-briefcase text-[#A30542]" />
            </div>
            <div class="flex items-center justify-between w-full gap-4">
              <h2 class="text-lg font-medium">Attendance Requests</h2>
              <div class="flex items-center gap-3">
                <Button
                  label="Create Request"
                  icon="pi pi-plus"
                  severity="secondary"
                  variant="contrast"
                  style="font-size: 14px;"
                  @click="showCreateDrawer = true"
                />
                <div v-if="!skeletonLoading" class="text-sm text-slate-500">
                  {{ requests.length }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #content>
          <Message v-if="errorMessage" severity="error" :closable="false" class="m-4">
            {{ errorMessage }}
          </Message>

          <div v-else-if="skeletonLoading" class="divide-y divide-slate-200">
            <div v-for="i in 3" :key="i" class="flex items-start justify-between p-4">
              <div class="flex flex-col items-start gap-2">
                <Skeleton width="10rem" class="mb-1" />
                <Skeleton width="8rem" class="mb-1" />
                <Skeleton width="12rem" />
              </div>
              <Skeleton width="6rem" />
            </div>
          </div>

          <Message v-else-if="requests.length === 0" severity="info" :closable="false" class="m-4">
            No attendance requests found.
          </Message>

          <div v-else>
            <div v-for="req in requests" :key="req.id">
              <div class="flex items-start justify-between p-4">
                <div class="flex flex-col items-start gap-1">
                  <div class="font-bold text-xs">{{ formatDate(req.att_date) }}</div>

                  <div class="flex items-center gap-2">
                    <Tag
                      :class="requestTypeTagClass(req.request_type)"
                      :value="requestTypeLabel(req.request_type)"
                      style="font-size: 10px;"
                    />
                    <Tag
                      :severity="statusSeverity(req.status)"
                      :value="statusLabel(req.status)"
                      style="font-size: 10px;"
                    />
                  </div>

                  <div v-if="req.destination || req.purpose" class="text-sm text-slate-600">
                    <span v-if="req.destination">{{ req.destination }}</span>
                    <span v-if="req.destination && req.purpose"> • </span>
                    <span v-if="req.purpose">{{ req.purpose }}</span>
                  </div>
                </div>

                <div class="text-[#4D4D4D] text-sm">
                  {{ dayLabel(req.att_date) }}
                </div>
              </div>
              <div class="border-t border-slate-200" />
            </div>

            <div v-if="hasMore" class="flex items-start justify-center">
              <Button
                label="See More"
                severity="info"
                variant="text"
                :loading="loadingMore"
                @click="loadMore"
              />
            </div>
          </div>
        </template>
      </Card>
    </PullToRefresh>

    <Drawer
      v-model:visible="showCreateDrawer"
      class=" max-w-[768px]"
      :pt="{ content: { style: 'padding:0' } }"
      :dismissable="false"
      position="full"
      style="height: auto"
      header="Create Attendance Request"
       
      @close="showCreateDrawer = false"
    >
      <div class="px-4 py-2">
        <div class="field py-2">
          <label class="block font-medium">Request Type</label>
          <Select
            v-model="createForm.request_type"
            class="w-full"
            :options="[
              { id: 'OT', title: 'Overtime (OT)' },
              { id: 'COA', title: 'Certificate of Attendance (COA)' },
            ]"
            option-label="title"
            option-value="id"
            placeholder="Select Type"
          />
        </div>

        <div class="field py-2">
          <label class="block font-medium">Date</label>
          <DatePicker
            v-model="createForm.att_date"
            class="w-full"
            date-format="MM dd, yy"
            :manual-input="false"
            show-icon
            placeholder="Select Date"
          />
        </div>
 

        <div class="field py-2">
          <label class="block font-medium">Purpose</label>
          <InputText v-model="createForm.purpose" class="w-full" />
        </div>

        <div class="py-2">
          <Card
            class="border border-slate-200"
            :pt="{ body: { style: 'padding: 0 !important;' } }"
          >
            <template #header>
              <div class="flex items-center gap-2 px-4 py-2 border-b border-slate-200">
                <div>
                  <i class="pi pi-clock text-[#A30542]" />
                </div>
                <div>
                  <h2 class="text-lg font-medium">Logs (Optional)</h2>
                </div>
              </div>
            </template>

            <template #content>
              <div v-if="createForm.request_type === 'OT'" class="px-4 py-3 grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium">OT In</label>
                  <InputText v-model="createForm.ot_in" class="w-full" placeholder="08:00" />
                </div>
                <div>
                  <label class="block text-sm font-medium">OT Out</label>
                  <InputText v-model="createForm.ot_out" class="w-full" placeholder="17:30" />
                </div>
              </div>
            </template>
          </Card>
        </div>
 
      </div>

      <div class="mt-4 w-full sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <Button
          label="Submit"
          icon="pi pi-send"
          class="w-full"
          :loading="creating"
          @click="submitCreate"
        />
      </div>
    </Drawer>
  </div>

</template>

<style scoped>
.no-padding-card :deep(.p-card-body) {
  padding: 0 !important;
}
</style>
