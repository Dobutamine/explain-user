import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    apiUrl: "http://localhost:8081",
  }),

  getters: {},

  actions: {},
});
