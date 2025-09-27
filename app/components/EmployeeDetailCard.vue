<script setup lang="ts">
import type { Employee } from '~/types/employees';

const props = defineProps<{
  employee: Employee | null | undefined;
  skeletonLoading?: boolean | false | undefined
}>();

</script>

<template>
    <div class="relative mx-auto mt-14 mb-6">
        <div v-if="skeletonLoading" class="absolute left-1/2 -translate-x-1/2 -top-12 h-22 w-22 ring-4 ring-white rounded-full overflow-hidden bg-gray-200">
            <Skeleton shape="circle" size="6rem"></Skeleton>
        </div>

        <div v-else>
            <ProfileAvatar 
                size="24"
                class="absolute left-1/2 -translate-x-1/2 -top-12 z-10 rounded-full h-24 w-24 ring-4 ring-white overflow-hidden bg-gray-200"
                :name="employee?.fname" 
                :font-size-ratio="2"
                :src="employee?.image"
            />
        </div>

        <Card class="shadow-lg pt-12">
            <template #content>
                <div class="px-6 pb-4">
                    <div v-if="skeletonLoading" class="flex flex-col items-center">
                        <Skeleton width="15rem" class="mb-2"/>
                        <Skeleton width="5rem" class="mb-2"/>
                        <Skeleton width="10rem" class="mb-2"/>
                    </div>

                    <div v-else>
                        <h3 class="text-center text-xl font-medium text-gray-900">
                            {{ employee?.fname }} {{  employee?.mname  }} {{  employee?.lname  }}
                        </h3>
                        <div class="mt-1 flex justify-center text-sm text-gray-700">
                            <span>#{{ employee?.id_num }}</span>
                        </div>
                        <div class="mt-1 flex justify-center text-sm text-gray-700">
                            <span>
                                {{ employee?.designation?.title }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>