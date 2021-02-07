<template>
  <div class="container mt-4">
    <div class="card overflow-visible">
      <div class="box p-6">
        <h1 class="title">Vypsání nové soutěže</h1>
        <b-field
          label="Název soutěže"
          :message="'Ahoj'"
          :type="'is-danger'"
          :label-position="'on-border'"
        >
          <b-input placeholder="Název soutěže" v-model="contestName"></b-input>
        </b-field>
        <b-field label="Datum uzávěrky" :label-position="'on-border'">
          <b-datepicker
            placeholder="Vyberte datum"
            v-model="contestDateEnding"
            :locale="'cs-CZ'"
            :min-date="dateToday"
            icon="calendar-today"
            trap-focus
          >
          </b-datepicker>
        </b-field>
        <b-field label="Kategorie" :label-position="'on-border'">
          <b-select placeholder="Vyberte kategorii">
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
        <b-field label="Popis soutěže" :label-position="'on-border'">
          <b-input
            placeholder="Popis soutěže..."
            maxlength="150"
            v-model="contestDescription"
            type="textarea"
          ></b-input>
        </b-field>
        <button @click="saveContest" class="button is-primary">
          Vypsat soutěž
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewContestPanel",
  data() {
    return {
      contestName: "",
      contestDateEnding: "",
      contestDescription: "",
    };
  },
  methods: {
    saveContest() {
      console.log("save");
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
