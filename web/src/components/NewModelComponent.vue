<template>
  <q-card
    class="q-ma-sm q-pa-sm"
    :style="{ 'font-size': '12px', width: '100%' }"
  >
    <div>
      new model of type {{ modelType }}
      <div
        class="q-col-gutter-none"
        v-for="(modelProp, index) in modelProps"
        :key="index"
      >
        {{ modelProp }}
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

export default {
  setup() {},
  components: {},
  props: {
    modelProps: Array,
    modelType: String,
    modelName: String,
  },

  data() {
    return {
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
    saveModelProperties() {
      // save the model state to the server
      let modelState = { ...explain.modelState };

      // build a new model definition object
      let newModelState = {
        engine_version: 0.1,
        name: this.definition.name,
        description: this.definition.description,
        weight: this.definition.weight,
        user: this.user.name,
        protected: this.definition.protected,
        shared: this.definition.shared,
        models: {},
      };
      // iterate over the models in the modelState object
      Object.entries(modelState.Models).forEach(([model_name, model]) => {
        let modelType = model.ModelType;
        newModelState.models[model_name] = {};
        // find the modelType in the engine definition file
        Object.entries(this.engine.base_model_settings).forEach(
          ([prop_name, prop]) => {
            // get the value of this input from the current modelstate
            let current_value = modelState.Models[model_name][prop_name];
            // set the current_value in the models object
            newModelState.models[model_name][prop_name] = current_value;
          }
        );
        Object.entries(this.engine.core_models[modelType].inputs).forEach(
          ([input_name, input]) => {
            // get the value of this input from the current modelstate
            let current_value = modelState.Models[model_name][input_name];
            if (current_value !== undefined) {
              // set the current_value in the models object
              newModelState.models[model_name][input_name] = current_value;
            }
          }
        );
        if (this.engine.core_models[modelType].outputs !== undefined) {
          Object.entries(this.engine.core_models[modelType].outputs).forEach(
            ([output_name, input]) => {
              try {
                // get the value of this input from the current modelstate
                let current_value = modelState.Models[model_name][output_name];
                if (current_value !== undefined) {
                  // set the current_value in the models object
                  newModelState.models[model_name][output_name] = current_value;
                }
              } catch {}
            }
          );
        }
      });
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
