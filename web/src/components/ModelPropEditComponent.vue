<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div v-for="(selectedModelItem, index) in selectedModelItems" :key="index">
      <div
        v-if="selectedModelItem.prop.propSettings.typeProp == 'numeric'"
        class="q-ma-sm q-gutter-sm row justify-left"
      >
        <NumberInputComponentVue
          :caption="selectedModelItem.prop.propSettings.caption"
          :modelProp="selectedModelItem.prop.propSettings.modelProp"
          :unit="selectedModelItem.prop.propSettings.unit"
          :min="selectedModelItem.prop.propSettings.min"
          :step="selectedModelItem.prop.propSettings.step"
          :value="selectedModelItem.value"
          :displayFactor="selectedModelItem.prop.propSettings.displayFactor"
          :displayRounding="selectedModelItem.prop.propSettings.displayRounding"
          @propupdate="updatePropFromChild"
        >
        </NumberInputComponentVue>
      </div>
    </div>

    <!-- <div class="q-ma-sm q-gutter-xs row">
        <BooleanInputComponentVue
          v-if="prop.typeProp == 'boolean'"
          :caption="prop.caption"
          :modelProp="prop.modelProp"
          :value="propValues[prop.modelProp]"
          @propupdate="updatePropFromChild"
        >
        </BooleanInputComponentVue>
      </div>

      <div class="q-ma-sm row justify-left">
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
      <div class="q-ma-sm row justify-left">
        <MultipleListInputComponentVue
          v-if="prop.typeProp == 'multilist'"
          :caption="prop.caption"
          :modelProp="prop.modelProp"
          :value="propValues[prop.modelProp]"
          :options="prop.options"
          @propupdate="updatePropFromChild"
        >
        </MultipleListInputComponentVue>
      </div> -->
    <div>
      <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
        <q-btn color="red-10" size="sm" style="width: 70px">UPDATE</q-btn>
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
    // MultipleListInputComponentVue,
    // ListInputComponentVue,
    NumberInputComponentVue,
    // BooleanInputComponentVue,
  },
  props: {
    selectedModelItems: Array,
  },
  watch: {
    selectedModelItems(n, o) {
      this.displayList = this.selectedModelItems;
    },
  },
  data() {
    return {
      statusMessage: "",
      displayList: [],
    };
  },
  methods: {
    cancel() {},
    updatePropFromChild(propName, propValue) {
      //this.propValues[propName] = propValue;
    },
    addToScript() {
      // let counter = 0;
      // // only script the changed values
      // for (let pv in this.propValues) {
      //   if (this.propValues[pv] != this.initPropValues[pv]) {
      //     // build script event
      //     counter += 1;
      //     this.script.script.push({
      //       m: this.selectedModel,
      //       p: pv,
      //       o: this.initPropValues[pv],
      //       v: this.propValues[pv],
      //       it: 0.0,
      //       at: 0.0,
      //       state: "pending",
      //     });
      //     // prevent updating again
      //     this.initPropValues[pv] = this.propValues[pv];
      //   }
      // }
      // if (counter > 0) {
      //   this.statusMessage = "property change added to script";
      //   setTimeout(() => (this.statusMessage = ""), 1500);
      // } else {
      //   this.statusMessage = "nothing has changed!";
      //   setTimeout(() => (this.statusMessage = ""), 1500);
      // }
    },
    updateProps() {
      // // newProperties is an array of ojects containing the new settings with form {m: model, p: prop, v: value, at: time, it: time}
      // let updatePropObject = [];
      // // iterate over all props and build an prop update object
      // for (let pv in this.propValues) {
      //   updatePropObject.push({
      //     m: this.selectedModel,
      //     p: pv,
      //     v: this.propValues[pv],
      //     at: 0.0,
      //     it: 0.0,
      //   });
      //   // update also the initial values
      //   this.initPropValues[pv] = this.propValues[pv];
      // }
      // // set the new model properties on the model
      // explain.setModelProperties(updatePropObject);
      // this.statusMessage = "property updated";
      // setTimeout(() => (this.statusMessage = ""), 1000);
    },
  },
  beforeUnmount() {
    // remove the model state event listener
  },
  mounted() {},
};
</script>

<style></style>
