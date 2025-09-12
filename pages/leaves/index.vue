<script setup lang="ts">
const visibleBottom = ref(false);

</script>

<template>
   
<LeaveContent @openBottomDrawer="visibleBottom = true" />

<Drawer class="rounded-2xl rounded-b-none" :pt="{ content: { style: 'padding:0' } }" v-model:visible="visibleBottom" @close="visibleBottom = false" :dismissable="false" position="bottom" style="height: auto" header="Apply Leave" :block-scroll="true" :style="{ maxHeight: '90vh' }">
    <ApplyLeaveDrawer v-model="visibleBottom" />
</Drawer>

</template>
