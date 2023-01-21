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
          color="grey-3"
          class="col q-mr-sm"
          outline
          dark
          icon="fa-solid fa-add"
          size="sm"
        >
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
          color="grey-3"
          class="col q-mr-sm"
          outline
          dark
          icon="fa-solid fa-edit"
          size="sm"
        >
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
          color="grey-3"
          class="col"
          outline
          dark
          icon="fa-solid fa-trash-can"
          size="sm"
        >
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
      <div class="q-mt-xs q-mb-sm row text-overline justify-center"></div>
      <div class="q-mt-xs q-mb-sm row text-overline justify-center"></div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <BuildPropEditComponent
          :selectedModelItems="selectedModelItems"
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
      modelTypes: [],
    };
  },
  methods: {
    cancelBuild() {
      this.selectedModelItems = [];
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
  },
};
</script>

<style></style>
