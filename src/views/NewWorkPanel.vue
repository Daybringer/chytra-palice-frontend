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
        <!-- Author email -->
        <b-field
          label="Autor práce"
          :message="errors.email"
          :type="validationState('email')"
          :label-position="'on-border'"
        >
          <b-input
            :placeholder="'Email autora (např. xvanmi01@gjk.cz)'"
            @input="validate('email')"
            @blur="validate('email')"
            v-model.trim="data.email"
            :disabled="!isAdmin"
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
            :value="formatDate(new Date())"
            disabled
          ></b-input>
        </b-field>
        <!-- Subject -->
        <b-field
          label="Předmět"
          :label-position="'on-border'"
          :message="errors.subject"
          :type="
            errors.subject ? 'is-danger' : checked.subject ? 'is-success' : ''
          "
        >
          <b-select
            v-model="data.subject"
            placeholder="Vyberte předmět"
            @input="validate('subject')"
            @blur="validate('subject')"
          >
            <option value="cestina">
              Čeština
            </option>
            <option value="hst">
              HST
            </option>
            <option value="dejepis">
              Dějepis
            </option>
            <option value="jine">
              Jiné
            </option>
          </b-select>
        </b-field>
        <!-- Maturita project -->
        <b-field>
          <b-checkbox v-model="data.isMaturita">
            Maturitní práce
          </b-checkbox>
        </b-field>
        <!-- Keywords -->
        <b-field label="Klíčová slova" :label-position="'on-border'">
          <b-taginput
            v-model="tags"
            :data="filteredTags"
            autocomplete
            :allow-new="true"
            :open-on-focus="true"
            icon="label"
            placeholder="Přidat klíčová slova"
            @typing="getFilteredTags"
          >
          </b-taginput>
        </b-field>
      </div>
      <!-- File upload -->
      <div
        class="has-text-centered box has-text-primary p-3 has-text-weight-medium has-background-success-light"
        v-show="data.file"
      >
        {{ data.file ? data.file.name : "" }}
      </div>
      <b-field>
        <b-upload v-model="data.file" native drag-drop expanded>
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>Nahrajte soubor (.odt, .docx, .pdf)</p>
            </div>
          </section>
        </b-upload>
      </b-field>
      <div class="buttons mt-5">
        <b-button
          @click="saveWork"
          class="button is-primary has-text-weight-medium"
          expanded
        >
          Nahrát práci
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
// yup validation
import { object, string } from "yup";
const newContestSchema = object().shape({
  name: string().required("Vyplňte název práce"),
  email: string()
    .email("Invalidní email")
    .required("Vyplňte email autora"),
  subject: string().required("Vyberte předmět"),
});

// Components
export default {
  name: "AddWorkPanel",
  methods: {
    saveWork() {
      this.validate("name");
      this.validate("email");
      this.validateFile();
      if (!(this.errors.name || this.errors.email || this.errors.file)) {
        this.$store.dispatch("newWork", {
          name: this.data.name,
          file: this.data.file,
          // TODO  Check google domain for email and fill authorName
          authorName: this.isAdmin ? this.data.authorEmail : this.author,
          authorEmail: this.data.authorEmail,
          contestID: this.contestID,
          keywords: this.tags,
          maturita: this.isMaturita,
          subject: this.data.subject,
        });
        this.$buefy.toast.open({
          duration: 5000,
          message: `Soutěžní práce byla úspěšně nahrána`,
          position: "is-top",
          type: "is-primary",
        });

        this.updateTags();

        this.$router.push("/");
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
    updateTags() {
      const newTags = [];
      this.tags.forEach((preTag) => {
        const tag =
          preTag
            .trim()
            .charAt(0)
            .toUpperCase() +
          preTag
            .trim()
            .slice(1)
            .toLowerCase();
        if (!this.allTags.includes(tag)) {
          newTags.push(tag);
        }
      });
      if (newTags.length !== 0) {
        this.$store.dispatch("addNewTags", newTags);
      }
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
          message: `Nahrajte soutěžní práci`,
          position: "is-bottom",
          type: "is-danger",
        });
      } else {
        if (
          this.data.file.type == "application/pdf" ||
          this.data.file.type == "application/vnd.oasis.opendocument.text" ||
          this.data.file.type ==
            "application / vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          this.errors.file = "";
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: `Nevhodný formát. Podporovanými formáty jsou PDF, DOCX a ODT`,
            position: "is-bottom",
            type: "is-danger",
          });
          this.errors.file = "Invalid format";
          this.data.file = null;
        }
      }
    },
    getFilteredTags(text) {
      const normalizedText = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      this.filteredTags = this.allTags.filter((keyword) => {
        return keyword
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(normalizedText);
      });
    },
  },
  computed: {
    author() {
      return this.$store.getters.getName;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
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
    allTags() {
      return this.$store.getters.getTags;
    },
  },
  mounted() {
    if (!this.isAdmin) {
      this.data.email = this.authorEmail;
    }
    this.filteredTags = this.allTags;
  },
  data() {
    return {
      errors: { name: "", email: "", file: "", subject: "" },
      checked: { name: "", email: "", file: "", subject: "" },
      data: { name: "", email: "", file: null, isMaturita: false, subject: "" },
      authorName: "",
      tags: [],
      // Load the tags from backend
      filteredTags: [],
    };
  },
};
</script>

<style scoped></style>
