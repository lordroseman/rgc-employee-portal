
import type { Employee } from "~/types/employees"; 

export const useEmployeeApi = () => {
    const config = useRuntimeConfig();

    const employeeApi = useCrudApi<Employee>(`/api/portal/employeedetail`);
 

    const uploadImage = async (id: number, file: File) => {

        const formData = new FormData();
        formData.append("image", file)

        return fetch(`${config.public.hrisApiUrl}/api/employees/${id}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${useCookie('access_token').value}`
            }   
        })
    }
 

    return {
        ...employeeApi, 
        uploadImage
    }
}