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
};
</script>
<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}

// Footer fixed bottom solution
#app {
  position: relative;
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

// Set your colors
$primary: #80b918;
$primary-light: findLightColor($primary);
$primary-dark: findDarkColor($primary);
$primary-invert: findColorInvert($primary);
$twitter: #4099ff;
$twitter-invert: findColorInvert($twitter);

// Lists and maps
$custom-colors: null !default;
$custom-shades: null !default;

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: mergeColorMaps(
  (
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
