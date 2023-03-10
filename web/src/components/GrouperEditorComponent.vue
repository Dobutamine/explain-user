<template>
  <q-card class="q-ma-sm">
    <div class="q-ma-sm">
      <div v-for="(grouperItem, index) in grouperItems" :key="index">
        <AbsoluteComponent
          v-if="grouperItem.properties.typeGrouper == 'abs'"
          :grouperItem="grouperItem"
          @grouperItemUpdateDirect="updateGrouperItemFromChildDirect"
          @removegrouperitemdirect="removeGrouperItemDirect"
        ></AbsoluteComponent>
        <SliderComponentVue
          v-if="grouperItem.properties.typeGrouper == 'slider'"
          :grouperItem="grouperItem"
          @grouperItemUpdate="updateGrouperItemFromChild"
          @removegrouperitem="removeGrouperItem"
        ></SliderComponentVue>
        <SwitchComponent
          v-if="grouperItem.properties.typeGrouper == 'switch'"
          :grouperItem="grouperItem"
          @grouperItemUpdate="updateGrouperItemFromChild"
          @removegrouperitem="removeGrouperItem"
        ></SwitchComponent>
      </div>
    </div>

    <div v-if="grouperItems.length > 0">
      <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
        <q-btn
          color="primary"
          size="sm"
          style="width: 70px"
          @click="updateGroupers"
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
          size="sm"
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
import { useScriptStore } from "stores/script";
import { useConfigStore } from "src/stores/config";
import { useDefinitionStore } from "src/stores/definition";
import SliderComponentVue from "./groupers/SliderComponent.vue";
import SwitchComponent from "./groupers/SwitchComponent.vue";
import AbsoluteComponent from "./groupers/AbsoluteComponent.vue";

export default {
  setup() {
    const script = useScriptStore();
    const uiConfig = useConfigStore();
    const definition = useDefinitionStore();
    return {
      script,
      uiConfig,
      definition,
    };
  },
  components: {
    SliderComponentVue,
    AbsoluteComponent,
    SwitchComponent,
  },
  props: {
    grouperItems: Array,
  },
  data() {
    return {
      collapsed: false,
      statusMessage: "",
      grouperItemsList: [],
      processedGrouperItems: {},
      updateList: {},
      updateListDirect: {},
    };
  },
  methods: {
    translateGrouper(group, prop, value, update) {
      // get current grouper value
      let current_grouper_value = this.uiConfig.groupers[group][prop].value;
      // store new grouper value
      this.uiConfig.groupers[group][prop].value = value;
      // get the grouper props
      let grouperProps = this.uiConfig.groupers[group][prop];
      // define an model update object
      let updatePropObject = [];
      // iterate over the grouper properties
      grouperProps.properties.forEach((prop) => {
        // get the current value from explain
        let current_value =
          explain.modelState.Models[prop.model][prop.modelProp];
        // set the new value to the current value (safety)
        let new_value = current_value;
        // relative change?
        if (grouperProps.unit === "%") {
          let change =
            parseFloat(grouperProps.value) - parseFloat(current_grouper_value);
          // calculate the new value
          new_value =
            current_value +
            (current_value / current_grouper_value) * change * prop.factor;
        } else {
          new_value = value;
        }
        // build a new script entry
        updatePropObject.push({
          m: prop.model,
          p: prop.modelProp,
          v: new_value,
          it: 0.0,
          at: 0.0,
        });
      });
      // set the new model properties on the model
      if (update) {
        explain.setModelProperties(updatePropObject);
      }
    },
    updateGroupers(update = true) {
      let counter = 0;
      for (let item in this.updateList) {
        counter += 1;
        let processedItem = item.split(".");
        let group = processedItem[0];
        let prop = processedItem[1];
        let value = this.updateList[item];

        this.translateGrouper(group, prop, value, update);
      }

      let directUpdatePropObject = [];
      Object.entries(this.updateListDirect).forEach(([name, value]) => {
        let [model, prop] = name.split(".");
        if (value != explain.modelState.Models[model][prop]) {
          counter += 1;

          directUpdatePropObject.push({
            m: model,
            p: prop,
            v: value,
            it: 0.0,
            at: 0.0,
          });
          explain.setModelProperties(directUpdatePropObject);
        }
      });

      if (counter > 0) {
        // display the status message
        this.statusMessage = "groupers updated";
        setTimeout(() => (this.statusMessage = ""), 1000);
      } else {
        // display the status message
        this.statusMessage = "nothing changed";
        setTimeout(() => (this.statusMessage = ""), 1000);
      }

      // reset the updateProps list
      this.updateList = {};
    },
    addToScript() {
      let counter = 0;
      for (let item in this.updateList) {
        let processedItem = item.split(".");
        let group = processedItem[0];
        let prop = processedItem[1];
        let newValue = this.updateList[item];

        // get the current value
        if (newValue != this.uiConfig.groupers[group][prop].value) {
          // delete the prop as the prop is moved to the script, otherwise we get state problems
          //this.updateGroupers();
          //this.removeGrouperItem(group, prop);
          counter += 1;
          // update the script and ui store
          this.script.script.push({
            m: group,
            p: prop,
            o: this.uiConfig.groupers[group][prop].value,
            v: newValue,
            it: 5.0,
            at: 0.0,
            t: "grouper",
            state: "pending",
          });
        }
      }

      Object.entries(this.updateListDirect).forEach(([name, value]) => {
        let [model, prop] = name.split(".");
        console.log(model, prop, value);
        if (value != explain.modelState.Models[model][prop]) {
          counter += 1;
          this.script.script.push({
            m: model,
            p: prop,
            o: explain.modelState.Models[model][prop],
            v: value,
            it: 5.0,
            at: 0.0,
            t: "",
            state: "pending",
          });
        }
      });

      if (counter > 0) {
        this.statusMessage = "property change added to script";
        setTimeout(() => (this.statusMessage = ""), 1500);
      } else {
        this.statusMessage = "nothing changed!";
        setTimeout(() => (this.statusMessage = ""), 1500);
      }
    },
    updateGrouperItemFromChildDirect(props) {
      Object.entries(props).forEach(([name, value]) => {
        this.updateListDirect[name] = value;
      });
    },
    updateGrouperItemFromChild(grouper, grouperItem, value) {
      let key = grouper + "." + grouperItem;
      this.updateList[key] = value;
    },
    removeGrouperItem(grouper, grouperItem) {
      let key = grouper + "." + grouperItem;
      // delete from updatelist
      delete this.updateList[key];
      //propagate
      this.$emit("removegrouperitem", grouper, grouperItem);
    },
    removeGrouperItemDirect(grouper, grouperItem) {
      // delete from updatelist
      this.uiConfig.groupers[grouper][grouperItem].properties.forEach(
        (item) => {
          let key = item.model + "." + item.modelProp;
          delete this.updateListDirect[key];
        }
      );

      //propagate
      this.$emit("removegrouperitem", grouper, grouperItem);
    },
    cancel() {
      this.updateList = {};
      this.$emit("removeallgroupers");
    },

    newGrouperSelected() {
      // check for all the grouperItems if the initial value should be set other then 100%
      for (let g in this.grouperItems) {
        let grouper = this.grouperItems[g];
        for (let grouperItem in this.uiConfig.groupers[grouper]) {
          // check whether the initialValue index is not -1
          let initialValueIndex =
            this.uiConfig.groupers[grouper][grouperItem].initialValueIndex;
          if (initialValueIndex > -1) {
            // set the initial value
            let model =
              this.uiConfig.groupers[grouper][grouperItem].properties[
                initialValueIndex
              ].model;
            let modelProp =
              this.uiConfig.groupers[grouper][grouperItem].properties[
                initialValueIndex
              ].modelProp;
            let value = explain.modelState.Models[model][modelProp];
            this.uiConfig.groupers[grouper][grouperItem].value = value;
          }
        }
      }
    },
  },
  mounted() {
    this.$bus.on("update_groupers", () => {
      this.updateGroupers(false);
      this.cancel();
    });
  },
};
</script>

<style></style>
