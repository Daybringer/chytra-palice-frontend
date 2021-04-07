<template>
  <div class="box overlay">
    <!-- Post  -->
    <div>
      <h1 class="title has-text-primary">{{ title }}</h1>
      <h2 class="subtitle mb-1">{{ author }}</h2>
      <h3 class="has-text-grey">{{ date }}</h3>
      <hr />
      <div class="content html-content" v-html="content"></div>
    </div>

    <!-- Link to post panel -->
    <button
      class="read-button button is-primary"
      tag="router-link"
      @click="linkToPost"
    >
      Číst dále
    </button>

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
      @remove="remove"
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
</template>

<script>
import EditDeleteModal from "./EditDeleteModal.vue";

export default {
  name: "PostCard",
  props: {
    id: Number,
    title: String,
    author: String,
    date: String,
    content: String,
  },
  data() {
    return {
      isComponentModalActive: false,
    };
  },
  components: { EditDeleteModal },
  methods: {
    linkToPost() {
      this.$router.push({ path: `/clanek/${this.id}` });
    },
    remove(id) {
      console.log("lol");
      this.$emit("remove", id);
    },
  },
  computed: {
    logged() {
      return this.$store.getters.isLoggedIn;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
  },
};
</script>

<style scoped>
.edit-button {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
}

.read-button {
  position: absolute;
  bottom: 0.5rem;
  right: 1rem;
}

.overlay {
  position: relative;
  max-height: 50vh !important;
  overflow: hidden;
}

.overlay::before {
  background-image: linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -moz-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -ms-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -o-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  background-image: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  content: "";
  height: 3.5rem;
  bottom: 0;
  position: absolute;
  width: 100%;
}
</style>
