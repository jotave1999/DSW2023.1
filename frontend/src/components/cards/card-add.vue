<template>
  <section class="add-new-task flex">
    <span
      class="add-new-task-inner align-center full"
      v-if="!isFormCardOpen"
      @click="isFormCardOpen = !isFormCardOpen"
    >
      <span>Adicione um Cartão</span>
      <span class="add-new-task-inner-title"></span>
    </span>
    <div v-else class="new-card-form">
      <textarea
        name="add-card"
        cols="30"
        rows="10"
        placeholder="Insira o titulo do cartão..."
        v-model="cardToEdit.title"
        spellcheck="false"
      ></textarea>
      <div class="add-card-control">
        <button @click="addCard">Adicionar Cartão</button>
        <span
          class="add-card-close-icon"
          @click="isFormCardOpen = !isFormCardOpen"
        ></span>
      </div>
    </div>
  </section>
</template>

<script>
import { cardService } from "../../service/card.service.js";
import { userService } from "../../service/user.service";
export default {
  props: {
    columnId: {
      type: String,
    },
  },
  data() {
    return {
      isFormCardOpen: false,
      cardToEdit: cardService.createCard(),
    };
  },
  created() {},
  methods: {
    addCard() {
      this.isFormCardOpen = !this.isFormCardOpen;
      this.$emit("add", { card: this.cardToEdit, listId: this.columnId });
      this.cardToEdit = null;
    },
  },
  watch: {
    isFormCardOpen: {
      handler(mode) {
        this.cardToEdit = mode ? cardService.createCard() : null;
      },
    },
  },
};
</script>
