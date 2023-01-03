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
          label="sub model"
          style="width: 100%; font-size: 12px"
          @update:model-value="modelSelected"
        />
      </div>
      <div class="q-ma-sm q-gutter-xs row">
        <div v-for="(prop, index) in props" :key="index">
          <BooleanInputComponentVue
            v-if="prop.typeProp == 'boolean'"
            :caption="prop.caption"
            :modelProp="prop.modelProp"
            :value="propValues[prop.modelProp]"
            @propupdate="updatePropFromChild"
          >
          </BooleanInputComponentVue>
        </div>
      </div>
      <div class="q-ma-sm q-gutter-sm row justify-left">
        <div v-for="(prop, index) in props" :key="index">
          <NumberInputComponentVue
            v-if="prop.typeProp == 'numeric'"
            :caption="prop.caption"
            :modelProp="prop.modelProp"
            :unit="prop.unit"
            :min="prop.min"
            :step="prop.step"
            :value="propValues[prop.modelProp]"
            :displayFactor="prop.displayFactor"
            @propupdate="updatePropFromChild"
          >
          </NumberInputComponentVue>
        </div>
      </div>
      <div class="q-ma-sm row justify-left">
        <div v-for="(prop, index) in props" :key="index">
          <ListInputComponentVue
            v-if="prop.typeProp == 'list'"
            :caption="prop.caption"
            :modelProp="prop.modelProp"
            :value="propValues[prop.modelProp]"
            :options="prop.options"
            @propupdate="updatePropFromChild"
          >
          </ListInputComponentVue>
        </div>
      </div>
      <div class="q-ma-sm row justify-left">
        <div v-for="(prop, index) in props" :key="index">
          <MultipleListInputComponentVue
            v-if="prop.typeProp == 'multilist'"
            :caption="prop.caption"
            :modelProp="prop.modelProp"
            :value="propValues[prop.modelProp]"
            :options="prop.options"
            @propupdate="updatePropFromChild"
          >
          </MultipleListInputComponentVue>
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
        <q-btn color="indigo-10" size="sm" style="width: 70px">CANCEL</q-btn>
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
import MultipleListInputComponentVue from "./ui-elements/MultipleListInputComponent.vue";
import ListInputComponentVue from "./ui-elements/ListInputComponent.vue";
import BooleanInputComponentVue from "./ui-elements/BooleanInputComponent.vue";
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";

export default {
  components: {
    MultipleListInputComponentVue,
    ListInputComponentVue,
    NumberInputComponentVue,
    BooleanInputComponentVue,
  },
  props: {
    modelType: String,
    props: Array,
  },
  watch: {
    props(np, op) {
      this.propValues = {};
    },
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
      // newProperties is an array of ojects containing the new settings with form {m: model, p: prop, v: value, at: time, it: time}
      let updatePropObject = [];

      // iterate over all props and build an prop update object
      for (let pv in this.propValues) {
        updatePropObject.push({
          m: this.selectedModel,
          p: pv,
          v: this.propValues[pv],
          at: 0.0,
          it: 0.0,
        });
      }

      console.log(updatePropObject);

      // set the new model properties on the model
      explain.setModelProperties(updatePropObject);

      this.statusMessage = "property updated";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    modelSelected() {
      // update the values of the props
      this.propValues = [];
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
