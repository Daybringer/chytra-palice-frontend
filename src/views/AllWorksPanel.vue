<template>
  <div class="container my-6">
    <div class="box">
      <b-field class="mb-5">
        <b-switch v-model="advancedSearch">Rozšířené vyhledavání</b-switch>
      </b-field>
      <!-- Search fields -->
      <div class="block">
        <b-field label="Název práce" label-position="on-border">
          <b-input
            name="name"
            placeholder="Hledat..."
            type="search"
            icon-pack="fas"
            icon="search"
            v-model="search.name"
            v-debounce="filter"
          >
          </b-input>
        </b-field>
        <transition name="slide-up">
          <div v-show="advancedSearch">
            <div class="field">
              <b-field
                label="Autor
            "
                label-position="on-border"
              >
                <b-input
                  name="author"
                  placeholder="Hledat..."
                  type="search"
                  icon-pack="fas"
                  icon="search"
                  v-model="search.author"
                  v-debounce="filter"
                >
                </b-input>
              </b-field>
              <b-field label="Klíčová slova" :label-position="'on-border'">
                <b-taginput
                  v-model="keywords"
                  :data="filteredKeywords"
                  autocomplete
                  attached
                  :open-on-focus="true"
                  icon="label"
                  placeholder="Hledat dle klíčových slov"
                  @typing="getFilteredKeywords"
                  @input="filter"
                >
                </b-taginput>
              </b-field>
            </div>
            <b-field label="Předmět" :label-position="'on-border'">
              <b-select
                v-model="search.subject"
                placeholder="Vyberte předmět"
                @input="filter"
              >
                <option value="all">
                  -
                </option>
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
            <!-- <b-field label="Umístění">
              <b-checkbox v-model="search.standings[0]">
                1. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.standings[1]">
                2. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.standings[2]">
                3. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.standings[3]">
                Bez umístění
              </b-checkbox>
            </b-field> -->
            <b-field>
              <b-checkbox v-model="search.maturita" @input="filter">
                <b>Maturitní práce</b>
              </b-checkbox>
            </b-field>
          </div>
        </transition>
      </div>
      <!-- Table -->
      <div class="block">
        <b-table
          :data="filteredWorks"
          :paginated="true"
          :per-page="15"
          striped
          hoverable
          mobile-cards
          @click="tableClick"
          :default-sort="['id', 'desc']"
          class="is-clickable"
        >
          <b-table-column
            field="name"
            label="Název práce"
            v-slot="props"
            sortable
            centered
          >
            {{ props.row.name }}
          </b-table-column>
          <b-table-column
            field="author"
            label="Autor"
            v-slot="props"
            sortable
            centered
          >
            {{ props.row.authorName }}
          </b-table-column>

          <b-table-column
            field="class"
            label="Třída"
            centered
            numeric
            v-slot="props"
            sortable
          >
            {{ props.row.class }}
          </b-table-column>
          <b-table-column
            field="date"
            numeric
            label="Přidáno"
            v-slot="props"
            sortable
            centered
          >
            {{ new Date(+props.row.dateAdded).toLocaleDateString("cs") }}
          </b-table-column>
        </b-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AllWorksPanel",
  methods: {
    tableClick(row) {
      this.$router.push(`/prace/${row.ID}`);
    },
    filter() {
      const filteredWorks = [];
      this.works.forEach((work) => {
        let passed = true;
        if (this.search.name) {
          if (!this.strContains(work.name, this.search.name)) passed = false;
        }
        if (this.advancedSearch) {
          if (this.search.author) {
            if (!this.strContains(work.authorName, this.search.author))
              passed = false;
          }

          this.keywords.forEach((keyword) => {
            if (!this.work.keywords.includes(keyword)) passed = false;
          });

          if (this.search.maturita && !work.isMaturitaProject) passed = false;

          if (this.search.subject !== "all")
            if (this.search.subject !== work.subject) return false;

          if (passed) filteredWorks.push(work);
        }
      });
      this.filteredWorks = filteredWorks;
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
    getFilteredKeywords(text) {
      this.filteredKeywords = this.allKeywords.filter((keyword) => {
        return this.strContains(keyword, text);
      });
    },
    async fetchWorks() {
      this.$store
        .dispatch("getAllWorks", {
          approvedState: "approved",
        })
        .then((works) => {
          this.works = works;
          this.filteredWorks = works;
        })
        .catch((err) => console.log(err));
    },
    async fetchKeywords() {
      this.allKeywords = await this.$store.dispatch("getAllKeywords");
      this.filteredKeywords = this.allKeywords;
    },
  },
  created() {
    this.fetchWorks();
    this.fetchKeywords();
  },
  data() {
    return {
      works: null,
      filteredWorks: [],
      search: {
        name: "",
        author: "",
        standings: [true, true, true, true],
        subject: "all",
        maturita: false,
      },
      advancedSearch: false,
      keywords: [],
      filteredKeywords: [],
      allKeywords: [],
    };
  },
};
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s ease;
}

.slide-up-leave-active {
  transition: all 0.05s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
