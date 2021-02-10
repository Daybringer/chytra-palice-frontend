<template>
  <div class="container mt-4">
    <div class="box p-6-desktop">
      <h1 class="title">Nahrání soutěžní práce</h1>
      <div class="block">
        <!-- Název -->
        <b-field label="Název práce" :label-position="'on-border'">
          <b-input placeholder="Název práce" v-model.trim="work.name"></b-input>
        </b-field>
        <!-- Autor -->
        <b-field label="Autor práce" :label-position="'on-border'">
          <b-input
            placeholder="Název práce"
            :value="author + ' (' + authorEmail + ')'"
            disabled
          ></b-input>
        </b-field>
        <!-- Soutěž -->
        <b-field label="Zařazeno do soutěže" :label-position="'on-border'">
          <b-input placeholder="Soutěž" :value="contestName" disabled></b-input>
        </b-field>
        <b-field label="Datum přidání" :label-position="'on-border'">
          <b-input
            placeholder="Datum přidání"
            :value="formatDate()"
            disabled
          ></b-input>
        </b-field>
        <!-- Datum  -->

        <!--  -->
      </div>
      <!-- Nahrání souboru -->
      <h2 class="is-size-5 has-text-weight-semibold block">Soutěžní práce</h2>
      <b-field>
        <b-upload
          v-model="work.file"
          @input="checkWork"
          native
          drag-drop
          expanded
        >
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>Nahrajte soubor (.docx, .odt)</p>
            </div>
          </section>
        </b-upload>
      </b-field>
      <!-- Divider -->
      <div>
        <div class="divider">Nebo</div>
      </div>
      <!-- Vue text editor -->
      <vue-editor
        :editor-toolbar="toolbarSettings"
        :placeholder="'Přepište práci'"
        v-model="content"
        class="block"
      ></vue-editor>
      <button
        @click="saveWork"
        class="button is-primary has-text-weight-medium"
      >
        Nahrát práci
      </button>
    </div>
  </div>
</template>

<script>
// Components
import { VueEditor } from "vue2-editor";
export default {
  name: "AddWorkPanel",
  components: { VueEditor },
  methods: {
    saveWork() {
      console.log("asdf");
    },
    formatDate() {
      const dateNow = new Date();
      return this.$formateDate(dateNow);
    },
    checkWork() {
      console.log(this.work.file);
    },
  },
  computed: {
    author() {
      return this.$store.getters.getName;
    },
    authorEmail() {
      return this.$store.getters.getEmail;
    },
    contestID() {
      return this.$route.params.contestID;
    },
    contestName() {
      return this.$store.getters.getContestByID(this.contestID).name;
    },
  },
  data() {
    return {
      errors: { name: "", file: "" },
      work: { name: "", file: null },
      content: "",
      // VueEditor
      toolbarSettings: [
        [{ header: [false, 3] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
    };
  },
};
</script>

<style scoped></style>
