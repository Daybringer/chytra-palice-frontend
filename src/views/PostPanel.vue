<template>
  <div v-if="post" class="container">
    <div class="box card">
      <h1 class="title has-text-primary">{{ post.title }}</h1>
      <h2 class="subtitle mb-1">{{ post.author }}</h2>
      <h3 class="has-text-grey">
        {{ new Date(+post.dateAdded).toLocaleDateString("cs") }}
      </h3>
      <hr />
      <div class="content html-content" v-html="post.content"></div>

      <!-- Image carousel -->
      <b-carousel
        v-if="post.pictures.length !== 0"
        :autoplay="false"
        with-carousel-list
        :indicator="false"
        :overlay="gallery"
        @click="switchGallery(true)"
      >
        <b-carousel-item v-for="filename in post.pictures" :key="filename">
          <figure class="image">
            <b-image responsive ratio="5by3" :src="genUrl(filename)" />
          </figure>
        </b-carousel-item>
        <span
          v-if="gallery"
          @click="switchGallery(false)"
          class="modal-close is-large"
        />
        <template #list="props">
          <b-carousel-list
            v-model="props.active"
            :data="post.pictures"
            v-bind="al"
            @switch="props.switch($event, false)"
            as-indicator
          />
        </template>
        <!-- <template #overlay>
          <div class="has-text-centered has-text-white">
            Hello i'am overlay!
          </div>
        </template> -->
      </b-carousel>
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
          <edit-delete-modal
            :id="post.id"
            @close="props.close"
          ></edit-delete-modal>
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
      post: null,
      isComponentModalActive: false,
      // Gallery
      gallery: false,
      al: {
        hasGrayscale: true,
        itemsToShow: 2,
        breakpoints: {
          768: {
            hasGrayscale: false,
            itemsToShow: 4,
          },
          960: {
            hasGrayscale: true,
            itemsToShow: 6,
          },
        },
      },
    };
  },
  methods: {
    async fetchPost() {
      this.post = await this.$store.dispatch("getPostByID", this.id);

      if (!this.post) {
        this.$router.push({ path: "/", query: { err: "notFound" } });
      } else {
        document.title = `Chytrá palice - ${this.post.title}`;
      }
    },
    switchGallery(value) {
      this.gallery = value;
      if (value) {
        return document.documentElement.classList.add("is-clipped");
      } else {
        return document.documentElement.classList.remove("is-clipped");
      }
    },
    genUrl(filename) {
      const base =
        process.env.NODE_ENV === "production"
          ? `http://palice.gjk.cz:3000`
          : `http://localhost:3000`;
      console.log(`${base}/${filename}`);
      return `${base}/posts/images/${filename}`;
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
  created() {
    this.fetchPost();
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
