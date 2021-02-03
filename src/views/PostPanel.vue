<template>
  <div class="container">
    <div class="box card min-h-80">
      <h1 class="title has-text-primary">{{ post.title }}</h1>
      <h2 class="subtitle">{{ post.author }}</h2>
      <hr />
      <div v-if="!error" class="content" v-html="post.content"></div>
      <h1 v-if="error" class="has-text-danger">Článek neexistuje</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "PostPanel",
  data() {
    return {
      error: false,
      post: {},
    };
  },
  methods: {
    loadContent() {
      const posts = JSON.parse(window.localStorage.getItem("posts"));
      if (!posts) this.error = true;
      for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == this.id) {
          this.post = posts[i];
          return;
        }
      }
      this.error = true;
    },
    setTitle() {
      document.title =
        "Chytrá palice - " +
        (!this.error ? this.post.title : "Článek neexistuje");
    },
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  mounted() {
    this.loadContent();
    this.setTitle();
  },
};
</script>

<style scoped></style>
