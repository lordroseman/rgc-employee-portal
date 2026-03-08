<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";
import type { Employee } from "~/types/employees";

const props = defineProps<{
  employee: Employee | null | undefined;
  skeletonLoading?: boolean | false | undefined;
}>();

const fullName = computed(() => {
  if (!props.employee) return "";
  const { fname, mname, lname } = props.employee;
  return [fname, mname, lname].filter(Boolean).join(" ");
});

const hiredDateDisplay = computed(() => {
  if (!props.employee?.hired_date) return "";
  return useDateFormat(props.employee.hired_date, "MMM DD, YYYY").value;
});
</script>

<template>
  <div class="border-b border-slate-200 bg-white shadow-sm rounded-xl">
    <div class="px-4 py-4 sm:px-5">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <Skeleton v-if="skeletonLoading" shape="circle" size="3.5rem" />
          <ProfileAvatar
            v-else
            :name="employee?.fname"
            :src="employee?.image"
            :font-size-ratio="0.4"
            :size="56"
            class="rounded-full ring-2 ring-slate-200 overflow-hidden"
          />
        </div>

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <div v-if="skeletonLoading">
            <Skeleton width="14rem" height="1.25rem" class="mb-2" />
            <Skeleton width="10rem" height="0.875rem" />
          </div>
          <div v-else>
            <!-- Name + status badge -->
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="truncate text-base font-semibold text-slate-900">
                {{ fullName || "Employee" }}
              </h2>
              <span
                v-if="employee?.employment_status?.title"
                class="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20"
              >
                {{ employee.employment_status.title }}
              </span>
            </div>
            <!-- Meta row -->
            <div
              class="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"
            >
              <span v-if="employee?.designation?.title" class="flex items-center gap-1">
                <i class="pi pi-briefcase" />
                {{ employee.designation.title }}
              </span>
              <span v-if="employee?.company?.name" class="flex items-center gap-1">
                <i class="pi pi-building" />
                {{ employee.company.name }}
              </span>
              <span v-if="employee?.id_num" class="flex items-center gap-1">
                <i class="pi pi-id-card" />
                {{ employee.id_num }}
              </span>
              <span v-if="hiredDateDisplay" class="flex items-center gap-1">
                <i class="pi pi-calendar" />
                Hired {{ hiredDateDisplay }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
