import { defineStore } from "pinia";

export const useScriptStore = defineStore("script", {
  state: () => ({
    scriptName: "basic default script",
    scriptLines: [
      {
        m: "AA",
        p: "UVol",
        v: 0.01,
        o: 0.0,
        at: 1.0,
        it: 5.0,
        state: "pending",
      },
      {
        m: "AA",
        p: "Vol",
        v: 0.01,
        o: 0.0,
        at: 1.0,
        it: 50.0,
        state: "pending",
      },
    ],
  }),

  getters: {},

  actions: {},
});
