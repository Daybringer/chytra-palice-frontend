<template>
  <div class="container mb-5">
    <div v-if="contest && works" class="box">
      <!-- Contest info -->
      <div class="block">
        <h1 class="title has-text-primary">{{ contest.name }}</h1>

        <p>
          <b>Datum vytvoření: </b
          >{{ new Date(+contest.dateAdded).toLocaleDateString("cs") }}
        </p>
        <p>
          <b>Datum uzávěrky: </b
          >{{ new Date(+contest.dateEnding).toLocaleDateString("cs") }}
        </p>
        <p>
          <b>
            Stav:
          </b>
          <span
            :class="!contest.running ? 'has-text-danger' : 'has-text-primary'"
            >{{ contest.running ? "V průběhu" : "Ukončena" }}</span
          >
        </p>
        <p>
          <b>Kategorie: </b
          >{{
            contest.category === "palice"
              ? "Chytrá palice"
              : contest.category === "palicka"
              ? "Chytrá palička"
              : "-"
          }}
        </p>
        <p><b>Popis: </b> {{ contest.description }}</p>
      </div>
      <!-- Control buttons -->
      <div class="buttons">
        <b-button
          v-show="contest.running"
          icon-left="plus-thick"
          tag="router-link"
          :to="'/nova-prace/' + id"
          type="is-primary"
        >
          Přidat práci
        </b-button>
        <b-button
          v-show="admin"
          @click="isModalActive = true"
          icon-left="trophy"
          type="is-info"
          >{{
            !contest.running ? "Upravit pořadí" : "Uzavřít soutěž"
          }}</b-button
        >

        <b-modal
          v-model="isModalActive"
          has-modal-card
          trap-focus
          :destroy-on-hide="true"
          aria-role="dialog"
          aria-label="Choose standings"
          aria-modal
        >
          <template #default="props">
            <div @close="props.close" class="container winnersModal">
              <div class="card p-5 is-justify-content-center">
                <h2 class="subtitle has-text-centered is-size-4">
                  <b>Označte oceněné práce</b>
                </h2>
                <div style="width:500px;height:1px;"></div>
                <div class="block">
                  <div
                    v-for="work in works"
                    :key="work.id"
                    class="card mt-4 columns mx-0"
                  >
                    <p
                      class="column is-flex is-justify-content-center is-align-items-center"
                    >
                      {{ work.name }}
                    </p>
                    <div
                      class="column is-flex is-justify-content-center is-align-items-center"
                    >
                      <div class="buttons">
                        <b-button
                          type="is-gold"
                          @click="moveToWinners(0, work.id)"
                          :outlined="!winners[0].includes(work.id)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-silver"
                          @click="moveToWinners(1, work.id)"
                          :outlined="!winners[1].includes(work.id)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-bronze"
                          @click="moveToWinners(2, work.id)"
                          :outlined="!winners[2].includes(work.id)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-danger"
                          @click="removeFromWinners(work.id)"
                          icon-right="close-thick"
                        >
                        </b-button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="buttons is-justify-content-center">
                  <b-button
                    expanded
                    class="button is-info"
                    @click="closeContest"
                  >
                    Uzavřít soutěž
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </b-modal>

        <b-button
          v-show="admin"
          tag="router-link"
          :to="`/souteze/edit/${id}`"
          icon-left="close-thick"
          type="is-warning"
          >Upravit soutěž</b-button
        >
        <b-button
          v-show="admin"
          @click="isRemoveModalActive = true"
          icon-left="close-thick"
          type="is-danger"
          >Vymazat soutěž</b-button
        >
        <b-modal
          v-model="isRemoveModalActive"
          has-modal-card
          trap-focus
          :destroy-on-hide="true"
          aria-role="dialog"
          aria-label="Confirm removing of contest"
          aria-modal
        >
          <template #default="props">
            <div @close="props.close" class="container">
              <div class="card p-5 is-justify-content-center">
                <h2 class="subtitle has-text-centered is-size-4">
                  <b>Chcete doopravdy soutěž vymazat?</b>
                </h2>
                <div class="buttons is-justify-content-center">
                  <b-button class="button is-danger" @click="removeContest">
                    Potvrdit vymazání soutěže
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </b-modal>
      </div>
      <!-- Awarded works -->
      <div v-show="!contest.running" class="block has-text-centered">
        <h2 class="title">Oceněné práce</h2>
        <div class="block">
          <div
            v-for="workID in contest.first.concat(
              contest.second.concat(contest.third)
            )"
            :key="workID"
            class="card mt-4 is-clickable activeContestCard columns mx-0"
            @click="routeToWork(workID)"
            :class="
              contest.first.includes(workID)
                ? 'has-border-gold'
                : contest.second.includes(workID)
                ? 'has-border-silver'
                : 'has-border-bronze'
            "
          >
            <p
              class="column is-flex is-justify-content-center is-align-items-center has-text-weight-bold has-text-primary"
            >
              <span
                class="icon"
                :class="
                  contest.first.includes(workID)
                    ? 'has-text-gold'
                    : contest.second.includes(workID)
                    ? 'has-text-silver'
                    : 'has-text-bronze'
                "
              >
                <i class="mdi mdi-trophy " />
              </span>
            </p>
            <p
              class="column is-flex is-justify-content-center is-align-items-center has-text-weight-medium has-text-gray"
            >
              {{ findWorkByID(workID).name }}
            </p>

            <p
              class="column is-flex is-justify-content-center is-align-items-center has-text-gray"
            >
              {{ findWorkByID(workID).authorName }}
            </p>
          </div>
        </div>
      </div>
      <!-- Nominated works -->
      <div class="block has-text-centered mb-5">
        <h2 class="title">Nominované práce</h2>
        <span v-show="works.length === 0">Je tu nějak prázdno</span>
        <div class="block">
          <div
            v-for="work in works"
            :key="work.id"
            class="card mt-4 is-clickable activeContestCard columns mx-0"
            @click="routeToWork(work.id)"
          >
            <p
              class="column is-flex is-justify-content-center is-align-items-center has-text-weight-medium has-text-primary"
            >
              {{ work.name }}
            </p>

            <p
              class="column is-flex is-justify-content-center is-align-items-center has-text-gray"
            >
              {{ work.authorName }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContestPanel",
  data() {
    return {
      contest: null,
      works: null,
      isRemoveModalActive: false,
      isModalActive: false,
      radioButton: "",
      winners: [[], [], []],
    };
  },
  methods: {
    async fetchContest() {
      this.$store
        .dispatch("getContestByID", this.id)
        .then((contest) => {
          this.contest = contest;
          document.title = `Chytrá palice - ${this.contest.name}`;
        })
        .catch((err) => {
          console.log(err);
          this.$router.push({ path: "/", query: { err: "conNotFound" } });
        });
    },
    async fetchWorks() {
      this.works = await this.$store.dispatch("getAllWorks", {
        approvedState: "approved",
        contestID: this.id,
      });
    },

    async removeContest() {
      this.$store
        .dispatch("removeContest", this.id)
        .then(() => {
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
    },
    findWorkByID(workID) {
      return this.works.filter((work) => work.id == workID)[0];
    },
    removeFromWinners(workID) {
      this.winners.forEach((arr) => {
        const index = arr.indexOf(workID);
        if (index !== -1) arr.splice(index, 1);
      });
    },
    // position: 0..first place, 1...second etc.
    moveToWinners(position, workID) {
      this.removeFromWinners(workID);
      this.winners[position].push(workID);
    },
    async closeContest() {
      if (
        this.winners[0].length !== 0 &&
        this.winners[1].length !== 0 &&
        this.winners[2].length !== 0
      ) {
        this.$store
          .dispatch("setWinners", {
            id: this.id,
            winners: this.winners,
          })
          .then(() => {
            this.contest.first = this.winners[0];
            this.contest.second = this.winners[1];
            this.contest.third = this.winners[2];
            this.isModalActive = false;
            this.contest.running = false;
            this.$buefy.toast.open({
              duration: 5000,
              message: `Soutěž byla uzavřena`,
              position: "is-top",
              type: "is-primary",
            });
          });
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Všechny příčky musí být obsazeny`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    routeToWork(id) {
      this.$router.push(`/prace/${id}`);
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
    this.fetchContest();
    this.fetchWorks();
  },
};
</script>

<style scoped>
.winnersModal {
  max-height: 95vh;
  overflow-y: auto;
}
</style>
