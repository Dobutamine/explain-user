import { defineStore } from "pinia";

export const useScriptStore = defineStore("script", {
  state: () => ({
    user: "",
    name: "default",
    script: [
      {
        m: "AA",
        p: "UVol",
        v: 0.01,
        o: 0.0,
        at: 1.0,
        it: 5.0,
        state: "pending",
      },
    ],
    shared: false,
    protected: false,
    dateCreated: Date.now(),
    dateUpdated: Date.now(),
  }),

  getters: {},

  actions: {},
});
