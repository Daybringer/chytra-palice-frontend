<template>
  <div class="container">
    <div class="box card">
      <h1 class="title has-text-primary">{{ post.title }}</h1>
      <h2 class="subtitle">{{ post.author }}</h2>
      <hr />
      <div class="content html-content" v-html="post.content"></div>

      <!-- Button to triger edit or close modal -->
      <button
        @click="isComponentModalActive = true"
        v-if="logged && admin"
        class="button is-small is-rounded edit-button"
      >
        <span class="icon is-small ">
          <i class="fas fa-cog"></i>
        </span>
      </button>

      <!-- Edit or close modal -->
      <b-modal
        v-model="isComponentModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-label="Edit or Close"
        aria-modal
      >
        <template #default="props">
          <edit-delete-modal :id="id" @close="props.close"></edit-delete-modal>
        </template>
      </b-modal>
    </div>
  </div>
</template>

<script>
import EditDeleteModal from "../components/EditDeleteModal.vue";
export default {
  name: "PostPanel",
  components: { EditDeleteModal },
  data() {
    return {
      error: false,
      post: {},
      isComponentModalActive: false,
    };
  },
  methods: {
    loadContent() {
      this.post = this.$store.getters.getPostByID(this.id);
      if (!this.post) {
        this.$router.push({ path: "/", query: { err: "notFound" } });
        this.error = true;
      }
    },
    setTitle() {
      if (!this.error) document.title = `Chytrá palice - ${this.post.title}`;
    },
    linkToPost() {
      this.$router.push({ path: `/clanek/${this.id}` });
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

<style scoped>
.edit-button {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
}
</style>
