<template>
  <div class="container mb-5">
    <div class="box">
      <div class="block">
        <h1 class="title has-text-primary">{{ contest.name }}</h1>

        <p><b>Datum vytvoření: </b>{{ formatDate(contest.dateCreated) }}</p>
        <p><b>Datum uzávěrky: </b>{{ formatDate(contest.dateEnding) }}</p>
        <p>
          <b>
            Stav:
          </b>
          <span :class="closed ? 'has-text-danger' : 'has-text-primary'">{{
            closed ? "Ukončena" : "V průběhu"
          }}</span>
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
      <div class="buttons">
        <b-button
          v-show="!closed"
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
          >{{ closed ? "Upravit pořadí" : "Uzavřít soutěž" }}</b-button
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
                    v-for="work in approvedWorks"
                    :key="work.ID"
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
                          @click="moveToWinners(0, work.ID)"
                          :outlined="!winners[0].includes(work.ID)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-silver"
                          @click="moveToWinners(1, work.ID)"
                          :outlined="!winners[1].includes(work.ID)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-bronze"
                          @click="moveToWinners(2, work.ID)"
                          :outlined="!winners[2].includes(work.ID)"
                          icon-right="trophy"
                        >
                        </b-button>
                        <b-button
                          type="is-danger"
                          @click="removeFromWinners(work.ID)"
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

        <b-button v-show="admin" icon-left="close-thick" type="is-warning"
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
                  <b-button
                    class="button is-info"
                    @click="isRemoveModalActive = false"
                  >
                    Uzavřít soutěž
                  </b-button>
                </div>
              </div>
            </div>
          </template>
        </b-modal>
      </div>
      <div v-show="closed" class="block has-text-centered">
        <h2 class="title">Oceněné práce</h2>
        <div class="block">
          <div
            v-for="work in winnerWorks"
            :key="work.ID + 'w'"
            class="card mt-4 is-clickable activeContestCard columns mx-0"
            @click="routeToWork(work.ID)"
            :class="
              winners[0].includes(work.ID)
                ? 'has-border-gold'
                : winners[1].includes(work.ID)
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
                  winners[0].includes(work.ID)
                    ? 'has-text-gold'
                    : winners[1].includes(work.ID)
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
      <div class="block has-text-centered mb-5">
        <h2 class="title">Nominované práce</h2>
        <span v-show="approvedWorks.length === 0">Je tu nějak prázdno</span>
        <div class="block">
          <div
            v-for="work in approvedWorks"
            :key="work.ID"
            class="card mt-4 is-clickable activeContestCard columns mx-0"
            @click="routeToWork(work.ID)"
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
      contest: {},
      isRemoveModalActive: false,
      isModalActive: false,
      error: false,
      radioButton: "",
      winners: [[], [], []],
      winnerWorks: [],
      closed: false,
    };
  },
  methods: {
    loadContent() {
      this.contest = this.$store.getters.getContestByID(this.id);
      if (!this.contest) {
        this.$router.push({ path: "/", query: { err: "conNotFound" } });
        this.error = true;
      } else {
        this.closed = this.contest.isClosed;

        this.winners = this.contest.winners;
        this.setWinnerWorks();
      }
    },
    removeContest() {
      this.$store.dispatch("removeContest", {
        contestID: this.id,
      });
      this.isRemoveModalActive = false;
      this;
    },
    setWinnerWorks() {
      if (!this.closed) return [];
      this.winnerWorks = this.approvedWorks
        .filter((work) => this.winners[0].includes(work.ID))
        .concat(
          this.approvedWorks.filter((work) => this.winners[1].includes(work.ID))
        )
        .concat(
          this.approvedWorks.filter((work) => this.winners[2].includes(work.ID))
        );
    },
    removeFromWinners(workID) {
      this.winners.forEach((arr) => {
        const index = arr.indexOf(workID);
        if (index !== -1) arr.splice(index, 1);
      });
    },
    // position: 0..first place,1...second etc.
    moveToWinners(position, workID) {
      this.removeFromWinners(workID);
      this.winners[position].push(workID);
    },
    formatDate(dateString) {
      return this.$formateDate(dateString);
    },
    setTitle() {
      if (!this.error) document.title = `Chytrá palice - ${this.contest.name}`;
    },
    closeContest() {
      if (
        this.winners[0].length !== 0 &&
        this.winners[1].length !== 0 &&
        this.winners[2].length !== 0
      ) {
        this.$store.dispatch("setWinners", {
          contestID: this.id,
          winners: this.winners,
        });

        this.isModalActive = false;
        this.closed = true;
        this.$buefy.toast.open({
          duration: 5000,
          message: `Soutěž byla uzavřena`,
          position: "is-top",
          type: "is-primary",
        });
        this.setWinnerWorks();
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
    works() {
      const works = [];
      this.contest.nominated.forEach((id) => {
        works.push(this.$store.getters.getWorkByID(id));
      });
      return works;
    },
    approvedWorks() {
      return this.works.filter((work) => work.approvedState === "approved");
    },
  },
  beforeMount() {
    this.loadContent();
    this.setTitle();
    console.log(`contest`, this.contest);
    console.log("works", this.works);
    console.log("approved", this.approvedWorks);
    console.log(`winners: ${this.winners}`);
  },
};
</script>

<style scoped>
.winnersModal {
  max-height: 95vh;
  overflow-y: auto;
}
</style>
