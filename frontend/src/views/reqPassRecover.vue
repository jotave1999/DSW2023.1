<template>
  <div>
    <msg-modal :msg="msg" @close="msg=null" />
    <div class="login-form">
      <div class="title">
        <span></span>
        <h1>Trello DSW 2023.1</h1>
      </div>
      <div class="board">
        <p class="title">Recupere sua Senha</p>
        <form @submit.prevent="recoverPass">
          <input
            v-model="recover.email"
            class="fullname"
            placeholder="Insira o e-mail da conta que deseja recuperar"
          />
          <button type="submit">Recuperar</button>
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
      recover: {
        email: "",
      },
      cont:0,
      msg: null,
    };
  },
  computed: {
  },
  created() {},
  methods: {
    async recoverPass() {
      var recover = null;
      try {
        if (!this.recover.email) {
            this.recoverMsg("Por favor, insira o email da conta que deseja recuperar a senha");
            return;
        }
        recover = await this.$store.dispatch({ type: "reqPassRecover", email: this.recover });
        this.recoverMsg("Cheque sua caixa de email para recuperar sua senha","Email enviado!");
      } catch (err) {
        this.recoverMsg("Falha", "Falha ao enviar o email de recuperação de senha");
      }
    },
    recoverMsg(value, title = "Recuperar a Senha", event) {
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