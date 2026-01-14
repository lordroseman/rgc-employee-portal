<template>
	<div
		ref="rootEl"
		class="select-none"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
		@touchcancel="onTouchEnd"
	>
		<!-- Indicator sits just above content; revealed by translateY -->
		<div
			class="flex items-center justify-center"
			:style="indicatorStyle"
			aria-live="polite"
			aria-atomic="true"
		>
			<slot
				name="indicator"
				:pulling="isPulling"
				:refreshing="isRefreshing"
				:progress="progress"
				:distance="pullDistance"
				:threshold="threshold"
			>
				<div class="flex items-center gap-2 text-white text-sm">
                
					<svg
						v-if="isRefreshing"
						viewBox="0 0 24 24"
						class="h-4 w-4 animate-spin"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<circle
							cx="12"
							cy="12"
							r="9"
							stroke="currentColor"
							stroke-width="2"
							opacity="0.25"
						/>
						<path
							d="M21 12a9 9 0 0 0-9-9"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					<svg 
                        v-if="isPulling && pullDistance >= threshold"
						viewBox="0 0 24 24"
						class="h-4 w-4"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						:style="arrowStyle"
					>
						<path
							d="M12 5v12"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<path
							d="M7 13l5 5 5-5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg> 
					<span>{{ label }}</span>
				</div>
			</slot>
		</div>

		<div class="will-change-transform" :style="contentStyle">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

type ScrollTarget = 'window' | 'self'

const props = withDefaults(
	defineProps<{
		disabled?: boolean
		threshold?: number
		maxPull?: number
		refreshHold?: number
		scrollTarget?: ScrollTarget
		/**
		 * If provided, the component will treat this as source-of-truth.
		 * You can still listen to `update:refreshing`.
		 */
		refreshing?: boolean | null
		/**
		 * Optional callback to await. Useful if you want the component
		 * to automatically hold the indicator until the Promise resolves.
		 */
		onRefresh?: () => unknown | Promise<unknown>
	}>(),
	{
		disabled: false,
		threshold: 72,
		maxPull: 100,
		refreshHold: 56,
		scrollTarget: 'window',
		refreshing: null,
		onRefresh: undefined,
	},
)

const emit = defineEmits<{
	(e: 'refresh'): void
	(e: 'update:refreshing', value: boolean): void
}>()

const rootEl = ref<HTMLElement | null>(null)

const startY = ref(0)
const isDragging = ref(false)
const isPulling = ref(false)
const pullDistance = ref(0)
const translateY = ref(0)
const internalRefreshing = ref(false)

const isControlledRefreshing = computed(() => props.refreshing !== null && props.refreshing !== undefined)
const isRefreshing = computed(() => (isControlledRefreshing.value ? (props.refreshing as boolean) : internalRefreshing.value))

const threshold = computed(() => Math.max(0, props.threshold))

const progress = computed(() => {
	const t = threshold.value || 1
	return Math.max(0, Math.min(1, pullDistance.value / t))
})

const label = computed(() => {
	if (isRefreshing.value) return 'Refreshing…'
	if (isPulling.value && pullDistance.value >= threshold.value) return 'Release to refresh'
	return ''
})

const transition = computed(() => (isDragging.value ? 'none' : 'transform 200ms ease'))

const indicatorStyle = computed(() => {
	const hold = Math.max(0, props.refreshHold)
	return {
		height: `${hold}px`,
		marginTop: `-${hold}px`,
		transform: `translateY(${translateY.value}px)`,
		transition: transition.value,
	} as const
})

const contentStyle = computed(() => {
	return {
		transform: `translateY(${translateY.value}px)`,
		transition: transition.value,
	} as const
})

const arrowStyle = computed(() => {
	const rotate = pullDistance.value >= threshold.value ? 180 : 0
	return {
		transform: `rotate(${rotate}deg)`,
		transition: 'transform 150ms ease',
	} as const
})

function getScrollTop(): number {
	if (props.scrollTarget === 'self') {
		return rootEl.value?.scrollTop ?? 0
	}

	// window/document scroll
	return window.scrollY || document.documentElement.scrollTop || 0
}

function isAtTop(): boolean {
	return getScrollTop() <= 0
}

function applyPull(deltaY: number) {
	const maxPull = Math.max(0, props.maxPull)
	const eased = Math.min(maxPull, deltaY * 0.6)
	pullDistance.value = eased
	translateY.value = eased
}

async function setRefreshing(nextVal: boolean) {
	emit('update:refreshing', nextVal)
	if (!isControlledRefreshing.value) internalRefreshing.value = nextVal
}

async function triggerRefresh() {
	if (props.disabled || isRefreshing.value) return
	await setRefreshing(true)
	translateY.value = Math.max(0, props.refreshHold)
	pullDistance.value = translateY.value
	emit('refresh')

	if (props.onRefresh) {
		try {
			await props.onRefresh()
		} finally {
			await nextTick()
			await setRefreshing(false)
		}
	}
}

function reset() {
	isPulling.value = false
	pullDistance.value = 0
	translateY.value = 0
}

function onTouchStart(e: TouchEvent) {
	if (props.disabled || isRefreshing.value) return
	if (e.touches.length !== 1) return
	if (!isAtTop()) return

	const touch = e.touches.item(0)
	if (!touch) return

	isDragging.value = true
	isPulling.value = false
	startY.value = touch.clientY
	pullDistance.value = 0
	translateY.value = 0
}

function onTouchMove(e: TouchEvent) {
	if (!isDragging.value || props.disabled || isRefreshing.value) return
	if (e.touches.length !== 1) return

	const touch = e.touches.item(0)
	if (!touch) return

	const currentY = touch.clientY
	const deltaY = currentY - startY.value
	if (deltaY <= 0) {
		reset()
		return
	}

	if (!isAtTop()) return
	if (e.cancelable) e.preventDefault()

	isPulling.value = true
	applyPull(deltaY)
}

async function onTouchEnd() {
	if (!isDragging.value) return
	isDragging.value = false

	const shouldRefresh = !props.disabled && pullDistance.value >= threshold.value
	if (shouldRefresh) {
		await triggerRefresh()
		// If parent controls refreshing, it may keep us in the hold state; otherwise we’ll reset via watcher.
		return
	}

	reset()
}

watch(
	() => isRefreshing.value,
	(val) => {
		if (val) {
			translateY.value = Math.max(0, props.refreshHold)
			pullDistance.value = translateY.value
			return
		}

		if (!isDragging.value) reset()
	},
)

// Safety: if the component unmounts while dragging.
onBeforeUnmount(() => {
	isDragging.value = false
})
</script>
