<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <!-- component title  -->
    <div class="row text-overline justify-center">
      {{ title }}
    </div>
    <!-- diagram pixi app stage -->
    <div class="stageModelTree" :style="{ display: display }">
      <canvas id="stageModelTree"></canvas>
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
          v-model="uiConfig.diagram.name"
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
import ModelItem from "../components/ui-elements/ModelItem";

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
      title: "MODEL TREE",
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
      modelTreeConnections: {},
      modelTreeComponents: {},
      modelTypes: [],
      models: {},
      refractory: false,
      path: null,
    };
  },
  methods: {
    openSavePopup() {
      this.showPopUpSave = true;
    },
    initModelTree() {
      // get the reference to the canvas
      canvas = document.getElementById("stageModelTree");
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
    },
    buildModelTree() {
      if (this.refractory) return;

      this.refractory = true;
      // first clear all the children from the stage
      this.clearDiagram();
      // draw the skeleton graphics
      this.drawSkeletonGraphics();
      // draw the grid
      this.drawGrid();
      // find all model types in current model
      let mt = [];
      this.models = {};
      const xWidth = this.pixiApp.renderer.width;
      const yWidth = this.pixiApp.renderer.height;
      Object.entries(explain.modelState.Models).forEach(([name, model]) => {
        mt.push(model.ModelType);
        this.models[name] = model;

        if (model.IsEnabled) {
          this.modelTreeComponents[name] = new ModelItem(
            this.pixiApp,
            name,
            model,
            explain.modelState,
            this.modelTreeComponents,
            {}
          );
        }
      });
      // remove the duplicates
      this.modelTypes = [...new Set(mt)];
      // determine the input and outputs of every model type
      Object.values(this.modelTreeComponents).forEach((modelTreeComponent) => {
        switch (modelTreeComponent.model.ModelType) {
          case "BloodResistor":
            modelTreeComponent.inputs.push(modelTreeComponent.model.CompFrom);
            modelTreeComponent.outputs.push(modelTreeComponent.model.CompTo);
            this.modelTreeComponents[
              modelTreeComponent.model.CompTo
            ].inputs.push(modelTreeComponent.key);
            this.modelTreeComponents[
              modelTreeComponent.model.CompFrom
            ].outputs.push(modelTreeComponent.key);
            break;
        }
        switch (modelTreeComponent.model.ModelType) {
          case "GasResistor":
            modelTreeComponent.inputs.push(modelTreeComponent.model.CompFrom);
            modelTreeComponent.outputs.push(modelTreeComponent.model.CompTo);
            this.modelTreeComponents[
              modelTreeComponent.model.CompTo
            ].inputs.push(modelTreeComponent.key);
            this.modelTreeComponents[
              modelTreeComponent.model.CompFrom
            ].outputs.push(modelTreeComponent.key);
            break;
        }
      });

      this.updateModelTree();
      //console.log(this.modelTreeComponents);
      // prevent multi triggering
      setTimeout(() => (this.refractory = false), 2000);
    },
    updateModelTree() {
      let matches = [];
      // determine all connections, connect inputs to outputs
      Object.values(this.modelTreeComponents).forEach(
        (modelTreeComponentInput) => {
          // iterate over the inputs of this modelTreeCompoent
          modelTreeComponentInput.inputs.forEach((input) => {
            // iterate over all outputs
            Object.values(this.modelTreeComponents).forEach(
              (modelTreeComponentOutput) => {
                modelTreeComponentOutput.outputs.forEach((output) => {
                  if (input == output) {
                    // we have a match
                    matches.push({
                      i: modelTreeComponentInput.key,
                      o: modelTreeComponentOutput.key,
                    });
                  }
                });
              }
            );
          });
        }
      );

      if (this.path) {
        this.path.clear();
        this.pixiApp.stage.removeChild(this.path);
      }
      this.path = new PIXI.Graphics();
      this.path.zIndex = 1;
      this.path.cacheAsBitmap = true;
      this.path.lineStyle(1, 0xffffff, 1);

      matches.forEach((match) => {
        let x_input = this.modelTreeComponents[match.i].sprite.x;
        let y_input = this.modelTreeComponents[match.i].sprite.y;
        let x_output = this.modelTreeComponents[match.o].sprite.x;
        let y_output = this.modelTreeComponents[match.o].sprite.y;

        this.path.moveTo(x_output, y_output);
        this.path.lineTo(x_input, y_input);
      });

      this.pixiApp.stage.addChild(this.path);
    },
    clearDiagram() {
      this.pixiApp.stage.removeChildren();
    },
    saveModelToServer() {},
    loadModelFromServer() {},
    getModelsFromServer() {},
    deleteModelFromServer() {},
    openServerCommunication() {
      // show server communication pop up
      this.showPopUpServer = true;

      // get all available diuagrams for this user
      this.getModelsFromServer();
    },
    closeServerCommunication() {
      // close the server communication pop up
      this.showPopUpServer = false;
      this.showPopUpSave = false;
    },
    changeEditingMode() {},

    stateUpdate() {},
    // drawing methods
    drawGrid() {
      const gridSize = 10;

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
    },
    drawSkeletonGraphics() {},
  },
  beforeUnmount() {
    document.removeEventListener("state", this.buildModelTree);
  },
  mounted() {
    // listen for model state update
    document.addEventListener("state", this.buildModelTree);
    // get the model state
    explain.getModelState();

    // initialize the diagram
    this.initModelTree();

    document.addEventListener("modeltreeupdate", this.updateModelTree);
  },
};
</script>

<style scoped>
#stageModelTree {
  width: 100%;
}
</style>
