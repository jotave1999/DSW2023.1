<template>
  <div>
    <msg-modal :msg="msg" @close="msg=null" />
    <div class="login-form">
      <div class="title">
        <span></span>
        <h1>Trello DSW 2023.1</h1>
      </div>
      <div class="board">
        <p class="title">Insira sua nova senha</p>
        <form @submit.prevent="changePass">
          <input
              :type="passwordType"
              v-model="user.password"
              class="password"
              placeholder="Insira a Senha"
              autocomplete
            />
          <button type="submit">Trocar Senha</button>
        </form>
        <hr />
      </div>
    </div>
  </div>
</template>

<script>
import msgModal from "@/components/msg-modal.vue";

export default {
  components: {
    msgModal,
  },
  data() {
    return {
      user: {
        recoverString:"",
        password: "",
      },
      msg: null,
      isPasswordShown: false,
    };
  },
  computed: {
    passwordType() {
      return this.isPasswordShown ? "text" : "password";
    },
  },
  created() {},
  methods: {
    async changePass() {
      var user = null;
      try {
          if (!this.user.password) {
            this.loginMsg("Por favor, insira a Senha que deseja mudar");
            return;
          }
          user = await this.$store.dispatch({ type: "passRecover", user: this.user });
          this.$router.push("/");
      } catch (err) {
        this.loginMsg("Falha ao trocar a senha", "Erro");
      }
    },
    loginMsg(value, title = "Error", event) {
      this.msg = {
        value,
        title,
        event,
        background:false,
        controls: { ok: "" },
      };
    },
  },
  watch: {
    "$route.params.recoverString": {
      async handler(recoverString) {
        this.user.recoverString = recoverString
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
