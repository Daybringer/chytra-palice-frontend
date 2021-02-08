<template>
  <div class="container">
    <div class="box">
      <h1 class="title has-text-primary">{{ contest.name }}</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContestPanel",
  data() {
    return { contest: {}, error: false };
  },
  methods: {
    loadContent() {
      this.contest = this.$store.getters.getContestByID(this.id);
      if (!this.contest) {
        this.$router.push({ path: "/", query: { err: "conNotFound" } });
        this.error = true;
      }
    },
    setTitle() {
      if (!this.error) document.title = `Chytrá palice - ${this.contest.name}`;
    },
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    logged() {
      return this.$store.getters.isLoggedIn;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
  },
  mounted() {
    this.loadContent();
    this.setTitle();
  },
};
</script>

<style scoped></style>
