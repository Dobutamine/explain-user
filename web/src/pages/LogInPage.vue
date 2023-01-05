<template>
  <q-page padding class="bg-black">
    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-input
          v-model="name"
          :value="name"
          stack-label
          autofocus
          label="USER NAME"
        >
        </q-input>
      </div>
      <div class="col text-center"></div>
    </div>

    <div v-if="newUserEntry" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-input
          v-model="email"
          type="email"
          :value="email"
          stack-label
          autofocus
          label="EMAIL"
        >
        </q-input>
      </div>
      <div class="col text-center"></div>
    </div>

    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-form @submit="pressedEnter">
          <q-input
            v-model="password"
            type="password"
            :value="id"
            stack-label
            label="PASSWORD"
          >
          </q-input>
        </q-form>
      </div>
      <div class="col text-center"></div>
    </div>

    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col2 text-center">
        <q-btn
          v-if="!newUserEntry"
          class="q-pl-lg q-pr-lg bg-blue-10"
          @click="LogIn"
          style="width: 150px"
          size="sm"
          >LOG IN</q-btn
        >
        <q-btn
          class="q-ml-lg q-pl-lg q-pr-lg bg-blue-10"
          @click="showRegistration"
          style="width: 150px"
          size="sm"
          >REGISTER</q-btn
        >
        <q-btn
          v-if="newUserEntry"
          class="q-ml-lg q-pl-lg q-pr-lg bg-blue-10"
          @click="cancelRegistration"
          style="width: 150px"
          size="sm"
          >CANCEL</q-btn
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div v-if="login" class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <br />
        <p>
          This Explain user application is a free webapplication developed by
          Tim Antonius and Willem van Meurs.
        </p>

        <br />
        <a href="mailto: tajantonius@gmail.com"
          >Report comments or bugs here!</a
        >
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center">
        <q-card v-if="errorText != ''" class="q-pa-sm">
          {{ errorText }}
        </q-card>
      </div>
      <div class="col text-center"></div>
    </div>
    <div class="row justify-center items-start q-ma-lg">
      <div class="col text-center"></div>
      <div class="col text-center"></div>
    </div>
  </q-page>
</template>

<script>
import { explain } from "src/boot/explain";
import { PIXI } from "src/boot/pixi";
import { useLoggedInUser } from "stores/loggedInUser";
//import axios from "axios";
/* eslint-disable */
export default {
  setup() {
    const user = useLoggedInUser();
    return {
      user,
    };
  },
  data() {
    return {
      apiUrl: "http://localhost:8081",
      name: "",
      email: "",
      password: "",
      id: "",
      errorText: "",
      connected: false,
      showChoices: false,
      newUserEntry: false,
      login: true,
    };
  },
  methods: {
    showRegistration() {
      if (!this.newUserEntry) {
        this.newUserEntry = true;
      } else {
        this.registerNewUser();
      }
    },
    cancelRegistration() {
      this.id = "";
      this.newUserEntry = false;
      this.login = true;
      this.email = "";
      this.password = "";
      this.name = "";
    },
    LogOut() {
      this.id = "";
      this.showChoices = false;
      this.login = true;
      this.email = "";
      this.password = "";
      this.name = "";
      this.errorText = "";
    },
    pressedEnter() {
      if (this.newUserEntry) {
        this.registerNewUser();
      } else {
        this.LogIn();
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
    async LogIn() {
      const url = `${this.apiUrl}/api/auth`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: this.name, password: this.password }),
      });

      if (response.status === 200) {
        let data = await response.json();
        this.user.id = data._id;
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.isAdmin = data.isAdmin;
        this.user.token = data.token;
        this.user.loggedIn = true;
        this.$router.push("/main");
      } else {
        this.errorText = "Invalid username or password";
        // reset the password entry
        this.password = "";
        this.user.name = "";
        this.user.email = "";
        this.user.isAdmin = false;
        this.user.token = "";
        this.user.loggedIn = false;
      }
    },
  },
  mounted() {
    this.$q.dark.set(true);
    this.id = "";
    this.email = "";
    this.password = "";
    this.name = "";

    this.user.name = "";
    this.user.email = "";
    this.user.isAdmin = false;
    this.user.token = "";
    this.user.loggedIn = false;

    // override development
    this.password = "y5qkqjed";
    this.name = "Timothy Antonius";
    this.LogIn();
  },
};
</script>

<style>
a:link {
  color: grey;
  background-color: transparent;
  text-decoration: none;
}
a:visited {
  color: grey;
  background-color: transparent;
  text-decoration: none;
}
a:hover {
  color: red;
  background-color: transparent;
  text-decoration: underline;
}
a:active {
  color: yellow;
  background-color: transparent;
  text-decoration: underline;
}
</style>
