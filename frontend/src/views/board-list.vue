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

              ></span
              ></span></board-preview>
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
        "Alfabéticamente A-Z",
        "Alfabéticamente Z-A",
      ],
      sortBy: "Alfabéticamente A-Z",
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
    async removeBoard(board) {
      await this.$store.dispatch({ type: "removeBoard", board });
    },
    async msgConfirm(type, req) {
      switch (type) {
        case "board":
          this.msg = {
            title: "Deletar Quadro",
            value:
              "Tem certeza que quer deletar o Quadro?\nEsta ação não pode ser desfeita.",
            background: true,
            controls: { deletar: "deletebtn", cancelar: "cancel-btn" },
            req,
            run: { deletar: "removeBoard" },
          };
          break;
      }
    },
  },
  computed: {
    boardToShow() {
      if (!this.boards) return null;
      const star = this.boards.filter((board) => board.isFavorite);
      const other = this.boards.filter(
        (board) => !star.find((star) => star === board)
      );
      const demo = this.isGuest
        ? this.boards.filter((board) => board.isDemoBoard)
        : [];
      const boards = { demo, star, other };
      for (const key in boards) {
        switch (this.sortBy) {
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
