import { defineStore } from 'pinia';
import type { PaginationMeta } from '~/types/common';
import type { AttendanceRequest } from '~/types/attendanceRequests'; 

type AttendanceRequestsFilter = {
  status?: string;
  type?: string;
};

const normalizeStatus = (value?: string | null) => (value ?? '').trim().toLowerCase();
const normalizeType = (value?: string | null) => (value ?? '').trim().toUpperCase();

export const useAttendanceRequestsStore = defineStore('attendanceRequests', () => {
  const requests = ref<AttendanceRequest[]>([]);
  const meta = ref<PaginationMeta | null>(null);

  const loading = ref(false);
  const loadingMore = ref(false);
  const errorMessage = ref<string | null>(null);

  const { get } = useCrudApi<AttendanceRequest>(`/api/portal/attendance/requests`);

  const hasMore = computed(() => {
    if (!meta.value) return false;
    return meta.value.current_page < meta.value.last_page;
  });

  const fetchPage = async (page: number, append = false) => {
    errorMessage.value = null;

    if (append) loadingMore.value = true;
    else loading.value = true;

    try {
      const response = await get<AttendanceRequest[]>({ page });

      if (response.success) {
        const next = response.data ?? [];
        requests.value = append ? [...requests.value, ...next] : next;
        meta.value = response.meta ?? null;
        return response;
      }

      errorMessage.value = 'Unable to load attendance requests.';
      return response;
    } catch (error) {
      errorMessage.value = 'Unable to load attendance requests.';
      throw error;
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  };

  const refresh = async () => {
    requests.value = [];
    meta.value = null;
    await fetchPage(1, false);
  };

  const getByStatusAndType = (status?: string, type?: string) => {
    const desiredStatus = status ? normalizeStatus(status) : null;
    const desiredType = type ? normalizeType(type) : null;

    return requests.value.filter((request) => {
      const matchesStatus = desiredStatus ? normalizeStatus(request.status) === desiredStatus : true;
      const matchesType = desiredType ? normalizeType(request.request_type) === desiredType : true;
      return matchesStatus && matchesType;
    });
  };

  const getBy = (filter: AttendanceRequestsFilter) => {
    return getByStatusAndType(filter.status, filter.type);
  };

  const reset = () => {
    requests.value = [];
    meta.value = null;
    errorMessage.value = null;
    loading.value = false;
    loadingMore.value = false;
  };

  const pendingRequests = computed(() => getByStatusAndType('pending'));

  return {
    requests,
    meta,
    loading,
    loadingMore,
    errorMessage,
    hasMore,
    pendingRequests,
    fetchPage,
    refresh,
    getByStatusAndType,
    getBy,
    reset,
  };
});
