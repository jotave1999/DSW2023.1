<template>
  <div class="card-details-container" @click="goBack" v-if="card">
    <media-preview @close="closeMedia" />
    <msg-modal
      :msg="msg"
      @close="msg = null"
      @cancelar="msg = null"
      @deletar="deleteConfirm"
    />
    <action-cmp
      v-if="action"
      @set="dispatchSetItem"
      @remove="dispatchRemoveItem"
      @close="action = null"
      :card="card"
      :action="action"
    ></action-cmp>
    <section class="card-details" @keydown.esc="goBack">
      <div class="card-details-main" @click.stop>
        <div class="header">
          <div class="header-content" ref="container">
            <span></span>
            <textarea
              name=""
              id=""
              cols="30"
              rows="1"
              placeholder="Titulo"
              v-model="card.title"
              :style="textAreaStyle"
              @focus="resizeTextarea"
              @keyup="resizeTextarea"
              @change="dispatchSetItem({ item: card.title, key: 'title' })"
              spellcheck="false"
            ></textarea>
            <p>Na lista {{ getListName }}</p>
          </div>
        </div>

        <div class="card-details-body">
          <main class="main-task flex">
            <div class="main-task-details">
              <description :card="card" @set="dispatchSetItem" />
            </div>
            <div class="main-task-btns flex">
              <h3>Ações</h3>
              <div class="action-btns flex">
                <button
                  v-for="title in actionsBtn"
                  :key="'btn-' + title"
                  @click="handleAction(title, $event)"
                  :class="toClass(title) + '-btn'"
                >
                  <span :class="toClass(title) + '-icon'"></span>
                  {{ title }}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import description from "../cards/items/item-description.vue";
import actionCmp from "./action-popup/actions-popup.vue";
import msgModal from "@/components/msg-modal.vue";

import {
  isHexColorLight,
  sentenceToKababCase,
} from "../../service/util.service";
import { cardService } from "../../service/card.service";

export default {
  name: "card",
  props: {
    board: Object,
  },
  data() {
    return {
      addToCardTxt: [
        "Membros",
        "Legendas",
        "Anexo",
      ],
      action: null,
      msg: null,
      card: null,
    };
  },
  methods: {
    closeMedia() {
      const query = Object.assign({}, this.$route.query);
      delete query.media;
      delete query.tag;
      this.$router.replace({ query });
    },
    goBack() {
      if (this.action) return;
      this.$emit("close");
    },
    async dispatchSetItem({ item, key }) {
      // console.log("dispatchSetItem():", item, key);
      const listId = this.$route.query.listId;
      const cardId = this.card.id;
      item = await this.$store.dispatch({
        type: "setItem",
        item,
        listId,
        cardId,
        key,
      });
      this.updateCard(listId, cardId);
      return item;
    },
    async dispatchRemoveItem({ item, key }) {
      // console.log("dispatchRemoveItem():", item, key);
      const listId = this.$route.query.listId;
      const cardId = this.card.id;
      item = await this.$store.dispatch({
        type: "removeItem",
        item,
        listId,
        cardId,
        key,
      });
      this.updateCard(listId, cardId);
      return item;
    },
    async updateCard(listId, cardId) {
      try {
        this.card = await this.$store.dispatch({
          type: "getCardById",
          listId,
          cardId,
        });
        return this.card;
      } catch (err) {
        console.log(err);
      }
    },
    deleteConfirm() {
      const listId = this.$route.query.listId;
      this.$emit("remove", { listId, card: this.card });
      this.$emit("close");
    },
    changeTextAreaSize() {
      this.$nextTick(() => {
        this.$refs.container.forEach((ta) => {
          ta.firstChild.dispatchEvent(new Event("keyup"));
        });
      });
    },
    resizeTextarea: function (e) {
      let area = e.target;
      area.style.height = area.scrollHeight - 4 + "px";
    },
    async handleAction(action, event) {
      const listId = this.$route.query.listId;
      const path = this.$route.path;
      switch (action) {
        case "Copiar":
          const copyCard = await this.$store.dispatch({
            type: "copyCard",
            listId,
            card: { ...this.card, title: this.card.title + " (Copy)" },
          });
          this.$router.push(`${path}?listId=${listId}&cardId=${copyCard.id}`);
          break;
        case "Deletar":
          this.msg = {
            title: "Deletar Cartão",
            value:
              "Tem certeza que quer deletar este cartão ?\nEssa ação não pode ser desfeita",
            background: true,
            controls: { deletar: "deletebtn", Cancelar: "cancel-btn" },
          };
          break;
      }
    },
    toClass(str) {
      return sentenceToKababCase(str);
    },
  },
  computed: {
    textAreaStyle() {
      const lineCount = this.card.title?.match(/.{1,62}/g)?.length || 1;
      return { height: lineCount * 28 + 6 + "px" };
    },
    getListName() {
      return this.board.lists.find(
        (list) => list.id === this.$route.query.listId
      )?.title;
    },
    darkStyle() {
      return !isHexColorLight(this.card.cover.color)
        ? { filter: "invert(1)", color: "black" }
        : {};
    },
    actionsBtn() {
      return this.card.archiveAt = ["Copiar", "Deletar"]
    },
  },
  watch: {
    "card.title.length": {
      handler() {
        this.changeTextAreaSize;
      },
      deep: true,
      immediate: true,
    },
    "$route.query.cardId": {
      async handler(cardId) {
        if (cardId) {
          const listId = this.board.lists.find((list) =>
            list.cards.find((card) => card.id === cardId)
          )?.id;
          this.card = await cardService.getCardById(this.board, listId, cardId);
        } else this.card = null;
      },
      immediate: true,
    },
  },
  components: {
    description,
    actionCmp,
    msgModal,
  },
};
</script>
