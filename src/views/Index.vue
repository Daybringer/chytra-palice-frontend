<template>
  <section class="section">
    <div class="container">
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
      <post-card
        v-for="post in posts"
        :key="post"
        :author="post.author"
        :date="post.date"
        :title="post.title"
        :content="post.content"
      ></post-card>
    </div>
  </section>
</template>

<script>
import PostCard from "../components/PostCard.vue";
import { VueEditor } from "vue2-editor";
export default {
  name: "Index",
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
      posts: [
        // {
        //   author: "Michaela Bečková",
        //   date: "31.1.2020",
        //   title: "Palice 2020",
        //   content: "<h1>What is this?</h1><strong>some text</strong>",
        // },
      ],
    };
  },
  components: { VueEditor, PostCard },
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

<style scoped></style>
