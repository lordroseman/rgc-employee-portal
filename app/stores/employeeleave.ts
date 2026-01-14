
import { defineStore } from 'pinia'
import { useLeaveApi } from '~/composables/api/useLeaveApi'; 
import type { EmployeeLeave,  EmployeeLeaveResponse } from '~/types/leaves';
import { FetchError } from 'ofetch'

export const useEmployeeLeaveStore = defineStore('employeeLeave', () => {

    const employeeLeaves = ref<{
        pending: EmployeeLeave[]
        approved: EmployeeLeave[]
        rejected: EmployeeLeave[]
    } | null>(null) 
    const { create, get } = useLeaveApi();
    
 

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
    }

    return {
        employeeLeaves, 
        getLeaveByEmployee,
        createEmployeeLeave, 
        leaveDayType,
        leaveType,
        reset
    }
});