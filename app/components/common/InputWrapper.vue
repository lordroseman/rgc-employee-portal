<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
    field: string
    label: string
    errorMessage?: string | string[] | null
}>()

const error = computed(() => {
    if (props.errorMessage) {
        return Array.isArray(props.errorMessage) ? props.errorMessage.join(' ') : props.errorMessage
    }
    return null
})

</script>

<template>

<div>
    <slot name="label">
        <label :for="field">{{ label }}</label>
    </slot>
    <slot />
    <span v-if="errorMessage" class="text-red-500 text-sm">
        {{error }}
    </span>
</div>
</template>
