import { defineStore } from "pinia";

export const useDefinitionStore = defineStore("definition", {
  state: () => ({
    engine_version: 0.1,
    name: "",
    description: "",
    weight: 3.3,
    user: "",
    protected: false,
    shared: true,
    models: {},
  }),

  getters: {},

  actions: {
    getDefinitionObject() {
      return {
        EngineVersion: this.engine_version,
        Name: this.name,
        Description: this.description,
        Weight: parseFloat(this.weight),
        ModelTimeTotal: 0.0,
        Models: this.models,
      };
    },
    async getDefinition(
      apiUrl,
      engine_version,
      definition_name,
      user_name,
      token
    ) {
      const url = `${apiUrl}/api/definitions/get_definition?token=${token}`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: engine_version,
          name: definition_name,
          user: user_name,
        }),
      });

      if (response.status === 200) {
        let data = await response.json();
        this.engine_version = data.engine_version;
        this.name = data.name;
        this.description = data.description;
        this.weight = data.weight;
        this.user = data.user;
        this.protected = data.protected;
        this.shared = data.shared;
        this.models = data.models;
        return true;
      } else {
        return false;
      }
    },
  },
});
