import type { AttendanceRequest } from '~/types/attendanceRequests';

export const useAttendanceRequestsApi = () => {
  const attendanceRequestsApi = useCrudApi<AttendanceRequest>(`/api/portal/attendance/requests`);

  return {
    ...attendanceRequestsApi,
  };
};
