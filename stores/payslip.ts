
import { defineStore } from 'pinia'
import { usePayslipApi } from '~/composables/api/usePayslipApi';
import type { Payslip } from '~/types/payslip';
import { FetchError } from 'ofetch'

export const useEmployeePayslipStore = defineStore('employeePayslip', () => {

    const employeePayslip = ref<Payslip[] | null>(null)
    // const pagination = ref<PaginationMeta>({
    //     total: 0
    // } as PaginationMeta);

    // render/fetch flags
    const loading = ref(false)
    const ready = ref(false)
    const error  = ref<string | null>(null)

    // const { getAll, create, get, remove } = useLeaveApi();
    const { getAll, create, update, get, remove } = usePayslipApi();
    

    // const getEmployeeLeaves = async (params: PaginationRequestParam) => {
    //     const response = await getAll(params);
    //     if (response.success) {
    //         employeeLeaves.value = response.data
    //     }

    // }

    const getEmployeePayslip = async (latest: boolean) => {//id is removed, since it will be supplied on the backend (HRIS)
        const response = await get<Payslip[]>(latest);
        if (response.success) {
            employeePayslip.value = response.data
        }
        return response;
    }

    // const createEmployeeLeave = async (payload: EmployeeLeave) => {

    //     try {
    //         const response = await create(payload)
    //         if (response.success) {
    //             employeeLeaves.value?.pending.unshift(response.data)
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

    // Clear store so revisits start clean (prevents stale flash)
    const reset = () => {
        employeePayslip.value = null
    }

    return {
        employeePayslip,
        // pagination,
        getEmployeePayslip,
        // createEmployeeLeave,
        // updateEmployeeLeave,
        // deleteEmployeeLeave,
        // updateLeaveStatus,
        reset
    }
});