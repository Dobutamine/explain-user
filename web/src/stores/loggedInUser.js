import { defineStore } from "pinia";

export const useLoggedInUser = defineStore("loggedInUser", {
  state: () => ({
    id: "",
    name: "",
    email: "",
    token: "",
    isAdmin: false,
    loggedIn: true,
  }),

  getters: {},

  actions: {
    resetUser() {
      this.id = "";
      this.name = "";
      this.token = "";
      this.isAdmin = false;
      this.loggedIn = false;
    },
  },
});
