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
      <div class="q-mt-es row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedModel"
          :options="models"
          hide-bottom-space
          dense
          label="select component type"
          style="width: 90%; font-size: 12px"
          @update:model-value="modelSelected"
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <ModelPropBuildComponentVue
          v-if="selectedModel"
          :modelType="selectedModel"
          :props="props"
          style="width: 100%"
        ></ModelPropBuildComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import ModelPropBuildComponentVue from "./ModelPropBuildComponent.vue";
import { useUserInterfaceStore } from "src/stores/userInterface";

export default {
  components: {
    ModelPropBuildComponentVue,
  },
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      title: "NEW MODEL COMPONENT",
      collapsed: true,
      models: [],
      props: [],
      options: [],
      selectedModel: "",
    };
  },
  methods: {
    modelSelected() {
      try {
        let found_options = [];
        this.props = this.uiConfig.models[this.selectedModel].properties;
        // if the selected model is a container then process the property with the optional models
        this.props.forEach((p) => {
          if (
            p.modelProp == "ContainedModels" ||
            p.modelProp == "CompFrom" ||
            p.modelProp == "CompTo" ||
            p.modelProp == "CompBlood" ||
            p.modelProp == "CompGas"
          ) {
            // iterate over the optionalModels property
            p.optionalModels.forEach((om) => {
              // iterate over all models to find the names
              for (let model in explain.modelState.Models) {
                if (explain.modelState.Models[model].ModelType == om) {
                  found_options.push(model);
                }
              }
            });
            p["options"] = found_options;
          }
        });
      } catch (e) {
        console.log(e);
        this.props = [];
      }
    },
    cancel() {
      this.selectedModel = "";
    },
    processModelState() {
      let modelTypes = [];
      for (let model in explain.modelState.Models) {
        modelTypes.push(explain.modelState.Models[model].ModelType);
      }
      // remove duplicates
      this.models = [...new Set(modelTypes)];
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.processModelState);
  },
  mounted() {
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.processModelState);

    // get the model state
    explain.getModelState();
  },
};
</script>

<style></style>
