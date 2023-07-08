<template>
  <div>
    <msg-modal :msg="msg" @close="msg=null" />
    <div class="login-form">
      <div class="title">
        <span></span>
        <h1>Trello DSW 2023.1</h1>
      </div>
      <div class="board">
        <p class="title">{{ title }}</p>
        <form @submit.prevent="login">
          <input
            class="username"
            v-model="user.username"
            placeholder="Insira o Usuário"
          />
          <input
            v-if="!isLogin"
            v-model="user.fullname"
            class="fullname"
            placeholder="Insira o Nome Completo"
          />
          <div>
            <input
              :type="passwordType"
              v-model="user.password"
              class="password"
              placeholder="Insira a Senha"
              autocomplete
            />
          </div>
          <button type="submit">{{ btnTitle }}</button>
        </form>
        <hr />
        <p class="sign-in" @click="isLogin = !isLogin">Can't log in? <ul><li>{{ isSignup }}</li></ul></p>
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
        username: "",
        fullname: "",
        password: "",
        imgUrl: "",
      },
      msg: null,
      isLogin: true,
      isPasswordShown: false,
    };
  },
  computed: {
    isSignup() {
      return this.isLogin ? "Cadastre sua conta" : "Voltar";
    },
    title() {
      return this.isLogin ? "Entre no Trello DSW 2023.1" : "Cadastro";
    },
    btnTitle() {
      return this.isLogin ? "Entrar" : "Cadastrar";
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    passwordType() {
      return this.isPasswordShown ? "text" : "password";
    },
  },
  created() {},
  methods: {
    async login() {
      var user = null;
      try {
        if (this.isLogin) {
          if (!this.user.username) {
            this.loginMsg("Por favor, insira o Usuário e Senha para se autenticar");
            return;
          }
          user = await this.$store.dispatch({ type: "login", user: this.user });
          if (user) this.$router.push("/board");
          else this.loginMsg("Falha no Login", "Falha no Login");
        } else {
          user = await this.$store.dispatch({
            type: "signup",
            user: this.user,
          });
          if (user) this.$router.push("/board");
          this.loginMsg("Preencha os campos", "Cadastro falho");
        }
        this.$store.dispatch({ type: "getUsers" });
      } catch (err) {
        this.loginMsg("Falha no Login", "Falha no Login");
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
};
</script>
