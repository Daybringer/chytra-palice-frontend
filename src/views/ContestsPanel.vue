<template>
  <div class="container my-6">
    <div class="box">
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
            {{ "do " + formatDate(contest.dateEnding) }}
          </p>
          <p
            class="column is-flex is-justify-content-center is-align-items-center"
          >
            {{
              numberOfApprovedNominated(getWorksFromIDArr(contest.nominated))
            }}
          </p>
          <div
            class="column has-text-centered is-justify-content-center is-align-items-center is-flex"
            v-if="logged"
          >
            <div class="buttons are-small">
              <b-button
                @click.stop="routeToNewWork(contest.id)"
                icon-left="plus"
                type="is-primary"
              >
                Přidat práci
              </b-button>
              <b-button
                v-show="admin"
                @click.stop="routeToContest(contest.id)"
                icon-left="cog"
                type="is-info"
                >Spravovat soutěž</b-button
              >
            </div>
          </div>
        </div>
      </div>
      <div class="block has-text-centered">
        <h2 class="title mt-6 py-3">Všechny soutěže</h2>
        <b-field>
          <b-switch v-model="advancedSearch">Rozšířené vyhledavání</b-switch>
        </b-field>
        <b-table
          :data="allContests"
          :mobile-cards="false"
          :hoverable="true"
          @click="tableClick"
          class="is-clickable"
        >
          <b-table-column
            field="name"
            label="Název soutěže"
            sortable
            centered
            :searchable="advancedSearch"
            v-slot="props"
          >
            {{ props.row.name }}
          </b-table-column>
          <b-table-column
            field="nominated"
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
            centered
            sortable
          >
            {{ formatDate(props.row.dateEnding) }}
          </b-table-column>

          <b-table-column
            field="category"
            label="Kategorie"
            v-slot="props"
            sortable
            centered
          >
            {{ props.row.category }}
          </b-table-column>
          <b-table-column
            field="category"
            label="Probíhá"
            v-slot="props"
            centered
            width="40"
            sortable
          >
            <b-icon
              pack="fas"
              :icon="props.row.isClosed ? 'times ' : 'check'"
              size="is-small"
              :type="props.row.isClosed ? 'is-danger ' : 'is-primary'"
            >
            </b-icon>
          </b-table-column>
        </b-table>
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
      advancedSearch: false,
    };
  },
  computed: {
    allContests() {
      return this.$store.getters.getContests;
    },
    activeContests() {
      const activeContArr = [];
      this.allContests.forEach((contest) => {
        if (!contest.isClosed) activeContArr.push(contest);
      });
      return activeContArr;
    },
    logged() {
      return this.$store.getters.isLoggedIn;
    },
    admin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    tableClick(row) {
      this.routeToContest(row.id);
    },
    routeToContest(id) {
      this.$router.push(`/souteze/${id}`);
    },
    routeToNewWork(id) {
      this.$router.push(`/nova-prace/${id}`);
    },

    formatDate(dateString) {
      return this.$formateDate(dateString);
    },
    filterOnlyApproved(works) {
      return works.filter((work) => work.approvedState === "approved");
    },
    getWorksFromIDArr(idArr) {
      const works = [];
      idArr.forEach((id) => {
        works.push(this.$store.getters.getWorkByID(id));
      });
      return works;
    },
    numberOfApprovedNominated(nominated) {
      const filtered = this.filterOnlyApproved(nominated);
      return `${filtered.length} ${
        filtered.length === 0 || filtered.length > 4 ? "prací" : "práce"
      }`;
    },
    isContestActive(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      return date > now;
    },
  },
};
</script>

<style>
.vertical-middle {
  vertical-align: middle;
}
.th-wrap {
  justify-content: center !important;
  width: auto;
  padding: 0;
  margin: 0;
}
</style>
