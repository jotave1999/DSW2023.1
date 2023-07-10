  <template>
  <section class="add-new-list">
    <div
      class="center"
      v-if="!isListFormOpen"
      @click="isListFormOpen = !isListFormOpen"
    >
      <span class="icon"></span>
      Adicionar uma Lista
    </div>
    <div
      v-else
      class="list-form"
      :class="{ 'add-list-active': isListFormOpen }"
    >
      <input type="text" class="input-form" />
      <div class="add-card-control">
        <button>Adicionar Cartão</button>
        <span class="icon" @click="isListFormOpen = !isListFormOpen"></span>
      </div>
    </div>
  </section>
</template>
  
<script>
export default {
  props: {},
  data() {
    return {
      isListFormOpen: false,
    };
  },
  methods: {},
};
</script>
