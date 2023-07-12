<template>
  <div class="board-menu-page" @click="$emit('close')">
    <section class="board-menu-container" @click.stop>
      <div class="menu-header align-center">
        <span
          v-if="contentToShow !== 'Menu'"
          @click="setContent('Menu')"
        ></span>
        <h4>{{ contentToShow }}</h4>
        <span @click="$emit('close')"></span>
      </div>
      <div class="board-menu-content">
        <div class="menu-content" v-if="contentToShow === 'Menu'">
          <ul class="menu-action-btns">
            <li @click="setContent('Background')">
              <span
                class="bg-icon"
                :style="{ backgroundColor: 'lightblue' }"
              ></span>
              <span>Mudar fundo</span>
            </li>
            <li @click="removeBoard()">
              <span
                class="deletar-icon"
              ></span>
              <span>Deletar Quadro</span>
            </li>
          </ul>
        </div>
        <component
          v-else
          :is="contentToShow"
          :board="board"
          @set="setBoard"
        ></component>
      </div>
    </section>
  </div>
</template>

<script>
import Avatar from "vue-avatar";
import Background from "./background-content.vue";

import { getLoggedinUser } from "../../../service/user.service";
import { cardService } from "../../../service/card.service";
import { deepCopy } from "../../../service/util.service";

export default {
  props: {
    board: Object,
  },
  data() {
    return {
      contentToShow: "Menu",
    };
  },
  created() {},
  methods: {
    setContent(val) {
      this.contentToShow = val;
    },
    setBoard({ key, item }) {
      this.$store.dispatch({ type: "setBoardItem", key, item });
    },
    removeBoard() {
      const board = deepCopy(this.board);
      this.$emit("removeBoard", board);
    },
  },
  components: {
    Avatar,
    Background,
  },
  computed: {
  },
};
</script>

<style></style>
