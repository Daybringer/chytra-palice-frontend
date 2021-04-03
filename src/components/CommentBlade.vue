<template>
  <div class="box is-relative">
    <div class="has-text-left has-text-primary is-size-6">
      <i>{{ author }}</i>
    </div>
    <div>{{ message }}</div>
    <!-- Remove button -->
    <b-button
      v-show="isAdmin"
      class="removeButton"
      type="is-danger is-small"
      icon-right="close"
      @click="isComponentModalActive = true"
    />
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
        <div @close="props.close" class="container">
          <div class="card p-5 is-justify-content-center">
            <h2 class="subtitle">
              Chcete doopravdy smazat komentář?
            </h2>
            <div class="buttons is-justify-content-center">
              <b-button class="button is-danger" @click="deleteComment">
                Smazat
              </b-button>
              <b-button class="button is-warning" @click="cancel">
                Zrušit
              </b-button>
            </div>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "CommentBlade",
  props: ["author", "message", "id", "workID"],
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    cancel() {
      this.isComponentModalActive = false;
    },
    deleteComment() {
      this.$store.dispatch("deleteComment", this.id).then(() => {
        this.$emit("removeComment", this.id);
      });
      this.isComponentModalActive = false;
    },
  },
  data() {
    return { isComponentModalActive: false };
  },
};
</script>

<style scoped>
.removeButton {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
}
</style>
