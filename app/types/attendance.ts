
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
  tt1_in: z.string().optional(),
  tt1_out: z.string().optional(),
  tt2_in: z.string().optional(),
  tt2_out: z.string().optional(),
  tt3_in: z.string().optional(),
  tt3_out: z.string().optional(),
  tt4_in: z.string().optional(),
  tt4_out: z.string().optional(),
  ot_in: z.string().optional(),
  ot_out: z.string().optional(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

const ScheduleSchema = z.object({
  sched_date: z.coerce.date().nullable().optional(),
  time_in: z.string().optional(),
  time_out: z.string().optional(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;

const AttendanceScheduleSchema = z.object({
  attendance: z.array(AttendanceSchema),
  schedule: z.array(ScheduleSchema),
});

export type AttendanceSchedule = z.infer<typeof AttendanceScheduleSchema>;