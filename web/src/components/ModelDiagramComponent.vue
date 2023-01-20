<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
      <q-icon
        v-if="collapsed"
        class="q-ml-sm q-mt-sm"
        name="fa-solid fa-chevron-down"
      ></q-icon>
      <q-icon
        v-if="!collapsed"
        class="q-ml-sm q-mt-sm"
        name="fa-solid fa-chevron-up"
      ></q-icon>
    </div>
    <div class="stage" :style="{ display: display }">
      <canvas id="stage"></canvas>
    </div>
    <div class="row justify-center">
      <q-btn-toggle
        color="grey-10"
        class="q-ma-sm"
        toggle-color="red-10"
        size="sm"
        v-model="editingSelection"
        @click="changeEditingMode"
        :options="[
          { label: 'selecting', value: 0 },
          { label: 'moving', value: 1 },
          { label: 'rotating', value: 2 },
          { label: 'morphing', value: 3 },
          { label: 'sizing', value: 4 },
        ]"
      />
    </div>
    <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs">
      <q-btn
        color="red-10"
        dense
        size="sm"
        style="width: 50px"
        icon="fa-solid fa-upload"
        @click="saveDiagramToServer"
      ></q-btn>
      <q-btn
        color="blue-10"
        dense
        size="sm"
        style="width: 50px"
        icon="fa-solid fa-download"
        @click="openServerCommunication"
      ></q-btn>
      <q-btn
        color="grey-14"
        size="xs"
        dense
        style="width: 50px"
        @click="clearDiagram"
        icon="fa-solid fa-trash-can"
      ></q-btn>
    </div>
    <div
      class="q-gutter-sm row text-overline justify-center q-mb-xs"
      style="font-size: 10px"
    >
      {{ statusMessage }}
    </div>
    <q-popup-edit
      v-if="showPopUpServer"
      fit
      touch-position
      model-value="sylisgek"
    >
      <q-card bordered dark style="width: 300px">
        <div class="row text-overline justify-center">
          available diagrams on server
        </div>
        <div class="row">
          <q-select
            class="q-ml-md q-mr-md"
            label-color="red-6"
            v-model="selectedDiagramOnServer"
            :options="availableDiagramsOnServer"
            hide-bottom-space
            dense
            label="available diagrams"
            style="width: 90%; font-size: 12px"
          />
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="primary"
            size="sm"
            style="width: 50px"
            @click="getDiagramFromServer"
            icon="fa-solid fa-download"
          ></q-btn>
          <q-btn
            color="red-10"
            size="sm"
            style="width: 50px"
            @click="deleteDiagramFromServer"
            icon="fa-solid fa-delete-left"
          ></q-btn>
          <q-btn
            color="indigo-10"
            size="sm"
            style="width: 50px"
            @click="closeServerCommunication"
            icon="fa-solid fa-xmark"
          ></q-btn>
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-xs"
          style="font-size: 10px"
        >
          {{ statusMessage }}
        </div>
      </q-card>
    </q-popup-edit>
  </q-card>
</template>

<script>
import { PIXI } from "../boot/pixi";
import { explain } from "../boot/explain";
import BloodCompartment from "../components/ui-elements/BloodCompartment";
import BloodConnector from "../components/ui-elements/BloodConnector";
import Shunt from "../components/ui-elements/Shunt";
import Container from "../components/ui-elements/Container";
import GasCompartment from "../components/ui-elements/GasCompartment";
import GasConnector from "../components/ui-elements/GasConnector";
import GasExchanger from "../components/ui-elements/GasExchanger";

import { useUserInterfaceStore } from "src/stores/userInterface";
import { useLoggedInUser } from "stores/loggedInUser";

let canvas = null;

export default {
  setup() {
    const uiConfig = useUserInterfaceStore();
    const user = useLoggedInUser();
    return {
      uiConfig,
      user,
    };
  },
  data() {
    return {
      apiUrl: "http://localhost:8081",
      title: "MODEL DIAGRAM",
      collapsed: false,
      editingSelection: "selecting",
      display: "block",
      rt_running: false,
      gridVertical: null,
      gridHorizontal: null,
      skeletonGraphics: null,
      diagramComponents: {},
      ticker: null,
      availableDiagramsOnServer: [],
      selectedDiagramOnServer: "",
      statusMessage: "",
      showPopUpServer: false,
    };
  },
  methods: {
    clearDiagram() {
      this.uiConfig.diagram = {
        settings: {},
        protected: false,
        shared: false,
        components: {},
      };
      this.pixiApp.destroy();
    },
    saveDiagramToServer() {
      Object.keys(this.diagramComponents).forEach((key) => {
        // try to find the component in the diagram store
        let found = Object.keys(this.uiConfig.diagram.components).includes(key);
        // if found then update the component
        if (found) {
          switch (this.diagramComponents[key].compType) {
            case "BloodCompartment":
              console.log(this.diagramComponents[key]);
              this.uiConfig.diagram.components[key].label =
                this.diagramComponents[key].label;
              this.uiConfig.diagram.components[key].models = [
                ...this.diagramComponents[key].models,
              ];
              this.uiConfig.diagram.components[key].compType =
                this.diagramComponents[key].compType;
              this.uiConfig.diagram.components[key].layout = {
                ...this.diagramComponents[key].layout,
              };
              break;
          }
        }
      });
    },
    async saveDiagramToServer2() {
      // check if script is not protected
      if (this.uiConfig.diagram.protected) {
        alert("Diagram is protected!");
        return;
      }

      const url = `${this.apiUrl}/api/diagrams/update_diagram?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.uiConfig.diagram.name,
          user: this.user.name,
          settings: this.uiConfig.diagram.settings,
          components: this.uiConfig.diagram.components,
          protected: this.uiConfig.diagram.protected,
          shared: this.uiConfig.diagram.shared,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new diagram created on server.";
            break;
          case "update":
            this.statusMessage = "diagram is updated on server.";
            break;
        }
        setTimeout(() => (this.statusMessage = ""), 1500);
      }
      this.showPopUpServer = false;
    },
    openServerCommunication() {
      this.showPopUpServer = true;
      this.getAllDiagramsFromUser();
    },
    async getAllDiagramsFromUser() {
      // do a server request
      const url = `${this.apiUrl}/api/diagrams/get_diagrams?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: this.user.name }),
      });
      if (response.status === 200) {
        let data = await response.json();
        // returns an array with all scripts of this user
        if (data.length > 0) {
          this.availableDiagramsOnServer = data.map((diagram) => diagram.name);
          this.selectedDiagramOnServer = "";
        } else {
          this.availableDiagramsOnServer = [];
        }
      }
    },
    async getDiagramFromServer() {
      // do a server request
      const url = `${this.apiUrl}/api/diagrams/get_diagram?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.selectedDiagramOnServer,
          user: this.user.name,
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        // process the result
        this.uiConfig.diagram.user = data.user;
        this.uiConfig.diagram.name = data.name;
        this.uiConfig.diagram.settings = data.settings;
        this.uiConfig.diagram.components = data.components;
        this.uiConfig.diagram.protected = data.protected;
        this.uiConfig.diagram.shared = data.shared;
        this.uiConfig.diagram.dateUpdated = data.dateUpdated;
        this.uiConfig.diagram.dateCreated = data.dateCreated;

        this.statusMessage = "diagram loaded from server.";
        setTimeout(() => (this.statusMessage = ""), 1500);
        this.showPopUpServer = false;
      }
    },
    deleteDiagramFromServer() {},
    closeServerCommunication() {
      this.showPopUpServer = false;
    },
    changeEditingMode() {},
    addToDiagram() {},
    removeFromDiagram(componentName) {
      if (componentName) {
        delete this.diagramComponents[componentName];
      }
    },
    statusUpdate() {
      if (explain.statusMessage.includes("realtime model started")) {
        this.rt_running = true;
      }
      if (explain.statusMessage.includes("realtime model stopped")) {
        this.rt_running = false;
      }
    },
    initDiagram() {
      // get the reference to the canvas
      canvas = document.getElementById("stage");
      // set the resolution of the pix application
      PIXI.settings.RESOLUTION = 2;
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        transparent: false,
        antialias: true,
        backgroundColor: 0x333333,
        view: canvas,
      });

      // allow sortable children
      this.pixiApp.stage.sortableChildren = true;

      // draw the skeleton graphics
      this.drawSkeletonGraphics();

      // draw the grid
      this.drawGrid();

      // draw the components
      this.drawComponents();

      // add a ticker to update all sprites
      this.ticker = this.pixiApp.ticker.add((delta) => {
        if (this.rt_running) {
          Object.values(this.diagramComponents).forEach((sprite) => {
            if (explain.modelData.length > 0) {
              sprite.update(explain.modelData[0]);
            }
          });
        }
      });
    },
    drawGrid() {
      if (this.uiConfig.diagram.settings.grid) {
        const gridSize = this.uiConfig.diagram.settings.gridSize;

        if (this.gridVertical) {
          this.gridVertical.clear();
          this.pixiApp.stage.removeChild(this.gridVertical);
        }
        // build the grid
        this.gridVertical = new PIXI.Graphics();
        for (let x = 0; x < this.pixiApp.renderer.width; x = x + gridSize) {
          this.gridVertical.lineStyle(1, 0x888888, 0.1);
          this.gridVertical.moveTo(x, 0);
          this.gridVertical.lineTo(x, this.pixiApp.renderer.height);
        }
        this.pixiApp.stage.addChild(this.gridVertical);

        if (this.gridHorizontal) {
          this.gridHorizontal.clear();
          this.pixiApp.stage.removeChild(this.gridHorizontal);
        }
        this.gridHorizontal = new PIXI.Graphics();
        for (let y = 0; y < this.pixiApp.renderer.height; y = y + gridSize) {
          this.gridHorizontal.lineStyle(1, 0x888888, 0.1);
          this.gridHorizontal.moveTo(0, y);
          this.gridHorizontal.lineTo(this.pixiApp.renderer.width, y);
        }
        this.pixiApp.stage.addChild(this.gridHorizontal);
      } else {
        if (this.gridVertical) {
          this.gridVertical.clear();
          this.pixiApp.stage.removeChild(this.gridVertical);
        }
        if (this.gridHorizontal) {
          this.gridHorizontal.clear();
          this.pixiApp.stage.removeChild(this.gridHorizontal);
        }
      }
    },

    drawSkeletonGraphics() {
      if (this.uiConfig.diagram.settings.skeleton) {
        if (this.skeletonGraphics) {
          this.skeletonGraphics.clear();
          this.pixiApp.stage.removeChild(this.skeletonGraphics);
        }
        const radius = this.uiConfig.diagram.settings.radius;
        const color = this.uiConfig.diagram.settings.skeletonColor;

        // initalize the skeleton graphics
        this.skeletonGraphics = new PIXI.Graphics();

        // get center stage
        const xCenter = this.pixiApp.renderer.width / 4;
        const yCenter = this.pixiApp.renderer.height / 4;
        this.skeletonGraphics.beginFill(color);
        this.skeletonGraphics.lineStyle(1, color, 1);
        this.skeletonGraphics.drawCircle(xCenter, yCenter, xCenter * radius);
        this.skeletonGraphics.endFill();
        this.pixiApp.stage.addChild(this.skeletonGraphics);
      }
    },

    drawComponents() {
      // get the layout properties
      const xCenter = this.pixiApp.renderer.width / 4;
      const yCenter = this.pixiApp.renderer.height / 4;
      const radius = this.uiConfig.diagram.settings.radius;

      // render the blood compartments
      Object.entries(this.uiConfig.diagram.components).forEach(
        ([key, component]) => {
          switch (component.compType) {
            case "BloodCompartment":
              this.diagramComponents[key] = new BloodCompartment(
                this.pixiApp,
                key,
                component.label,
                component.models,
                component.layout,
                xCenter,
                yCenter,
                radius
              );
              break;
            case "GasCompartment":
              this.diagramComponents[key] = new GasCompartment(
                this.pixiApp,
                key,
                component.label,
                component.models,
                component.layout,
                xCenter,
                yCenter,
                radius
              );
              break;
            case "BloodConnector":
              this.diagramComponents[key] = new BloodConnector(
                this.pixiApp,
                key,
                component.label,
                component.models,
                this.diagramComponents[component.dbcFrom],
                this.diagramComponents[component.dbcTo]
              );
              break;
            case "Shunt":
              this.diagramComponents[key] = new Shunt(
                this.pixiApp,
                key,
                component.label,
                component.models,
                this.diagramComponents[component.dbcFrom],
                this.diagramComponents[component.dbcTo]
              );
              break;
            case "Container":
              this.diagramComponents[key] = new Container(
                this.pixiApp,
                key,
                component.label,
                component.models,
                component.layout,
                xCenter,
                yCenter,
                radius
              );
              break;

            case "GasConnector":
              this.diagramComponents[key] = new GasConnector(
                this.pixiApp,
                key,
                component.label,
                component.models,
                this.diagramComponents[component.dbcFrom],
                this.diagramComponents[component.dbcTo]
              );
              break;
            case "GasExchanger":
              this.diagramComponents[key] = new GasExchanger(
                this.pixiApp,
                key,
                component.label,
                component.models,
                component.gas,
                component.layout,
                xCenter,
                yCenter,
                radius
              );
              break;
          }
        }
      );

      // connect the compartments
    },
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    // initialize the diagram
    this.initDiagram();

    document.addEventListener("status", this.statusUpdate);
  },
};
</script>

<style scoped>
#stage {
  width: 100%;
}
</style>
