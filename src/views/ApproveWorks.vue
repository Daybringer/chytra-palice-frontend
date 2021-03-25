<template>
  <div class="container my-6">
    <div class="box has-text-centered">
      <div class="block has-text-centered">
        <h2 class="title py-3">Práce ke schválení</h2>
        <div
          v-for="work in works"
          :key="work.ID"
          class="card mt-4 is-clickable activeContestCard columns mx-0"
          @click="routeToWork(work.ID)"
        >
          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-weight-bold has-text-primary"
          >
            {{ work.name }}
          </p>

          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-weight-bold has-text-grey"
          >
            {{ getContestByID(work.contestID).name }}
          </p>

          <p
            class="column is-flex is-justify-content-center is-align-items-center has-text-grey"
          >
            {{ work.authorName }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApproveWorks",
  computed: {
    works() {
      const works = this.$store.getters.getWorks;
      return works.filter((work) => work.approvedState === "pending");
    },
  },
  methods: {
    getContestByID(id) {
      return this.$store.getters.getContestByID(id);
    },
    routeToWork(id) {
      this.$router.push(`/prace/${id}`);
    },
  },
};
</script>

<style scoped></style>
