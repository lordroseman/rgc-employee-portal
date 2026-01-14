
import { z } from "zod";

export const AttendanceLogsSchema = z.object({
  time: z.string().trim().min(1, "Please input time"),
});

export const AttendanceSchema = z.object({
  id: z.number().int().positive().optional(),
  date: z.coerce.date().nullable().optional(),
  att_date: z.string().optional(),
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
  basic: z.string().optional(),
  ot: z.string().optional(),
  late: z.string().optional(),
  undertime: z.string().optional(),
  remarks: z.string().optional(),
});

export type Attendance = z.infer<typeof AttendanceSchema>;

const ScheduleSchema = z.object({
  sched_date: z.coerce.date().nullable().optional(),
  time_in: z.string().optional(),
  time_out: z.string().optional(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;

export const AttendanceScheduleSchema = z.object({
  attendance: z.record(AttendanceSchema),
  schedule: z.record(ScheduleSchema),
});

export type AttendanceSchedule = z.infer<typeof AttendanceScheduleSchema>;



export type AttendanceScheduleReference = {
    shift: string | null;
    break_period: number | null;
    grace_period: number | null;
    timein: string | null;
    timeout: string | null;
};


export type AttendanceDetail = Omit<Attendance, "attendance_id"> & {
    attendance_id: number;
    schedule?: AttendanceScheduleReference | null;
    created_at?: string | null;
    updated_at?: string | null;
};


export type AttendanceTimeUpdatePayload = Partial<
    Pick<
        Attendance,
        | "tt1_in"
        | "tt1_out"
        | "tt2_in"
        | "tt2_out"
        | "tt3_in"
        | "tt3_out"
        | "tt4_in"
        | "tt4_out"
        | "ot_in"
        | "ot_out"
        | "remarks"
    >
>;