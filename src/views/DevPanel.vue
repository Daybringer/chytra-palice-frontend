<template>
  <div class="container mt-4">
    <div class="buttons">
      <button class="button is-danger" @click="flushLocal">
        Clear Local Storage
      </button>
      <button class="button is-primary" @click="addExamplePost">
        Add example post
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DevPanel",
  methods: {
    flushLocal() {
      this.$store.dispatch("deleteAllPosts");
    },
    addExamplePost() {
      this.$store.dispatch("newPost", {
        title: "Palice 2020",
        content: "<h3>What is this?</h3><br/>some text",
      });
    },
  },
};
</script>

<style></style>
