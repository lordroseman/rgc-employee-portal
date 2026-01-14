// import type { PaginationRequestParam } from "~/types/common";
import type { Attendance, AttendanceDetail } from "~/types/attendance";
// import { useCrudApi } from "./useCrudApi";

export const useAttendanceApi = () => {
    const config = useRuntimeConfig();

    const employeeAttendanceApi = useCrudApi<Attendance>(`/api/portal/attendance`);

    const endpoint = `${config.public.hrisApiUrl}/api/attendance`;
    const portalEndpoint = `${config.public.hrisApiUrl}/api/portal/attendance`;

    const getByEmployeeDate = async (employeeId: number, attDate: string) => {
        return useAuthFetch<AttendanceDetail>(`${endpoint}/by-employee-date`, {
            query: {
                employee_id: employeeId,
                att_date: attDate,
            },
        });
    };

    const getByDate = async (attDate: string) => {
        return useAuthFetch<AttendanceDetail | null>(`${portalEndpoint}/by-date`, {
            query: {
                att_date: attDate,
            },
        });
    };

    return {
        // getAll,
        // get,
        // create,
        // // update,
        // remove
        ...employeeAttendanceApi,
        getByEmployeeDate,
        getByDate,
    }
}