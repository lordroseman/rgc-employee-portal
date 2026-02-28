import dayjs from 'dayjs';
import { useToast } from 'primevue';
import type { Payslip } from '~/types/payslip';

export const usePayslipReport = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const toast = useToast();
  const downloading = ref(false);

  const downloadPayslip = async (payslip?: Payslip | null) => {
    if (!payslip?.payslip_id || !payslip.payroll_date) {
      toast.add({
        severity: 'warn',
        summary: 'No Payslip Selected',
        detail: 'No payslip data is available to download.',
        life: 3000,
      });
      return false;
    }

    const from = dayjs(payslip.period_from).format('YYYY-MM-DD');
    const to = dayjs(payslip.period_to).format('YYYY-MM-DD');
    const paydate = dayjs(payslip.payroll_date).format('YYYY-MM-DD');

    downloading.value = true;

    try {
      let token = auth.token;
      if (!token) {
        await auth.refreshAccessToken();
        token = auth.token;
      }

      if (!token) {
        throw new Error('Unauthenticated');
      }

      const blob = await $fetch<Blob>(`${config.public.hrisApiUrl}/api/portal/reports/payslip`, {
        query: { paydate },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/pdf',
        },
        responseType: 'blob',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Payslip_${from}_to_${to}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.add({
        severity: 'success',
        summary: 'Download Complete',
        detail: 'Payslip report downloaded successfully.',
        life: 3000,
      });

      return true;
    } catch (error: unknown) {
      console.error('Payslip download failed:', error);
      const status = (error as { response?: { status?: number } })?.response?.status;
      const detail = status === 401
        ? 'Session expired. Please log in again.'
        : 'Failed to download payslip report. Please try again.';
      toast.add({ severity: 'error', summary: 'Download Failed', detail, life: 5000 });
      return false;
    } finally {
      downloading.value = false;
    }
  };

  return {
    downloading,
    downloadPayslip,
  };
};
