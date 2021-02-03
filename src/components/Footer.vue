<template>
  <footer class="custom-footer has-background-white-bis">
    <div class="has-text-centered">
      <p>
        Created by
        <a href="https://daybringer.github.io" target="_">Michal Vaňata</a>
        <br />
        Licensed under
        <a href="https://opensource.org/licenses/MIT">MIT</a>
        <!-- TODO remove link to dev -->
        <router-link to="/dev" class="px-2">dev</router-link>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.custom-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6rem;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
