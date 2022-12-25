import { defineStore } from "pinia";

export const useExplainStore = defineStore("explain", {
  state: () => ({
    userName: "Timothy",
  }),

  getters: {
    getUserName(state) {
      return state.userName;
    },
  },

  actions: {},
});
