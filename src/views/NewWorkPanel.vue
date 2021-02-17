<template>
  <div class="container my-6">
    <div class="box p-6-desktop">
      <h1 class="title">Nahrání soutěžní práce</h1>
      <!--  -->
      <div class="block">
        <!-- Name of work -->
        <b-field
          label="Název práce"
          :message="errors.name"
          :type="validationState('name')"
          :label-position="'on-border'"
        >
          <b-input
            placeholder="Název práce"
            @input="validate('name')"
            @blur="validate('name')"
            v-model.trim="data.name"
          ></b-input>
        </b-field>
        <!-- Author -->
        <b-field label="Autor práce" :label-position="'on-border'">
          <b-input
            placeholder="Název práce"
            :value="author + ' (' + authorEmail + ')'"
            disabled
          ></b-input>
        </b-field>
        <!-- Contest -->
        <b-field label="Zařazeno do soutěže" :label-position="'on-border'">
          <b-input placeholder="Soutěž" :value="contestName" disabled></b-input>
        </b-field>
        <!-- Date  -->
        <b-field label="Datum přidání" :label-position="'on-border'">
          <b-input
            placeholder="Datum přidání"
            :value="formatDate()"
            disabled
          ></b-input>
        </b-field>
      </div>
      <!-- File upload -->
      <h2 class="is-size-5 has-text-weight-semibold block">Soutěžní práce</h2>
      <b-field>
        <b-upload v-model="data.file" native drag-drop expanded>
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
      <!-- Text editor -->
      <vue-editor
        disabled
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
// yup validation
import { object, string } from "yup";
const newContestSchema = object().shape({
  name: string().required("Vyplňte název práce"),
});

// Components
import { VueEditor } from "vue2-editor";
export default {
  name: "AddWorkPanel",
  components: { VueEditor },
  methods: {
    saveWork() {
      this.validate("name");
      this.validateFile();
      if (!(this.errors.name || this.errors.file)) {
        this.$store.dispatch("newWork", {
          name: this.data.name,
          file: this.data.file,
          author: this.author,
          contestID: this.contestID,
        });
      }
    },
    formatDate(date = new Date()) {
      return this.$formateDate(date);
    },
    // FIXME only works on a properties that aren't an object => `propName` can't have a format like work.name, description.state.date, etc.
    validationState(propName) {
      return this.errors[propName]
        ? "is-danger"
        : this.checked[propName]
        ? "is-success"
        : "";
    },
    async validate(field) {
      newContestSchema
        .validateAt(field, this.data)
        .then(() => {
          this.errors[field] = "";
          this.checked[field] = true;
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
    validateFile() {
      this.checked.file = true;
      if (!this.data.file) {
        this.errors.file = "Invalid or missing file";
        this.$buefy.toast.open({
          duration: 5000,
          message: `Nahrajte prosím soutěžní práci`,
          position: "is-bottom",
          type: "is-danger",
        });
      } else {
        this.errors.file = "";
      }
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
      checked: { name: "", file: "" },
      data: { name: "", file: null },
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
