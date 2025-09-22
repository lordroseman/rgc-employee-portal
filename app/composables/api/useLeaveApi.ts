// import type { PaginationRequestParam } from "~/types/common";
import type { EmployeeLeave } from "~/types/leaves";
// import { useCrudApi } from "./useCrudApi";

export const useLeaveApi = () => {
    const config = useRuntimeConfig();

    const employeeLeaveApi = useCrudApi<EmployeeLeave>(`/api/portal/leaves`);

    const updateStatus = async(id: number, status: number) => {
        return useAuthFetch<EmployeeLeave>(config.public.hrisApiUrl + '/api/leaves/' + id + '/status', {
            method: 'PUT',
            body: JSON.stringify({ status })
        })
    }

    return {
        // getAll,
        // get,
        // create,
        // // update,
        // remove
        ...employeeLeaveApi,
        updateStatus
    }
}