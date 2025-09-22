// import type { PaginationRequestParam } from "~/types/common";
import type { Payslip } from "~/types/payslip";
// import { useCrudApi } from "./useCrudApi";

export const usePayslipApi = () => {
    // const config = useRuntimeConfig();

    const employeePayslipApi = useCrudApi<Payslip>(`/api/portal/payslip`);

    // const updateStatus = async(id: number, status: number) => {
    //     return useAuthFetch<Payslip>(config.public.hrisApiUrl + '/api/payslips/' + id + '/status', {
    //         method: 'PUT',
    //         body: JSON.stringify({ status })
    //     })
    // }

    return {
        // getAll,
        // get,
        // create,
        // // update,
        // remove
        ...employeePayslipApi
    }
}