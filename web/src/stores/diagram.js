import { defineStore } from "pinia";

export const useDiagramStore = defineStore("diagram", {
  state: () => ({
    circulation: {
      settings: {
        backgroundColor: 0x333333,
        editingMode: 1,
        scaling: 0.1,
        gridSize: 10.0,
        snapToGrid: true,
        skeleton: true,
      },
      components: {
        bloodCompartments: {
          LV: {
            label: "LV",
            models: ["LV"],
            x: 100,
            y: 100,
            scale: 0.05,
            visible: true,
          },
          RV: {
            label: "RV",
            models: ["RV"],
            x: 100,
            y: 100,
            scale: 0.05,
            visible: true,
          },
          LA: {
            label: "LA",
            models: ["LA"],
            x: 100,
            y: 100,
            scale: 0.05,
            visible: true,
          },
          RA: {
            label: "RA",
            models: ["RA"],
            x: 100,
            y: 100,
            scale: 0.05,
            visible: true,
          },
        },
        containers: {},
        bloodConnectors: {},
        gasCompartments: {},
        gasConnectors: {},
        exchangers: {},
        diffusors: {},
        valves: {
          RA_RV: {
            label: "RA_RV",
            models: ["RA_RV"],
            dbcFrom: "LV",
            dbcTo: "RV",
            valve: true,
            visiable: true,
          },
          RV_PA: {
            label: "RV_PA",
            models: ["RV_PA"],
            dbcFrom: "RV",
            dbcTo: "PA",
            valve: true,
            visiable: true,
          },
          LA_LV: {
            label: "LA_LV",
            models: ["LA_LV"],
            dbcFrom: "LA",
            dbcTo: "LV",
            valve: true,
            visiable: true,
          },
          LV_AA: {
            label: "LV_AA",
            models: ["LV_AA"],
            dbcFrom: "LV",
            dbcTo: "AA",
            valve: true,
            visiable: true,
          },
        },
        pumps: {},
      },
    },
  }),

  getters: {},

  actions: {},
});
