
import { defineStore } from 'pinia'
import { useLeaveApi } from '~/composables/api/useLeaveApi'; 
import type { EmployeeLeave, EmployeeLeaveResponse, LeaveBalanceResponse } from '~/types/leaves';
import { FetchError } from 'ofetch'

export const useEmployeeLeaveStore = defineStore('employeeLeave', () => {

    const employeeLeaves = ref<{
        pending: EmployeeLeave[]
        approved: EmployeeLeave[]
        rejected: EmployeeLeave[]
    } | null>(null)

    const leaveBalance = ref<LeaveBalanceResponse | null>(null)

    const { create, get, getLeaveBalance: fetchLeaveBalance } = useLeaveApi();
    
 

    const getLeaveByEmployee = async (refresh: boolean = false) => {

        if(!refresh && employeeLeaves.value) {
            return ;
        }

        const response = await get<EmployeeLeaveResponse>()
        if (response.success) {
            employeeLeaves.value = response.data
        }
        return response
    }

    const getLeaveBalance = async (year?: number) => {
        const response = await fetchLeaveBalance(year)
        if (response.success) {
            leaveBalance.value = response.data
        }
        return response
    }

    const createEmployeeLeave = async (payload: EmployeeLeave) => {

        try {
            const response = await create(payload)
            if (response.success) {
                employeeLeaves.value?.pending.unshift(response.data)
            }
        } catch (e) {
            if (e instanceof FetchError) {
                const error = e as FetchError<{ message: string; errors: Record<keyof EmployeeLeave, string[]> }>;
                return {
                    error
                }
            }
        }
    }

    

    const leaveType = [
        { id: 0, title: "Sick Leave" },
        { id: 1, title: "Vacation Leave" }
    ];

    const leaveDayType = [
        { id: 1, title: "Whole Day" },
        { id: 2, title: "Half Day" }
    ];

    // Clear store so revisits start clean (prevents stale flash)
    const reset = () => {
        employeeLeaves.value = null
        leaveBalance.value = null
    }

    return {
        employeeLeaves,
        leaveBalance,
        getLeaveByEmployee,
        getLeaveBalance,
        createEmployeeLeave,
        leaveDayType,
        leaveType,
        reset
    }
});