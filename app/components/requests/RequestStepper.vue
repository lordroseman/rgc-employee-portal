<script setup lang="ts">

</script>

<template>
    <div class="p-6 bg-white rounded-lg shadow-md">

        <Stepper value="1" class="basis-[50rem]">
            <StepList>
                <Step value="1">Step 1</Step>
                <Step value="2">Step 2</Step>
                <Step value="3">Step 3</Step>
            </StepList>
            <StepPanels>
                <StepPanel v-slot="{ activateCallback }" value="1">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"/>
                    </div>
                    <div class="flex pt-6 justify-end">
                        <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('2')" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="2">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                            Content II</div>
                    </div>
                    <div class="flex pt-6 justify-between">
                        <Button
label="Back" severity="secondary" icon="pi pi-arrow-left"
                            @click="activateCallback('1')" />
                        <Button label="Next" icon="pi pi-arrow-right" icon-pos="right" @click="activateCallback('3')" />
                    </div>
                </StepPanel>
                <StepPanel v-slot="{ activateCallback }" value="3">
                    <div class="flex flex-col h-48">
                        <div
                            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium">
                            Content III</div>
                    </div>
                    <div class="pt-6">
                        <Button
label="Back" severity="secondary" icon="pi pi-arrow-left"
                            @click="activateCallback('2')" />
                    </div>
                </StepPanel>
            </StepPanels>
        </Stepper>

    </div>
</template>