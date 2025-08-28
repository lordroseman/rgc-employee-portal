<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ref, type Ref } from 'vue'

// today
const today = new Date()

// generate 15 days before today + today (16 days total)
const dates = ref(
  Array.from({ length: 16 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - (15 - i))
    return {
      date: d,
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: d.getDate()
    }
  })
)

// 👇 force as Ref<Date>
const selectedDate: Ref<Date> = ref(today)

function selectDate(d: Date) {
  selectedDate.value = d
}
</script>

<template>
    <Swiper
      :slides-per-view="5"
      :centered-slides="false"
      :watch-overflow="true"
      :slides-offset-after="0"
      :initial-slide="dates.length - 3"
    >
      <SwiperSlide
        v-for="(day, index) in dates"
        :key="index"
        @click="selectDate(day.date)"
      >
        <div
          class="cursor-pointer p-3 text-center "
        >
          <div
          class="rounded-lg uppercase pt-2 pb-2"
          :class="(selectedDate.toDateString() === day.date.toDateString())
            ? 'bg-[#088492] text-white font-bold'
            : 'bg-gray-100 text-gray-700'">
            <div class="text-xs">{{ day.month }}</div>
            <div class="text-lg">{{ day.day }}</div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
</template>