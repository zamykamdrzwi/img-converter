<script setup>
import { ref, onMounted } from "vue";
import { quality } from "@/stores/quality.js";

const store = quality();
const activeButton = ref(null);

onMounted(() => {
  setActiveButton(store.imgQuality)
})

const buttons = ref([
  { id: 0, label: '20%' },
  { id: 1, label: '40%' },
  { id: 2, label: '60%' },
  { id: 3, label: '80%' },
]);

const updateQuality = (value) => {
  store.setQuality(value)
}

const setActiveButton = (id) => {
  activeButton.value = id;
  updateQuality(id);
};
</script>

<template>
  <section class="w-full flex justify-center items-center">
    <div class="custom-width flex flex-col gap-6 justify-between items-center my-5 mb-10">
      <h2 class="text-2xl font-bold tracking-wide text-gray-700">
        Change image quality:
      </h2>
      <div class="w-full flex justify-around flex-wrap gap-6">
        <button
            v-for="button in buttons"
            :key="button.id"
            class="bg-amber-300 border-2 border-amber-300 px-10 py-3 rounded-3xl text-gray-600 font-bold text-xl hover:bg-white transition-all duration-300 ease-in"
            :class="{
        'bg-white': activeButton === button.id,
        'bg-amber-300': activeButton !== button.id
            }"
            @click="setActiveButton(button.id)"
        >
          {{ button.label }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-width {
  width: 800px;

  @media(max-width: 768px) {
    width: 100%;
  }
}
</style>