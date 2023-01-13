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
    <q-resize-observer @resize="handleResize" />
  </q-card>
</template>

<script>
import { PIXI } from "../boot/pixi";
import { explain } from "../boot/explain";
import DiagramBloodCompartment from "../components/classes/DiagramBloodCompartment";
import DiagramBloodConnector from "../components/classes/DiagramBloodConnector";
import DiagramGasCompartment from "../components/classes/DiagramGasCompartment";
import DiagramGasConnector from "../components/classes/DiagramGasConnector";
import DiagramGasExchanger from "../components/classes/DiagramGasExchanger";
import DiagramContainer from "../components/classes/DiagramContainer";
import DiagramDiffusor from "../components/classes/DiagramDiffusor";

import DiagramValve from "../components/classes/DiagramValve";

import { useDiagramStore } from "src/stores/diagram";

let canvas = null;

export default {
  setup() {
    const diagram = useDiagramStore();
    return {
      diagram,
    };
  },
  data() {
    return {
      title: "MODEL DIAGRAM",
      collapsed: false,
      editingSelection: "selecting",
      display: "block",
      stage: {
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0,
        scaling: 60,
        aspectRatio: 0.8,
      },
      skeletonGraphics: {},
      diagramComponents: {},
      watchedModels: [],
    };
  },
  methods: {
    changeEditingMode() {},
    addToDiagram() {},
    removeFromDiagram(componentName) {
      if (componentName) {
        delete this.diagramComponents[componentName];
      }
    },
    initDiagram() {
      // get the reference to the canvas
      canvas = document.getElementById("stage");
      PIXI.settings.RESOLUTION = 2;
      // define a pixi app with the canvas as view
      this.pixiApp = new PIXI.Application({
        transparent: false,
        antialias: true,
        backgroundColor: 0x333333,
        view: canvas,
        sortableChildren: true,
      });
      this.pixiApp.spriteMode = { text: "moving", mode: 1 };

      // size the canvas
      this.handleResize();

      // initalize the skeleton graphics
      this.skeletonGraphics = new PIXI.Graphics();
      this.pixiApp.stage.addChild(this.skeletonGraphics);

      // draw the skeleton graphics
      this.drawSkeletonGraphics();

      // draw the grid
      this.pixiApp.gridSize = 10;
      this.drawGrid();
    },
    drawGrid() {
      // build the grid
      for (
        let x = 0;
        x < this.pixiApp.renderer.width;
        x = x + this.pixiApp.gridSize
      ) {
        const vertical = new PIXI.Graphics();
        vertical.lineStyle(1, 0x888888, 0.1);
        vertical.moveTo(x, 0);
        vertical.lineTo(x, this.pixiApp.renderer.height);
        this.pixiApp.stage.addChild(vertical);
      }
      for (
        let y = 0;
        y < this.pixiApp.renderer.height;
        y = y + this.pixiApp.gridSize
      ) {
        const horizontal = new PIXI.Graphics();
        horizontal.lineStyle(1, 0x888888, 0.1);
        horizontal.moveTo(0, y);
        horizontal.lineTo(this.pixiApp.renderer.width, y);
        this.pixiApp.stage.addChild(horizontal);
      }
    },
    drawSkeletonGraphics() {
      this.skeletonGraphics.clear();
      // get center stage
      const xCenter = this.pixiApp.renderer.width / 4;
      const yCenter = this.pixiApp.renderer.height / 4;
      this.skeletonGraphics.beginFill(0x444444);
      this.skeletonGraphics.lineStyle(1, 0x444444, 1);
      this.skeletonGraphics.drawCircle(xCenter, yCenter, xCenter * 0.6);
      this.skeletonGraphics.endFill();
      this.pixiApp.stage.addChild(this.skeletonGraphics);
    },
    buildDiagram(diagramName = "circulation") {
      let diagramRef = this.diagram.circulation;

      switch (diagramName) {
        case "circulation":
          diagramRef = this.diagram.circulation;
          break;
      }
      // build the blood compartments
      for (let dbc in diagramRef.components.bloodCompartments) {
        let component = diagramRef.components.bloodCompartments;
        this.diagramComponents[dbc] = new DiagramBloodCompartment(
          dbc,
          component[dbc].label,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the gas compartments
      for (let dbc in diagramRef.components.gasCompartments) {
        let component = diagramRef.components.gasCompartments;
        this.diagramComponents[dbc] = new DiagramGasCompartment(
          dbc,
          component[dbc].label,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the blood connectors
      for (let dbc in diagramRef.components.bloodConnectors) {
        let component = diagramRef.components.bloodConnectors;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramBloodConnector(
          dbc,
          component[dbc].label,
          component[dbc].dbcFrom,
          component[dbc].dbcTo,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the gas connectors
      for (let dbc in diagramRef.components.gasConnectors) {
        let component = diagramRef.components.gasConnectors;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramGasConnector(
          dbc,
          component[dbc].label,
          component[dbc].dbcFrom,
          component[dbc].dbcTo,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the valves
      for (let dbc in diagramRef.components.valves) {
        let component = diagramRef.components.valves;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramValve(
          dbc,
          component[dbc].label,
          component[dbc].dbcFrom,
          component[dbc].dbcTo,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the gas exchangers
      for (let dbc in diagramRef.components.exchangers) {
        let component = diagramRef.components.exchangers;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramGasExchanger(
          dbc,
          component[dbc].label,
          component[dbc].dbcFrom,
          component[dbc].dbcTo,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the diffusors
      for (let dbc in diagramRef.components.diffusors) {
        let component = diagramRef.components.diffusors;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramDiffusor(
          dbc,
          component[dbc].label,
          component[dbc].dbcFrom,
          component[dbc].dbcTo,
          component[dbc].models,
          this.pixiApp
        );
      }
      // build the containers
      for (let dbc in diagramRef.components.containers) {
        let component = diagramRef.components.containers;
        // id, label, dbcFrom, dbcTo, connectors, pixiApp
        this.diagramComponents[dbc] = new DiagramContainer(
          dbc,
          component[dbc].label,
          component[dbc].models,
          this.pixiApp
        );
      }
    },
    handleResize() {
      // get stage sizes
      if (canvas) {
        this.stage.width = canvas.getBoundingClientRect().width;
        this.stage.height =
          canvas.getBoundingClientRect().width * this.stage.aspectRatio;
        // get the center of the stage
        this.stage.centerX = this.stage.width * 0.5;
        this.stage.centerY = this.stage.height * 0.5;
        // resize the pixi app
        if (this.pixiApp) {
          this.pixiApp.renderer.resize(this.stage.width, this.stage.height);
        }
      }
    },
  },
  mounted() {
    // initialize the diagram
    this.initDiagram();
    // build the circulation diagram
    this.buildDiagram("circulation");
  },
};
</script>

<style scoped>
#stage {
  width: 100%;
}
</style>
