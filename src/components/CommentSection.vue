<template>
  <div class="container mb-5">
    <div class="box has-text-centered ">
      <h3 class="subtitle">Komentářová sekce</h3>
      <div class="block">
        <comment-blade
          v-for="comment in comments"
          :key="comment.id"
          :author="comment.authorName"
          :message="comment.message"
          :id="comment.id"
          @removeComment="removeComment"
        />
      </div>
      <div v-if="isAdmin" class="field">
        <div class="control">
          <b-input
            expanded
            v-model="newComment"
            @keyup.enter.native="saveComment"
            placeholder="Napiš komentář"
            maxlength="400"
            type="textarea"
          ></b-input>
        </div>
        <div class="control">
          <a @click="saveComment" class="button is-primary">
            Uložit komentář
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommentBlade from "./CommentBlade.vue";
export default {
  name: "CommentSection",
  props: ["workID", "isAdmin"],
  components: {
    CommentBlade,
  },
  methods: {
    async getAllCommentsByWorkID() {
      this.comments = await this.$store.dispatch(
        "getAllCommentsByWorkID",
        this.workID
      );
    },
    async saveComment() {
      const createCommentDto = {
        workID: this.workID,
        message: this.newComment.trim(),
      };
      if (createCommentDto.message !== "")
        this.$store
          .dispatch("createComment", createCommentDto)
          .then((comment) => {
            this.comments.push(comment);
            this.$buefy.toast.open({
              duration: 5000,
              message: `Komentář byl úspěšně uložen`,
              position: "is-top",
              type: "is-primary",
            });
            this.newComment = "";
          })

          .catch((err) => {
            console.log(err);
            this.$buefy.toast.open({
              duration: 5000,
              message: `Při ukládání komentáře došlo k chybě`,
              position: "is-top",
              type: "is-warning",
            });
          });
    },
    removeComment(id) {
      for (let x = 0; x < this.comments.length; x++) {
        if (this.comments[x].id == id) this.comments.splice(x, 1);
      }
    },
  },
  created() {
    this.getAllCommentsByWorkID();
  },
  data() {
    return {
      newComment: "",
      comments: [],
    };
  },
};
</script>

<style scoped></style>
