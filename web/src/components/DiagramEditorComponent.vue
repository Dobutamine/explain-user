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
    <div v-if="!collapsed">
      <div v-if="diagram.name !== ''" class="row text-overline justify-center">
        {{ diagram.name }}
      </div>
      <div v-if="diagram.name === ''" class="row text-overline justify-center">
        no diagram loaded
      </div>

      <!-- topline buttons -->
      <div
        v-if="diagram.name !== ''"
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        <q-btn color="primary q-mr-xs" label="add" dark class="col" size="sm">
          <q-menu dark>
            <q-list dense>
              <div
                v-for="(
                  diagramComponentType, index
                ) in general.diagramComponentTypes"
                :key="index"
              >
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="addComponent(diagramComponentType)"
                  >
                    {{ diagramComponentType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          color="secondary"
          label="edit"
          dark
          class="col q-mr-xs"
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div
                v-for="(diagramComponentName, index) in diagramComponentNames"
                :key="index"
              >
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="editComponent(diagramComponentName)"
                  >
                    {{ diagramComponentName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn color="negative" label="delete" dark class="col" size="sm">
          <q-menu dark>
            <q-list dense>
              <div
                v-for="(diagramComponentName, index) in diagramComponentNames"
                :key="index"
              >
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="deleteComponent(diagramComponentName)"
                  >
                    {{ diagramComponentName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <!-- editor mode 1 or 2 -->
      <div
        v-if="editorMode == 1 || editorMode == 2"
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        {{ compType }}
        <div :style="{ 'font-size': '10px', width: '100%' }">
          <q-input
            label="name"
            v-model="compName"
            square
            hide-hint
            dense
            dark
            stack-label
            style="width: 100%"
          />
          <q-input
            label="label"
            v-model="compLabel"
            square
            hide-hint
            dense
            dark
            stack-label
            style="width: 100%"
          />
          <q-select
            class="col-9"
            label="models"
            v-model="compModelSelection"
            :options="compModels"
            hide-bottom-space
            dense
            multiple
            style="font-size: 12px"
          />
          <div
            v-if="
              advancedMode &&
              (compType == 'BloodCompartment' ||
                compType == 'GasCompartment' ||
                compType == 'Container' ||
                compType == 'GasExchanger')
            "
          >
            layout
            <q-btn-toggle
              class="q-ma-sm col-9"
              v-model="compLayoutType"
              size="sm"
              dark
              spread
              dense
              no-caps
              toggle-color="blue-grey-6"
              color="grey-9"
              text-color="black"
              :options="[
                { label: 'Arc', value: true },
                { label: 'Relative', value: false },
              ]"
            />
            <div v-if="!compLayoutType" class="row">
              <q-input
                class="col q-ma-sm"
                label="postion x"
                v-model="compLayoutX"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
              <q-input
                class="col q-ma-sm"
                label="position Y"
                v-model="compLayoutY"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
            </div>
            <div v-if="compLayoutType" class="row">
              <q-input
                class="col q-ma-sm"
                label="position Degrees"
                v-model="compLayoutDgs"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
            </div>

            <div class="row">
              <q-input
                class="col q-ma-sm"
                label="scale X"
                v-model="compScaleX"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
              <q-input
                class="col q-ma-sm"
                label="scale Y"
                v-model="compScaleY"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
            </div>
            <div class="row">
              <q-input
                class="col q-ma-sm"
                label="label pos X"
                v-model="compTextX"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
              <q-input
                class="col q-ma-sm"
                label="label pos Y"
                v-model="compTextY"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
              <q-input
                class="col q-ma-sm"
                label="label size"
                v-model="compTextSize"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
            </div>
          </div>

          <div
            v-if="
              compType == 'BloodConnector' ||
              compType == 'GasConnector' ||
              compType == 'Shunt'
            "
          >
            <div class="row">
              <q-select
                class="col"
                label="Diagram comp from"
                v-model="compDbcFrom"
                :options="compDbcFroms"
                hide-bottom-space
                dense
                style="font-size: 12px"
              />
              <q-select
                class="col"
                label="Diagram comp To"
                v-model="compDbcTo"
                :options="compDbcTos"
                hide-bottom-space
                dense
                style="font-size: 12px"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- editor mode 3 -->
      <div v-if="editorMode === 3">
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs"
        >
          Are you sure you want to remove {{ compName }}?
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs"
        >
          <q-btn
            color="red-10"
            dense
            size="sm"
            style="width: 50px"
            icon="fa-solid fa-trash-can"
            @click="deleteComponentFromStore"
          ></q-btn>
          <q-btn
            color="grey-14"
            size="xs"
            dense
            style="width: 50px"
            @click="cancelDiagramBuild"
            icon="fa-solid fa-refresh"
          ></q-btn>
        </div>
      </div>
      <!-- server communication buttons -->
      <div
        v-if="editorMode < 3 && editorMode > 0"
        class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs"
      >
        <q-btn
          color="negative"
          dense
          size="sm"
          style="width: 50px"
          icon="fa-solid fa-check"
          @click="saveDiagramComponent"
        ></q-btn>
        <q-btn
          color="grey-14"
          size="xs"
          dense
          style="width: 50px"
          @click="cancelDiagramBuild"
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
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";

import { useConfigStore } from "src/stores/config";
import { useDiagramStore } from "src/stores/diagram";
import { useGeneralStore } from "src/stores/general";
export default {
  components: {},
  setup() {
    const uiConfig = useConfigStore();
    const diagram = useDiagramStore();
    const general = useGeneralStore();
    return {
      uiConfig,
      diagram,
      general,
    };
  },
  data() {
    return {
      advancedMode: true,
      editorMode: 0,
      title: "DIAGRAM EDITOR",
      collapsed: false,
      modelsTree: {},
      selectedModelType: [],
      selectedModelItems: [],
      modelTypes: [],
      selectedDiagramComponent: "",
      diagramComponentNames: [],
      compName: "",
      compLabel: "",
      compType: "",
      compModels: [],
      compLayoutType: true,
      compLayoutX: 1,
      compLayoutY: 1,
      compMorphX: 1,
      compMorphY: 1,
      compScaleX: 1,
      compScaleY: 1,
      compTextX: 0,
      compTextY: 0,
      compTextSize: 10,
      compLayoutDgs: 0,
      compDbcFrom: "",
      compDbcFroms: [],
      compDbcTo: "",
      compDbcTos: [],
      compModelSelection: [],
      compGas: "O2",
      compGasses: ["O2", "Co2"],
      rebuild_event: null,
      statusMessage: "",
    };
  },
  methods: {
    updateDiagram() {
      this.$bus.emit("rebuild_diagram");
    },
    getAllDiagramComponents() {
      this.diagramComponentNames = [];
      if (this.diagram.components) {
        Object.keys(this.diagram.components).forEach((component) => {
          this.diagramComponentNames.push(component);
        });
      }
    },
    saveDiagramComponent() {
      let layoutType = "rel";
      switch (this.compType) {
        case "GasCompartment":
          layoutType = "rel";
          if (this.compLayoutType) {
            layoutType = "arc";
          }
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            layout: {
              pos: {
                type: layoutType,
                x: parseFloat(this.compLayoutX),
                y: parseFloat(this.compLayoutY),
                dgs: parseFloat(this.compLayoutDgs),
              },
              morph: {
                x: parseFloat(this.compMorphX),
                y: parseFloat(this.compMorphY),
              },
              scale: {
                x: parseFloat(this.compScaleX),
                y: parseFloat(this.compScaleY),
              },
              text: {
                x: parseFloat(this.compTextX),
                y: parseFloat(this.compTextY),
                size: parseFloat(this.compTextSize),
              },
            },
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "BloodCompartment":
          layoutType = "rel";
          if (this.compLayoutType) {
            layoutType = "arc";
          }
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            layout: {
              pos: {
                type: layoutType,
                x: parseFloat(this.compLayoutX),
                y: parseFloat(this.compLayoutY),
                dgs: parseFloat(this.compLayoutDgs),
              },
              morph: {
                x: parseFloat(this.compMorphX),
                y: parseFloat(this.compMorphY),
              },
              scale: {
                x: parseFloat(this.compScaleX),
                y: parseFloat(this.compScaleY),
              },
              text: {
                x: parseFloat(this.compTextX),
                y: parseFloat(this.compTextY),
                size: parseFloat(this.compTextSize),
              },
            },
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "Container":
          layoutType = "rel";
          if (this.compLayoutType) {
            layoutType = "arc";
          }
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            layout: {
              pos: {
                type: layoutType,
                x: parseFloat(this.compLayoutX),
                y: parseFloat(this.compLayoutY),
                dgs: parseFloat(this.compLayoutDgs),
              },
              morph: {
                x: parseFloat(this.compMorphX),
                y: parseFloat(this.compMorphY),
              },
              scale: {
                x: parseFloat(this.compScaleX),
                y: parseFloat(this.compScaleY),
              },
              text: {
                x: parseFloat(this.compTextX),
                y: parseFloat(this.compTextY),
                size: parseFloat(this.compTextSize),
              },
            },
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "BloodConnector":
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            dbcFrom: this.compDbcFrom,
            dbcTo: this.compDbcTo,
            layout: {},
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "Shunt":
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            dbcFrom: this.compDbcFrom,
            dbcTo: this.compDbcTo,
            layout: {},
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "GasConnector":
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            dbcFrom: this.compDbcFrom,
            dbcTo: this.compDbcTo,
            layout: {},
          };
          this.$bus.emit("rebuild_diagram");
          break;
        case "GasExchanger":
          layoutType = "rel";
          if (this.compLayoutType) {
            layoutType = "arc";
          }
          this.diagram.components[this.compName] = {
            label: this.compLabel,
            models: this.compModelSelection,
            compType: this.compType,
            gas: this.compGas,
            layout: {
              pos: {
                type: layoutType,
                x: parseFloat(this.compLayoutX),
                y: parseFloat(this.compLayoutY),
                dgs: parseFloat(this.compLayoutDgs),
              },
              morph: {
                x: parseFloat(this.compMorphX),
                y: parseFloat(this.compMorphY),
              },
              scale: {
                x: parseFloat(this.compScaleX),
                y: parseFloat(this.compScaleY),
              },
              text: {
                x: parseFloat(this.compTextX),
                y: parseFloat(this.compTextY),
                size: parseFloat(this.compTextSize),
              },
            },
          };
          this.$bus.emit("rebuild_diagram");
          break;
      }
      this.cancelDiagramBuild();
    },
    cancelDiagramBuild() {
      this.clearFields();
      this.getAllDiagramComponents();
      this.compType = "";
      this.selectedModelItems = [];
      this.editorMode = 0;
    },
    deleteComponent(compName) {
      this.editorMode = 3;
      this.compName = compName;
    },
    deleteComponentFromStore() {
      delete this.diagram.components[this.compName];
      this.$bus.emit("rebuild_diagram");
      this.cancelDiagramBuild();
    },
    editComponent(compName) {
      this.editorMode = 2;
      // get all the properties
      this.selectedDiagramComponent = this.diagram.components[compName];

      // get all possible model types
      this.compModels = [];
      this.compModelSelection = [];

      switch (this.selectedDiagramComponent.compType) {
        case "BloodConnector":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("BloodCompartment");
          break;
        case "GasConnector":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("GasCompartment");
          break;
        case "Shunt":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("BloodCompartment");
          break;
        case "BloodCompartment":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          if (this.selectedDiagramComponent.layout.pos.type == "arc") {
            this.compLayoutType = true;
          } else {
            this.compLayoutType = false;
          }
          this.compLayoutDgs = parseFloat(
            this.selectedDiagramComponent.layout.pos.dgs.toFixed(2)
          );
          this.compLayoutX = parseFloat(
            this.selectedDiagramComponent.layout.pos.x.toFixed(2)
          );
          this.compLayoutY = parseFloat(
            this.selectedDiagramComponent.layout.pos.y.toFixed(2)
          );
          this.compMorphX = parseFloat(
            this.selectedDiagramComponent.layout.morph.x.toFixed(2)
          );
          this.compMorphY = parseFloat(
            this.selectedDiagramComponent.layout.morph.y.toFixed(2)
          );
          this.compScaleX = parseFloat(
            this.selectedDiagramComponent.layout.scale.x.toFixed(2)
          );
          this.compScaleY = parseFloat(
            this.selectedDiagramComponent.layout.scale.y.toFixed(2)
          );
          this.compTextX = parseFloat(
            this.selectedDiagramComponent.layout.text.x.toFixed(2)
          );
          this.compTextY = parseFloat(
            this.selectedDiagramComponent.layout.text.y.toFixed(2)
          );
          this.compTextSize = parseFloat(
            this.selectedDiagramComponent.layout.text.size.toFixed(2)
          );

          // add the other possible models
          break;
        case "GasCompartment":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          if (this.selectedDiagramComponent.layout.pos.type == "arc") {
            this.compLayoutType = true;
          } else {
            this.compLayoutType = false;
          }
          this.compLayoutDgs = parseFloat(
            this.selectedDiagramComponent.layout.pos.dgs.toFixed(2)
          );
          this.compLayoutX = parseFloat(
            this.selectedDiagramComponent.layout.pos.x.toFixed(2)
          );
          this.compLayoutY = parseFloat(
            this.selectedDiagramComponent.layout.pos.y.toFixed(2)
          );
          this.compMorphX = parseFloat(
            this.selectedDiagramComponent.layout.morph.x.toFixed(2)
          );
          this.compMorphY = parseFloat(
            this.selectedDiagramComponent.layout.morph.y.toFixed(2)
          );
          this.compScaleX = parseFloat(
            this.selectedDiagramComponent.layout.scale.x.toFixed(2)
          );
          this.compScaleY = parseFloat(
            this.selectedDiagramComponent.layout.scale.y.toFixed(2)
          );
          this.compTextX = parseFloat(
            this.selectedDiagramComponent.layout.text.x.toFixed(2)
          );
          this.compTextY = parseFloat(
            this.selectedDiagramComponent.layout.text.y.toFixed(2)
          );
          this.compTextSize = parseFloat(
            this.selectedDiagramComponent.layout.text.size.toFixed(2)
          );

          // add the other possible models
          break;
        case "Container":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          if (this.selectedDiagramComponent.layout.pos.type == "arc") {
            this.compLayoutType = true;
          } else {
            this.compLayoutType = false;
          }
          this.compLayoutDgs = parseFloat(
            this.selectedDiagramComponent.layout.pos.dgs.toFixed(2)
          );
          this.compLayoutX = parseFloat(
            this.selectedDiagramComponent.layout.pos.x.toFixed(2)
          );
          this.compLayoutY = parseFloat(
            this.selectedDiagramComponent.layout.pos.y.toFixed(2)
          );
          this.compMorphX = parseFloat(
            this.selectedDiagramComponent.layout.morph.x.toFixed(2)
          );
          this.compMorphY = parseFloat(
            this.selectedDiagramComponent.layout.morph.y.toFixed(2)
          );
          this.compScaleX = parseFloat(
            this.selectedDiagramComponent.layout.scale.x.toFixed(2)
          );
          this.compScaleY = parseFloat(
            this.selectedDiagramComponent.layout.scale.y.toFixed(2)
          );
          this.compTextX = parseFloat(
            this.selectedDiagramComponent.layout.text.x.toFixed(2)
          );
          this.compTextY = parseFloat(
            this.selectedDiagramComponent.layout.text.y.toFixed(2)
          );
          this.compTextSize = parseFloat(
            this.selectedDiagramComponent.layout.text.size.toFixed(2)
          );

          // add the other possible models
          break;
        case "GasExchanger":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.compGas = this.selectedDiagramComponent.gas;
          this.selectModelTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          if (this.selectedDiagramComponent.layout.pos.type == "arc") {
            this.compLayoutType = true;
          } else {
            this.compLayoutType = false;
          }
          this.compLayoutDgs = parseFloat(
            this.selectedDiagramComponent.layout.pos.dgs.toFixed(2)
          );
          this.compLayoutX = parseFloat(
            this.selectedDiagramComponent.layout.pos.x.toFixed(2)
          );
          this.compLayoutY = parseFloat(
            this.selectedDiagramComponent.layout.pos.y.toFixed(2)
          );
          this.compMorphX = parseFloat(
            this.selectedDiagramComponent.layout.morph.x.toFixed(2)
          );
          this.compMorphY = parseFloat(
            this.selectedDiagramComponent.layout.morph.y.toFixed(2)
          );
          this.compScaleX = parseFloat(
            this.selectedDiagramComponent.layout.scale.x.toFixed(2)
          );
          this.compScaleY = parseFloat(
            this.selectedDiagramComponent.layout.scale.y.toFixed(2)
          );
          this.compTextX = parseFloat(
            this.selectedDiagramComponent.layout.text.x.toFixed(2)
          );
          this.compTextY = parseFloat(
            this.selectedDiagramComponent.layout.text.y.toFixed(2)
          );
          this.compTextSize = parseFloat(
            this.selectedDiagramComponent.layout.text.size.toFixed(2)
          );

          // add the other possible models
          break;
      }
    },
    findDiagramComponents(compType) {
      Object.keys(this.diagram.components).forEach((compName) => {
        if (this.diagram.components[compName].compType == compType) {
          this.compDbcFroms.push(compName);
          this.compDbcTos.push(compName);
        }
      });
    },
    clearFields() {
      this.compLabel = "";
      this.compName = "";
      this.compModels = [];
      this.compLayoutType = true;
      this.compLayoutDgs = 0;
      this.compLayoutX = 1;
      this.compLayoutY = 1;
      this.compMorphX = 1;
      this.compMorphY = 1;
      this.compScaleX = 1;
      this.compScaleY = 1;
      this.compTextX = 0;
      this.compTextY = 0;
      this.compTextSize = 10;
      this.compDbcFroms = [];
      this.compDbcFrom = "";
      this.compDbcTo = "";
      this.compDbcTos = [];
    },
    addComponent(compType) {
      this.editorMode = 1;
      this.clearFields();
      this.selectModelTypeToAdd(compType);
      switch (compType) {
        case "BloodConnector":
          this.findDiagramComponents("BloodCompartment");
          break;
        case "GasConnector":
          this.findDiagramComponents("GasCompartment");
          break;
        case "Container":
          this.findDiagramComponents("BloodCompartment");
          this.findDiagramComponents("GasCompartment");
          break;
        case "Shunt":
          this.findDiagramComponents("BloodCompartment");
          break;
        case "Pump":
          break;
        case "Oxygenator":
          break;
      }
    },
    selectModelTypeToAdd(compType) {
      this.compType = compType;
      // find all models which this compType could hold
      this.compModels = [];
      this.compModelSelection = [];
      let models = [];
      switch (this.compType) {
        case "BloodCompartment":
          models = ["BloodCompliance", "BloodTimeVaryingElastance"];
          break;
        case "BloodConnector":
          models = ["BloodResistor"];
          break;
        case "Shunt":
          models = ["BloodResistor"];
          break;
        case "GasCompartment":
          models = ["GasCompliance"];
          break;
        case "GasConnector":
          models = ["GasResistor"];
          break;
        case "Container":
          models = ["Container"];
          break;
        case "GasExchanger":
          models = ["GasExchanger"];
          break;
        case "Pump":
          models = ["Pump"];
          break;
        case "Oxygenator":
          models = ["Oxygenator"];
          break;
      }
      Object.keys(explain.modelState.Models).forEach((model) => {
        if (models.includes(explain.modelState.Models[model].ModelType)) {
          this.compModels.push(model);
        }
      });
    },
    selectModelType(modeltype) {
      // search the properties needed for this modeltype in the uiconfig
      this.selectedModelItems = [];
      this.selectedModelItems = this.uiConfig.models[modeltype].properties;
    },
    buildModelItemTree() {
      // build the grouperItem tree from the ui store
      this.modelsTree = {};
      // // first find all models
      // for (let model in explain.modelState.Models) {
      //   let modelType = explain.modelState.Models[model].ModelType;
      //   let props = [];
      //   if (!this.modelTypes.includes(modelType)) {
      //     this.modelTypes.push(modelType);
      //   }
      //   if (this.uiConfig.models[modelType]) {
      //     for (let prop in this.uiConfig.models[modelType].properties) {
      //       let propName =
      //         this.uiConfig.models[modelType].properties[prop].modelProp;
      //       let propSettings = this.uiConfig.models[modelType].properties[prop];
      //       props.push({
      //         propName: propName,
      //         propSettings: propSettings,
      //       });
      //     }

      //     this.modelsTree[model] = {
      //       model: model,
      //       modelType: modelType,
      //       props: props,
      //       value: "",
      //     };
      //   }
      // }
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.buildModelItemTree);
    document.removeEventListener(
      "edit_comp",
      (e) => {
        this.editComponent(e.detail);
      },
      false
    );
  },
  mounted() {
    this.rebuild_event = new CustomEvent("rebuild_diagram");

    try {
      document.removeEventListener("state", this.buildModelItemTree);
      document.removeEventListener(
        "edit_comp",
        (e) => {
          this.editComponent(e.detail);
        },
        false
      );
    } catch {}
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildModelItemTree);

    // get the model state
    explain.getModelState();

    // get all diagram component names
    this.getAllDiagramComponents();

    document.addEventListener(
      "edit_comp",
      (e) => {
        this.editComponent(e.detail);
      },
      false
    );

    this.$bus.on("diagram_loaded", () => this.getAllDiagramComponents());
  },
};
</script>

<style></style>
