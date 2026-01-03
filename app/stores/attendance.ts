
import { defineStore } from 'pinia'
import type { Attendance, Schedule, AttendanceSchedule } from '~/types/attendance';
import { useAttendanceApi } from '~/composables/api/useAttendanceApi';

export const useEmployeeAttendanceStore = defineStore('employeeAttendance', () => {

    const employeeAttendance = ref<Record<string, Attendance> | null>(null);
    const employeeSchedule = ref<Record<string, Schedule> | null>(null);

    const { get, } = useAttendanceApi();


    const getEmployeeAttendance = async (latest: boolean, date_from: string, date_to: string, refresh: boolean = false) => {//id is removed, since it will be supplied on the backend (HRIS)

        // If data exists and not refreshing, skip fetching
        
        if (employeeAttendance.value && !refresh) { 
            return;
        } 
        const response = await get<AttendanceSchedule>({ latest, date_from, date_to });
        if (response.success) {
            const { attendance, schedule } = response.data;

            employeeAttendance.value = attendance ?? {};
            employeeSchedule.value = schedule ?? {};
            // employeeAttendance.value = response.data;
        }
        return response;
    }

    // Clear store so revisits start clean (prevents stale flash)
    const reset = () => {
        employeeAttendance.value = null
        employeeSchedule.value = null
    }

    return {
        employeeAttendance,
        employeeSchedule,
        getEmployeeAttendance,
        reset
    }
});