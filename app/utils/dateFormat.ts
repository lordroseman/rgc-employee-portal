import dayjs from "dayjs";

export const formatDate = (value: unknown): string => {
  if (!value) return "-";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : String(value);
};

export const formatDateTime = (value: unknown): string => {
  if (!value) return "-";
  const parsed = dayjs(String(value));
  return parsed.isValid() ? parsed.format("YYYY-MM-DD HH:mm") : String(value);
};

export const formatTime = (date: string, value: unknown): string => { 
  if (!value) return "-";
  const parsed = dayjs(`${date}T${String(value)}`);
  return parsed.isValid() ? parsed.format("hh:mm A") : String(value);
}


export const timeToMinutes = (value: string | null | undefined): number | null => {
  const normalized = (value);
  if (!normalized) return null;
  const [hoursStr, minutesStr] = normalized.split(":");
  if (hoursStr === undefined || minutesStr === undefined) return null;
  const hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr, 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};
