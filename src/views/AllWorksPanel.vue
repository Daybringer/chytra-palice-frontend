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
              <b-field label="Název soutěže" label-position="on-border">
                <b-input
                  name="contest"
                  placeholder="Hledat..."
                  type="search"
                  icon-pack="fas"
                  icon="search"
                  v-model="search.contest"
                  v-debounce="filter"
                >
                </b-input>
              </b-field>
            </div>
            <div class="block">
              <b-field label="Kategorie">
                <b-checkbox v-model="search.categories" native-value="palice">
                  Chytrá palice
                </b-checkbox>
                <b-checkbox v-model="search.categories" native-value="palicka">
                  Chytrá palička
                </b-checkbox>
                <b-checkbox v-model="search.categories" native-value="other">
                  Jiné kategorie
                </b-checkbox>
              </b-field>
            </div>
            <b-field label="Umístění">
              <b-checkbox v-model="search.placings" native-value="1">
                1. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.placings" native-value="2">
                2. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.placings" native-value="3">
                3. místo
              </b-checkbox>
            </b-field>
            <b-field>
              <b-checkbox v-model="search.placings" native-value="4">
                Bez umístění
              </b-checkbox>
            </b-field>
          </div>
        </transition>
      </div>
      <!-- Table -->
      <div class="block">
        <b-table
          :data="filteredWorks"
          striped
          hoverable
          mobile-cards
          @click="tableClick"
          :default-sort="['id', 'desc']"
          class="is-clickable"
        >
          <b-table-column
            field="ID"
            label="ID"
            width="40"
            numeric
            v-slot="props"
            sortable
          >
            {{ props.row.ID }}
          </b-table-column>
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
            field="contest"
            label="Soutěž"
            v-slot="props"
            sortable
            centered
          >
            {{ props.row.contest }}
          </b-table-column>
          <b-table-column
            field="category"
            label="Kategorie"
            v-slot="props"
            sortable
            centered
          >
            {{ props.row.category }}
          </b-table-column>
          <b-table-column
            field="standing"
            width="40"
            label="Umístění"
            centered
            numeric
            v-slot="props"
            sortable
          >
            {{ props.row.id }}
          </b-table-column>
          <b-table-column
            field="date"
            numeric
            label="Přidáno"
            v-slot="props"
            sortable
            centered
          >
            {{ new Date(props.row.dateAdded).toLocaleDateString() }}
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
      console.log("filtering");
      const filteredWorks = [];
      this.works.forEach((work) => {
        if (this.search.name) {
          if (!this.strContains(work.name, this.search.name)) return;
        }
        if (this.advancedSearch) {
          if (this.search.author) {
            if (!this.strContains(work.author, this.search.author)) return;
          }
          if (this.search.contest) {
            if (!this.strContains(work.contest, this.search.contest)) return;
          }
        }
        filteredWorks.push(work);
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
  },
  computed: {
    works() {
      const works = this.$store.getters.getWorks;
      works.map((work) => {
        const contest = this.$store.getters.getContestByID(work.contestID);
        work.contest = contest.name;
        work.category =
          contest.category === "palice"
            ? "Palice"
            : contest.category === "palicka"
            ? "Palička"
            : "-";
      });
      return works.filter((work) => {
        if (work) {
          return work.approvedState === "approved";
        } else {
          return false;
        }
      });
    },
  },
  beforeMount() {
    this.filteredWorks = this.works;
  },
  data() {
    return {
      filteredWorks: [],
      search: {
        name: "",
        author: "",
        contest: "",
        categories: ["palice", "palicka", "other"],
        placings: ["1", "2", "3", "4"],
        dateFrom: "",
        dateTo: "",
      },
      advancedSearch: false,
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
