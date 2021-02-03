<template>
  <div>
    <button @click="flushLocal">Clear Local Storage</button>
    <button @click="addExamplePost">Add example post</button>
  </div>
</template>

<script>
export default {
  name: "DevPanel",
  methods: {
    flushLocal() {
      window.localStorage.clear();
    },
    addExamplePost() {
      let posts = JSON.parse(window.localStorage.getItem("posts"));
      const examplePost = {
        author: "Michaela Bečková",
        date: "31.1.2020",
        title: "Palice 2020",
        content: "<h1>What is this?</h1><strong>some text</strong>",
      };
      if (!posts) posts = [];
      posts.push(examplePost);
      window.localStorage.setItem("posts", JSON.stringify(posts));
    },
  },
};
</script>

<style></style>
