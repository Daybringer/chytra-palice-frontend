<template>
  <div class="container my-6">
    <div class="box p-6-desktop">
      <h1 class="title">Vypsání nové soutěže</h1>
      <b-field
        label="Název soutěže"
        :message="errors.name"
        :type="errors.name ? 'is-danger' : checked.name ? 'is-success' : ''"
        :label-position="'on-border'"
      >
        <b-input
          placeholder="Název soutěže"
          v-model.trim="contest.name"
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
          v-model="contest.endDate"
          :locale="'cs-CZ'"
          :min-date="dateToday"
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
          v-model="contest.category"
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
          v-model.trim="contest.description"
          type="textarea"
          @input="validate('description')"
          @blur="validate('description')"
        ></b-input>
      </b-field>
      <button
        @click="saveContest"
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
    .min(3, "Název soutěže je moc krátký (3-30 znaků)")
    .max(30, "Název soutěže je moc dlouhý (3-30 znaků)"),
  endDate: date()
    .required("Vyplňte datum uzávěrky")
    .typeError("Vyplňte datum uzávěrky"),
  category: string().matches(/palice|palicka|other/, {
    message: "Zvolte kategorii",
    excludeEmptyString: false,
  }),
  description: string().max(150),
});

export default {
  name: "NewContestPanel",
  data() {
    return {
      contest: {
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
    };
  },
  methods: {
    async saveContest() {
      await this.validateAll();
      if (
        !(
          this.errors.name ||
          this.errors.endDate ||
          this.errors.category ||
          this.errors.description
        )
      ) {
        this.$store
          .dispatch("newContest", {
            name: this.contest.name,
            endDate: this.contest.endDate,
            category: this.contest.category,
            description: this.contest.description,
          })
          .then((id) => {
            this.$buefy.toast.open({
              duration: 5000,
              message: `Soutěž byla uložena`,
              position: "is-top",
              type: "is-primary",
            });

            this.$router.push(`/souteze/${id}`);
          });
      }
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
        .validateAt(field, this.contest)
        .then(() => {
          this.errors[field] = "";
          this.checked[field] = true;
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
  },
  computed: {
    dateToday() {
      return new Date();
    },
  },
};
</script>

<style scoped>
.overflow-visible {
  overflow: visible;
}
</style>
