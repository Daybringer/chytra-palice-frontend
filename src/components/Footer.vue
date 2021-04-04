<template>
  <footer class="custom-footer has-background-white-bis">
    <div class="has-text-centered">
      <p>
        Pro GJK
        <a href="https://vanata.dev" target="_">Michal Vaňata</a>
        <br />
        Licencováno pod
        <a href="https://opensource.org/licenses/MIT">MIT</a>
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
