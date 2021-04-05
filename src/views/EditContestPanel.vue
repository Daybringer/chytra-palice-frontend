<template>
  <div class="container my-6">
    <div v-if="contest" class="box p-6-desktop">
      <h1 class="title">Úprava soutěže</h1>
      <b-message type="is-danger">
        Při změně data uzávěrky soutěže dojde k otevření soutěže a vyresetování
        současného pořadí vítězných prací.
      </b-message>
      <b-field
        label="Název soutěže"
        :message="errors.name"
        :type="errors.name ? 'is-danger' : checked.name ? 'is-success' : ''"
        :label-position="'on-border'"
      >
        <b-input
          placeholder="Název soutěže"
          v-model.trim="data.name"
          @input="validate('name')"
          @blur="validate('name')"
        ></b-input>
      </b-field>
      <b-field
        label="Datum uzávěrky"
        :label-position="'on-border'"
        :message="errors.endDate"
        :type="
          errors.endDate ? 'is-danger' : checked.endDate ? 'is-success' : ''
        "
      >
        <b-datepicker
          placeholder="Vyberte datum"
          v-model="data.endDate"
          :locale="'cs-CZ'"
          :min-date="new Date(contest.dateAdded)"
          icon="calendar-today"
          trap-focus
          @input="validate('endDate')"
          @blur="validate('endDate')"
        >
          <!-- TODO add custom validation text - Buefy doesn't allow messages on readonly elements -->
        </b-datepicker>
      </b-field>
      <b-field
        label="Kategorie"
        :label-position="'on-border'"
        :message="errors.category"
        :type="
          errors.category ? 'is-danger' : checked.category ? 'is-success' : ''
        "
      >
        <b-select
          v-model="data.category"
          placeholder="Vyberte kategorii"
          @input="validate('category')"
          @blur="validate('category')"
        >
          <option value="palice">
            Chytrá palice
          </option>
          <option value="palicka">
            Chytrá palička
          </option>
          <option value="other">
            Jiná kategorie
          </option>
        </b-select>
      </b-field>
      <b-field
        label="Popis soutěže"
        :label-position="'on-border'"
        :message="errors.description"
        :type="
          errors.description
            ? 'is-danger'
            : checked.description
            ? 'is-success'
            : ''
        "
      >
        <b-input
          placeholder="Popis soutěže..."
          maxlength="150"
          v-model.trim="data.description"
          type="textarea"
          @input="validate('description')"
          @blur="validate('description')"
        ></b-input>
      </b-field>
      <button
        @click="updateContest"
        class="button is-primary has-text-weight-medium"
      >
        Vypsat soutěž
      </button>
    </div>
  </div>
</template>

<script>
// yup validation
import { object, string, date } from "yup";
const newContestSchema = object().shape({
  name: string()
    .required("Vyplňte název soutěže")
    .min(3, "Název soutěže je moc krátký (3-60 znaků)")
    .max(60, "Název soutěže je moc dlouhý (3-60 znaků)"),
  endDate: date()
    .required("Vyplňte datum uzávěrky")
    .typeError("Vyplňte datum uzávěrky"),
  category: string().matches(/palice|palicka|other/, {
    message: "Zvolte kategorii",
    excludeEmptyString: false,
  }),
  description: string().max(200),
});

export default {
  name: "EdiContestPanel",
  data() {
    return {
      data: {
        name: "",
        endDate: null,
        category: "",
        description: "",
      },
      checked: {
        name: false,
        endDate: false,
        category: false,
        description: false,
      },
      errors: {
        name: "",
        endDate: "",
        category: "",
        description: "",
      },
      contest: null,
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    async updateContest() {
      await this.validateAll();
      if (
        !(
          this.errors.name ||
          this.errors.endDate ||
          this.errors.category ||
          this.errors.description
        )
      ) {
        const endDateNum = new Date(this.data.endDate).getTime();
        this.$store
          .dispatch("updateContest", {
            updateContestDto: {
              name: this.data.name.trim(),
              dateEnding: endDateNum,
              category: this.data.category,
              description: this.data.description.trim(),
            },
            id: this.id,
          })
          .then((id) => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Soutěž byla uložena`,
              position: "is-top",
              type: "is-primary",
            });

            this.$router.push(`/souteze/${id}`);
          })
          .catch((err) => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `${err}`,
              position: "is-top",
              type: "is-warning",
            });
          });
      }
    },
    async fetchContestUnfiltered() {
      this.$store
        .dispatch("getContestByIDUnfiltered", this.id)
        .then((contest) => {
          this.contest = contest;
          this.data.name = contest.name;
          this.data.endDate = new Date(contest.dateEnding);
          this.data.category = contest.category;
          this.data.description = contest.description;
        })
        .catch(() => {
          this.$router.push({ path: "/", query: { err: "conNotFound" } });
        });
    },
    async validateAll() {
      await Promise.all([
        this.validate("name"),
        this.validate("endDate"),
        this.validate("category"),
        this.validate("description"),
      ]);
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
  },
  created() {
    this.fetchContestUnfiltered();
  },
};
</script>

<style scoped>
.overflow-visible {
  overflow: visible;
}
</style>
