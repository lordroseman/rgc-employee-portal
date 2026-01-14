<script setup lang="ts">
type Props = {
	/**
	 * Fallback message shown when no default slot content is provided.
	 */
	message?: string
	/**
	 * PrimeIcon class for the fallback icon (used when no `icon` slot is provided).
	 * Example: "pi pi-info-circle"
	 */
	iconClass?: string
	/**
	 * Size utility class for the fallback icon.
	 * Example: "text-4xl"
	 */
	iconSizeClass?: string
}

const props = withDefaults(defineProps<Props>(), {
	message: 'No data to display.',
	iconClass: 'pi pi-info-circle',
	iconSizeClass: 'text-7xl',
})
</script>

<template>
	<div class="w-full py-10 flex flex-col items-center justify-center text-center">
		<div class="mb-4 flex items-center justify-center">
			<slot name="icon">
				<i
					:class="[props.iconClass, props.iconSizeClass, 'text-gray-400']"
					style="font-size: 2rem"
					aria-hidden="true"
				/>
			</slot>
		</div>

		<div class="max-w-md">
			<slot>
				<p class="text-sm text-gray-500 text-pretty max-w-[40ch]">
					{{ props.message }}
				</p>
			</slot>
		</div>
	</div>
</template>
