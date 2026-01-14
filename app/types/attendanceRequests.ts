export type AttendanceRequestStatus = 'pending' | 'approved' | 'rejected' | (string & {});

export type AttendanceRequestLogs = Partial<{
  time_in: string;
  break_out: string;
  break_in: string;
  time_out: string;
}> & Record<string, string | undefined>;

export type AttendanceRequest = {
  id: number;
  employee_id: number;
  request_type: string;
  att_date: string; // YYYY-MM-DD
  destination?: string | null;
  purpose?: string | null;
  logs?: AttendanceRequestLogs | null;
  remarks?: string | null;
  status: AttendanceRequestStatus;
  approver_id?: number | null;
  submitted_by?: number | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  decision_notes?: string | null;
  employee?: {
    employee_id: number;
    fname: string;
    lname: string;
  } | null;
  approver?: unknown | null;
  submitter?: {
    id: number;
    username: string;
  } | null;
  created_at?: string;
  updated_at?: string;
};
