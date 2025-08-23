
export default function useEmploymentStatus() {
    const employmentStatuses = shallowRef([
        {
          id: 1,
          title: 'Training'
        },
        {
          id: 2,
          title: 'Probationary'
        },
        {
          id: 3,
          title: 'Regular'
        },
        {
          id: 4,
          title: 'Resigned'
        },
        {
          id: 5,
          title: 'Terminated'
        },
        {
          id: 6,
          title: 'Retired'
        },
        {
          id: 7,
          title: 'AWOL'
        },
        {
          id: 8,
          title: 'On Leave'
        },
        {
          id: 9,
          title: 'Retrenched'
        },
        {
          id: 10,
          title: 'Deceased'
        },
        {
          id: 11,
          title: 'Forced Leave'
        },
        {
          id: 12,
          title: 'Contractual'
        },
        {
          id: 13,
          title: 'Suspended'
        },
        {
          id: 14,
          title: 'Part-Time'
        },
        {
          id: 15,
          title: 'Fixed Term'
        }
      ]);

      return {
        employmentStatus : employmentStatuses
      }
}
