<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div>
      <div class="q-mt-xs row gutter text-overline justify-left">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedModel"
          :options="models"
          hide-bottom-space
          dense
          label="compliance"
          style="width: 50%; font-size: 12px"
          @update:model-value="modelSelected"
        />
        <q-toggle
          class="q-ml-xs q-mt-md"
          size="xs"
          v-model="IsEnabled"
          label="Enabled"
          style="font-size: 10px"
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <div v-for="(prop, index) in props" :key="index">
          <NumberInputComponentVue
            v-if="prop.typeProp == 'numeric'"
            :caption="prop.caption"
            :modelProp="prop.modelProp"
            :unit="prop.unit"
            :min="prop.min"
            :step="prop.step"
            :value="propValues[prop.modelProp]"
            @propupdate="updatePropFromChild"
          >
          </NumberInputComponentVue>
        </div>
      </div>

      <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
        <q-btn color="red-10" size="sm" style="width: 70px" @click="updateProps"
          >UPDATE</q-btn
        >
        <q-btn
          color="secondary"
          size="sm"
          style="width: 70px"
          @click="addToScript"
          >SCRIPT</q-btn
        >
        <q-btn color="blue-10" size="sm" style="width: 70px">CANCEL</q-btn>
      </div>
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
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";
export default {
  components: {
    NumberInputComponentVue,
  },
  props: {
    modelType: String,
    props: Array,
  },
  watch: {
    modelType(nmt, omt) {
      this.selectedModel = "";
      this.processModelState();
    },
  },
  data() {
    return {
      collapsed: false,
      models: [],
      selectedModel: "",
      statusMessage: "",
      IsEnabled: true,
      propValues: {},
    };
  },
  methods: {
    updatePropFromChild(propName, propValue) {
      this.propValues[propName] = propValue;
    },
    addToScript() {
      this.statusMessage = "property change added to script";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    updateProps() {
      console.log(this.propValues);
      this.statusMessage = "property updated";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    modelSelected() {
      // update the values of the props
      this.props.forEach((p) => {
        this.propValues[p.modelProp] =
          explain.modelState.Models[this.selectedModel][p.modelProp];
      });
    },
    processModelState() {
      // get all the blood compliances
      this.models = [];
      for (let model in explain.modelState.Models) {
        if (explain.modelState.Models[model].ModelType === this.modelType) {
          this.models.push(model);
        }
      }
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
