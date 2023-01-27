import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: "",
    name: "",
    email: "",
    token: "",
    default_engine: 0.1,
    default_definition: "normal neonate",
    isAdmin: false,
    loggedIn: true,
  }),

  getters: {},

  actions: {
    resetUser() {
      this.id = "";
      this.name = "";
      this.token = "";
      this.default_engine = 0;
      this.default_definition = "";
      this.isAdmin = false;
      this.loggedIn = false;
    },
    async logIn(apiUrl, name, password) {
      const url = `${apiUrl}/api/auth`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, password: password }),
      });

      if (response.status === 200) {
        let data = await response.json();
        this.id = data._id;
        this.name = data.name;
        this.email = data.email;
        this.default_definition = data.default_definition;
        this.default_engine = parseFloat(data.default_engine);
        this.isAdmin = data.isAdmin;
        this.token = data.token;
        this.loggedIn = true;
        return true;
      } else {
        this.errorText = "Invalid username or password";
        // reset the password entry
        this.password = "";
        this.name = "";
        this.email = "";
        this.default_definition = "";
        this.default_engine = 0.0;
        this.isAdmin = false;
        this.token = "";
        this.loggedIn = false;
        return false;
      }
    },
    async registerNewUser() {
      const url = `${this.apiUrl}/api/users/new_user`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          password: this.password,
          isAdmin: false,
        }),
      });

      if (response.status === 200) {
        // login the user
        this.LogIn();
      } else {
        this.errorText = "Name or email already registered!";
        // reset the password entry
        this.password = "";
      }
    },
  },
});
