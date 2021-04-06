<template>
  <div class="container my-6">
    <create-post-form></create-post-form>
  </div>
</template>

<script>
// Components
import CreatePostForm from "../components/CreatePostForm.vue";
export default {
  name: "NewPostPanel",
  components: { CreatePostForm },
};
</script>

<style scoped></style>
