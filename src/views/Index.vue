<template>
  <section class="section">
    <div class="container">
      <post-card
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :author="post.author"
        :date="post.date"
        :title="post.title"
        :content="post.content"
      ></post-card>
    </div>
  </section>
</template>

<script>
import PostCard from "../components/PostCard.vue";
export default {
  name: "Index",
  computed: {
    posts() {
      return this.$store.getters.getPosts;
    },
  },
  components: { PostCard },
};
</script>

<style scoped></style>
