<script setup lang="ts">

const route = useRoute()

defineProps<{
  dateRange: boolean
}>()

</script>

<template>
    <Card 
        class="border border-gray-300 mb-6" 
        style="border-radius: 6px;" 
        :pt="{
            body: { style: 'padding: 0 !important;' }
        }"
    >
    
        <template #header v-if="route.path === '/dashboard'">
            <div class="flex items-center gap-2 px-4 py-2 border-b border-gray-300">
                <div class="pt-1">
                <i class="pi pi-clock text-[#008AAD]"></i>
                </div>
                <div>
                <h2 class="text-lg font-semibold">Today's Attendance</h2>
                </div>
            </div>
        </template>

        <template #content>
            <div class="flex justify-center">
                <div class="flex items-center p-4">
                    <div class="flex flex-col items-center font-bold">
                        <div class="text-xs text-[#036985]">AUGUST 26, 2025 [TUE]</div>
                        <div class="text-sm">11:00 AM - 04:00 PM</div>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-300"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                <Tag severity="success" value="IN" class="text-sm" />
                </div>
                <div class="flex-1 text-left font-bold">
                10:58 PM
                </div>
                <div class="text-[#852F01] text-sm">
                
                </div>
            </div>

            <div class="border-t border-gray-300"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                <Tag severity="warn" value="OUT" class="text-sm" />
                </div>
                <div class="flex-1 text-left font-bold">
                06:45 PM
                </div>
                <div class="text-[#852F01] text-sm">
                
                </div>
            </div>

            <div class="border-t border-gray-300"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                <Tag :style="{ backgroundColor: '#852F01', color: '#fff' }" value="IN" class="text-sm" />
                </div>
                <div class="flex-1 text-left font-bold">
                06:45 PM
                </div>
                <div class="text-[#852F01] text-sm">
                Overtime
                </div>
            </div>

            <div class="border-t border-gray-300"></div>
            <div class="flex items-center p-4 gap-2">
                <div class="w-12 flex justify-center">
                <Tag :style="{ backgroundColor: '#852F01', color: '#fff' }" value="OUT" class="text-sm" />
                </div>
                <div class="flex-1 text-left font-bold">
                06:45 PM
                </div>
                <div class="text-[#852F01] text-sm">
                Overtime
                </div>
            </div>

            <div v-if="dateRange">
                <div class="border-t border-gray-300"></div>
                <div class="flex items-start justify-center">
                    <Button label="View Details" severity="info" variant="text" />
                </div>
            </div>
        </template>
    </Card>
</template>
