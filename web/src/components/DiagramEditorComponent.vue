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
                    @click="selectComponentTypeToAdd(diagramComponentType)"
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
                    @click="selectDiagramComponent(diagramComponentName)"
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
                v-for="(diagramComponentType, index) in diagramComponentTypes"
                :key="index"
              >
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectComponentType(diagramComponentType)"
                  >
                    {{ diagramComponentType }}
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
          v-if="editorMode == 0 || editorMode == 2"
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
          <div v-if="compType == 'BloodCompartment'">
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
        </div>

        <div v-if="editorMode == 1"></div>
        <div v-if="editorMode == 2"></div>
        <div v-if="editorMode == 3"></div>
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
      compModelSelection: [],
      diagramComponentTypes: [],
    };
  },
  methods: {
    getAllDiagramComponents() {
      this.diagramComponentNames = [];
      Object.keys(this.uiConfig.diagram.components).forEach((component) => {
        this.diagramComponentNames.push(component);
      });
    },
    cancelBuild() {
      this.selectedModelItems = [];
    },
    selectDiagramComponent(compName) {
      // get all the properties
      this.selectedDiagramComponent =
        this.uiConfig.diagram.components[compName];

      console.log(this.selectedDiagramComponent);
      switch (this.selectedDiagramComponent.compType) {
        case "BloodCompartment":
          this.compType = this.selectedDiagramComponent.compType;
          this.compName = compName;
          this.compLabel = this.selectedDiagramComponent.label;
          this.compModels = this.selectedDiagramComponent.models;
          this.compLayoutDgs = this.selectedDiagramComponent.layout.pos.dgs;
          this.compLayoutX = this.selectedDiagramComponent.layout.pos.x;
          this.compLayoutY = this.selectedDiagramComponent.layout.pos.y;
          this.compMorphX = this.selectedDiagramComponent.layout.morph.x;
          this.compMorphY = this.selectedDiagramComponent.layout.morph.y;
          this.compScaleX = this.selectedDiagramComponent.layout.scale.x;
          this.compScaleY = this.selectedDiagramComponent.layout.scale.y;
          this.compTextX = this.selectedDiagramComponent.layout.text.x;
          this.compTextX = this.selectedDiagramComponent.layout.text.x;
          this.compTextY = this.selectedDiagramComponent.layout.text.y;
          this.compTextSize = this.selectedDiagramComponent.layout.text.size;
          this.compModelSelection = this.compModels;
          break;
      }
    },
    selectComponentTypeToAdd(compType) {
      this.compType = compType;
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
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildModelItemTree);
    // get the model state
    explain.getModelState();

    // get all diagram component types
    this.diagramComponentTypes = this.uiConfig.diagram.settings.componentTypes;

    // get all diagram component names
    this.getAllDiagramComponents();
  },
};
</script>

<style></style>
