<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import dayjs from 'dayjs';
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import { ref, type Ref } from 'vue'

// today
const selectedDate = defineModel<string>('selectedDate', {
  default: dayjs().format('YYYY-MM-DD')
});

// generate 15 days before today + today (16 days total)
const dates = ref(
  Array.from({ length: 16 }, (_, i) => {
    const d = dayjs().subtract(15 - i, 'day');
    return {
      date: d.toDate(),
      iso: d.format('YYYY-MM-DD'),   
      month: d.format('MMM').toUpperCase(),
      day: d.date(),
    };
  })
);

// 👇 force as Ref<Date>
// const selectedDate: Ref<Date> = ref(today)

function selectDate(d: string) {
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
        @click="selectedDate = day.iso"
      >
        <div
          class="cursor-pointer p-3 text-center "
        >
          <div
          class="rounded-lg uppercase pt-2 pb-2"
          :class="selectedDate === day.iso
            ? 'bg-[#ecfdf5] text-[#1ea178] font-bold border'
            : 'bg-gray-100 text-gray-700'">
            <div class="text-xs">{{ day.month }}</div>
            <div class="text-lg">{{ day.day }}</div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
</template>