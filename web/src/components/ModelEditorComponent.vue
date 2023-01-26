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

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useConfigStore();
    return {
      script,
      uiConfig,
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
      console.log(this.selectedModelItems);
    },
    findModelProperties() {
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
