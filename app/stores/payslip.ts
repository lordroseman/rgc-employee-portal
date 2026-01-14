
import { defineStore } from 'pinia'
import { usePayslipApi } from '~/composables/api/usePayslipApi';
import type { Payslip } from '~/types/payslip'; 

export const useEmployeePayslipStore = defineStore('employeePayslip', () => {

    const employeePayslip = ref<Payslip[] | null>(null)
    const isFetching = ref(false);

    const {   get } = usePayslipApi();
    
 

    const getEmployeePayslip = async (latest: boolean, refresh: boolean = false) => {//id is removed, since it will be supplied on the backend (HRIS)

      

        if(!refresh && employeePayslip.value) {
            return ;
        }

          if(isFetching.value) return;
          

        isFetching.value = true;
        const response = await get<Payslip[]>({latest});
        if (response.success) {
            employeePayslip.value = response.data
        } 

        isFetching.value = false;
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