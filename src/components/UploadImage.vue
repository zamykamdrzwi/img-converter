<script setup>
import { ref } from "vue";

const imageUrl = ref(null);

const fileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
    const webpImage = await convertToWebp(file);
    imageUrl.value = URL.createObjectURL(webpImage);
  } else {
    console.warn('Problem ze zdjęciem');
  }
}

const convertToWebp = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Conversion to WebP failed'));
              }
            },
            'image/webp',
            0.8 // quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
</script>

<template>
  <section>
    <input type="file" @change="fileUpload" accept="image/png, image/jpeg"/>
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Uploaded Image">
    </div>
    <a v-if="imageUrl" :href="imageUrl" download="converted-image.webp">
      <button class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        Download Image
      </button>
    </a>
  </section>
</template>

<style scoped>
img {
  max-width: 500px;
  height: auto;
}
</style>