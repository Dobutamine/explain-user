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
import BloodCompartmentSprite from "../components/ui-elements/BloodCompartmentSprite";

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
        this.ticker.start();
      }
      if (explain.statusMessage.includes("realtime model stopped")) {
        this.ticker.stop();
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

      // initalize the skeleton graphics
      this.skeletonGraphics = new PIXI.Graphics();

      // draw the skeleton graphics
      this.drawSkeletonGraphics();

      // draw the grid
      this.drawGrid(10.0);

      // add a ticker to update all sprites
      this.ticker = this.pixiApp.ticker.add((delta) => {
        Object.values(this.diagramComponents).forEach((sprite) => {
          if (explain.modelData.length > 0) {
            sprite.update(explain.modelData[0]);
          }
        });
      });
    },
    drawGrid(gridSize) {
      if (this.gridVertical) {
        this.gridVertical.clear();
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
      }
      this.gridHorizontal = new PIXI.Graphics();
      for (let y = 0; y < this.pixiApp.renderer.height; y = y + gridSize) {
        this.gridHorizontal.lineStyle(1, 0x888888, 0.1);
        this.gridHorizontal.moveTo(0, y);
        this.gridHorizontal.lineTo(this.pixiApp.renderer.width, y);
      }
      this.pixiApp.stage.addChild(this.gridHorizontal);
    },

    drawSkeletonGraphics() {
      if (this.skeletonGraphics) {
        this.skeletonGraphics.clear();
      }
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
      let diagramRef = this.uiConfig.diagrams.circulation;

      const xCenter = this.pixiApp.renderer.width / 4;
      const yCenter = this.pixiApp.renderer.height / 4;
      const radius = xCenter * 0.6;

      Object.entries(diagramRef.components).forEach(([key, component]) => {
        switch (component.compType) {
          case "BloodCompartment":
            this.diagramComponents[key] = new BloodCompartmentSprite(
              this.pixiApp.stage,
              key,
              component.label,
              component.models,
              {
                x: xCenter,
                y: yCenter,
                pos: component.posDgs.dgs,
                radius: radius,
                x_offset: component.posDgs.x_offset,
                y_offset: component.posDgs.y_offset,
              },
              null
            );
            break;
        }
      });
    },

    buildDiagramExp(diagramName = "circulation") {
      let diagramRef = this.uiConfig.diagrams.circulation;

      switch (diagramName) {
        case "circulation":
          diagramRef = this.uiConfig.diagrams.circulation;
          break;
      }
      // build the blood compartments
      const xCenter = this.pixiApp.renderer.width / 4;
      const yCenter = this.pixiApp.renderer.height / 4;

      for (let dbc in diagramRef.components) {
        let component = diagramRef.components[dbc];
        if (component.compType == "BloodCompartment") {
          let x =
            xCenter + Math.cos(component.posDgs * 0.0174533) * xCenter * 0.6;
          let y =
            yCenter + Math.sin(component.posDgs * 0.0174533) * xCenter * 0.6;
          let pos = { x: x, y: y };
          this.diagramComponents[dbc] = new DiagramBloodCompartment(
            dbc,
            component.label,
            pos,
            component.models,
            this.pixiApp
          );
        }
        if (component.compType == "BloodConnector") {
          this.diagramComponents[dbc] = new DiagramBloodConnector(
            dbc,
            component.label,
            component.dbcFrom,
            component.dbcTo,
            component.models,
            this.pixiApp
          );
        }
        if (component.compType == "Valve") {
          this.diagramComponents[dbc] = new DiagramValve(
            dbc,
            component.label,
            component.dbcFrom,
            component.dbcTo,
            component.models,
            this.pixiApp
          );
        }
        console.log(this.diagramComponents[dbc]);
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    // initialize the diagram
    this.initDiagram();
    // build the circulation diagram
    this.buildDiagram("circulation");
    document.addEventListener("status", this.statusUpdate);
  },
};
</script>

<style scoped>
#stage {
  width: 100%;
}
</style>
