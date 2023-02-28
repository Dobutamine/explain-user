import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    apiUrl: "http://localhost:8081",
    diagramComponentTypes: [
      "BloodCompartment",
      "BloodConnector",
      "BloodPump",
      "GasCompartment",
      "GasConnector",
      "Shunt",
      "Container",
      "GasExchanger",
      "Oxygenator",
    ],
  }),

  getters: {},

  actions: {},
});
