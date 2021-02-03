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
  components: { VueEditor },
  data() {
    return {
      toolbarSettings: [
        [{ header: [false, 1, 2] }],
        ["bold", "italic", "underline", "strike"], // toggled buttons
        // [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        ["link", "image", "video"],
        ["clean"], // remove formatting button
      ],
      author: "Blanka Činátlová",
      content: "",
      title: "",
    };
  },
  methods: {
    savePost() {
      const date = new Date();
      const post = {
        title: this.title,
        author: this.author,
        date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
        content: this.content,
      };
      this.posts.push(post);
      this.content = "";
    },
  },
};
</script>

<style></style>
