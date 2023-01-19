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

let canvas = null;

export default {
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
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
