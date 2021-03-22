<template>
  <div class="box">
    <div class="has-text-left has-text-primary is-size-6">
      <i>{{ author }}</i>
    </div>

    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "CommentBlade",
  props: ["author", "message"],
};
</script>

<style scoped></style>
