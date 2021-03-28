<template>
  <div id="app">
    <div class="content-wrap has-navbar-fixed-top">
      <Navbar></Navbar>
      <router-view class="mt-6" />
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
// Components
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
export default {
  name: "App",
  components: { Navbar, Footer },
  mounted() {},
  beforeMount() {
    if (this.$store.getters.isLoggedIn)
      this.$store.dispatch("setBearer", this.$store.getters.getToken);
  },
};
</script>
<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
}

// Footer fixed bottom solution
#app {
  position: relative;
}
.activeContestCard:hover {
  transform: scale(105%);
}
.activeContestCard:focus-within {
  transform: scale(105%);
}
.content-wrap {
  min-height: calc(100vh - 6rem);
  padding-bottom: 6rem;
}

.html-content p {
  margin-bottom: 0.5rem !important;
}

.html-content p br {
  display: none;
}

.p-6-desktop {
  padding: 2rem !important;
}

.min-h-80vh {
  min-height: 80vh;
}

@media only screen and (min-width: 1024px) {
  .p-6-desktop {
    padding: 3rem !important;
  }
}

// Import Bulma's core
@import "~bulma/sass/utilities/_all";
$navbar-height: 3.5rem;

$primary: #80b918;
$primary-light: findLightColor($primary);
$primary-dark: findDarkColor($primary);
$primary-invert: findColorInvert($primary);

$custom-colors: null !default;
$custom-shades: null !default;

// Contest border
.has-border-gold {
  border: 3px solid darken($yellow, 15%);
}
.has-border-silver {
  border: 3px solid $grey-light;
}
.has-border-bronze {
  border: 3px solid $orange;
}

// Mergemaps

$colors: mergeColorMaps(
  (
    "gold": (
      $yellow,
      $white,
    ),
    "silver": (
      $grey-light,
      $white,
    ),
    "bronze": (
      $orange,
      $white,
    ),
    "white": (
      $white,
      $black,
    ),
    "black": (
      $black,
      $white,
    ),
    "light": (
      $light,
      $light-invert,
    ),
    "dark": (
      $dark,
      $dark-invert,
    ),
    "primary": (
      $primary,
      $primary-invert,
      $primary-light,
      $primary-dark,
    ),
    "link": (
      $link,
      $link-invert,
      $link-light,
      $link-dark,
    ),
    "info": (
      $info,
      $info-invert,
      $info-light,
      $info-dark,
    ),
    "success": (
      $success,
      $success-invert,
      $success-light,
      $success-dark,
    ),
    "warning": (
      $warning,
      $warning-invert,
      $warning-light,
      $warning-dark,
    ),
    "danger": (
      $danger,
      $danger-invert,
      $danger-light,
      $danger-dark,
    ),
  ),
  $custom-colors
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "~@creativebulma/bulma-divider";
</style>
