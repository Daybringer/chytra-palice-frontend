<template>
  <div class="container my-6">
    <div v-if="works !== null" class="box has-text-centered">
      <div class="block has-text-centered">
        <h2 class="title py-3">Práce ke schválení</h2>
        <div
          v-for="work in works"
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
            class="column is-flex is-justify-content-center is-align-items-center has-text-grey"
          >
            {{ work.authorName }}
          </p>
        </div>
        <h3 v-show="works.length === 0" class="subtitle py-3">Vše vyřízeno</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ApproveWorks",
  data() {
    return {
      works: null,
    };
  },
  created() {
    this.fetchPendingWorks();
  },
  methods: {
    async fetchPendingWorks() {
      this.works = await this.$store.dispatch("getAllWorks", {
        approvedState: "pending",
      });
    },
    routeToWork(id) {
      this.$router.push(`/prace/${id}`);
    },
  },
};
</script>

<style scoped></style>
