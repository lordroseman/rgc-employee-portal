
import type { DataTableFilterMetaData } from "primevue";
import { z } from "zod";

export type EmployeeLeaveFilters = {
  q: DataTableFilterMetaData;
//   id_num: DataTableFilterMetaData;
//   name: DataTableFilterMetaData;
//   employment_status_id: DataTableFilterMetaData;
//   designation_id: DataTableFilterMetaData;
//   company_id: DataTableFilterMetaData;
//   assigned_to: DataTableFilterMetaData;
//   status: DataTableFilterMetaData;
}; 

// Format to YYYY-MM-DD
function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DateOrStringSchema = z
.union([
    z.string()
    .min(1, "Please input date")
    .refine(val => !isNaN(new Date(val).getTime()), {
      message: 'Invalid date string',
    }),
  z.date()
])
.optional() // allow undefined
.nullable() // allow null
.transform((value) => {
  if (!value) return null
  const date = typeof value === 'string' ? new Date(value) : value
  return formatDate(date)
})

export const LeaveSchema = z.object({
    id: z.number().nullable().optional(),
    date_from: DateOrStringSchema, 
    date_to: DateOrStringSchema,
    leave_type: z.number().min(0, "Please select leave type"),
    leave_breakdown: z.array(z.object({
      date: z.string().min(1, "Date is required"),
      duration: z.number().min(1, "Day type is required"),
    })).optional().nullable(),
    reason: z.string().nullable(),
    employee: z.object({
      employee_id: z.number().min(1, "Please select employee"),
      fname: z.string().min(2, "First name is required"),
      lname: z.string().min(2, "Last name is required"),
      mname: z.string().min(2, "Middle name is required"),
    }).nullable().optional(),
    name: z.string().optional(),
    status: z.number().optional(),
    created_at: z.string().optional()
})

export type EmployeeLeaveForm = z.infer<typeof LeaveSchema>

export const EmployeeLeaveSchema = z.object({
    id: z.number().nullable().optional(),
    date_from: DateOrStringSchema, 
    date_to: DateOrStringSchema,
    leave_type: z.number().min(0, "Please select leave type"),
    leave_breakdown: z.array(z.object({ 
      date: z.string().min(1, "Date is required"),
      duration: z.number().min(1, "Day type is required"),
    })).optional().nullable(),
    reason: z.string().nullable(),
    employee: z.object({
      employee_id: z.number().min(1, "Please select employee"),
      fname: z.string().min(2, "First name is required"),
      lname: z.string().min(2, "Last name is required"),
      mname: z.string().min(2, "Middle name is required"),
    }).nullable().optional(),
    name: z.string().optional(),
    status: z.number().optional(),
    created_at: z.string().optional()
})

export type EmployeeLeave = z.infer<typeof EmployeeLeaveSchema>

export type EmployeeLeaveResponse = {
  pending: EmployeeLeave[]
  approved: EmployeeLeave[]
  rejected: EmployeeLeave[]
}