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
      <div
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        <q-btn
          color="grey-3 q-mr-xs"
          outline
          dark
          icon="fa-solid fa-add"
          class="col"
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div
                v-for="(diagramComponentType, index) in diagramComponentTypes"
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
          color="grey-3"
          outline
          dark
          icon="fa-solid fa-edit"
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
        <q-btn
          color="grey-3"
          outline
          dark
          icon="fa-solid fa-trash-can"
          class="col"
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
      <div
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        <div
          v-if="editorMode == 1 || editorMode == 2"
          :style="{ 'font-size': '10px', width: '100%' }"
        >
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
            label="caption"
            v-model="compLabel"
            square
            hide-hint
            dense
            dark
            stack-label
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
              compType == 'BloodCompartment' ||
              compType == 'GasCompartment' ||
              compType == 'Container'
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
                label="morph X"
                v-model="compMorphX"
                square
                type="number"
                hide-hint
                dense
                dark
                stack-label
              />
              <q-input
                class="col q-ma-sm"
                label="morph Y"
                v-model="compMorphY"
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

        <div v-if="editorMode == 1"></div>
        <div v-if="editorMode == 2"></div>
        <div v-if="editorMode == 3"></div>
        <q-btn @click="updateDiagram">TEST</q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";

import BuildPropEditComponent from "./BuildPropEditComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";
export default {
  components: {},
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      editorMode: 0,
      notyet: true,
      title: "DIAGRAM COMPONENT EDITOR",
      collapsed: true,
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
      compLayoutX: 0,
      compLayoutY: 0,
      compMorphX: 0,
      compMorphY: 0,
      compScaleX: 0,
      compScaleY: 0,
      compTextX: 0,
      compTextY: 0,
      compTextSize: 10,
      compLayoutDgs: 0,
      compDbcFrom: "",
      compDbcFroms: [],
      compDbcTo: "",
      compDbcTos: [],
      compModelSelection: [],
      diagramComponentTypes: [],
      rebuild_event: null,
    };
  },
  methods: {
    updateDiagram() {
      console.log("dispatch event");
      this.$bus.emit("rebuild_diagram");
    },
    getAllDiagramComponents() {
      this.diagramComponentNames = [];
      Object.keys(this.uiConfig.diagram.components).forEach((component) => {
        this.diagramComponentNames.push(component);
      });
    },
    cancelBuild() {
      this.selectedModelItems = [];
      this.editorMode = 0;
    },
    deleteComponent(compName) {
      this.editorMode = 3;
    },
    editComponent(compName) {
      this.editorMode = 2;
      // get all the properties
      this.selectedDiagramComponent =
        this.uiConfig.diagram.components[compName];

      // get all possible model types
      this.compModels = [];
      this.compModelSelection = [];

      switch (this.selectedDiagramComponent.compType) {
        case "BloodConnector":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("BloodCompartment");
          break;
        case "GasConnector":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("GasCompartment");
          break;
        case "Shunt":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
          this.compModelSelection = this.selectedDiagramComponent.models;
          this.compDbcFrom = this.selectedDiagramComponent.dbcFrom;
          this.compDbcTo = this.selectedDiagramComponent.dbcTo;
          this.findDiagramComponents("BloodCompartment");
          break;
        case "BloodCompartment":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
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
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
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
          this.selectComponentTypeToAdd(this.selectedDiagramComponent.compType);
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
      Object.keys(this.uiConfig.diagram.components).forEach((compName) => {
        if (this.uiConfig.diagram.components[compName].compType == compType) {
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
      this.compLayoutX = 0;
      this.compLayoutY = 0;
      this.compMorphX = 1;
      this.compMorphY = 1;
      this.compScaleX = 1;
      this.compScaleY = 1;
      this.compTextX = 0;
      this.compTextY = 0;
      this.compTextSize = 10;
    },
    addComponent(compType) {
      this.editorMode = 1;
      this.clearFields();
      this.selectComponentTypeToAdd(compType);
    },
    selectComponentTypeToAdd(compType) {
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
      console.log(this.selectedModelItems);
    },
    removeAllProps() {
      // this.selectedModelItems = [];
    },
    buildModelItemTree() {
      // build the grouperItem tree from the ui store
      this.modelsTree = {};
      // first find all models
      for (let model in explain.modelState.Models) {
        let modelType = explain.modelState.Models[model].ModelType;
        let props = [];
        if (!this.modelTypes.includes(modelType)) {
          this.modelTypes.push(modelType);
        }
        if (this.uiConfig.models[modelType]) {
          for (let prop in this.uiConfig.models[modelType].properties) {
            let propName =
              this.uiConfig.models[modelType].properties[prop].modelProp;
            let propSettings = this.uiConfig.models[modelType].properties[prop];
            props.push({
              propName: propName,
              propSettings: propSettings,
            });
          }

          this.modelsTree[model] = {
            model: model,
            modelType: modelType,
            props: props,
            value: "",
          };
        }
      }
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.buildModelItemTree);
  },
  mounted() {
    this.rebuild_event = new CustomEvent("rebuild_diagram");

    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildModelItemTree);
    // get the model state
    explain.getModelState();

    // get all diagram component types
    this.diagramComponentTypes = this.uiConfig.diagram.settings.componentTypes;

    // get all diagram component names
    this.getAllDiagramComponents();

    this.$bus.on("rebuild_diagram", () => console.log("timmie fromeditor"));
  },
};
</script>

<style></style>
