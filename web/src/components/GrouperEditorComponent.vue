<template>
  <q-card class="q-ma-sm">
    <div class="q-ma-sm">
      <div v-for="(grouperItem, index) in grouperItems" :key="index">
        <SliderComponentVue
          v-if="grouperItem.properties.typeGrouper == 'slider'"
          :grouperItem="grouperItem"
          @grouperItemUpdate="updateGrouperItemFromChild"
          @removegrouperitem="removeGrouperItem"
        ></SliderComponentVue>
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
        <q-btn color="negative" size="sm" style="width: 70px" @click="cancel"
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
import { useScriptStore } from "stores/script";
import { useConfigStore } from "src/stores/config";
import SliderComponentVue from "./groupers/SliderComponent.vue";

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
    SliderComponentVue,
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
    };
  },
  methods: {
    updateGroupers() {
      let counter = 0;
      for (let item in this.updateList) {
        counter += 1;
        let processedItem = item.split(".");
        let group = processedItem[0];
        let prop = processedItem[1];
        let value = this.updateList[item];
        this.uiConfig.groupers[group][prop].value = value;
      }
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
            it: 0.0,
            at: 0.0,
            t: "grouper",
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
      this.updateGroupers();
      this.cancel();
    });
  },
};
</script>

<style></style>
