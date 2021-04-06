<template>
  <section class="section container pt-0">
    <section class="section pt-0">
      <div class="tile is-ancestor">
        <div class="tile is-vertical is-8">
          <div class="tile">
            <div class="tile is-parent is-vertical">
              <article class="tile is-child notification is-primary">
                <p class="title">Vertical...</p>
                <p class="subtitle">Top tile</p>
              </article>
              <article
                class="tile is-child notification is-warning has-text-centered"
              >
                <p class="title">Podcast týdne</p>
                <iframe
                  src="https://open.spotify.com/embed-podcast/episode/0g3NJEE1EWAToSTBRptPb9"
                  width="100%"
                  height="232"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  :class="spotifyLoading ? 'spotifyLoading' : ''"
                  @load="spotifyLoaded()"
                ></iframe>
              </article>
            </div>
            <div class="tile is-parent">
              <article class="tile is-child notification is-info">
                <p class="title">Middle tile</p>
                <p class="subtitle">With an image</p>
                <figure class="image is-4by3">
                  <img src="https://bulma.io/images/placeholders/640x480.png" />
                </figure>
              </article>
            </div>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child notification is-danger">
              <p class="title">Wide tile</p>
              <p class="subtitle">Aligned with the right tile</p>
              <div class="content">
                <!-- Content -->
              </div>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-success">
            <div class="content">
              <p class="title">Tall tile</p>
              <p class="subtitle">With even more content</p>
              <div class="content">
                <!-- Content -->
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section class="section">
      <post-card
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :author="post.author"
        :date="new Date(+post.dateAdded).toLocaleDateString('cs')"
        :title="post.title"
        :content="post.content"
      ></post-card>
    </section>
  </section>
</template>

<script>
import PostCard from "../components/PostCard.vue";
export default {
  name: "Index",
  data() {
    return {
      spotifyLoading: true,
      posts: [],
    };
  },
  components: { PostCard },
  methods: {
    async fetchPosts() {
      this.posts = await this.$store.dispatch("getAllPosts");
    },
    formatDate(dateString) {
      return this.$formateDate(dateString);
    },
    spotifyLoaded() {
      this.spotifyLoading = false;
    },
  },
  // FIXME Should just fetch top ten and implement infinite scroll
  created() {
    this.fetchPosts();
  },
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

<style scoped>
.spotifyLoading {
  background-color: darkslategrey;
  border-radius: 0.5rem;
}
</style>
