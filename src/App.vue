<template>
  <div id="app">
    <div class="content-wrap">
      <Navbar></Navbar>
      <router-view />
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
.content-wrap {
  min-height: 100vh;
  padding-bottom: 6rem;
}
.custom-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  position: absolute;
  bottom: 0;
  width: 100%;
}
#app {
  min-height: 100vh;
  position: relative;
}
html,
body {
  margin: 0;
  padding: 0;
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
</style>
