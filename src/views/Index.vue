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
  mounted() {
    if (this.$route.query.err == "admin") {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Nedostatečná oprávnění`,
        position: "is-top",
        type: "is-danger",
      });
    } else if (this.$route.query.err == "login") {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Pro přístup musíte být přihlášen(a)`,
        position: "is-top",
        type: "is-danger",
      });
    } else if (this.$route.query.err == "notFound") {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Článek neexistuje`,
        position: "is-top",
        type: "is-danger",
      });
    } else if (this.$route.query.err == "conNotFound") {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Soutěž neexistuje`,
        position: "is-top",
        type: "is-danger",
      });
    }
  },
};
</script>

<style scoped></style>
