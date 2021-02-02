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
    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/prace' }">
        Prehled prací
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/souteze' }">
        Soutěže
      </b-navbar-item>

      <!-- <b-navbar-dropdown label="Info">
        <b-navbar-item href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown> -->
    </template>

    <template #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary">
            <strong>Přihlásit se</strong>
          </a>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
<script>
export default {
  name: "Navbar",
};
</script>
<style scoped>
.logoSVG {
  height: 4rem;
  max-height: 1000px !important;
}
</style>
