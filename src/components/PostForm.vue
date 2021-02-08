<template>
  <div class="box p-6-desktop">
    <h1 class="title">
      {{ type === "create" ? "Nový článek" : "Editace článku" }}
    </h1>
    <form @submit.prevent="savePost">
      <div class="field block">
        <label class="label">Nadpis</label>
        <div class="control">
          <input
            class="input"
            v-model="title"
            type="text"
            placeholder="Název článku"
          />
        </div>
      </div>
      <b-field label="Add some tags" :label-position="'on-border'">
        <b-taginput
          :value="['My first tag', 'My second tag']"
          ellipsis
          icon="label"
          placeholder="Add a tag"
        >
        </b-taginput>
      </b-field>
      <vue-editor
        :editor-toolbar="toolbarSettings"
        v-model="content"
        class="block"
      ></vue-editor>
      <div class="buttons">
        <button class="button is-primary">Uložit článek</button>
      </div>
    </form>
  </div>
</template>

<script>
// Components
import { VueEditor } from "vue2-editor";
export default {
  name: "CreatePostFormular",
  props: {
    type: String, // 'create' || 'edit'
    id: String, // when type === edit: id of post
  },
  components: { VueEditor },
  data() {
    return {
      toolbarSettings: [
        [{ header: [false, 3] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        // [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["link", "image", "video"],
        ["clean"], // remove formatting button
      ],
      content: "",
      title: "",
    };
  },
  methods: {
    savePost() {
      this.title = this.title.trim();
      this.content = this.content.trim();

      if (this.title && this.content) {
        if (this.type === "edit") {
          this.$store.dispatch("editPost", {
            id: this.id,
            title: this.title,
            content: this.content,
          });
        } else {
          this.$store.dispatch("newPost", {
            title: this.title,
            content: this.content,
          });
        }

        this.showSuccess();
        this.title = "";
        this.content = "";
        this.$router.push(`/clanek/${this.id}`);
      } else {
        this.showError();
      }
    },
    showError() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Článek nesmí být prázdný`,
        position: "is-top",
        type: "is-danger",
      });
    },
    showSuccess() {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Článek byl úspěšně uložen`,
        position: "is-top",
        type: "is-success",
      });
    },
  },
  mounted() {
    if (this.type === "edit") {
      const { title, content } = this.$store.getters.getPostByID(this.id);
      if (!(title && content))
        this.$router.push({ path: "/", query: { err: "notFound" } });
      this.title = title;
      this.content = content;
    }
  },
};
</script>

<style scoped></style>
