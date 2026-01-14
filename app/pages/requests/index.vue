<script setup lang="ts"> 
 

definePageMeta({
  title: 'My Requests'
})

useHead({
  title: 'My Requests | My Portal'
})
 

</script>

<template>
  <div class="relative">
    <div class="mb-4">
      <h2 class="text-lg font-medium text-white">Select an Attendance Request</h2>
      <p class="text-sm text-white">Choose a request type to continue.</p>
    </div>

    <div class="space-y-4">
      <NuxtLink to="/leaves" class="block">
        <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition">
          <template #content>
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="rounded-full bg-amber-50 px-2 pt-2 pb-1 shrink-0">
                  <i class="pi pi-calendar text-amber-600" style="font-size: 18px" aria-hidden="true" />
                </div>
                <div>
                  <div class="text-gray-800 font-medium leading-tight">Leaves</div>
                  <div class="text-sm text-gray-500">File and track your leave applications.</div>
                </div>
              </div>
              <i class="pi pi-angle-right text-gray-400 shrink-0" aria-hidden="true" />
            </div>
          </template>
        </Card>
      </NuxtLink>

      <NuxtLink to="/requests/coa" class="block">
        <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition">
          <template #content>
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="rounded-full bg-indigo-50 px-2 pt-2 pb-1 shrink-0">
                  <i class="pi pi-file text-indigo-600" style="font-size: 18px" aria-hidden="true" />
                </div>
                <div>
                  <div class="text-gray-800 font-medium leading-tight">Certificate of Attendance</div>
                  <div class="text-sm text-gray-500">Request a certificate for a specific date.</div>
                </div>
              </div>
              <i class="pi pi-angle-right text-gray-400 shrink-0" aria-hidden="true" />
            </div>
          </template>
        </Card>
      </NuxtLink>

      <NuxtLink to="/requests/ot" class="block">
        <Card v-ripple class="shadow cursor-pointer hover:bg-gray-50 transition">
          <template #content>
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="rounded-full bg-orange-50 px-2 pt-2 pb-1 shrink-0">
                  <i class="pi pi-clock text-orange-600" style="font-size: 18px" aria-hidden="true" />
                </div>
                <div>
                  <div class="text-gray-800 font-medium leading-tight">Overtime</div>
                  <div class="text-sm text-gray-500">Submit overtime hours for approval.</div>
                </div>
              </div>
              <i class="pi pi-angle-right text-gray-400 shrink-0" aria-hidden="true" />
            </div>
          </template>
        </Card>
      </NuxtLink>
    </div>
  </div>

</template>

<style scoped>
.no-padding-card :deep(.p-card-body) {
  padding: 0 !important;
}
</style>
