<script setup lang="ts">
import dayjs from 'dayjs';
import type { AttendanceRequest } from '~/types/attendanceRequests';

import { useAttendanceRequestsApi } from '~/composables/api/useAttendanceRequestsApi';

const route = useRoute();
 
const appStore = useAppStore();


appStore.pageTitle = route.params.type === 'ot' ? 'Overtime Requests' : 'Certificate of Attendance';

useHead(() => ({
  title: `${appStore.pageTitle} | My Portal`,
}));

const requestType = computed(() => {
  const typeParam = route.params.type;
  const type = typeof typeParam === 'string' ? typeParam.toLowerCase() : '';
  return type === 'ot' ? 'OT' : 'COA';
});

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
  request_type: requestType.value,
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

const attendanceRequestsStore = useAttendanceRequestsStore();
const { loading, loadingMore } =
  storeToRefs(attendanceRequestsStore);

const { create } = useAttendanceRequestsApi();

const toast = useToast();


const refresh = async (_reload = false) => {
  await attendanceRequestsStore.refresh();
};

const resetCreateForm = () => {
  createForm.value = {
    request_type: requestType.value,
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

const attachButton = ref(false);

onMounted(async () => {
  await refresh(false); 
  attachButton.value = true;
});

</script>

<template>
  <div class="relative"> 
    <PullToRefresh :disabled="loading || loadingMore" @refresh="refresh(true)">

      <div class="bg-white rounded-lg flex flex-col">
        <Button
icon="pi pi-plus" :label="`New ${requestType === 'OT' ? 'Overtime' : 'Certificate of Attendance'}`" class="mt-4 mr-4 ml-auto"
          @click="showCreateDrawer = true" />
        <RequestsTab :type="requestType" />
      </div>
    </PullToRefresh>

    <Teleport v-if="attachButton" to="#fab-container">
      <Button
v-tooltip.left="'Add New Request'" icon="pi pi-plus" aria-label="Add Request" class="text-white " rounded
        raised size="large" />
    </Teleport>

    <Drawer
v-model:visible="showCreateDrawer" class=" max-w-[768px]" :pt="{ content: { style: 'padding:0' } }"
      :dismissable="false" position="full" style="height: auto" :header="requestType === 'OT' ? 'Overtime Request' : 'Certificate of Attendance Request'"
      @close="showCreateDrawer = false">
      <RequestForm v-model="createForm" />

      <div class="mt-4 w-full sticky bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_6px_rgba(0,0,0,0.1)]">
        <Button label="Submit" icon="pi pi-send" class="w-full" :loading="creating" @click="submitCreate" />
      </div>
    </Drawer>
  </div>

</template>

<style scoped>
.no-padding-card :deep(.p-card-body) {
  padding: 0 !important;
}
</style>
