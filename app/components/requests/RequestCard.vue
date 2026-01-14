<script setup lang="ts">
import dayjs from 'dayjs';
import type { AttendanceRequest } from '~/types/attendanceRequests';

defineProps<{
    request: AttendanceRequest;
}>();

const formatDate = (date: string) => dayjs(date).format('MMMM DD, YYYY').toUpperCase();
const dayLabel = (date: string) => dayjs(date).format('dddd');

const requestTypeLabel = (code: string) => {
    const normalized = (code ?? '').toUpperCase();
    const map: Record<string, string> = {
        OT: 'Overtime',
        COA: 'Certificate of Attendance',
    };
    return map[normalized] ?? normalized;
};


const requestTypeTagClass = (code: string) => {
    const normalized = (code ?? '').toUpperCase();
    if (normalized === 'OT') return '!bg-orange-50 !text-orange-500';
    if (normalized === 'COA') return '!bg-indigo-50 !text-indigo-500';
    return '!bg-orange-50 !text-orange-500';
};


const statusSeverity = (status: string) => {
    const normalized = (status ?? '').toLowerCase();
    if (normalized === 'approved') return 'success';
    if (normalized === 'rejected') return 'danger';
    return 'warn';
};

const statusLabel = (status: string) => {
    const normalized = (status ?? '').toLowerCase();
    if (!normalized) return '';
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

</script>

<template>
    <div>
        <div class="flex items-start justify-between p-4">
            <div class="flex flex-col items-start gap-1">
                <div class="font-bold text-xs">{{ formatDate(request.att_date) }}</div>

                <div class="flex items-center gap-2">
                    <Tag
:class="requestTypeTagClass(request.request_type)"
                        :value="requestTypeLabel(request.request_type)" style="font-size: 10px;" />
                    <Tag
:severity="statusSeverity(request.status)" :value="statusLabel(request.status)"
                        style="font-size: 10px;" />
                </div>

                <div v-if="request.destination || request.purpose" class="text-sm text-slate-600">
                    <span v-if="request.purpose">{{ request.purpose }}</span>
                </div>
            </div>

            <div class="text-[#4D4D4D] text-sm">
                {{ dayLabel(request.att_date) }}
            </div>
        </div>
        <div class="border-t border-slate-200" />
    </div>
</template>a