<template>
  <div class="container my-6">
    <post-form :id="id" :type="'edit'"></post-form>
  </div>
</template>

<script>
// Components
import PostForm from "../components/PostForm.vue";
export default {
  name: "EditPostPanel",
  components: { PostForm },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
};
</script>

<style scoped></style>
