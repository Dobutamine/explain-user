<template>
  <q-card class="q-ma-sm">
    <div class="q-ma-sm">
      <div
        v-for="(selectedModelItem, index) in selectedModelItems"
        :key="index"
      >
        <div
          v-if="selectedModelItem.prop.propSettings.typeProp == 'numeric'"
          class="row q-mt-sm"
        >
          <NumberInputComponentVue
            :modelName="selectedModelItem.model"
            :caption="selectedModelItem.prop.propSettings.caption"
            :modelProp="selectedModelItem.prop.propSettings.modelProp"
            :unit="selectedModelItem.prop.propSettings.unit"
            :min="selectedModelItem.prop.propSettings.min"
            :step="selectedModelItem.prop.propSettings.step"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            :displayFactor="selectedModelItem.prop.propSettings.displayFactor"
            :displayRounding="
              selectedModelItem.prop.propSettings.displayRounding
            "
            @propupdate="updatePropFromChild"
            @propdelete="deleteProp"
          >
          </NumberInputComponentVue>
        </div>
        <div
          v-if="selectedModelItem.prop.propSettings.typeProp == 'boolean'"
          class="row q-mt-sm"
        >
          <BooleanInputComponentVue
            :caption="selectedModelItem.prop.propSettings.caption"
            :modelName="selectedModelItem.model"
            :modelProp="selectedModelItem.prop.propSettings.modelProp"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="updatePropFromChild"
            @propdelete="deleteProp"
          >
          </BooleanInputComponentVue>
        </div>
        <div
          v-if="selectedModelItem.prop.propSettings.typeProp == 'list'"
          class="row q-mt-sm"
        >
          <ListInputComponentVue
            :caption="selectedModelItem.prop.propSettings.caption"
            :modelName="selectedModelItem.model"
            :modelProp="selectedModelItem.prop.propSettings.modelProp"
            :options="selectedModelItem.prop.propSettings.optionalModels"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="updatePropFromChild"
            @propdelete="deleteProp"
          >
          </ListInputComponentVue>
        </div>
        <div
          v-if="selectedModelItem.prop.propSettings.typeProp == 'multilist'"
          class="row q-mt-sm"
        >
          <MultipleListInputComponentVue
            :caption="selectedModelItem.prop.propSettings.caption"
            :modelName="selectedModelItem.model"
            :modelProp="selectedModelItem.prop.propSettings.modelProp"
            :options="selectedModelItem.prop.propSettings.optionalModels"
            :value="selectedModelItem.value"
            :initValue="selectedModelItem.value"
            @propupdate="updatePropFromChild"
            @propdelete="deleteProp"
          >
          </MultipleListInputComponentVue>
        </div>
      </div>
    </div>

    <div v-if="selectedModelItems.length > 0">
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
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import MultipleListInputComponentVue from "./ui-elements/MultipleListInputComponent.vue";
import ListInputComponentVue from "./ui-elements/ListInputComponent.vue";
import BooleanInputComponentVue from "./ui-elements/BooleanInputComponent.vue";
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";
import { useScriptStore } from "stores/script";
import { useUserInterfaceStore } from "src/stores/userInterface";

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useUserInterfaceStore();
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
    selectedModelItems: Array,
  },
  data() {
    return {
      statusMessage: "",
      updateList: {},
    };
  },
  methods: {
    deleteProp(model, prop) {
      // propagate the message
      this.$emit("propdelete", model, prop);
    },
    cancel() {
      this.$emit("removeallprops");
    },
    updatePropFromChild(modelName, propName, propValue) {
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
          // delete the prop as the prop is moved to the script, otherwise we get state problems
          this.deleteProp(model, prop);
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
  },
  beforeUnmount() {
    // remove the model state event listener
  },
  mounted() {},
};
</script>

<style></style>
