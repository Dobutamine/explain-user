import { defineStore } from "pinia";
import { explain } from "src/boot/explain";

export const useDiagramStore = defineStore("diagram", {
  state: () => ({
    engine_version: 0.1,
    user: "",
    name: "",
    definition: "",
    protected: false,
    shared: false,
    settings: {
      backgroundColor: 3355443,
      editingMode: 1,
      scaling: 0.1,
      grid: false,
      gridSize: 10,
      snapToGrid: true,
      skeleton: true,
      skeletonColor: 4473924,
      pathColor: 4473924,
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
    async getDiagram(apiUrl, diagram_name, user_name, token) {
      // do a server request
      const url = `${apiUrl}/api/diagrams/get_diagram?token=${token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: diagram_name,
          user: user_name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        // process the result
        this.user = data.user;
        this.name = data.name;
        this.definition = data.definition;
        this.settings = data.settings;
        this.components = data.components;
        this.protected = data.protected;
        this.shared = data.shared;
        this.dateUpdated = data.dateUpdated;
        this.dateCreated = data.dateCreated;
        if (this.components === undefined) {
          this.components = {};
        }

        return true;
      } else {
        return false;
      }
    },
    updateDataCollector(propsArray) {
      // get all the props from charts
      let propIdsDiagram = [];

      // diagrams
      Object.values(this.components).forEach((component) => {
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
    clearDiagram() {
      this.engine_version = 0.1;
      this.user = "";
      this.name = "";
      this.definition = "";
      this.protected = false;
      this.shared = false;
      this.components = {};
      this.settings = {
        backgroundColor: 3355443,
        editingMode: 1,
        scaling: 0.1,
        grid: false,
        gridSize: 10,
        snapToGrid: true,
        skeleton: true,
        skeletonColor: 4473924,
        pathColor: 4473924,
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
      };
    },
  },
});
