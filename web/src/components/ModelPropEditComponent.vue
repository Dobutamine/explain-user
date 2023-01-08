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
    MultipleListInputComponentVue,
    ListInputComponentVue,
    NumberInputComponentVue,
    BooleanInputComponentVue,
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
    deleteProp(model, prop) {
      // propagate the message
      this.$emit("propdelete", model, prop);
    },
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
