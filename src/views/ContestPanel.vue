<template>
  <div class="container">
    <div class="box">
      <div class="block">
        <h1 class="title has-text-primary">{{ contest.name }}</h1>

        <p><b>Datum vytvoření: </b>{{ formatDate(contest.dateCreated) }}</p>
        <p><b>Datum uzávěrky: </b>{{ formatDate(contest.dateEnding) }}</p>
        <p>
          <b>
            Stav:
          </b>
          <span
            :class="contest.isClosed ? 'has-text-danger' : 'has-text-primary'"
            >{{ contest.isClosed ? "Ukončena" : "V průběhu" }}</span
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
      <div class="buttons">
        <b-button
          icon-left="plus-thick"
          tag="router-link"
          :to="'/nova-prace/' + id"
          type="is-primary"
        >
          Přidat práci
        </b-button>
        <b-button v-show="admin" icon-left="check-bold" type="is-info"
          >Uzavřít soutěž</b-button
        >
        <b-button v-show="admin" icon-left="close-thick" type="is-danger"
          >Vymazat soutěž</b-button
        >
      </div>
      <div v-if="contest.winners.length !== 0" class="block has-text-centered">
        <h2 class="title">Vítězné práce</h2>
        <div class="block"></div>
      </div>
      <div class="block has-text-centered">
        <h2 class="title">Nominované práce</h2>
        <span v-show="contest.nominated.length === 0">Je tu nějak prázdno</span>
        <div class="block"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ContestPanel",
  data() {
    return { contest: {}, error: false };
  },
  methods: {
    loadContent() {
      this.contest = this.$store.getters.getContestByID(this.id);
      if (!this.contest) {
        this.$router.push({ path: "/", query: { err: "conNotFound" } });
        this.error = true;
      }
    },
    formatDate(dateString) {
      return this.$formateDate(dateString);
    },
    setTitle() {
      if (!this.error) document.title = `Chytrá palice - ${this.contest.name}`;
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

<style scoped></style>
