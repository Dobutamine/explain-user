import { defineStore } from "pinia";

export const useScriptStore = defineStore("script", {
  state: () => ({
    user: "",
    name: "",
    script: [],
    shared: false,
    protected: false,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
  }),

  getters: {},

  actions: {},
});
