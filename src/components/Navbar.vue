<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item
        class="logoSVGcontainer"
        tag="router-link"
        :to="{ path: '/' }"
      >
        <img
          src="../assets/palice_logo_verbal.svg"
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
        Nová soutež
      </b-navbar-item>
      <!-- Login/Logout button  -->
      <b-navbar-item tag="div">
        <div class="buttons">
          <button v-if="!logged" @click="logIn" class="button is-primary">
            <strong>Přihlásit se</strong>
          </button>
          <button v-if="logged" @click="logOut" class="button is-primary">
            <strong>Odhlasit se</strong>
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
    logIn() {
      this.$store.dispatch("logIn");
    },
    logOut() {
      this.$store.dispatch("logOut");
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
