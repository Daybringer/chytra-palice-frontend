<template>
  <div class="container mb-5">
    <div class="box has-text-centered ">
      <h3 class="subtitle">Komentářová sekce</h3>
      <comment-blade
        v-for="comment in commentCollection"
        :key="comment.ID"
        :author="comment.authorName"
        :message="comment.message"
        :ID="comment.ID"
        :workID="comment.workID"
      />

      <div class="field has-addons is-justify-content-center">
        <div class="control">
          <b-input
            class="is-inline"
            v-model="newComment"
            @keydown.enter="saveComment"
            placeholder="Napiš komentář"
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
  props: ["workID"],
  components: {
    CommentBlade,
  },
  computed: {
    userEmail() {
      return this.$store.getters.getEmail;
    },
    userName() {
      return this.$store.getters.getName;
    },
  },
  methods: {
    fetchCommentCollection() {
      this.commentCollection = this.$store.getters.getCommentCollectionByWorkID(
        this.workID
      );
    },
    saveComment() {
      const comment = {
        authorEmail: this.userEmail,
        authorName: this.userName,
        workID: this.workID,
        message: this.newComment,
      };
      this.$store.dispatch("addComment", comment);
      this.newComment = "";
      if (!this.commentCollection) this.fetchCommentCollection();
      this.$buefy.toast.open({
        duration: 5000,
        message: `Komentář byl úspěšně uložen`,
        position: "is-top",
        type: "is-primary",
      });
    },
  },
  mounted() {
    this.fetchCommentCollection();
    console.log(this.commentCollection);
  },
  data() {
    return {
      newComment: "",
      commentCollection: [],
    };
  },
};
</script>

<style scoped></style>
