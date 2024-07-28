<script setup>

</script>

<template>
  <section>
    <h1 class="text-6xl font-bold leading-tight text-gray-700 bg-amber-300 text-center mb-16">
      IMG Converter
    </h1>
    <div class="w-full flex justify-center mb-16">
      <div class="custom-width mx-6 md:mx-0">
        <p class="text-xl tracking-wide text-gray-700 mb-6">
          On this page you can convert your <span class="font-bold">.png</span> or <span class="font-bold">.jpeg</span> images to
          <span class="font-bold">.webp</span>. This conversion makes the images <span class="font-bold">weigh less</span>.
        </p>
        <p class="text-xl tracking-wide text-gray-700 mb-6">
          You can upload <span class="font-bold">several images</span> at once and download it as a <span class="font-bold">.zip</span>
          or add and download only one photo at once as <span class="font-bold">.webp</span>.
        </p>
        <p class="text-xl tracking-wide text-gray-700 mb-6">
          First, change the <span class="font-bold">target image quality</span>.
          The lower the percentage, the lower the quality of the photo and the less it will weigh.
        </p>
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