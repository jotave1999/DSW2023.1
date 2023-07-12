<template>
  <div
    v-if="board"
    class="board main-content"
    @filter="(filter) => (filterBy = filter)"
  >
    <msg-modal
      :msg="msg"
      @close="msg = null"
      @deletar="(data) => remove('deletar', data)"
      @cancelar="msg = null"
    />
    <card-details
      v-if="$route.query.listId && $route.query.cardId"
      @close="$router.push({ path: $route.path })"
      @remove="removeCard"
      :board="board"
    />
    <div class="board-fixed-container" :style="background">
      <board-nav
        v-if="board"
        @removeBoard1="(data) => msgConfirm('board', data)"
        :board="board"
        :filter="filterBy"
        
      ></board-nav>
      <card-list
        @addCard="addCard"
        @addList="addList"
        @removeCard="removeCard"
        @removeList="(data) => msgConfirm('list', data)"
        :filterBy="filterBy"
        :board="board"
      />
    </div>
  </div>
</template>

<script>
import boardNav from "../components/board-nav.vue";
import cardList from "../components/cards/card-list.vue";
import cardDetails from "../components/cards/card-details.vue";
import msgModal from "@/components/msg-modal.vue";
import { socketService } from "../service/socket.service.js";
import { cardService } from "../service/card.service";

export default {
  props: [],
  data() {
    return {
      msg: null,
      board: null,
      filterBy: {
        keyword: "",
        members: [],
        dueDate: [0],
        labelsIds: [],
      },
      card: null,
      boardStyle: null,
      isDashboard: false,
      fn: {
        removeList: async (list) => {
          console.log(list);
          await this.$store.dispatch({ type: "removeList", list });
        },
      },
    };
  },
  components: {
    cardList,
    boardNav,
    cardDetails,
    msgModal,
  },
  created() {
    socketService.on("COMMIT", this.socketUpdate);
  },
  methods: {
    async addCard({ listId, card }) {
      await this.$store.dispatch({ type: "setCard", listId, card });
    },
    async addList(list) {
      await this.$store.dispatch({ type: "setList", list });
    },
    async removeCard({ listId, card }) {
      this.card = await this.$store.dispatch({
        type: "removeCard",
        listId,
        card,
      });
    },
    async removeList(list) {
      await this.$store.dispatch({ type: "removeList", list });
    },
    async removeBoard(board) {
      await this.$store.dispatch({ type: "removeBoard", board });
      await this.$store.dispatch({ type: "loadBoards"});
      this.$router.push("/board")
    },
    async remove(type, { req, run }) {
      this.msg = null;
      type = run[type];
      switch (type) {
        case "removeList":
          await this.removeList(req);
          break;
        case "removeBoard":
          await this.removeBoard(req);
          break;
      }
    },
    async msgConfirm(type, req) {
      switch (type) {
        case "list":
          this.msg = {
            title: "Deletar Lista",
            value:
              "Tem certeza que quer deletar a lista?\nEsta ação não pode ser desfeita.",
            background: true,
            controls: { deletar: "deletebtn", cancelar: "cancel-btn" },
            req,
            run: { deletar: "removeList" },
          };
          break;
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
    socketUpdate(data) {
      // console.log("socket >> ", data);
      this.$store.dispatch({ type: "socket", socketCmd: data });
    },
  },
  computed: {
    background() {
      const style = this.board.style;
      if (style.backgroundImage)
        return `backgroundImage: ${style.backgroundImage}`;
      else if (style.backgroundColor)
        return `backgroundColor: ${style.backgroundColor}`;
    },
  },
  watch: {
    "$route.params.id": {
      async handler(boardId) {
        this.board = await this.$store.dispatch({
          type: "getBoardById",
          boardId,
        });
        socketService.on(boardId, this.socketUpdate);
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
