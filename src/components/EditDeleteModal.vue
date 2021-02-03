<template>
  <div class="container">
    <div class="card p-5">
      <div class="buttons">
        <button class="button is-danger" @click="removePost">
          Odstranit článek
        </button>
        <button class="button is-primary" @click="pushToEdit">
          Upravit článek
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditDeleteModal",
  props: { id: Number },
  methods: {
    removePost() {
      this.$store.dispatch("removePost", this.id);
      this.$emit("close");
    },
    pushToEdit() {
      this.$router.push({ path: `/clanek/edit/${this.id}` });
    },
  },
};
</script>

<style scoped></style>
