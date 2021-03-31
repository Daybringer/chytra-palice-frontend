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
        <!-- Subject -->
        <b-field
          label="Předmět"
          :label-position="'on-border'"
          :message="errors.class"
          :type="errors.class ? 'is-danger' : checked.class ? 'is-success' : ''"
        >
          <b-select
            v-model="data.class"
            placeholder="Vyberte třídu"
            @input="validate('class')"
            @blur="validate('class')"
          >
            <option v-for="Class in classList" :key="Class" :value="Class">
              {{ Class }}
            </option>
          </b-select>
        </b-field>
        <!-- Maturita project -->
        <b-field>
          <b-checkbox
            :disabled="
              !(
                data.class == 'R8' ||
                data.class == '4A' ||
                data.class == '4B' ||
                data.class == '4C'
              )
            "
            v-model="data.isMaturita"
          >
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
  class: string().required("Vyberte třídu"),
});

// Components
export default {
  name: "AddWorkPanel",
  methods: {
    saveWork() {
      this.validate("name");
      this.validate("email");
      this.validate("subject");
      this.validate("class");
      this.validateFile();
      if (
        !(
          this.errors.name ||
          this.errors.email ||
          this.errors.subject ||
          this.errors.file ||
          this.errors.class
        )
      ) {
        const fileType = "odt";
        this.$store
          .dispatch(
            "createWork",
            {
              name: this.data.name.trim(),
              fileType: fileType,
              authorName: this.isAdmin ? this.authorName.trim() : this.author,
              authorEmail: this.data.email.trim(),
              contestID: Number(this.contestID),
              keywords: this.formatKeywords(this.tags),
              maturita: this.data.isMaturita,
              subject: this.data.subject,
            },
            this.data.file
          )
          .then((id) => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Soutěžní práce byla úspěšně nahrána`,
              position: "is-top",
              type: "is-primary",
            });

            this.$router.push(`/prace/${id}`);
          })
          .catch((err) => {
            console.log(err);
            this.$buefy.toast.open({
              duration: 5000,
              message: `${err}`,
              position: "is-top",
              type: "is-primary",
            });
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
    formatKeywords(keywords) {
      const newKeywords = [];
      keywords.forEach((keyword) => {
        const newKeyword =
          keyword
            .trim()
            .charAt(0)
            .toUpperCase() +
          keyword
            .trim()
            .slice(1)
            .toLowerCase();
        newKeywords.push(newKeyword);
      });
      return newKeywords;
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
      classList: [
        "R1",
        "R2",
        "R3",
        "R4",
        "R5",
        "R6",
        "R7",
        "R8",
        "1A",
        "1B",
        "1C",
        "2A",
        "2B",
        "2C",
        "3A",
        "3B",
        "3C",
        "4A",
        "4B",
        "4C",
      ],
      errors: { name: "", email: "", file: "", subject: "", class: "" },
      checked: { name: "", email: "", file: "", subject: "", class: "" },
      data: {
        name: "",
        email: "",
        file: null,
        isMaturita: false,
        subject: "",
        class: "",
      },
      authorName: "",
      tags: [],
      // Load the tags from backend
      filteredTags: [],
    };
  },
};
</script>

<style scoped></style>
