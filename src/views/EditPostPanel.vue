<template>
  <div class="container my-6">
    <!-- <post-form :id="id" :type="'edit'"></post-form> -->
  </div>
</template>

<script>
// Components
export default {
  name: "EditPostPanel",
  components: {},
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>

<style scoped></style>
