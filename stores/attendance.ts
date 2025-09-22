
import { defineStore } from 'pinia'
import type { Attendance } from '~/types/attendance';
import { FetchError } from 'ofetch'
import { useAttendanceApi } from '~/composables/api/useAttendanceApi';

export const useEmployeeAttendanceStore = defineStore('employeeAttendance', () => {

    const employeeAttendance = ref<Attendance[] | null>(null)
    // const employeeSchedule = ref<Schedule[] | null>(null)
    // const pagination = ref<PaginationMeta>({
    //     total: 0
    // } as PaginationMeta);

    // render/fetch flags
    const loading = ref(false)
    const ready = ref(false)
    const error  = ref<string | null>(null)

    // const { getAll, create, get, remove } = useLeaveApi();
    const { getAll, create, update, get, remove } = useAttendanceApi();
    

    // const getEmployeeLeaves = async (params: PaginationRequestParam) => {
    //     const response = await getAll(params);
    //     if (response.success) {
    //         employeeLeaves.value = response.data
    //     }

    // }

    const getEmployeeAttendance = async (latest: boolean) => {//id is removed, since it will be supplied on the backend (HRIS)
        const response = await get<Attendance[]>(latest);
        if (response.success) {
            // const { attendance, schedule } = response.data;
            
            // employeeAttendance.value = attendance;
            // employeeSchedule.value = schedule;
            employeeAttendance.value = response.data;
        }
        return response;
    }

    // Clear store so revisits start clean (prevents stale flash)
    const reset = () => {
        employeeAttendance.value = null
    }

    return {
        employeeAttendance,
        // employeeSchedule,
        // pagination,
        getEmployeeAttendance,
        // createEmployeeLeave,
        // updateEmployeeLeave,
        // deleteEmployeeLeave,
        // updateLeaveStatus,
        reset
    }
});