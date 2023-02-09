import { defineStore } from "pinia";

export const useInterventionStore = defineStore("intervention", {
  state: () => ({
    name: "",
    description: "",
    script: [],
    definition: "",
    shared: false,
    protected: false,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
  }),

  getters: {},

  actions: {},
});
