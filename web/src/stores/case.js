import { defineStore } from "pinia";

export const useCaseStore = defineStore("case", {
  state: () => ({
    name: "",
    description: "",
    scripts: [],
    definition: "",
    shared: false,
    protected: false,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
  }),

  getters: {},

  actions: {},
});
