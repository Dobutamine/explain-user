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
              <div v-for="(model, index) in modelsTree" :key="index">
                <q-item clickable dense>
                  <q-item-section
                    clickable
                    v-close-popup
                    @click="modelSelected(model.model)"
                  >
                    {{ model.model }}
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="row justify-center">
        <q-input
          v-if="selectedModel !== ''"
          class="row q-ma-sm"
          dense
          :value="selectedModel"
          v-model="selectedModel"
          readonly
          label="selected model"
          :style="{ 'font-size': '12px', width: '90%' }"
        />
      </div>
      <div v-if="selectedModel !== ''">
        <div
          class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm"
        >
          <q-btn
            color="red-10"
            size="sm"
            style="width: 70px"
            @click="deleteModel"
            >DELETE</q-btn
          >
          <q-btn color="indigo-10" size="sm" style="width: 70px" @click="cancel"
            >CANCEL</q-btn
          >
        </div>
        <div
          class="q-gutter-sm row text-overline justify-center q-mb-xs"
          style="font-size: 10px"
        >
          {{ statusMessage }}
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import { useConfigStore } from "src/stores/config";
export default {
  components: {
    //BuildPropEditComponent,
  },
  setup() {
    const uiConfig = useConfigStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      notyet: true,
      title: "DELETE MODEL ELEMENT",
      collapsed: true,
      modelsTree: {},
      modelTypes: [],
      selectedModel: "",
      models: [],
      statusMessage: "",
    };
  },
  methods: {
    deleteModel() {},
    cancel() {
      this.selectedModel = "";
    },
    modelSelected(model) {
      this.selectedModel = model;
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
    try {
      document.removeEventListener("state", this.buildModelItemTree);
    } catch {}
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.buildModelItemTree);
    // get the model state
    explain.getModelState();
  },
};
</script>

<style></style>
