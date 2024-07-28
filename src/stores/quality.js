import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const quality = defineStore('quality', {
    state: () => {
        return {
            imgQuality: 2
        }
    },
    actions: {
        setQuality(value) {
            this.imgQuality = value
        }
    }
});
