import { defineStore } from "pinia";

export const useEngineStore = defineStore("engine", {
  state: () => ({
    engine_version: 0,
    experimental_models: false,
    modeling_stepsize: 0.0,
    base_model_settings: {},
    core_models: {},
    experimental_models: {},
  }),

  getters: {},

  actions: {
    getEngineObject() {
      return {
        engine_version: this.engine_version,
        experimental_models: this.experimental_models,
        modeling_stepsize: this.modeling_stepsize,
        base_model_settings: this.base_model_settings,
        core_models: this.core_models,
        experimental_models: this.experimental_models,
      };
    },
    async getEngine(apiUrl, engine_version, token) {
      const url = `${apiUrl}/api/engines/get_engine?token=${token}`;
      // get the user login data
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: engine_version,
        }),
      });

      if (response.status === 200) {
        let data = await response.json();
        this.engine_version = data.engine_version;
        this.experimental_models = data.experimental_models;
        this.modeling_stepsize = data.modeling_stepsize;
        this.base_model_settings = data.base_model_settings;
        this.core_models = data.core_models;
        this.experimental_models = data.experimental_models;
        return true;
      } else {
        return false;
      }
    },
  },
});
