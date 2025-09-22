<script setup lang="ts">

definePageMeta({
    title: 'Leaves'
})


const visibleBottom = ref(false);

</script>

<template>
    <div>
    <LeaveContent @open-bottom-drawer="visibleBottom = true" />

    <Drawer
v-model:visible="visibleBottom" class="rounded-2xl rounded-b-none" :pt="{ content: { style: 'padding:0' } }"
        :dismissable="false" position="bottom" style="height: auto" header="Apply Leave" :block-scroll="true"
        :style="{ maxHeight: '90vh' }" @close="visibleBottom = false">
        <ApplyLeaveDrawer v-model="visibleBottom" />
    </Drawer>
    </div>

</template>
