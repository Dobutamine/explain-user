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
import { explain } from "../boot/explain";
import { useUserStore } from "src/stores/user";
import { useGeneralStore } from "../stores/general";
import { useConfigStore } from "../stores/config";
import { useEngineStore } from "../stores/engine";
import { useDefinitionStore } from "../stores/definition";
//import axios from "axios";
/* eslint-disable */
export default {
  setup() {
    const user = useUserStore();
    const general = useGeneralStore();
    const config = useConfigStore();
    const engine = useEngineStore();
    const definition = useDefinitionStore();
    return {
      user,
      general,
      config,
      engine,
      definition,
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
      get_config: null,
      log_in: null,
      get_engine: null,
      get_definition: null,
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
    LogIn() {
      this.user.logIn(this.general.apiUrl, this.name, this.password);
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
    startModel() {
      // initialize the modelengine
      explain.initModelEngine(this.engine.getEngineObject());

      // inject the explain definition into the model engine
      explain.injectModelDefinition(this.definition.getDefinitionObject());

      // show main window
      this.$router.push("/main");
    },
    pressedEnter() {
      if (this.newUserEntry) {
        this.registerNewUser();
      } else {
        this.LogIn();
      }
    },
  },
  beforeUnmount() {
    this.log_in();
    this.get_config();
    this.get_engine();
    this.get_definition();
  },
  mounted() {
    this.$q.dark.set(true);

    // define a login request handler
    this.log_in = this.user.$onAction(({ name, after }) => {
      if (name === "logIn") {
        after((result) => {
          if (result) {
            this.errorText = "";
            // get the config file
            this.config.getConfig(
              this.general.apiUrl,
              this.user.default_engine,
              this.user.default_engine_name,
              this.user.default_config,
              this.user.name,
              this.user.token
            );
            console.log("User logged in.");
          } else {
            this.errorText = "Invalid username or password!";
          }
        });
      }
    });

    // define a get config handler
    this.get_config = this.config.$onAction(({ name, after }) => {
      if (name === "getConfig") {
        after((result) => {
          if (result) {
            this.errorText = "";
            console.log("Configuration file loaded.");
            // get the right explain engine
            this.engine.getEngine(
              this.general.apiUrl,
              this.config.engine_version,
              this.config.engine_name,
              this.user.token
            );
          } else {
            this.errorText = "Can't find configuration settings on server!";
          }
        });
      }
    });

    this.get_engine = this.engine.$onAction(({ name, after }) => {
      if (name === "getEngine") {
        after((result) => {
          if (result) {
            this.errorText = "";
            console.log("Explain engine loaded.");
            // get model definition
            this.definition.getDefinition(
              this.general.apiUrl,
              this.user.default_engine,
              this.user.default_engine_name,
              this.user.default_definition,
              this.user.name,
              this.user.token
            );
          } else {
            this.errorText = "Can't find explain engine on server!";
          }
        });
      }
    });

    this.get_definition = this.definition.$onAction(({ name, after }) => {
      if (name === "getDefinition") {
        after((result) => {
          if (result) {
            this.errorText = "";
            console.log("Explain model definition loaded.");
            this.startModel();
          } else {
            this.errorText = "Can't find explain model definition on server!";
          }
        });
      }
    });

    // override login for developement development
    this.password = "y5qkqjed";
    this.name = "Timothy Antonius";
    this.user.logIn(this.general.apiUrl, this.name, this.password);
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
