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

      <b-carousel
        v-if="items.length !== 0"
        :autoplay="false"
        with-carousel-list
        :indicator="false"
        :overlay="gallery"
        @click="switchGallery(true)"
      >
        <b-carousel-item v-for="(item, i) in items" :key="i">
          <figure class="image">
            <b-image responsive ratio="5by3" :src="item.image" />
          </figure>
        </b-carousel-item>
        <span
          v-if="gallery"
          @click="switchGallery(false)"
          class="modal-close is-large"
        />
        <template #list="props">
          <b-carousel-list
            v-model="props.active"
            :data="items"
            v-bind="al"
            @switch="props.switch($event, false)"
            as-indicator
          />
        </template>
        <template #overlay>
          <div class="has-text-centered has-text-white">
            Hello i'am overlay!
          </div>
        </template>
      </b-carousel>
      <div class=" block">
        <b-field>
          <b-upload
            accept=".jpg,.png"
            expanded
            v-model="imageRaw"
            @input="formatImages"
            drag-drop
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
  props: {
    type: String, // 'create' || 'edit'
    id: String, // when type === edit: id of post
  },
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
      // Search
      workName: "",
      selectedWork: null,
      // Images
      imagesRaw: [],
      imageRaw: null,
      items: [], // {name:"",url:""}
      works: null,
      filteredWorks: [],
      //
      gallery: false,
      al: {
        hasGrayscale: true,
        itemsToShow: 2,
        breakpoints: {
          768: {
            hasGrayscale: false,
            itemsToShow: 4,
          },
          960: {
            hasGrayscale: true,
            itemsToShow: 6,
          },
        },
      },
    };
  },
  methods: {
    // TODO
    async savePost() {
      this.title = this.title.trim();
      this.content = this.content.trim();

      if (this.title && this.content) {
        if (this.type === "edit") {
          this.$store.dispatch("editPost", {
            id: this.id,
            title: this.title,
            content: this.content,
          });
          this.$router.push(`/clanek/${this.id}`);
        } else {
          this.$store.dispatch("newPost", {
            title: this.title,
            content: this.content,
          });
          this.$router.push(`/`);
        }

        this.$buefy.toast.open({
          duration: 5000,
          message: `Článek byl úspěšně uložen`,
          position: "is-top",
          type: "is-success",
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
    formatImages() {
      const reader = new FileReader();
      let url = "";
      reader.addEventListener(
        "load",
        () => {
          // convert image file to base64 string
          url = reader.result;
          this.items.push({ title: this.imageRaw.name, image: url });
        },
        false
      );
      reader.readAsDataURL(this.imageRaw);
    },
    switchGallery(value) {
      this.gallery = value;
      if (value) {
        return document.documentElement.classList.add("is-clipped");
      } else {
        return document.documentElement.classList.remove("is-clipped");
      }
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

<style scoped>
.mainImageContainer {
  height: 100px;
  width: 100px;
  border: 2px solid gray;
}
.is-active .al img {
  filter: grayscale(0%);
}
.al img {
  filter: grayscale(100%);
}
</style>
