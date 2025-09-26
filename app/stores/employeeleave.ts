
import { defineStore } from 'pinia'
import { useLeaveApi } from '~/composables/api/useLeaveApi';
import type { PaginationMeta, PaginationRequestParam } from '~/types/common';
import type { EmployeeLeave, EmployeeLeaveForm, EmployeeLeaveResponse } from '~/types/leaves';
import { FetchError } from 'ofetch'

export const useEmployeeLeaveStore = defineStore('employeeLeave', () => {

    const employeeLeaves = ref<{
        pending: EmployeeLeave[]
        approved: EmployeeLeave[]
        rejected: EmployeeLeave[]
    } | null>(null)
    // const pagination = ref<PaginationMeta>({
    //     total: 0
    // } as PaginationMeta);

    // render/fetch flags
    // const loading = ref(false)
    // const ready = ref(false)
    // const error  = ref<string | null>(null)

    // const { getAll, create, get, remove } = useLeaveApi();
    const { create, update, get, remove, updateStatus } = useLeaveApi();
    

    // const getEmployeeLeaves = async (params: PaginationRequestParam) => {
    //     const response = await getAll(params);
    //     if (response.success) {
    //         employeeLeaves.value = response.data
    //     }

    // }

    const getLeaveByEmployee = async () => {
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

    // const updateEmployeeLeave = async (id: number, employeeLeave: Partial<EmployeeLeaveForm>) => {
    //     const response = await update(id, employeeLeave)
    //     console.log('-- updateEmployeeLeave --', response)
    //     if (response.success) {
    //         const data = response.data;

    //         // update employee in employees
    //         const ind = employeeLeaves.value.findIndex(e => e.employee_id === data.employee_id)
    //         if (ind > -1) {
    //             employeeLeaves.value[ind] = data;
    //         }

    //     }
    // }

    // const deleteEmployeeLeave = async (id:number) => {
    //     try {
    //         const response = await remove(id)
    //         if (response) {
    //             console.log('--- employeeLeaves ---', employeeLeaves);
    //             const ind = employeeLeaves.value.findIndex(e => e.id === id)
    //             if (ind > -1) {
    //                employeeLeaves.value.splice(ind, 1);
    //             }

    //         }
    //     } catch (e) {
    //         if (e instanceof FetchError) {
    //             const error = e as FetchError<{ message: string; errors: Record<keyof EmployeeLeave, string[]> }>;
    //             return {
    //                 error
    //             }
    //         }
    //     }

    // }

    // const updateLeaveStatus = async(id: number, status: number) => {
    //     try {
    //         const response = await updateStatus(id, status)
    //         if (response.success) {
    //             const data = response.data;
    //             // update employee in employees
    //             const ind = employeeLeaves.value.findIndex(e => e.employee_id === data.employee_id)
    //             if (ind > -1) {
    //                 employeeLeaves.value[ind] = data;
    //             }
    //         }
    //     } catch (e) {
    //         if (e instanceof FetchError) {
    //             const error = e as FetchError<{ message: string; errors: Record<keyof EmployeeLeave, string[]> }>;
    //             return {
    //                 error
    //             }
    //         }
    //     }
    // }

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
        // pagination,
        getLeaveByEmployee,
        createEmployeeLeave,
        // updateEmployeeLeave,
        // deleteEmployeeLeave,
        // updateLeaveStatus,
        leaveDayType,
        leaveType,
        reset
    }
});