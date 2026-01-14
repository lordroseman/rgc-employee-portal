<script setup lang="ts"> 


const props = defineProps<{
    type: 'COA' | 'OT'
}>();

const tabValue = ref('pending')

const emptyMessage = computed(() => {
    if (props.type === 'COA') {
        return `You have no ${tabValue.value} Certificate of Attendance requests found.`
    } else if (props.type === 'OT') {
        return `You have no ${tabValue.value} Overtime requests found.`
    }
    return 'No requests found.'
})

const attendanceRequestsStore = useAttendanceRequestsStore();
const { meta: storeMeta, loading, loadingMore,  hasMore } =
    storeToRefs(attendanceRequestsStore);



// Example: this is effectively "get all pending COA" (based on the active tab).
const visibleRequests = computed(() => attendanceRequestsStore.getByStatusAndType(tabValue.value, props.type));


const loadMore = async () => {
    if (!hasMore.value || !storeMeta.value) return;
    await attendanceRequestsStore.fetchPage(storeMeta.value.current_page + 1, true);
};


</script>

<template>
    <Tabs v-model:value="tabValue" class="w-full">
        <!-- full width container -->
        <TabList class="flex w-full bg-gray-100 rounded-t-lg">
            <Tab value="pending" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition">
                Pending
            </Tab>
            <Tab
value="approved" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition"
                :disabled="loading">
                Approved
            </Tab>
            <Tab
value="rejected" class="w-1/3 text-center px-4 py-2 text-sm font-medium transition"
                :disabled="loading">
                Rejected
            </Tab>
        </TabList>

        <template v-if="loading">
            <div v-for="i in 3" :key="i" class="flex items-start justify-between p-4 bg-white">
                <div class="flex flex-col items-start gap-2">
                    <Skeleton width="10rem" class="mb-1" />
                    <Skeleton width="8rem" class="mb-1" />
                    <Skeleton width="12rem" />
                </div>
                <Skeleton width="6rem" />
            </div>
        </template>

         <div v-else class="bg-white">
            <div v-if="visibleRequests.length === 0" class="p-4"> 
                <EmptyStateMessage
                :message="emptyMessage"
                    icon-class="pi pi-file" icon-size-class="text-5xl" />
            </div>
            <div v-else>
                <div class="space-y-4 p-4">
                    <RequestCard v-for="request in visibleRequests" :key="request.id" :request="request" />
                </div>

                <div v-if="hasMore" class="p-4 text-center">
                    <Button label="Load More" :loading="loadingMore" @click="loadMore" />
                </div>
            </div>
        </div>
    </Tabs>
    
   

</template>