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
            <li class="about-board" @click="setContent('About')">
              <div class="title">
                <span class="trello-icon"></span>
                <span>Sobre este Quadro</span>
              </div>
              <p>Dê uma descrição para o seu Quadro</p>
            </li>
            <li @click="setContent('Background')">
              <span
                class="bg-icon"
                :style="{ backgroundColor: 'lightblue' }"
              ></span>
              <span>Mudar fundo</span>
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
    async restore(activity) {
      await this.$store.dispatch({
        activityId: activity.id,
        ...activity.dispatch,
        createdAt: Date.now(),
      });
      if (activity.listId && activity.cardId) this.goTo(activity);
    },
    goTo(activity) {
      if (!activity.listId || !activity.cardId) return;
      this.$router.push({
        path: `${this.$route.path}?listId=${activity.listId}&cardId=${activity.cardId}`,
      });
    },
    activityStyle(activity) {
      return !activity.listId || !activity.cardId ? {} : { cursor: "pointer" };
    },
    setContent(val) {
      this.contentToShow = val;
    },
    setBoard({ key, item }) {
      this.$store.dispatch({ type: "setBoardItem", key, item });
    },
  },
  components: {
    Avatar,
    Background,
  },
  computed: {
    activities() {
      return this.board.activities
        .filter((activity) => {
          if (activity.title.includes("undefined")) return false;
          if (!activity.mentions || !activity.mentions.length)
            activity.mentions = cardService.getMentions(
              this.board,
              activity.listId,
              activity.cardId
            );
          return (
            activity.createdBy._id === getLoggedinUser()?._id ||
            !activity.mentions ||
            !activity.mentions.length ||
            activity.mentions.find(
              (user) => user._id === getLoggedinUser()?._id
            )
          );
        })
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 50);
    },
  },
};
</script>

<style></style>
