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
      <!-- topline buttons -->
      <div
        class="q-pa-sm q-mt-xs q-mb-sm q-ml-md q-mr-md row text-overline justify-center"
      >
        <q-btn color="primary" class="col q-mr-sm" label="add" dark size="sm">
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelType, index) in modelTypes" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModelType(modelType)"
                  >
                    {{ modelType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn
          color="secondary"
          class="col q-mr-sm"
          label="edit"
          dark
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelName, index) in modelNames" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModel(modelName)"
                  >
                    {{ modelName }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn color="negative" class="col" label="delete" dark size="sm">
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelType, index) in modelTypes" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="selectModelType(modelType)"
                  >
                    {{ modelType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <BuildPropEditComponent
          :modelName="selectedModelName"
          :selectedModelItems="selectedModelItems"
          :editMode="editMode"
          @cancelbuild="cancelBuild"
        >
        </BuildPropEditComponent>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import BuildPropEditComponent from "./BuildPropEditComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";
export default {
  components: {
    BuildPropEditComponent,
  },
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      notyet: true,
      title: "MODEL EDITOR",
      collapsed: true,
      modelsTree: {},
      selectedModelType: [],
      selectedModelItems: [],
      editMode: 0,
      modelTypes: [],
      modelNames: [],
      selectedModelName: "",
    };
  },
  methods: {
    cancelBuild() {
      this.selectedModelItems = [];
    },
    selectModel(modelName) {
      // find the properties of the model
      let modelType = explain.modelState.Models[modelName].ModelType;
      // store the model name
      this.selectedModelName = modelName;
      // search the properties needed for this modeltype in the uiconfig
      this.editMode = 1;
      this.selectedModelItems = [];
      this.selectedModelItems = this.uiConfig.models[modelType].properties;
    },
    selectModelType(modeltype) {
      // search the properties needed for this modeltype in the uiconfig
      this.editMode = 0;
      this.selectedModelName = "";
      this.selectedModelItems = [];
      this.selectedModelItems = this.uiConfig.models[modeltype].properties;
    },
    removeAllProps() {
      // this.selectedModelItems = [];
    },
    buildModelItemTree() {
      // build the grouperItem tree from the ui store
      this.modelsTree = {};
      this.modelNames = [];
      // first find all models
      for (let model in explain.modelState.Models) {
        this.modelNames.push(model);
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
  },
};
</script>

<style></style>
