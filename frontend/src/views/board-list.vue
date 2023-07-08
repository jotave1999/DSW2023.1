<template>
  <main class="main-layout" v-if="boardToShow">
    <section class="boards-page">
      <h2>Area de Trabalho</h2>
      <div class="filter-section align-center">
        <select v-model="sortBy">
          <option v-for="value in options" :key="value">{{ value }}</option>
        </select>
        <input type="text" placeholder="Procurar Quadros" v-model="searchVal" />
      </div>
      <template v-if="boardToShow.star && boardToShow.star.length">
        <h3 class="board-list-title">Favoritos</h3>
        <ul class="board-star grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.star">
            <li :key="'S' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
      <template v-if="boardToShow.recent && boardToShow.recent.length">
        <h3 class="board-list-title">Atividade Recente</h3>
        <ul class="board-list grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.recent">
            <li v-if="!board.isStar" :key="'R' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
      <template v-if="boardToShow.other && boardToShow.other.length">
        <h3 class="board-list-title">Outros Quadros</h3>
        <ul class="board-list grid" v-if="boardToShow">
          <template class="grid" v-for="board in boardToShow.other">
            <li v-if="!board.isStar" :key="'O' + board._id">
              <board-preview
                :board="board"
                @change="toggleStar"
              ></board-preview>
            </li>
          </template>
        </ul>
      </template>
    </section>
  </main>
</template>

<script>
import boardPreview from "../components/board/board-preview.vue";
import { deepCopy } from "../service/util.service";
export default {
  data() {
    return {
      isGuest: this.$store.getters.loggedinUser?.username === "Guest",
      boards: null,
      options: [
        "Mais ativos",
        "Ultimos ativos",
        "Alfabéticamente A-Z",
        "Alfabéticamente Z-A",
      ],
      sortBy: "Mais ativos",
      searchVal: "",
    };
  },
  async created() {
    this.boards = await this.loadBoards();
  },
  methods: {
    async loadBoards() {
      return await this.$store.dispatch({ type: "loadBoards" });
    },
    toggleStar(changed) {
      const idx = this.boards.findIndex((board) => board._id === changed._id);
      console.log(idx);
      if (idx > -1) this.boards.splice(idx, 1, deepCopy(changed));
    },
  },
  computed: {
    boardToShow() {
      if (!this.boards) return null;
      const active = this.boards
        .sort((a, b) => b.activityCount - a.activityCount)
        .slice(0, 4);
      const recent = this.boards
        .sort((a, b) => b.lastActivity - a.lastActivity)
        .slice(0, 4);
      const star = this.boards.filter((board) => board.isFavorite);
      const other = this.boards.filter(
        (board) => !star.find((star) => star === board)
      );
      const demo = this.isGuest
        ? this.boards.filter((board) => board.isDemoBoard)
        : [];
      const boards = { demo, star, active, recent, other };
      for (const key in boards) {
        switch (this.sortBy) {
          case "Mais ativos":
            boards[key] = boards[key].sort(
              (a, b) => b.activityCount - a.activityCount
            );
            break;
          case "Ultimos ativos":
            boards[key] = boards[key].sort(
              (a, b) => b.lastActivity - a.lastActivity
            );
            break;
          case "Alfabéticamente A-Z":
            boards[key] = boards[key].sort((a, b) =>
              a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
            );
            break;
          case "Alfabéticamente Z-A":
            boards[key] = boards[key].sort((a, b) =>
              a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
            );
            break;
        }
        if (this.searchVal)
          boards[key] = boards[key].filter((board) =>
            board.title.toLowerCase().includes(this.searchVal.toLowerCase())
          );
      }
      return boards;
    },
  },
  components: {
    boardPreview,
  },
};
</script>

<style></style>
