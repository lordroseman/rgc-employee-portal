<script setup lang="ts">

</script>

<template>
    <div class="flex items-center justify-between mb-4">
    <div class="pt-2 pb-2">
      <Button 
        icon="pi pi-plus" 
        severity="primary"
        style="font-size: 14px;" 
        label="Apply Leave"
      />
    </div>

    <!-- <div class="flex gap-4 pt-2 pb-2">
      <Button 
        severity="warn" 
        icon="pi pi-download" 
        style="font-size: 14px;"
      />
    </div> -->
  </div>

    <div class="grid grid-cols-2 gap-3 mb-6 mt-4">
        <!-- Remaining Leave Credits -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Remaining Leave Credits
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-blue-50 px-2 pt-2 pb-1">
                        <i class="pi pi-clock text-blue-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        3
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Pending -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Leave Pending
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-amber-50 px-2 pt-2 pb-1">
                        <i class="pi pi-hourglass text-amber-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        2
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Approved -->
        <Card>
            <template #content>
                <div class="py-0 text-center">
                    <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                    Leave Approved
                    </div>
                    <div class="flex items-center gap-3">
                    <div class="rounded-full bg-green-50 px-2 pt-2 pb-1">
                        <i class="pi pi-check-circle text-green-600" style="font-size: 18px"></i>
                    </div>
                    <div class="text-xl font-bold">
                        1
                    </div>
                    </div>
                </div>
            </template>
        </Card>

        <!-- Leave Rejected -->
        <Card>
            <template #content>
            <div class="py-0 text-center">
                <div class="text-xs uppercase text-gray-500 font-semibold mb-2">
                Leave Rejected
                </div>
                <div class="flex items-center gap-3">
                <div class="rounded-full bg-red-50 px-2 pt-2 pb-1">
                    <i class="pi pi-times-circle text-red-600" style="font-size: 18px"></i>
                </div>
                <div class="text-xl font-bold">
                    0
                </div>
                </div>
            </div>
            </template>
        </Card>
    </div>

    <div class="mt-4">
       <Tabs value="0" class="w-full">
  <!-- full width container -->
  <TabList
    class="flex w-full bg-gray-100 rounded-lg"
    style="
        --p-tabs-tab-active-color:#0b8390;
        --p-tabs-inkbar-background:#0b8390;
        --p-tabs-tab-active-border-color:#0b8390;
        --p-tabs-tab-active-background:transparent;
    "
    >
    <Tab
      value="0"
      class="w-1/3 text-center px-4 py-2 text-sm font-medium transition"
    >
      Pending
    </Tab>
    <Tab
      value="1"
      class="w-1/3 text-center px-4 py-2 text-sm font-medium transition"
    >
      Approved
    </Tab>
    <Tab
      value="2"
      class="w-1/3 text-center px-4 py-2 text-sm font-medium transition"
    >
      Rejected
    </Tab>
  </TabList>

  <TabPanels class="mt-4">
    <TabPanel value="0">Upcoming leave content...</TabPanel>
    <TabPanel value="1">Past leave content...</TabPanel>
    <TabPanel value="2">Team leave content...</TabPanel>
  </TabPanels>
</Tabs>

    </div>

</template>
