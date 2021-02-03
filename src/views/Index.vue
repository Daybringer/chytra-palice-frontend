<template>
  <section class="section">
    <div class="container">
      <post-card
        v-for="post in posts"
        :key="post.title"
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
  data() {
    return {
      posts: [],
    };
  },
  mounted() {
    const posts = JSON.parse(window.localStorage.getItem("posts"));
    this.posts = posts;
  },
  components: { PostCard },
  methods: {},
};
</script>

<style scoped></style>
