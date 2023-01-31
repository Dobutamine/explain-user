<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <!-- component title  -->
    <div class="row text-overline justify-center">
      {{ diagram.name }}
    </div>
    <!-- diagram pixi app stage -->
    <div class="stage" :style="{ display: display }">
      <canvas id="stage"></canvas>
    </div>
    <!-- editing mode selectors -->
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
      <q-toggle
        class="text-overline"
        size="xs"
        v-model="diagram.settings.grid"
        @click="buildDiagram"
      >
        grid
      </q-toggle>
      <q-toggle
        class="text-overline"
        size="xs"
        v-model="diagram.settings.skeleton"
        @click="buildDiagram"
      >
        skeleton
      </q-toggle>
    </div>
    <!-- server communication buttons -->
    <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs">
      <q-btn
        color="primary"
        label="download"
        size="sm"
        style="width: 120px"
        icon="fa-solid fa-download"
        @click="openServerCommunication"
      ></q-btn>
      <q-btn
        color="secondary"
        label="upload"
        size="sm"
        style="width: 120px"
        icon="fa-solid fa-upload"
        @click="openSavePopup"
      ></q-btn>

      <q-btn
        color="negative"
        label="clear"
        size="sm"
        style="width: 120px"
        @click="clearDiagram"
        icon="fa-solid fa-xmark"
      ></q-btn>
    </div>
    <!-- status message -->
    <div
      class="q-gutter-sm row text-overline justify-center q-mb-xs"
      style="font-size: 10px"
    >
      {{ statusMessage }}
    </div>
    <!-- server communication popup -->
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
            @click="loadDiagramFromServer"
            icon="fa-solid fa-download"
          ></q-btn>
          <q-btn
            color="negative"
            size="sm"
            style="width: 50px"
            @click="deleteDiagramFromServer"
            icon="fa-solid fa-trash-can"
          ></q-btn>
          <q-btn
            color="grey-14"
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

    <q-popup-edit
      v-if="showPopUpSave"
      fit
      touch-position
      model-value="sylisgek"
    >
      <q-card bordered dark style="width: 300px">
        <div class="row text-overline justify-center">diagram name</div>
        <q-input
          class="row q-ma-sm"
          v-model="diagram.name"
          square
          hide-hint
          dense
          dark
          stack-label
        />
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-xs q-mb-sm"
        >
          <q-btn
            color="secondary"
            dense
            size="sm"
            style="width: 50px"
            icon="fa-solid fa-upload"
            @click="saveDiagramToServer"
          ></q-btn>

          <q-btn
            color="grey-14"
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

import { useConfigStore } from "src/stores/config";
import { useUserStore } from "src/stores/user";
import { useDiagramStore } from "src/stores/diagram";
import { useGeneralStore } from "src/stores/general";

let canvas = null;

export default {
  setup() {
    const ui = useConfigStore();
    const user = useUserStore();
    const diagram = useDiagramStore();
    const general = useGeneralStore();
    return {
      ui,
      user,
      diagram,
      general,
    };
  },
  data() {
    return {
      title: "ANIMATED DIAGRAM",
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
      showPopUpSave: false,
      addModelPopUp: false,
      load_diagram: null,
    };
  },
  methods: {
    toggleGrid() {
      this.buildDiagram();
    },
    openSavePopup() {
      this.showPopUpSave = true;
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

      // build the diagram
      this.buildDiagram();
    },
    buildDiagram() {
      // first clear all the children from the stage
      this.clearDiagram();
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
    clearDiagram() {
      this.pixiApp.stage.removeChildren();
    },
    async saveDiagramToServer() {
      // check if script is not protected
      if (this.diagram.protected) {
        alert("Diagram is protected!");
        return;
      }
      if (Object.keys(this.diagram.components).length === 0) {
        alert("No diagram components defined!");
        return;
      }

      const url = `${this.general.apiUrl}/api/diagrams/update_diagram?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.diagram.engine_version,
          name: this.diagram.name,
          user: this.user.name,
          definition: this.diagram.definition,
          settings: { ...this.diagram.settings },
          components: { ...this.diagram.components },
          protected: this.diagram.protected,
          shared: this.diagram.shared,
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
    loadDiagramFromServer() {
      this.diagram.getDiagram(
        this.general.apiUrl,
        this.selectedDiagramOnServer,
        this.user.name,
        this.user.token
      );
    },
    async getDiagramsFromServer() {
      // do a server request
      const url = `${this.general.apiUrl}/api/diagrams/get_diagrams?token=${this.user.token}`;
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
    async deleteDiagramFromServer() {},
    openServerCommunication() {
      // show server communication pop up
      this.showPopUpServer = true;

      // get all available diuagrams for this user
      this.getDiagramsFromServer();
    },
    closeServerCommunication() {
      // close the server communication pop up
      this.showPopUpServer = false;
      this.showPopUpSave = false;
    },
    changeEditingMode() {},
    statusUpdate() {
      if (explain.statusMessage.includes("realtime model started")) {
        this.rt_running = true;
      }
      if (explain.statusMessage.includes("realtime model stopped")) {
        this.rt_running = false;
      }
    },
    // drawing methods
    drawGrid() {
      if (this.diagram.settings.grid) {
        const gridSize = this.diagram.settings.gridSize;

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
      if (this.diagram.settings.skeleton) {
        if (this.skeletonGraphics) {
          this.skeletonGraphics.clear();
          this.pixiApp.stage.removeChild(this.skeletonGraphics);
        }
        const radius = this.diagram.settings.radius;
        const color = this.diagram.settings.skeletonColor;

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
      const radius = this.diagram.settings.radius;

      // render the blood compartments
      Object.entries(this.diagram.components).forEach(([key, component]) => {
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
            console.log("shunt added");
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
      });
    },
    updateConnectors() {},
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
    this.load_diagram();
  },
  mounted() {
    // define a load diagram request handler
    this.load_diagram = this.diagram.$onAction(({ name, after }) => {
      if (name === "getDiagram") {
        after((result) => {
          if (result) {
            this.statusMessage = "diagram loaded from server.";
            setTimeout(() => (this.statusMessage = ""), 1500);
            this.showPopUpServer = false;
            this.buildDiagram();
            this.$bus.emit("diagram_loaded");
          } else {
            this.statusMessage = "failed to get diagram.";
            setTimeout(() => (this.statusMessage = ""), 1500);
          }
        });
      }
    });

    // listen for an event coming from the explain model
    document.addEventListener("status", this.statusUpdate);

    // get the model state
    explain.getModelState();

    // initialize the diagram
    this.initDiagram();

    // listen for an event triggering a rebuild
    this.$bus.on("rebuild_diagram", this.buildDiagram);
  },
};
</script>

<style scoped>
#stage {
  width: 100%;
}
</style>
