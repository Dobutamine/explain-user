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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center">
        <q-btn
          color="grey-3"
          outline
          dark
          label="add diagram component"
          style="width: 80%"
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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center">
        <q-btn
          color="grey-3"
          outline
          dark
          label="edit diagram component"
          style="width: 80%"
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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center">
        <q-btn
          color="grey-3"
          outline
          dark
          label="delete diagram component"
          style="width: 80%"
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
      <div class="q-ma-sm q-gutter-sm row items-center"></div>
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
      notyet: true,
      title: "DIAGRAM EDITOR",
      collapsed: true,
      modelsTree: {},
      selectedModelType: [],
      selectedModelItems: [],
      modelTypes: [],
      selectedDiagramComponent: "",
      diagramComponentTypes: [],
    };
  },
  methods: {
    cancelBuild() {
      this.selectedModelItems = [];
    },
    selectComponentType(compType) {
      this.selectedDiagramComponent = compType;
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

    this.diagramComponentTypes = this.uiConfig.diagram.settings.componentTypes;
  },
};
</script>

<style></style>
