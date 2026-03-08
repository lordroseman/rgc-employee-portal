<script setup lang="ts">
import { useDateFormat } from "@vueuse/core";

definePageMeta({
  title: "My Profile",
});

useHead({
  title: "My Profile | My Portal",
});

const employeeStore = useEmployeeStore();
const { employee } = storeToRefs(employeeStore);
const { genders, maritalStatus } = employeeStore;
const skeletonLoading = ref(false);

const load = async () => {
  skeletonLoading.value = true;
  await employeeStore.getEmployee();
  skeletonLoading.value = false;
};

onMounted(async () => {
  await load();
});

const genderLabel = computed(
  () => genders.find((g) => g.id === employee.value?.gender)?.title ?? "—"
);
const maritalLabel = computed(
  () => maritalStatus.find((m) => m.id === employee.value?.marital_status)?.title ?? "—"
);
const birthdateDisplay = computed(() => {
  if (!employee.value?.birthdate) return "—";
  return useDateFormat(employee.value.birthdate, "MMM DD, YYYY").value;
});
const hiredDateDisplay = computed(() => {
  if (!employee.value?.hired_date) return "—";
  return useDateFormat(employee.value.hired_date, "MMM DD, YYYY").value;
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Compact hero card -->
    <EmployeeDetailCard :employee="employee" :skeleton-loading="skeletonLoading" />

    <!-- Personal Information -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2 px-4 pt-4">
          <i class="pi pi-user text-primary-500" />
          <span class="text-sm font-semibold text-slate-700">Personal Information</span>
        </div>
      </template>
      <template #content>
        <div v-if="skeletonLoading" class="space-y-3 px-1">
          <Skeleton
            v-for="n in 5"
            :key="n"
            height="0.9rem"
            :width="`${60 + (n % 3) * 15}%`"
          />
        </div>
        <div v-else class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p class="text-xs text-slate-400">First Name</p>
            <p class="font-medium text-slate-800">{{ employee?.fname || "—" }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Middle Name</p>
            <p class="font-medium text-slate-800">{{ employee?.mname || "—" }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Last Name</p>
            <p class="font-medium text-slate-800">{{ employee?.lname || "—" }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Birthdate</p>
            <p class="font-medium text-slate-800">{{ birthdateDisplay }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Gender</p>
            <p class="font-medium text-slate-800">{{ genderLabel }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Civil Status</p>
            <p class="font-medium text-slate-800">{{ maritalLabel }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Email</p>
            <p class="font-medium text-slate-800 break-all">
              {{ employee?.email || "—" }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Contact Number</p>
            <p class="font-medium text-slate-800">
              {{ employee?.contact_number || "—" }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Present Address</p>
            <p class="font-medium text-slate-800">
              {{ employee?.present_address || "—" }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Home Address</p>
            <p class="font-medium text-slate-800">{{ employee?.home_address || "—" }}</p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Employment Details -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2 px-4 pt-4">
          <i class="pi pi-briefcase text-primary-500" />
          <span class="text-sm font-semibold text-slate-700">Employment Details</span>
        </div>
      </template>
      <template #content>
        <div v-if="skeletonLoading" class="space-y-3 px-1">
          <Skeleton
            v-for="n in 4"
            :key="n"
            height="0.9rem"
            :width="`${55 + (n % 3) * 15}%`"
          />
        </div>
        <div v-else class="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <p class="text-xs text-slate-400">Employee ID</p>
            <p class="font-medium text-slate-800">{{ employee?.id_num || "—" }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-400">Date Hired</p>
            <p class="font-medium text-slate-800">{{ hiredDateDisplay }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Position</p>
            <p class="font-medium text-slate-800">
              {{ employee?.designation?.title || "—" }}
            </p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Company</p>
            <p class="font-medium text-slate-800">{{ employee?.company?.name || "—" }}</p>
          </div>
          <div class="col-span-2">
            <p class="text-xs text-slate-400">Employment Status</p>
            <p>
              <span
                v-if="employee?.employment_status?.title"
                class="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-inset ring-primary-600/20"
              >
                {{ employee.employment_status.title }}
              </span>
              <span v-else class="font-medium text-slate-800">—</span>
            </p>
          </div>
        </div>
      </template>
    </Card>

    <!-- Government IDs -->
    <Card>
      <template #header>
        <div class="flex items-center gap-2 px-4 pt-4">
          <i class="pi pi-id-card text-primary-500" />
          <span class="text-sm font-semibold text-slate-700">Government IDs & Bank</span>
        </div>
      </template>
      <template #content>
        <div v-if="skeletonLoading" class="space-y-3 px-1">
          <Skeleton
            v-for="n in 5"
            :key="n"
            height="0.9rem"
            :width="`${50 + (n % 4) * 12}%`"
          />
        </div>
        <div v-else class="space-y-3 text-sm">
          <div
            v-for="{ label, value } in [
              { label: 'SSS Number', value: employee?.sss },
              { label: 'PhilHealth Number', value: employee?.philhealth },
              { label: 'Pag-IBIG Number', value: employee?.pagibig },
              { label: 'TIN', value: employee?.tin },
              { label: 'Bank Account Number', value: employee?.bank_account },
            ]"
            :key="label"
            class="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 last:border-0 last:pb-0"
          >
            <span class="text-xs text-slate-400">{{ label }}</span>
            <span class="font-mono text-xs font-medium text-slate-700">
              {{ value || "—" }}
            </span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
