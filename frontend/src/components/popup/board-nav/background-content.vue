<template>
  <section class="change-background">
    <div class="background-select" v-if="!isPhotoOpen && !isColorOpen">
      <div class="image-user-select flex align-center justify-center">
        <div class="color-select">
          <img
            @click="isColorOpen = true"
            class="image"
            src="https://a.trellocdn.com/prgb/dist/images/colors@2x.ec32a2ed8dd8198b8ef0.jpg"
          />
          <div class="title">Cores</div>
        </div>
      </div>
      <hr />
    </div>
    <div class="unsplash-colors" v-if="isColorOpen">
      <div class="unsplash-container flex">
        <div
          class="image"
          v-for="(color, idx) in colors"
          :key="idx"
          :style="{ backgroundColor: color }"
          @click="setBg({ backgroundColor: color })"
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
import { debounce, isHexColorLight } from "../../../service/util.service";
import colorsPattern from "../../../assets/json/colors.json";

export default {
  props: {
    board: {
      type: Object,
    },
  },
  data() {
    return {
      isPhotoOpen: false,
      isColorOpen: false,
      search: "",
      colors: colorsPattern,
    };
  },
  methods: {
    async setBg({
      backgroundColor = null,
      backgroundThumb = null,
    }) {
      let bg = {};
        bg = {
          type: "color",
          backgroundColor,
          isDark: !isHexColorLight(backgroundColor),
        };
      this.$emit("set", {
        key: "style",
        item: { ...bg, customImages: this.customImages },
      });
    },
  
  },
  computed: {},
};
</script>

<style></style>
