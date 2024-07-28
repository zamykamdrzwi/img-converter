<script setup>
import { ref } from "vue";
import JSZip from "jszip";
import { saveAs } from 'file-saver';
import { quality } from "@/stores/quality.js";

const store = quality();
const newQuality = [0.2, 0.4, 0.6, 0.8];
const qualityToShow = ['20%', '40%', '60%', '80%'];
const currentQuality = ref([]);

const imageUrl = ref(null);
const imagesArray = ref([]);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
}

// Changing img to webp
const fileUpload = async (event) => {
  const file = event.target.files[0];
  if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
    const webpImage = await convertToWebp(file);
    imageUrl.value = URL.createObjectURL(webpImage);
    imagesArray.value.push(imageUrl.value);
  } else {
    console.warn('Problem ze zdjęciem');
  }
  currentQuality.value.push(qualityToShow[store.imgQuality]);
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
            newQuality[store.imgQuality] // quality
        );
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Handle drag and drop
const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (event) => {
  event.preventDefault();
  if (event.dataTransfer.files.length > 0) {
    fileInput.value.files = event.dataTransfer.files;
    fileInput.value.dispatchEvent(new Event('change', { bubbles: true }));
  }
};

// Download Images
const downloadAllImg = () => {
  if(imagesArray.value.length > 1) {
    downloadAsZip(imagesArray.value);
  } else {
    downloadSingle(imagesArray.value[0]);
  }
}

const fetchBlob = async (url) => {
  const response = await fetch(url);
  return response.blob();
};

const downloadAsZip = async (items) => {
  const zip = new JSZip();
  const folder = zip.folder('converted_images');

  for (const item of items) {
    const index = items.indexOf(item);
    const blob = await fetchBlob(item);
    folder.file(`converted-image${index}`, blob);
  }

  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'files.zip');
  });
}

const downloadSingle = (item) => {
  const link = document.createElement('a');
  link.href = item;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const resetWeb = () => {
  window.location.reload();
}
</script>

<template>
  <section>
    <div class="flex justify-center w-full">
      <div
        @dragover.prevent="onDragOver"
        @drop.prevent="onDrop"
        class="drop-zone mx-6 md:mx-0"
      >
        <div @click="triggerFileInput"
             class="cursor-pointer w-full h-full flex justify-center items-center flex-col text-gray-500">
          <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          </div>
          <div>Drag your files here or click in this area</div>
        </div>
        <input type="file" @change="fileUpload" accept="image/png, image/jpeg" ref="fileInput"
          class="hidden"/>
      </div>
    </div>

    <div class="w-full flex justify-center gap-14 mt-6 flex-wrap">
      <button @click="downloadAllImg" v-if="imageUrl"
              class="bg-amber-300 border-2 border-amber-300 px-10 py-3 rounded-3xl text-gray-600 font-bold text-xl hover:bg-white transition-all duration-300 ease-in">
        Download
      </button>
      <button @click="resetWeb" v-if="imageUrl"
              class="bg-amber-300 border-2 border-amber-300 px-10 py-3 rounded-3xl text-gray-600 font-bold text-xl hover:bg-white transition-all duration-300 ease-in">
        Reset Images
      </button>
    </div>

    <div class="w-full flex justify-center mb-16 mt-10">
      <div class="custom-width flex flex-wrap gap-6 justify-center">
        <div v-if="imageUrl"
             v-for="(image, index) in imagesArray" :key="image">
          <img :src="image" alt="Uploaded Image">
          <div class="text-gray-500 mt-4 flex justify-center">
            <span>Image quality: </span>
            <span class="font-bold">
              {{ currentQuality[index] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
img {
  max-width: 180px;
  height: auto;
}
.drop-zone {
  width: 800px;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media(max-width: 768px) {
    width: 100%;
  }
}
.drop-zone.drag-over {
  border-color: #000;
}
.custom-width {
  width: 800px;

  @media(max-width: 768px) {
    width: 100%;
  }
}
</style>