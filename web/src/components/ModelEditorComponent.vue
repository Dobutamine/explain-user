<template>
  <q-card class="q-ma-sm">
    <div>
      <q-input
        v-if="selectedModelItems.length > 0"
        class="row q-mb-md"
        dense
        v-model="newModelName"
        label="model name"
        :style="{ 'font-size': '12px', width: '100%' }"
      />
      <div
        v-for="(selectedModelItem, index) in selectedModelItems"
        :key="index"
      >
        <div v-if="selectedModelItem.typeProp == 'numeric'" class="row q-mt-sm">
          <NumberInputComponentVue
            :modelName="newModelName"
            :caption="selectedModelItem.caption"
            :modelProp="selectedModelItem.modelProp"
            :unit="selectedModelItem.unit"
            :min="selectedModelItem.min"
            :step="selectedModelItem.step"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            :displayFactor="selectedModelItem.displayFactor"
            :displayRounding="selectedModelItem.displayRounding"
            @propupdate="propUpdate"
          >
          </NumberInputComponentVue>
        </div>
        <div v-if="selectedModelItem.typeProp == 'boolean'" class="row q-mt-sm">
          <BooleanInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="propUpdate"
          >
          </BooleanInputComponentVue>
        </div>
        <div v-if="selectedModelItem.typeProp == 'list'" class="row q-mt-sm">
          <ListInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :options="selectedModelItem.optionalModels"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="propUpdate"
          >
          </ListInputComponentVue>
        </div>
        <div
          v-if="selectedModelItem.typeProp == 'multilist'"
          class="row q-mt-sm"
        >
          <MultipleListInputComponentVue
            :caption="selectedModelItem.caption"
            :modelName="newModelName"
            :modelProp="selectedModelItem.modelProp"
            :options="selectedModelItem.optionalModels"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="propUpdate"
          >
          </MultipleListInputComponentVue>
        </div>
      </div>
    </div>

    <div v-if="selectedModelItems.length > 0">
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
          color="secondary"
          size="sm"
          style="width: 70px"
          @click="saveModelProperties"
          >SAVE</q-btn
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
import MultipleListInputComponentVue from "./ui-elements/MultipleListInputComponent.vue";
import ListInputComponentVue from "./ui-elements/ListInputComponent.vue";
import BooleanInputComponentVue from "./ui-elements/BooleanInputComponent.vue";
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";
import { useScriptStore } from "stores/script";
import { useConfigStore } from "src/stores/config";
import { useEngineStore } from "src/stores/engine";
import { useDefinitionStore } from "src/stores/definition";
import { useUserStore } from "src/stores/user";

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useConfigStore();
    const engine = useEngineStore();
    const definition = useDefinitionStore();
    const user = useUserStore();
    return {
      script,
      uiConfig,
      engine,
      definition,
      user,
    };
  },
  components: {
    MultipleListInputComponentVue,
    ListInputComponentVue,
    NumberInputComponentVue,
    BooleanInputComponentVue,
  },
  props: {
    modelName: String,
    selectedModelItems: Array,
    editMode: Number, // 0 is new, 1 = existing
  },
  watch: {
    modelName(nv, ov) {
      this.newModelName = nv;
      this.findModelProperties();
    },
  },
  data() {
    return {
      newModelName: "",
      statusMessage: "",
      value: 0.0,
      updateList: [],
    };
  },
  mounted() {
    // get the model state
    explain.getModelState();
  },
  methods: {
    propUpdate(modelName, propName, propValue) {
      let key = modelName + "." + propName;
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
      console.log(newModelState);
    },
    findModelProperties() {
      console.log(explain.modelState);
      explain.getModelState();
      this.selectedModelItems.forEach((item) => {
        this.value = explain.modelState.Models[this.modelName][item.modelProp];
        item["value"] = this.value;
      });
    },
    addToModel() {
      if (this.newModelName === "") {
        alert("Give your model component a name!");
      }
    },
    cancel() {
      this.$emit("cancelbuild");
    },
  },
};
</script>

<style></style>
