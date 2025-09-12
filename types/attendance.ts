
import { z } from "zod";

export const AttendanceLogsSchema = z.object({
  time: z.string().trim().min(1, "Please input time"),
});

export const AttendanceSchema = z.object({
  id: z.number().int().positive().optional(),
  date: z.coerce.date().nullable().optional(),
  logs: z.array(AttendanceLogsSchema).optional(),
  reason: z.string().optional(),
  status: z.number().min(0).optional(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;