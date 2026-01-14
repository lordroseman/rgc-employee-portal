
import { z } from "zod";

export const AttendanceLogsSchema = z.object({
  time: z.string().trim().min(1, "Please input time"),
});


export type Attendance = {
    attendance_id?: number;
    company_id: number;
    employee_id: number;
    att_date: string;
    tt1_in: string | null;
    tt1_out: string | null;
    tt2_in?: string | null;
    tt2_out?: string | null;
    tt3_in?: string | null;
    tt3_out?: string | null;
    tt4_in?: string | null;
    tt4_out?: string | null;
    ot_in: string | null;
    ot_out: string | null;
    basic: number;
    ot: number;
    nd: number;
    late: number;
    holiday: number;
    flag: string | null;
    tag: string | null;
    remarks: string | null;
    
}


export const ScheduleSchema = z.object({
    id: z.number().nullable().optional(),
    employee_id: z.number().nullable().optional(),
    company_id: z.number(),
    designation_id: z.number(),
    time_in: z.string().min(1, "Please input time in"),
    time_out: z.string().min(1, "Please input time out"),
    late_threshold: z.number().min(0).optional(),
    break: z.number().min(0).optional(),
    shift: z.string().nullable().optional(),
    color: z.string().min(1, "Please input color").optional(),
    notes: z.string().max(500).optional()
});

export type Schedule = z.infer<typeof ScheduleSchema>;



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


export type AttendanceRequestLogs = {
  tt1_in?: string | null;
  tt1_out?: string | null;
  ot_in?: string | null;
  ot_out?: string | null;
  [key: string]: unknown;
};



export type RequestType = "COA" | "OB" | "OT";
 
export type AttendanceRequestWritePayload = { 
  request_type: RequestType;
  att_date: string | null;
  destination?: string | null;
  purpose?: string | null;
  remarks?: string | null;
  logs?: AttendanceRequestLogs | null;
  status?: "pending" | "approved" | "rejected" | null;
};


export type AttendanceRequestFormState = Omit<AttendanceRequestWritePayload, "att_date"> & {
  att_date: Date | null;
  logs: AttendanceRequestLogs;
};



export type TimePairUi = {
  key: string;
  label: string;
  inField: keyof AttendanceDetail;
  outField: keyof AttendanceDetail;
  inLabel: string;
  outLabel: string;
};
