<template>
  <q-card
    class="q-ma-sm q-pa-sm"
    :style="{ 'font-size': '12px', width: '100%' }"
  >
    <div>
      <div
        class="q-col-gutter-none"
        v-for="(modelProp, index) in modelProps"
        :key="index"
      >
        <!-- {{ modelProp }} -->
        <StringInputComponent
          v-if="modelProp.type === 'String'"
          :name="modelProp.name"
          :unit="modelProp.unit"
          :default="modelProp.current_value"
          :value="modelProp.current_value"
        ></StringInputComponent>
        <NumberInputComponent
          v-if="modelProp.type === 'Number'"
          :name="modelProp.name"
          :unit="modelProp.unit"
          :default="modelProp.current_value"
          :value="modelProp.current_value"
        ></NumberInputComponent>
      </div>
    </div>

    <div v-if="modelProps.length > 0">
      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-xs">
        <q-btn
          color="primary"
          size="sm"
          style="width: 70px"
          @click="updateProps"
          >UPDATE</q-btn
        >
        <q-btn
          color="secondary"
          size="sm"
          style="width: 70px"
          @click="addToScript"
          >SCRIPT</q-btn
        >
        <q-btn
          color="negative"
          size="xs"
          dense
          style="width: 50px"
          @click="cancel"
          icon="fa-solid fa-xmark"
        ></q-btn>
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
import StringInputComponent from "./ui-elements/StringInputComponent.vue";
import NumberInputComponent from "./ui-elements/NumberInputComponent.vue";

export default {
  setup() {},
  components: {
    StringInputComponent,
    NumberInputComponent,
  },
  props: {
    modelProps: Array,
    modelType: String,
    modelName: String,
  },
  data() {
    return {
      props: [],
      statusMessage: "",
      value: 0.0,
      updateList: [],
    };
  },
  methods: {
    propUpdate(propName, propValue) {
      let key = this.modelName + "." + propName;
      this.updateList[key] = propValue;
    },
    addToScript() {
      let counter = 0;
      for (let item in this.updateList) {
        let processed_item = item.split(".");
        let model = processed_item[0];
        let prop = processed_item[1];

        // get the current value
        let currentValue = explain.modelState.Models[model][prop];
        if (this.updateList[item] != currentValue) {
          counter += 1;
          this.script.script.push({
            m: model,
            p: prop,
            o: currentValue,
            v: this.updateList[item],
            it: 0.0,
            at: 0.0,
            t: "model",
            state: "pending",
          });
        }
      }
      if (counter > 0) {
        this.statusMessage = "property change added to script";
        setTimeout(() => (this.statusMessage = ""), 1500);
      } else {
        this.statusMessage = "nothing changed!";
        setTimeout(() => (this.statusMessage = ""), 1500);
      }

      // reset the updateProps list
      this.updateList = {};
    },
    updateProps() {
      // newProperties is an array of ojects containing the new settings with form {m: model, p: prop, v: value, at: time, it: time}
      let updatePropObject = [];
      // iterate over all props and build an prop update object
      for (let item in this.updateList) {
        let processed_item = item.split(".");
        let model = processed_item[0];
        let prop = processed_item[1];

        updatePropObject.push({
          m: model,
          p: prop,
          v: this.updateList[item],
          at: 0.0,
          it: 0.0,
        });
      }
      // set the new model properties on the model
      explain.setModelProperties(updatePropObject);

      // display the status message
      this.statusMessage = "properties updated";
      setTimeout(() => (this.statusMessage = ""), 1000);

      // reset the updateProps list
      this.updateList = {};
    },
    addToModel() {
      if (this.newModelName === "") {
        alert("Give your model component a name!");
      }
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style></style>
