<template>
  <div class="box">
    <h1 class="title">{{ title }}</h1>
    <h2 class="subtitle">{{ author }}</h2>
    <div class="block content" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    title: String,
    author: String,
    date: String,
    content: String,
  },
};
</script>

<style scoped></style>
