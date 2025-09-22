// import type { PaginationRequestParam } from "~/types/common";
import type { Attendance } from "~/types/attendance";
// import { useCrudApi } from "./useCrudApi";

export const useAttendanceApi = () => {
    const config = useRuntimeConfig();

    const employeeAttendanceApi = useCrudApi<Attendance>(`/api/portal/attendance`);
    
    return {
        // getAll,
        // get,
        // create,
        // // update,
        // remove
        ...employeeAttendanceApi
    }
}