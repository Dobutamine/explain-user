import { defineStore } from "pinia";
import { explain } from "src/boot/explain";

export const useDiagramStore = defineStore("diagram", {
  state: () => ({
    engine_version: 0.1,
    user: "Timothy Antonius",
    name: "default",
    definition: "normal neonate",
    protected: false,
    shared: false,
    settings: {
      backgroundColor: 0x333333,
      editingMode: 1,
      scaling: 0.1,
      grid: false,
      gridSize: 10.0,
      snapToGrid: true,
      skeleton: true,
      skeletonColor: 0x444444,
      pathColor: 0x444444,
      radius: 0.6,
      componentTypes: [
        "BloodCompartment",
        "BloodConnector",
        "GasCompartment",
        "GasConnector",
        "Container",
        "GasExchanger",
        "Shunt",
      ],
    },

    components: {},
  }),

  getters: {},

  actions: {
    updateDataCollector(propsArray) {
      // get all the props from charts
      let propIdsDiagram = [];

      // diagrams
      Object.values(this.diagram.components).forEach((component) => {
        switch (component.compType) {
          case "BloodCompartment":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Vol");
              propIdsDiagram.push(model + ".To2");
            });
            break;
          case "BloodConnector":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Flow");
            });
            break;
          case "Shunt":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Flow");
            });
            break;
          case "Container":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Vol");
            });
            break;
          case "GasCompartment":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Vol");
              propIdsDiagram.push(model + ".Po2");
            });
            break;
          case "GasConnector":
            component.models.forEach((model) => {
              propIdsDiagram.push(model + ".Flow");
            });
            break;
          case "GasExchanger":
            component.models.forEach((model) => {
              if (component.gas === "O2") {
                propIdsDiagram.push(model + ".FluxO2");
              }
              if (component.gas === "Co2") {
                propIdsDiagram.push(model + ".FluxCo2");
              }
            });
            break;
        }
      });
      explain.watchModelProperties(propIdsDiagram);
    },
  },
});
