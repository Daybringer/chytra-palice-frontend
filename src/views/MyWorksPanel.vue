<template>
  <div class="container my-6">
    <div class="box has-text-centered">
      <div class="block has-text-centered">
        <h2 class="title py-3">Moje práce</h2>
        <div
          v-for="work in myWorks"
          :key="work.id"
          class="card mt-4 is-clickable activeContestCard columns mx-0"
          @click="routeToWork(work.id)"
        >
          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-weight-bold has-text-primary"
          >
            {{ work.name }}
          </p>

          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-info"
            :class="
              work.approvedState === 'approved'
                ? 'has-text-success'
                : work.approvedState === 'rejected'
                ? 'has-text-danger'
                : 'has-text-info'
            "
          >
            {{
              work.approvedState === "approved"
                ? "Schváleno"
                : work.approvedState === "rejected"
                ? "Zámítnuto"
                : "Čekající na schválení"
            }}
          </p>
          <p
            class="column is-flex is-justify-content-center is-align-items-center"
          >
            {{ "x" + work.timesRead + " přečteno" }}
          </p>
        </div>
      </div>
      <b-button
        class="text-center"
        icon-left="plus-thick"
        tag="router-link"
        :to="'/souteze'"
        type="is-primary"
      >
        Přidat práci
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyWorksPanel",
  computed: {
    myEmail() {
      return this.$store.getters.getEmail;
    },
  },
  data() {
    return {
      myWorks: [],
    };
  },
  created() {
    this.fetchMyWorks();
  },
  methods: {
    routeToWork(id) {
      this.$router.push(`/prace/${id}`);
    },
    async fetchMyWorks() {
      this.myWorks = await this.$store.dispatch("getAllWorks", {
        authorEmail: this.myEmail,
      });
    },
  },
};
</script>

<style></style>
