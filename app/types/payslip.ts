
import { z } from "zod";

// One line-item inside income/deduction.details
const PayslipDetailItemSchema = z.object({
  id: z.number().nullable().optional(),
  payslip_id: z.coerce.number(),
  type: z.coerce.number(), 
  amount: z.coerce.number(),
  label: z.string().optional(),
  item_label: z.string().optional(),  
});

// Shape for income/deduction block
const PayslipBreakdownSchema = z.object({
  total: z.coerce.number(),
  details: z.array(PayslipDetailItemSchema),
});

// Main payslip schema
export const PayslipSchema = z.object({
  id: z.number().int().positive().nullable().optional(),
  payslip_id: z.coerce.number(),
  employee_id: z.coerce.number(),
  payroll_date: z.coerce.date(),
  period_from: z.coerce.date(),
  period_to: z.coerce.date(),
  basic_amount: z.coerce.number().optional(),
  late_amount: z.coerce.number().optional(), 
  net_pay: z.coerce.number().optional(),
  
  payslip_details: z.object({
    income: PayslipBreakdownSchema.optional(),
    deduction: PayslipBreakdownSchema.optional(),
  }).optional(),
  income: PayslipBreakdownSchema.optional(),
  deduction: PayslipBreakdownSchema.optional(),
  date: z.coerce.date().nullable().optional(),
  reason: z.string().optional(),
  status: z.number().min(0).optional(),
});

export type Payslip = z.infer<typeof PayslipSchema>;