// import type { PaginationRequestParam } from "~/types/common";
import type { EmployeeLeave, LeaveBalanceResponse } from "~/types/leaves";
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

    const getLeaveBalance = async (year?: number) => {
        const y = year ?? new Date().getFullYear()
        return useAuthFetch<LeaveBalanceResponse>(
            config.public.hrisApiUrl + '/api/portal/leave-balance',
            { query: { year: y } }
        )
    }

    return {
        ...employeeLeaveApi,
        updateStatus,
        getLeaveBalance
    }
}