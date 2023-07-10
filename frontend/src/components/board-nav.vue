<template>
  <section class="board-nav align-center full">
    <div class="menu-left-btns">
      <div class="title" :style="darkStyle">
        <input
          :size="title.length"
          v-model="title"
          class="board-title"
          @change="dispatchSetItem({ item: title, key: 'title' })"
        />
      </div>
      <div class="star btn" :style="{ darkStyle }" @click="toggleStar">
        <span :class="{ unstar: board.isFavorite }"></span>
      </div>
    </div>
    <div class="menu-members-btns align-center">
      <div class="avatar-list flex" v-if="board.members.length">
        <avatar
          v-for="(member, idx) in board.members"
          :key="member._id + idx"
          class="avatar"
          :size="28"
          :username="member.fullname"
          :src="member.imgUrl"
        ></avatar>
      </div>
      <div class="invite-btn btn" @click="toggleInviteModal" :style="darkStyle">
        <span></span>
        <span>Convidar para o Quadro</span>
      </div>
      <invite-modal
        v-if="isInvite"
        @setMembers="setMembers"
        @close="toggleInviteModal"
        :board="board"
      ></invite-modal>
    </div>
    <div class="menu-right-btns">
      <div class="board-menu btn" @click="toggleMenuModal" :style="darkStyle">
        <span></span>
        <span>Abrir Menu</span>
      </div>
      <menu-modal
        v-if="isMenuModal"
        :board="board"
        @close="toggleMenuModal"
        @removeBoard="(data) => removeBoard(data)"
      ></menu-modal>
    </div>
  </section>
</template>

<script>
import Avatar from "vue-avatar";
import inviteModal from "../components/popup/board-nav/invite-modal.vue";
import menuModal from "../components/popup/board-nav/menu-modal.vue";
export default {
  props: {
    board: Object,
    filter: Object,
  },
  data() {
    return {
      title: this.board.title,
      isInvite: false,
      isFilter: false,
      isMenuModal: false,
    };
  },
  methods: {
    async dispatchSetItem({ key, item }) {
      this.$store.dispatch({ type: "setBoardItem", key, item });
    },
    toggleInviteModal() {
      this.isInvite = !this.isInvite;
    },
    toggleMenuModal() {
      this.isMenuModal = !this.isMenuModal;
    },
    toggleStar() {
      this.$store.dispatch({
        type: "setBoardItem",
        key: "isFavorite",
        item: !this.board.isFavorite,
        boardId: this.board._id,
      });
    },
    setMembers(members) {
      this.board.members.push(...members);
      this.$store.dispatch({ type: "updateBoard", board: this.board });
    },
    removeBoard(board) {
      console.log("hahahahahah")
      this.$emit("removeBoard1", board);
    },
  },
  computed: {
    darkStyle() {
      return this.board.style.isDark
        ? { filter: "invert(1)", color: "black" }
        : {};
    },
  },
  components: {
    Avatar,
    inviteModal,
    menuModal,
  },
  
};
</script>

<style></style>
