<template>
  <div class="container">
    <div class="box card min-h-80">
      <h1 class="title has-text-primary">{{ post.title }}</h1>
      <h2 class="subtitle">{{ post.author }}</h2>
      <hr />
      <div class="content" v-html="post.content"></div>
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
      this.post = this.$store.getters.getPostByID(this.id);
    },
    setTitle() {
      document.title = `Chytrá palice - ${this.post.title}`;
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
