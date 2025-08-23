
import type { DataTableFilterMetaData } from "primevue";
import { z } from "zod";

export type EmployeeFilters = {
  q: DataTableFilterMetaData;
  id_num: DataTableFilterMetaData;
  name: DataTableFilterMetaData;
  employment_status_id: DataTableFilterMetaData;
  designation_id: DataTableFilterMetaData;
  company_id: DataTableFilterMetaData;
  assigned_to: DataTableFilterMetaData;
  status: DataTableFilterMetaData;
};


export const CompanySchema = z.object({
  company_id: z.number().nullable().optional(),
  parent_id: z.number().nullable(),
  name: z.string().min(1, "Please input company name"),
  parent: z.number().nullable().optional(),
});


export type Company = z.infer<typeof CompanySchema>

export const DesignationSchema = z.object({
  designation_id: z.number().nullable().optional(),
  title: z.string().min(1, "Please input designation title"),
});



export type Designation = z.infer<typeof DesignationSchema>


export const EmploymentStatusSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Please input employment status title"),
});


// Format to YYYY-MM-DD
function formatDate(date: Date): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const DateOrStringSchema = z
  .union([
    z.string().min(1, "Please intput date").refine(val => !isNaN(new Date(val).getTime()), {
      message: 'Invalid date string',
    }),
    z.date()
  ])
  .transform((value) => {
    const date = typeof value === 'string' ? new Date(value) : value
    return formatDate(date)
  })



export const EmployeeFormSchema = z.object({
  id_num: z.string().min(1, "Please input Employee ID"),
  fname: z.string().min(1, "Please input first name"),
  mname: z.string().min(1, "Please input middle name"),
  lname: z.string().min(1, "Please input last name"),
  present_address: z.string().min(1, "Please input present address"),
  home_address: z.string().min(1, "Please input home address"),
  contact_number: z.string().min(1, "Please input contact number"),
  birthdate: DateOrStringSchema,
  sss: z.string().min(1, "Please input SSS number"),
  philhealth: z.string().min(1, "Please input PhilHealth number"),
  pagibig: z.string().min(1, "Please input Pag-IBIG number"),
  tin: z.string().min(1, "Please input TIN"),
  marital_status: z.number().nullable(),
  gender: z.number().nullable(),
  email: z.string().min(1, "Please input email"),
  bank_account: z.string().min(1, "Please input bank account"),
  hired_date: DateOrStringSchema,
  non_mwe: z.boolean().nullable(),
})
export type EmployeeForm = z.infer<typeof EmployeeFormSchema>



export const EmployeeSchema = z.object({
  employee_id: z.number().nullable().optional(),
  id_num: z.string().min(1, "Please input Employee ID"),
  fname: z.string().min(1, "Please input first name"),
  mname: z.string().min(1, "Please input middle name"),
  lname: z.string().min(1, "Please input last name"),
  present_address: z.string().min(1, "Please input present address"),
  home_address: z.string().min(1, "Please input home address"),
  contact_number: z.string().min(1, "Please input contact number"),
  birthdate: DateOrStringSchema,
  sss: z.string().min(1, "Please input SSS number"),
  philhealth: z.string().min(1, "Please input PhilHealth number"),
  pagibig: z.string().min(1, "Please input Pag-IBIG number"),
  tin: z.string().min(1, "Please input TIN"),
  marital_status: z.number().nullable(),
  gender: z.number().nullable(),
  email: z.string().min(1, "Please input email"),
  bank_account: z.string().min(1, "Please input bank account"),
  hired_date: DateOrStringSchema,
  company: CompanySchema.optional(),
  designation: DesignationSchema.optional(),
  employment_status: EmploymentStatusSchema.optional(),
  non_mwe: z.boolean().optional(),
  company_id: z.number().nullable().optional(),
  designation_id: z.number().nullable().optional(),
  assigned_to: z.union([CompanySchema, z.number(), z.null()]).optional(),
  image: z.string().min(1, "Please input image").optional(),
});




export type Employee = z.infer<typeof EmployeeSchema>


export type EmploymentStatus = {
  id: number
  title: string
}


export const ServiceRecordFormSchema = z.object({
   effectivity_date: DateOrStringSchema,
  company_id: z.number().min(1, "Please select a company"),
  assigned_to:  z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select an assignment",
  }),
    designation_id: z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select a position",
  }),
   employment_status: z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select a company",
  }),
   notes: z.string(),
});


export const ServiceRecordSchema = z.object({
  id: z.number().nullable().optional(),
  employee_id: z.number().nullable().optional(),
  company_id: z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select a company",
  }),
  designation_id: z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select a position",
  }),
  company: CompanySchema.optional(),
  designation: DesignationSchema.optional(),
  assigned_to: z.union([CompanySchema, z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select an assignment",
  })]),
  notes: z.string(),
  effectivity_date: DateOrStringSchema,
  employment_status: z.union([EmploymentStatusSchema, z.number().nullable().refine(val => val !== null && val >= 1, {
    message: "Please select a company",
  })]),
});

export type ServiceRecord = z.infer<typeof ServiceRecordSchema>


export const WorkExperienceSchema = z.object({
  id: z.number().nullable().optional(),
  employee_id: z.number().nullable().optional(),
  company_name: z.string().min(1, "Please input company name"),
  position: z.string().min(1, "Please input position"),
  date_from: DateOrStringSchema,
  date_to: DateOrStringSchema,
  employment_status: z.string().min(1, "Please input employment status"),
});

export type WorkExperience = z.infer<typeof WorkExperienceSchema>

export const EducationalBackgroundSchema = z.object({
  id: z.number().nullable().optional(),
  employee_id: z.number().nullable().optional(),
  school_name: z.string().min(1, "Please input school name"),
  level: z.number().min(1, "Please select education level").nullable(),
  course: z.string().min(1, "Please input course"),
  year_range: z.tuple([z.date().nullable(), z.date().nullable()]), 
  graduated: z.union([z.literal(0), z.literal(1), z.boolean()]),
  educational_level: z
    .object({
      id: z.number(),
      title: z.string(),
    }).optional(),
}).transform((data) => {

  const yearRange = data.year_range;
  if (yearRange && Array.isArray(yearRange) && yearRange.length !== 2) {
    return {
      ...data,
      year_from: yearRange[0] ? yearRange[0].getFullYear() : null,
      year_to: yearRange[1] ? yearRange[1].getFullYear() : null,
    };
  }

  return data; 
});

export type EducationalBackground = z.infer<typeof EducationalBackgroundSchema>

export const FamilyBackgroundSchema = z.object({
  id: z.number().nullable().optional(),
  employee_id: z.number().nullable().optional(),
  name: z.string(),
  relation: z.number().nullable(),
  occupation: z.string(),
  contact_number: z.string(),
  family_relation: z
    .object({
      id: z.number(),
      title: z.string(),
    })
    .optional(),
});

export type FamilyBackground = z.infer<typeof FamilyBackgroundSchema>


export const  EmployeeFileFormSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string().min(1, "Please input file name"),
  description: z.string().min(1, "Please input file description"),
  file: z.instanceof(File, { message: "Please select a file" }).nullable().optional(), 
});

export type EmployeeFileForm = z.infer<typeof EmployeeFileFormSchema>

export const Employee201FileSchema = z.object({
  id: z.number().nullable().optional(),
  employee_id: z.number().nullable().optional(),
  name: z.string(),
  description: z.string(),
  file: z.string(),
  extension: z.string().optional(),
  datetimeUploaded: z.string().optional(),
});

export type Employee201File = z.infer<typeof Employee201FileSchema>


export type EmployeeSchedule = {
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  company: string;
  designation: string;
  date: string;
  timeIn: string;
  timeOut: string;
  lateThreshold: number;
  break: number;
  shiftName: string;
  shiftColor: string
}
