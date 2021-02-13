<template>
  <div class="container my-6">
    <post-form :type="'create'"> </post-form>
  </div>
</template>

<script>
// Components
import PostForm from "../components/PostForm.vue";
export default {
  name: "NewPostPanel",
  components: { PostForm },
};
</script>

<style scoped></style>
