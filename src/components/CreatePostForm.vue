<template>
  <div v-if="works" class="box p-6-desktop">
    <h1 class="title">
      Nový článek
    </h1>
    <form @submit.prevent="savePost">
      <div class="field block">
        <label class="label">Název článku</label>
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
      <b-field class="mb-3" label="Reference na práci">
        <b-autocomplete
          rounded
          v-model="workName"
          :data="filteredWorks"
          placeholder="Zadejte název práce"
          icon="magnify"
          dropdown-position="bottom"
          @select="(work) => (selectedWork = work)"
          @input="filterWorks"
        >
          <template #empty>Práce nenalezena</template>
        </b-autocomplete>
        <b-button @click="generateReference" class="button "
          >Vygenerovat referenci</b-button
        >
      </b-field>

      <div class=" block">
        <b-field>
          <b-upload
            accept=".jpg,.png"
            expanded
            v-model="images"
            drag-drop
            multiple
          >
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon icon="image" size="is-large"> </b-icon>
                </p>
                <p>Nahrajte obrázky</p>
              </div>
            </section>
          </b-upload>
        </b-field>
      </div>
      <div class="tags">
        <span
          v-for="(image, index) in images"
          :key="index"
          class="tag is-primary"
        >
          {{ image.name }}
          <button
            class="delete is-small"
            type="button"
            @click="images.splice(index, 1)"
          ></button>
        </span>
      </div>
      <div class="buttons">
        <button type="submit" class="button is-primary has-text-weight-medium">
          Uložit článek
        </button>
      </div>
    </form>
  </div>
</template>

<script>
// Components
import { VueEditor } from "vue2-editor";
export default {
  name: "CreatePostFormular",
  components: { VueEditor },
  data() {
    return {
      toolbarSettings: [
        [{ header: [false, 3] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        ["link"],
        ["clean"],
      ],
      title: "",
      content: "",
      images: [],
      // Search
      workName: "",
      selectedWork: null,
      works: null,
      filteredWorks: [],
    };
  },
  methods: {
    // TODO
    async savePost() {
      this.title = this.title.trim();
      this.content = this.content.trim();

      if (this.title && this.content) {
        this.$store
          .dispatch("createPost", {
            createPostDto: { title: this.title, content: this.content },
            images: this.images,
          })
          .then((id) => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Článek byl úspěšně uložen`,
              position: "is-top",
              type: "is-success",
            });
            setTimeout(() => {
              this.$router.push(`/clanek/${id}`);
            }, 3500);
          });
      } else {
        this.$buefy.toast.open({
          duration: 5000,
          message: `Článek nesmí být prázdný`,
          position: "is-top",
          type: "is-danger",
        });
      }
    },
    async fetchWorks() {
      this.$store
        .dispatch("getAllWorks", {
          approvedState: "approved",
        })
        .then((works) => {
          this.works = works;
          this.filteredWorks = works.map((work) => work.name);
        })
        .catch((err) => console.log(err));
    },
    generateReference() {
      if (this.selectedWork) {
        const workID = this.works.filter(
          (work) => work.name === this.selectedWork
        )[0].id;

        const base =
          process.env.NODE_ENV === "production"
            ? `http://palice.gjk.cz:8000`
            : `http://localhost:8080`;
        const reference = `${base}/prace/${workID}`;

        this.copyToClipboard(reference);

        this.$buefy.toast.open({
          duration: 5000,
          message: `Reference byla uložena do schránky`,
          position: "is-top",
          type: "is-info",
        });
        this.selectedWork = null;
        this.workName = "";
      }
    },
    filterWorks() {
      this.filteredWorks = this.works
        .filter((work) => this.strContains(work.name, this.workName))
        .map((work) => work.name);
    },
    strContains(string, substring) {
      const normalizedString = string
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const normalizedSubstring = substring
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return normalizedString.includes(normalizedSubstring);
    },
    copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
      } else if (
        document.queryCommandSupported &&
        document.queryCommandSupported("copy")
      ) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        } catch (ex) {
          console.warn("Copy to clipboard failed.", ex);
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      }
    },
  },
  created() {
    this.fetchWorks();
  },
};
</script>

<style scoped></style>
