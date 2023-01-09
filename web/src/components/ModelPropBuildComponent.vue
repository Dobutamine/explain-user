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
          label="select model type"
          style="width: 80%"
          size="sm"
        >
          <q-menu dark>
            <q-list dense>
              <div v-for="(modelType, index) in modelTypes" :key="index">
                <q-item clickable dense>
                  <q-item-section clickable v-close-popup>
                    {{ modelType }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <ModelPropEditComponentVue
          :selectedModelItems="selectedModelItems"
          style="width: 100%"
          @propdelete="deleteProp"
          @removeallprops="removeAllProps"
        ></ModelPropEditComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import ModelPropEditComponentVue from "./ModelPropEditComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";
export default {
  components: {
    ModelPropEditComponentVue,
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
      title: "EDIT MODEL PROPS",
      collapsed: true,
      modelsTree: {},
      selectedModelType: [],
      modelTypes: [],
    };
  },
  methods: {
    removeAllProps() {
      // this.selectedModelItems = [];
    },
    deleteProp(model, prop) {
      // // make sure the object does exits
      // let index = -1;
      // for (let gi in this.selectedModelItems) {
      //   if (
      //     this.selectedModelItems[gi].model == model &&
      //     this.selectedModelItems[gi].prop.propName == prop
      //   ) {
      //     index = gi;
      //   }
      // }
      // // if the grouperItem is found then remove it from the list
      // if (index > -1) {
      //   this.selectedModelItems.splice(index, 1);
      // }
    },
    addModelProp(model, modelType, prop) {
      // // make sure the object doesn't exist
      // let index = -1;
      // for (let gi in this.selectedModelItems) {
      //   if (
      //     this.selectedModelItems[gi].model == model &&
      //     this.selectedModelItems[gi].prop == prop
      //   ) {
      //     index = gi;
      //   }
      // }
      // // if the grouperItem is not found add it the list
      // if (index < 0) {
      //   // find the current value
      //   this.selectedModelItems.push({
      //     model: model,
      //     modelType: modelType,
      //     prop: prop,
      //     value: explain.modelState.Models[model][prop.propSettings.modelProp],
      //   });
      // }
    },

    buildModelItemTree() {
      // build the grouperItem tree from the ui store
      this.modelsTree = {};
      // first find all models
      for (let model in explain.modelState.Models) {
        let modelType = explain.modelState.Models[model].ModelType;
        if (!this.modelTypes.includes(modelType)) {
          this.modelTypes.push(modelType);
        }
        let props = [];
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
