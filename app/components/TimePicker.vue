<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

type Period = 'AM' | 'PM'
type Mode = 'hour' | 'minute'

const props = defineProps<{
  modelValue?: string   // e.g. "07:08 AM"
  visible?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:visible', v: boolean): void
}>()

/* ---------------- State ---------------- */
const open = computed({
  get: () => props.visible ?? false,
  set: (v: boolean) => emit('update:visible', v),
})

const hour   = ref<number>(7)     // 1..12
const minute = ref<number>(8)     // 0..59
const period = ref<Period>('AM')
const mode   = ref<Mode>('hour')  // active dial

const pad2 = (n: number) => String(n).padStart(2, '0')
const display = computed(() => `${pad2(hour.value)}:${pad2(minute.value)} ${period.value}`)

/* Parse incoming v-model */
watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    const m = val.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
    if (m) {
      hour.value   = Math.min(Math.max(parseInt(m[1]!), 1), 12)
      minute.value = Math.min(Math.max(parseInt(m[2]!), 0), 59)
      period.value = m[3]!.toUpperCase() as Period
    }
  },
  { immediate: true }
)

function confirm() {
  emit('update:modelValue', display.value)
  open.value = false
}

/* ---------------- Dial geometry (12 at top) ---------------- */
const hours = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)] // 12,1..11
const minuteTicks = Array.from({ length: 12 }, (_, i) => (i * 5) % 60) // 0..55 step 5

// Face size + radius
const FACE = 320 // px
const R    = 120 // pointer length AND label radius

function posStyle(index: number, total: number) {
  const angle = (index / total) * 360 // 0deg = 12 o'clock
  const rad = (angle - 90) * (Math.PI / 180)
  const x = R * Math.cos(rad)
  const y = R * Math.sin(rad)
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)',
  }
}

const hourAngle   = computed(() => (hour.value % 12) * 30) // 0..330
const minuteAngle = computed(() => minute.value * 6)       // 0..354
const pointerAngle = computed(() => (mode.value === 'hour' ? hourAngle.value : minuteAngle.value))

const tipStyle = computed(() => {
  const rad = (pointerAngle.value - 90) * (Math.PI / 180)
  const x = R * Math.cos(rad)
  const y = R * Math.sin(rad)
  return {
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)',
  }
})

/* ---------------- Draggable dial (mouse + touch) ---------------- */
const faceRef = ref<HTMLDivElement | null>(null)
let dragging = false
let cx = 0, cy = 0 // center in viewport coords

function normalizeDeg(d: number) {
  return (d % 360 + 360) % 360
}
function pointToAngle(clientX: number, clientY: number) {
  // atan2 has 0deg at +x (3 o'clock). We want 0deg at 12 o'clock.
  const rad = Math.atan2(clientY - cy, clientX - cx)
  const deg = rad * 180 / Math.PI
  return normalizeDeg(deg + 90) // shift so 12 o'clock = 0deg
}
function angleToHour(deg: number) {
  const idx = Math.round(deg / 30) % 12
  return idx === 0 ? 12 : idx
}
function angleToMinute(deg: number) {
  return Math.round(deg / 6) % 60 // 1-minute resolution
}

function updateFromEvent(e: MouseEvent | TouchEvent) {
  const t = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent)
  if (!t) return
  const a = pointToAngle(t.clientX, t.clientY)
  if (mode.value === 'hour') {
    hour.value = angleToHour(a)
  } else {
    minute.value = angleToMinute(a)
  }
}

function onStart(e: MouseEvent | TouchEvent) {
  const el = faceRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  cx = rect.left + rect.width / 2
  cy = rect.top  + rect.height / 2
  dragging = true
  updateFromEvent(e)

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onEnd)
  window.addEventListener('touchmove', onMove, { passive: false })
  window.addEventListener('touchend', onEnd)
}
function onMove(e: MouseEvent | TouchEvent) {
  if (!dragging) return
  e.preventDefault?.()
  updateFromEvent(e)
}
function onEnd() {
  dragging = false
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseup', onEnd)
  window.removeEventListener('touchmove', onMove)
  window.removeEventListener('touchend', onEnd)
}
onBeforeUnmount(onEnd)

/* ---------------- Click labels ---------------- */
function pickHour(h: number)   { hour.value = h; mode.value = 'minute' }
function pickMinute(m: number) { minute.value = m }
const periods: Period[] = ['AM', 'PM']
</script>

<template>
    <Drawer
        v-model:visible="open"
        dismissable-mask
        header="Select Time"
        :style="{ width: '460px' }"
        content-class="!pt-2"
         class="rounded-t-2xl   max-w-[768px]     " 
        :dismissable="false"
        position="bottom"
        style="height: auto"
        :block-scroll="true"
        :pt="{
          root : {
            'max-w-[768px]': true,
            'w-full': true,
            'mx-auto': true,
          }
           // leave space for bottom nav
        }"
    >
        <!-- Top row: big HH : MM and AM/PM -->
        <div class="grid grid-cols-[1fr_auto] gap-4 items-center">
            <div class="flex items-start gap-3">
                <!-- HOUR -->
                <button
                    type="button"
                    class="inline-flex items-center justify-center
                        text-5xl font-medium rounded-md border
                        font-mono tabular-nums
                        w-24 h-14 px-0
                        transition-colors"
                    :class="mode === 'hour'
                    ? 'border-violet-600 text-violet-700 bg-violet-50'
                    : 'border-slate-200 text-gray-800 bg-white'"
                    @click="mode = 'hour'"
                >
                    {{ pad2(hour) }}
                </button>

                <!-- COLON (fixed width so layout never shifts) -->
                <div class="text-5xl font-medium leading-none w-6 text-center">:</div>

                <!-- MINUTE -->
                <button
                    type="button"
                    class="inline-flex items-center justify-center
                        text-5xl font-medium rounded-md border
                        font-mono tabular-nums
                        w-24 h-14 px-0
                        transition-colors"
                    :class="mode === 'minute'
                    ? 'border-violet-600 text-violet-700 bg-violet-50'
                    : 'border-slate-200 text-gray-800 bg-white'"
                    @click="mode = 'minute'"
                >
                    {{ pad2(minute) }}
                </button>
            </div>


            <div class="flex flex-col gap-2">
                <SelectButton
                    v-model="period"
                    :options="periods"
                    class="!flex !flex-col"
                />
            </div>
        </div>

        <!-- Clock face (GRAY RING REMOVED; clean white circle with subtle border) -->
        <div
            ref="faceRef"
            class="relative mt-5 mx-auto rounded-full bg-white border border-slate-200 shadow-sm select-none touch-none"
            :style="{ width: FACE + 'px', height: FACE + 'px' }"
            @mousedown="onStart"
            @touchstart.prevent="onStart"
        >
        <!-- pointer line -->
        <div
            class="absolute left-1/2 top-1/2 h-[2px] bg-violet-600 origin-left pointer-events-none"
            :style="{ width: R + 'px', transform: `rotate(${pointerAngle - 90}deg)` }"
        />
        <!-- center knob -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-violet-600 rounded-full pointer-events-none"/>
        <!-- tip knob -->
        <div class="absolute w-6 h-6 bg-violet-600 rounded-full shadow pointer-events-none" :style="tipStyle"/>

        <!-- hour labels -->
        <template v-if="mode === 'hour'">
            <button
                v-for="(h, i) in hours"
                :key="'h' + h"
                type="button"
                class="absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                :class="h === hour ? 'bg-violet-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-violet-50'"
                :style="posStyle(i, 12)"
                @click.stop="pickHour(h)"
            >
            {{ h }}
            </button>
        </template>

        <!-- minute labels (0..55 every 5) -->
        <template v-else>
            <button
            v-for="(m, i) in minuteTicks"
            :key="'m' + m"
            type="button"
            class="absolute w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="m === minute ? 'bg-violet-600 text-white shadow' : 'bg-transparent text-gray-700 hover:bg-violet-50'"
            :style="posStyle(i, 12)"
            @click.stop="pickMinute(m)"
            >
            {{ pad2(m) }}
            </button>
        </template>
        </div>

        <template #footer>
        <div class="flex justify-between items-center w-full">
            <Button label="Cancel" text class="text-emerald-600" @click="open = false" />
            <div class="text-gray-600 mx-2">{{ display }}</div>
            <Button label="OK" class="!bg-emerald-600 !border-emerald-600" @click="confirm" />
        </div>
        </template>
    </Drawer>
</template>