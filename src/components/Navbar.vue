<template>
  <b-navbar class="is-fixed-top">
    <template #brand>
      <b-navbar-item class="logoSVGcontainer" @click="linkToRoot">
        <img
          src="../assets/logo_spaced_verbal.svg"
          class="logoSVG"
          alt="Chytrá palice - literární soutěž GJK"
        />
      </b-navbar-item>
    </template>
    <!-- Left side of navbar -->
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/prace' }">
        Přehled prací
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/souteze' }">
        Soutěže
      </b-navbar-item>
    </template>

    <!-- Right side of navbar -->
    <template #end>
      <b-navbar-item
        v-if="logged && !admin"
        tag="router-link"
        :to="{ path: '/moje-prace' }"
      >
        Moje práce
      </b-navbar-item>

      <b-navbar-item
        v-if="logged && admin"
        tag="router-link"
        :to="{ path: '/schvaleni' }"
      >
        Práce ke schválení
      </b-navbar-item>
      <b-navbar-item
        v-if="logged && admin"
        tag="router-link"
        :to="{ path: '/novy-clanek' }"
      >
        Nový článek
      </b-navbar-item>
      <b-navbar-item
        v-if="logged && admin"
        tag="router-link"
        :to="{ path: '/nova-soutez' }"
      >
        Nová soutěž
      </b-navbar-item>
      <!-- Login/Logout button  -->
      <b-navbar-item tag="div">
        <div class="buttons">
          <button v-if="!logged" @click="login" class="button is-primary">
            <strong>Přihlásit se</strong>
          </button>
          <button v-if="logged" @click="logout" class="button is-primary">
            <strong>Odhlásit se</strong>
          </button>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    async login() {
      await this.$gAuth
        .signIn()
        .then((googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.$store.dispatch("login", id_token);
          this.$buefy.toast.open({
            duration: 5000,
            message: `Byl(a) jste úspěšně přihlášen(a)`,
            position: "is-top",
            type: "is-primary",
          });
        })
        .catch((err) => {
          console.log(err);
          this.$buefy.toast.open({
            duration: 5000,
            message: `Přihlášení bylo neúspešné`,
            position: "is-top",
            type: "is-warning",
          });
        });
    },
    logout() {
      this.$store.dispatch("logout");
      if (this.$route.path !== "/") this.$router.push("/");
      this.$buefy.toast.open({
        duration: 5000,
        message: `Byl(a) jste úspěšně odhlášen(a)`,
        position: "is-top",
        type: "is-info",
      });
    },
    linkToRoot() {
      if (this.$route.path === "/") {
        window.scrollTo(0, 0);
      } else {
        this.$router.push("/");
      }
    },
  },
  computed: {
    logged() {
      return this.$store.getters.isLoggedIn;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>

<style scoped>
.logoSVG {
  height: 4rem;
  max-height: 1000px !important;
}
</style>
