<template>
  <div class="box p-6">
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

      <vue-editor
        :editor-toolbar="toolbarSettings"
        v-model="content"
        class="block"
      ></vue-editor>
      <button class="button block">Save post</button>
    </form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
export default {
  name: "CreatePostFormular",
  props: {
    type: String, //create | edit
    id: String,
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

      this.title = "";
      this.content = "";
    },
  },
  mounted() {
    if (this.type === "edit") {
      const { title, content } = this.$store.getters.getPostByID(this.id);
      this.title = title;
      this.content = content;
    }
  },
};
</script>

<style></style>
