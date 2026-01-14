
import { defineStore } from 'pinia'
import { useEmployeeApi } from '~/composables/api/useEmployeeApi';
import type { PaginationMeta } from '~/types/common';
import type { Employee } from '~/types/employees'; 

export const useEmployeeStore = defineStore('employee', () => {

    const employee = ref<Employee>();
    const pagination = ref<PaginationMeta>({
        total: 0
    } as PaginationMeta);


    const { get } = useEmployeeApi();

    const getEmployee = async () => {

        if(employee.value) {
            return;
        }


        const response = await get<Employee>();
        if (response.success) {
            employee.value = response.data;
        } 
    }

    const maritalStatus = [
        { id: 1, title: "Single" },
        { id: 2, title: "Married" },
        { id: 3, title: "Widowed" },
    ]
    const genders = [
        { id: 1, title: "Male" },
        { id: 2, title: "Female" }
    ];

    const employmentStatus = [
        { id: 1, title: "Training" },
        { id: 2, title: "Probationary" },
        { id: 3, title: "Regular" },
        { id: 4, title: "Resigned" },
        { id: 5, title: "Terminated" },
        { id: 6, title: "Retired" },
        { id: 7, title: "AWOL" },
        { id: 8, title: "On Leave" },
        { id: 9, title: "Retrenched" },
        { id: 10, title: "Deceased" },
        { id: 11, title: "Forced Leave" },
        { id: 12, title: "Contractual" },
        { id: 13, title: "Suspended" },
        { id: 14, title: "Part-Time" },
        { id: 15, title: "Fixed Term" }
    ];

    const educationLevels = [
        { id: 1, title: "Elementary" },
        { id: 2, title: "High School" },
        { id: 3, title: "Vocational" },
        { id: 4, title: "College" },
        { id: 5, title: "Graduate Studies" }
    ]

    const familyRelations = [
        { id: 1, title: "Father" },
        { id: 2, title: "Mother" },
        { id: 3, title: "Brother" },
        { id: 4, title: "Sister" },
        { id: 5, title: "Husband" },
        { id: 6, title: "Wife" },
        { id: 7, title: "Child" },
        { id: 8, title: "Grand Parent" }
    ]


    return {
        employee,
        pagination,
        getEmployee,
        maritalStatus,
        genders,
        employmentStatus,
        educationLevels,
        familyRelations
    }
});