<template>
  <div class="container my-6">
    <div v-if="contests" class="box">
      <!-- Running contests -->
      <div class="block has-text-centered">
        <h2 class="title py-3">Probíhající soutěže</h2>
        <div
          v-for="contest in activeContests"
          :key="contest.id"
          class="card mt-4 is-clickable activeContestCard columns mx-0"
          @click="routeToContest(contest.id)"
        >
          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-weight-bold has-text-primary"
          >
            {{ contest.name }}
          </p>
          <p
            class="column is-flex is-justify-content-center is-align-items-center"
          >
            {{ "do " + new Date(+contest.dateEnding).toLocaleDateString("cs") }}
          </p>
          <p
            class="column is-flex is-justify-content-center is-align-items-center"
          >
            {{
              contest.nominated.length +
                " " +
                nominatedCzechGrammar(contest.nominated.length)
            }}
          </p>
          <div
            class="column has-text-centered is-justify-content-center is-align-items-center is-flex"
            v-if="logged"
          >
            <div class="buttons are-small">
              <b-button
                @click.stop="routeToNewWork(+contest.id)"
                icon-left="plus"
                type="is-primary"
              >
                Přidat práci
              </b-button>
              <b-button
                v-show="admin"
                @click.stop="routeToContest(+contest.id)"
                icon-left="cog"
                type="is-info"
                >Spravovat soutěž</b-button
              >
            </div>
          </div>
        </div>
      </div>
      <!-- All contests -->
      <div class="box">
        <b-field class="mb-5">
          <b-switch @input="filter" v-model="advancedSearch"
            >Rozšířené vyhledavání</b-switch
          >
        </b-field>
        <!-- Search fields -->
        <div class="block">
          <b-field label="Název souteže" label-position="on-border">
            <b-input
              name="name"
              placeholder="Hledat..."
              type="search"
              icon-pack="fas"
              icon="search"
              v-model="search.name"
              v-debounce="filter"
            >
            </b-input>
          </b-field>
          <transition name="slide-up">
            <div v-show="advancedSearch">
              <div class="block">
                <b-field label="Kategorie">
                  <b-checkbox
                    v-model="search.categories"
                    native-value="palice"
                    @input="filter"
                  >
                    Chytrá palice
                  </b-checkbox>
                  <b-checkbox
                    v-model="search.categories"
                    native-value="palicka"
                    @input="filter"
                  >
                    Chytrá palička
                  </b-checkbox>
                  <b-checkbox
                    v-model="search.categories"
                    native-value="jine"
                    @input="filter"
                  >
                    Jiné kategorie
                  </b-checkbox>
                </b-field>
              </div>
              <div class="block">
                <b-field label="Stav">
                  <b-radio
                    v-model="search.running"
                    name="state"
                    :native-value="true"
                    @input="filter"
                  >
                    V průběhu
                  </b-radio>
                  <b-radio
                    v-model="search.running"
                    name="state"
                    :native-value="false"
                    @input="filter"
                  >
                    Ukončena
                  </b-radio>
                  <b-radio
                    v-model="search.running"
                    name="state"
                    :native-value="null"
                    @input="filter"
                  >
                    -
                  </b-radio>
                </b-field>
              </div>
            </div>
          </transition>
        </div>
        <!-- Table -->
        <div class="block">
          <b-table
            :data="filteredContests"
            striped
            hoverable
            mobile-cards
            @click="tableClick"
            :default-sort="['running', 'asc']"
            class="is-clickable"
          >
            <b-table-column
              field="name"
              label="Název soutěže"
              v-slot="props"
              sortable
              centered
            >
              {{ props.row.name }}
            </b-table-column>
            <b-table-column
              field="nominated.length"
              label="Počet prací"
              v-slot="props"
              sortable
              centered
            >
              {{ props.row.nominated.length }}
            </b-table-column>
            <b-table-column
              field="dateEnding"
              label="Datum uzávěrky"
              v-slot="props"
              sortable
              centered
            >
              {{ new Date(+props.row.dateEnding).toLocaleDateString("cs") }}
            </b-table-column>
            <b-table-column
              field="running"
              numeric
              label="Probíhá"
              v-slot="props"
              sortable
              centered
            >
              <b-icon
                pack="fas"
                :icon="props.row.running ? 'check' : 'times'"
                size="is-small"
                :type="props.row.running ? 'is-primary' : 'is-danger'"
              >
              </b-icon>
            </b-table-column>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Components
export default {
  name: "ContestPanel",
  data() {
    return {
      contests: null,
      filteredContests: [],
      activeContests: [],
      search: {
        name: "",
        running: null,
        categories: ["palice", "palicka", "jine"],
      },
      advancedSearch: false,
    };
  },
  computed: {
    logged() {
      return this.$store.getters.isLoggedIn;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
  },
  created() {
    this.fetchContests();
  },
  methods: {
    async fetchContests() {
      this.contests = await this.$store.dispatch("getAllContests");
      this.filteredContests = this.contests || [];
      this.activeContests = this.contests.filter((contest) => {
        return contest.running && +contest.dateEnding > Date.now();
      });
    },
    tableClick(row) {
      this.routeToContest(row.id);
    },
    routeToContest(id) {
      this.$router.push(`/souteze/${id}`);
    },
    routeToNewWork(id) {
      this.$router.push(`/nova-prace/${id}`);
    },
    filter() {
      const filteredContests = [];
      this.contests.forEach((contest) => {
        if (this.search.name) {
          if (!this.strContains(contest.name, this.search.name)) return;
        }
        if (this.advancedSearch) {
          if (!this.search.categories.includes(contest.category)) return;

          if (this.search.running === true && !contest.running) return;
          if (this.search.running === false && contest.running) return;
        }
        filteredContests.push(contest);
      });
      this.filteredContests = filteredContests;
    },
    strContains(string, substring) {
      const normalizedString = string
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedSubstring = substring
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedString.includes(normalizedSubstring);
    },
    nominatedCzechGrammar(nominated) {
      return nominated === 0 || nominated > 4 ? "prací" : "práce";
    },
  },
};
</script>

<style>
.slide-up-enter-active {
  transition: all 0.3s ease;
}

.slide-up-leave-active {
  transition: all 0.05s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
