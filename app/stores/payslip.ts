
import { defineStore } from 'pinia'
import { usePayslipApi } from '~/composables/api/usePayslipApi';
import type { Payslip } from '~/types/payslip'; 

export const useEmployeePayslipStore = defineStore('employeePayslip', () => {

    const employeePayslip = ref<Payslip[] | null>(null)
    
    const {   get } = usePayslipApi();
    
 

    const getEmployeePayslip = async (latest: boolean, refresh: boolean = false) => {//id is removed, since it will be supplied on the backend (HRIS)

        if(!refresh && employeePayslip.value) {
            return ;
        }


        const response = await get<Payslip[]>({latest});
        if (response.success) {
            employeePayslip.value = response.data
        } 
    }

   

    // Clear store so revisits start clean (prevents stale flash)
    const reset = () => {
        employeePayslip.value = null
    }

    return {
        employeePayslip, 
        getEmployeePayslip, 
        reset
    }
});