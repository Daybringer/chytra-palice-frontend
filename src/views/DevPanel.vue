<template>
  <div class="container my-6">
    <div class="buttons is-justify-content-center">
      <button class="button is-danger" @click="deletePosts">
        Delete all posts
      </button>
      <button class="button is-primary" @click="addExamplePost">
        Add an example post
      </button>
    </div>
    <div class="buttons is-justify-content-center">
      <button class="button is-info" @click="changeUserAdmin">
        Change to admin (Pešoutová)
      </button>
      <button class="button is-info" @click="changeUserMichal">
        Change to student (Michal Vaňata)
      </button>
      <button class="button is-info" @click="changeUserJaroslava">
        Change to student (Jaroslava Volhejnová)
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DevPanel",
  methods: {
    changeUserAdmin() {
      this.$store.dispatch("changeUser", {
        admin: true,
        name: "Blanka Činátlová",
        email: "cinatlova@gjk.cz",
      });
    },
    changeUserMichal() {
      this.$store.dispatch("changeUser", {
        admin: false,
        name: "Michal Vaňata",
        email: "xvanmi01@gjk.cz",
      });
    },
    changeUserJaroslava() {
      this.$store.dispatch("changeUser", {
        admin: false,
        name: "Jaroslava Volhejnová",
        email: "xvolja01@gjk.cz",
      });
    },
    deletePosts() {
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

<style scoped></style>
