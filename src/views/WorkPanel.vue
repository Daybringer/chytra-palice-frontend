<template>
  <div class="container" v-if="work">
    <div class="box">
      <div class="block">
        <!-- Work's name -->
        <h1 class="title has-text-primary">{{ work.name }}</h1>
        <!-- Author -->
        <h2 class="subtitle has-text-gray">
          {{ work.authorName }}
        </h2>
        <!-- Date -->
        <p>
          <b>Přidáno: </b
          >{{ new Date(+work.dateAdded).toLocaleDateString("cs") }}
        </p>
        <!-- Contest -->
        <p>
          <b>Zařazeno do soutěže: </b
          ><router-link :to="`/souteze/${contest.id}`">{{
            contest.name
          }}</router-link>
        </p>
        <!-- Subject -->
        <p>
          <b>Předmět: </b
          >{{
            work.subject === "hst"
              ? "HST"
              : work.category === "cestina"
              ? "Český jazyk"
              : work.category === "dejepis"
              ? "Dějepis"
              : "Jiné"
          }}
        </p>
        <!-- Is Maturita project -->
        <p><b>Maturitní práce: </b>{{ work.maturita ? "Ano" : "Ne" }}</p>
        <!-- Keywords -->
        <p>
          <b>Klíčová slova: </b>
          <span v-for="tag in work.keywords" :key="tag" class="tag m-1 is-link">
            {{ tag }}
          </span>
        </p>
        <!-- approvedState  (only for owner and admin)-->
        <p
          v-show="isAdmin || userEmail == work.authorEmail"
          :class="
            work.approvedState === 'approved'
              ? 'has-text-success'
              : work.approvedState === 'rejected'
              ? 'has-text-danger'
              : 'has-text-info'
          "
        >
          <span class="has-text-grey-dark"><b>Stav: </b></span>
          {{
            work.approvedState === "approved"
              ? "Schváleno"
              : work.approvedState === "rejected"
              ? "Zámítnuto"
              : "Čekající na schválení"
          }}
        </p>
        <!-- Guarantor message -->
        <p
          class="has-text-danger"
          v-if="
            (isAdmin || userEmail == work.authorEmail) &&
              work.approvedState == 'rejected'
          "
        >
          <span class="has-text-grey-dark"><b>Zpráva: </b></span>
          {{ work.guarantorMessage }}
        </p>
      </div>
      <!-- Controls for admin - accept\reject and modal for it-->
      <div v-if="isAdmin && work.approvedState === 'pending'" class="buttons">
        <b-button icon-left="check-bold" @click="approveWork" type="is-primary">
          Schválit práci
        </b-button>
        <b-button
          icon-left="close-thick"
          @click="isComponentModalActive = true"
          type="is-danger"
          >Zamítnout práci</b-button
        >
      </div>

      <b-modal
        v-model="isComponentModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="true"
        aria-role="dialog"
        aria-label="Write message"
        aria-modal
      >
        <template #default="props">
          <div :id="id" @close="props.close" class="container">
            <div class="card p-5 is-justify-content-center">
              <b-field label="Zpráva pro autora">
                <b-input
                  maxlength="200"
                  type="textarea"
                  v-model="guarantorMessage"
                ></b-input>
              </b-field>
              <div class="buttons is-justify-content-center">
                <b-button class="button is-danger" @click="rejectWork">
                  Zamítnout práci
                </b-button>
              </div>
            </div>
          </div>
        </template>
      </b-modal>

      <!-- PDF Viewer -->
      <div class="has-text-center block">
        <div class="buttons is-justify-content-center">
          <b-button
            type="is-primary"
            icon-left="chevron-left"
            @click="currPage > 1 ? (currPage -= 1) : (currPage = 1)"
          ></b-button>
          <b-button disabled>{{ `${currPage}/${pageCount}` }}</b-button>
          <b-button
            type="is-primary"
            icon-right="chevron-right"
            @click="
              currPage < pageCount ? (currPage += 1) : (currPage = pageCount)
            "
          ></b-button>
        </div>
        <pdf
          @error="pdfFailed"
          :src="pdfSrc"
          :page="currPage"
          @num-pages="setPageCount"
          style="max-width:600px;margin-left:auto;margin-right:auto; border:gray solid 2px;"
          class="block"
        ></pdf>
      </div>

      <!-- Download buttons-->
      <div class="buttons is-justify-content-center block">
        <b-button
          type="is-info"
          tag="a"
          :href="epubSrc"
          :disabled="work.fileType == 'pdf'"
          icon-right="book-open-page-variant"
        >
          Stáhnout EPUB
        </b-button>
        <b-button type="is-info" tag="a" :href="pdfSrc" icon-right="file-pdf">
          Stáhnout PDF
        </b-button>
      </div>
    </div>
    <!-- Comment section -->
    <comment-section :isAdmin="isAdmin" :workID="this.id"></comment-section>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import CommentSection from "../components/CommentSection.vue";
export default {
  name: "WorkPanel",
  components: { pdf, CommentSection },
  computed: {
    isAdmin() {
      // TODO change to redirect on "pending" or "rejected"
      return this.$store.getters.isAdmin;
    },
    id() {
      return this.$route.params.id;
    },
    userEmail() {
      return this.$store.getters.getEmail;
    },
  },
  methods: {
    pdfFailed(error) {
      console.log("Vyskytla se chyba u načítaní PDF: ", error);
    },
    async fetchWork() {
      this.$store
        .dispatch("getWorkByID", this.id)
        .then((work) => {
          this.work = work;

          if (!this.work) {
            this.$router.push({ path: "/", query: { err: "conNotFound" } });
          } else {
            this.fetchContest(this.work.contestID);
            document.title = `Chytrá palice - ${this.work.name}`;
          }
        })
        .catch(() => {
          this.$router.push({ path: "/", query: { err: "conNotFound" } });
        });
    },
    async fetchContest(id) {
      this.$store
        .dispatch("getContestByID", id)
        .then((contest) => {
          this.contest = contest;
        })
        .catch((err) => {
          console.log(err);
          this.$router.push({ path: "/", query: { err: "conNotFound" } });
        });
    },
    // FIXME remove it
    setPageCount(numberOfPages) {
      this.pageCount = numberOfPages;
    },
    rejectWork() {
      this.$store
        .dispatch("rejectWork", {
          guarantorMessage: this.guarantorMessage,
          id: this.id,
        })
        .then(() => {
          this.work.approvedState = "rejected";
          this.work.guarantorMessage = this.guarantorMessage;
          this.guarantorMessage = "";
          this.isComponentModalActive = false;
        })
        .catch((err) => console.log(err));
    },
    approveWork() {
      this.$store
        .dispatch("approveWork", this.id)
        .then(() => {
          this.work.approvedState = "approved";
          this.$buefy.toast.open({
            duration: 5000,
            message: `Práce byla zařazena do soutěže`,
            position: "is-top",
            type: "is-primary",
          });
        })
        .catch((err) => console.log(err));
    },
  },
  created() {
    this.fetchWork();
    if (process.env.NODE_ENV == "production") {
      this.pdfSrc = `http://palice.gjk.cz:3000/works/${this.id}/pdf`;
      this.epubSrc = `http://palice.gjk.cz:3000/works/${this.id}/epub`;
    } else {
      this.pdfSrc = `http://localhost:3000/works/${this.id}/pdf`;
      this.epubSrc = `http://localhost:3000/works/${this.id}/epub`;
    }
  },
  data() {
    return {
      work: null,
      contest: {},
      isComponentModalActive: false,
      guarantorMessage: "",
      currPage: 1,
      pageCount: 0,
      pdfSrc: "",
      epubSrc: "",
    };
  },
};
</script>

<style scoped></style>
