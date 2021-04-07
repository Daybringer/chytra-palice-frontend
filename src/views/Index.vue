<template>
  <section class="section container pt-0">
    <section class="section p-0">
      <div class="tile is-ancestor">
        <div class="tile is-vertical is-8">
          <div class="tile">
            <!-- O palici -->
            <div class="tile is-parent is-vertical">
              <article class="tile is-child notification is-primary">
                <p class="title">O Chytré palici</p>
                <hr />
                <p class="subtitle">
                  <i
                    >Co bývalo skryto, bude nyní odhaleno. <br />Co probíhalo za
                    zavřenými dveřmi kabinetů a v kuloárech školy, spatří světlo
                    veřejného zájmu.<br />
                    Co se předávalo pokoutně z ruky do ruky na ušmudlaném
                    papíře, bude poskytnuto demokraticky veškerému lidu.</i
                  >
                </p>
                <p class="subtitle">
                  Představuje se Vám nejslavnější literární soutěž Gymnázia Jana
                  Keplera, <b>Chytrá palice</b>, vyhlašovaná pravidelně od roku
                  2003.
                </p>

                <b-button
                  tag="router-link"
                  to="/o-palici"
                  class="is-primary is-light"
                  style="position:absolute;bottom:0;right:0;margin:0.5rem;"
                  >Číst dále</b-button
                >
              </article>
              <article class="tile is-child notification is-warning" outlined>
                <p class="subtitle">Nejnovější práce</p>
                <p v-if="newestWork" class="title">{{ newestWork.name }}</p>
                <p v-if="newestWork" class="subtitle">
                  {{ newestWork.authorName }}
                </p>
                <b-button
                  v-if="newestWork"
                  tag="router-link"
                  :to="`/prace/${newestWork.id}`"
                  class="is-dark"
                  outlined
                  rounded
                  icon-right="chevron-right"
                  style="position:absolute;bottom:0.5rem;right:0.5rem;"
                ></b-button>
              </article>
            </div>
            <div class="tile is-parent is-vertical">
              <article class="tile is-child notification is-info">
                <p class="subtitle">
                  {{ new Date().toLocaleDateString("cs") }}
                </p>
                <p class="subtitle">
                  Dnes má svátek:
                </p>
                <p v-if="jmeno" class="title">{{ jmeno }}</p>
              </article>
              <article
                class="tile is-child notification is-dark is-light has-text-centered"
              >
                <p class="title">Podcast týdne</p>
                <iframe
                  v-if="spotifyEpisode"
                  :src="
                    `https://open.spotify.com/embed-podcast/episode/${spotifyEpisode}`
                  "
                  width="100%"
                  height="232"
                  frameborder="0"
                  allowtransparency="true"
                  allow="encrypted-media"
                  :class="spotifyLoading ? 'spotifyLoading' : ''"
                  @load="spotifyLoaded()"
                ></iframe>
                <b-button
                  v-if="isAdmin"
                  @click="isSpotifyModalActive = true"
                  class="is-info "
                  rounded
                  icon-right="pencil"
                  style="position:absolute;top:0.5rem;right:0.5rem;"
                ></b-button>
              </article>
              <!-- Populární -->
              <article class="tile is-child notification is-warning">
                <p class="subtitle">Nejčtenější práce</p>
                <p v-if="popularWork" class="title">{{ popularWork.name }}</p>
                <b-button
                  v-if="popularWork"
                  tag="router-link"
                  outlined
                  :to="`/prace/${popularWork.id}`"
                  class="is-dark "
                  rounded
                  icon-right="chevron-right"
                  style="position:absolute;bottom:0.5rem;right:0.5rem;"
                ></b-button>
              </article>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child notification is-success">
            <div class="content">
              <p class="title">Aktualita</p>
              <hr />
              <p class="subtitle">{{ aktualitaContent }}</p>
              <b-button
                v-show="isAdmin"
                class="is-success is-light"
                @click="isAktualitaModalActive = true"
                rounded
                icon-right="pencil"
                style="position:absolute;top:0.5rem;right:0.5rem;"
              ></b-button>
            </div>
          </article>
        </div>
      </div>
    </section>
    <section class="section pr-0 pl-0">
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
    <!-- Spotify modal -->
    <b-modal
      v-model="isSpotifyModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Write spotify podcast link"
      aria-modal
    >
      <template #default="props">
        <div @close="props.close" class="container">
          <div class="card p-5 is-justify-content-center">
            <b-field label="Link na Spotify podcast">
              <b-input v-model="modalSpotifyPodcast"></b-input>
            </b-field>
            <div class="buttons is-justify-content-center">
              <b-button class="button is-primary" @click="editSpotify">
                Náhrát podcast
              </b-button>
            </div>
          </div>
        </div>
      </template>
    </b-modal>
    <!-- Aktualita modal -->
    <b-modal
      v-model="isAktualitaModalActive"
      has-modal-card
      trap-focus
      :destroy-on-hide="true"
      aria-role="dialog"
      aria-label="Write aktualita content"
      aria-modal
    >
      <template #default="props">
        <div @close="props.close" class="container">
          <div class="card p-5 is-justify-content-center">
            <b-field label="Aktualita">
              <b-input
                type="textarea"
                maxlength="200"
                v-model="modalAktualitaPodcast"
              ></b-input>
            </b-field>
            <div class="buttons is-justify-content-center">
              <b-button class="button is-primary" @click="editAktualita">
                Náhrát aktualitu
              </b-button>
            </div>
          </div>
        </div>
      </template>
    </b-modal>
  </section>
</template>

<script>
import axios from "axios";
import PostCard from "../components/PostCard.vue";
export default {
  name: "Index",
  data() {
    return {
      spotifyLoading: true,
      posts: [],
      jmeno: null,
      newestWork: null,
      popularWork: null,
      spotifyEpisode: null,
      modalSpotifyPodcast: "",
      isSpotifyModalActive: false,
      aktualitaContent: "Je zde nějak prázdno",
      modalAktualitaPodcast: "",
      isAktualitaModalActive: false,
    };
  },
  components: { PostCard },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    async fetchPosts() {
      this.posts = await this.$store.dispatch("getAllPosts");
    },
    async fetchNewestWork() {
      this.newestWork = await this.$store.dispatch("fetchNewestWork");
    },
    async fetchPopularWork() {
      this.popularWork = await this.$store.dispatch("fetchPopularWork");
    },
    async fetchSpotify() {
      const episode = await this.$store.dispatch("fetchSpotify");
      if (episode) this.spotifyEpisode = episode;
      else this.spotifyEpisode = "5nwwxvfgQScY05pATnS17q";
    },
    async editSpotify() {
      this.isSpotifyModalActive = false;
      if (this.modalSpotifyPodcast) {
        const episodeLink = this.modalSpotifyPodcast
          .split("?")[0]
          .split("/")[4];
        this.modalSpotifyPodcast = "";
        this.spotifyEpisode = episodeLink;
        this.$store.dispatch("editSpotify", episodeLink);
      }
    },
    async fetchAktualita() {
      const aktualita = await this.$store.dispatch("fetchAktualita");
      if (aktualita) this.aktualitaContent = aktualita;
    },
    async editAktualita() {
      this.isAktualitaModalActive = false;
      if (this.modalAktualitaPodcast) {
        this.aktualitaContent = this.modalAktualitaPodcast;

        this.$store.dispatch("editAktualita", this.modalAktualitaPodcast);
        this.modalAktualitaPodcast = "";
      }
    },
    spotifyLoaded() {
      this.spotifyLoading = false;
    },
    async getSvatekName() {
      const today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;

      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      const mmdd = dd + "" + mm;
      axios
        .get(`https://svatky.adresa.info/json?lang=cs&date=${mmdd}`)
        .then((res) => {
          this.jmeno = res.data[0].name;
        });
    },
  },
  // FIXME Should just fetch top ten and implement infinite scroll
  created() {
    this.fetchPosts();
    this.getSvatekName();
    this.fetchNewestWork();
    this.fetchPopularWork();
    this.fetchSpotify();
    this.fetchAktualita();
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
