<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div class="q-ma-sm">
      <div v-for="(grouper, index) in groupers" :key="index">
        <div
          v-for="(grouperItem, key) in uiConfig.groupers[grouper]"
          :key="grouperItem.caption"
        >
          <HeartRhythmGrouperComponentVue
            v-if="grouperItem.typeGrouper == 'heartRhythmGrouper'"
            :grouper="grouper"
            :grouperItem="grouperItem"
            :grouperItemName="key"
            @grouperItemUpdate="updateGrouperItemFromChild"
          >
          </HeartRhythmGrouperComponentVue>
          <SliderComponentVue
            v-if="grouperItem.typeGrouper == 'slider'"
            :grouper="grouper"
            :grouperItem="grouperItem"
            :grouperItemName="key"
            @grouperItemUpdate="updateGrouperItemFromChild"
          ></SliderComponentVue>
        </div>
      </div>
    </div>

    <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
      <q-btn color="red-10" size="sm" style="width: 70px">UPDATE</q-btn>
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
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import HeartRhythmGrouperComponentVue from "./groupers/HeartRhythmGrouperComponent.vue";
import SliderComponentVue from "./groupers/SliderComponent.vue";
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
  components: { SliderComponentVue, HeartRhythmGrouperComponentVue },
  props: {
    groupers: Array,
  },
  watch: {
    groupers(ng, og) {
      this.newGrouperSelected();
    },
  },
  data() {
    return {
      collapsed: false,
      grouperItems: {},
      statusMessage: "",
      changedGroupers: {},
    };
  },
  methods: {
    addToScript() {
      for (let changedGrouper in this.changedGroupers) {
        // process the changedGrouper list
        let model_prop = changedGrouper.split(".");
        const model = model_prop[0];
        const prop = model_prop[1];
        let newValue1 = this.changedGroupers[changedGrouper].value1;
        let newValue2 = this.changedGroupers[changedGrouper].value2;
        // update the script and ui store
        if (this.uiConfig.groupers[model][prop].value1) {
          this.script.script.push({
            m: model,
            p: prop,
            o: this.uiConfig.groupers[model][prop].value1,
            v: newValue1,
            it: 0.0,
            at: 0.0,
            state: "pending",
          });

          this.uiConfig.groupers[model][prop].value1 = newValue1;
        }
      }

      // reset the changeGrouper
      this.changedGroupers = {};
    },
    updateGrouperItemFromChild(grouper, grouperItem, value1, value2, combined) {
      let key = grouper + "." + grouperItem;
      this.changedGroupers[key] = { value1: value1, value2: value2 };

      // this.uiConfig.groupers[this.grouper][grouperItem].value1 = value1;
      // this.uiConfig.groupers[this.grouper][grouperItem].value2 = value2;
      this.uiConfig.groupers[grouper][grouperItem].single = combined;
    },
    cancel() {
      this.grouperItems = [];
    },
    newGrouperSelected() {
      // check for all the grouperItems if the initial value should be set other then 100%
      // for (let grouperItem in this.uiConfig.groupers[this.grouper]) {
      //   // check whether the initialValue index is not -1
      //   let initialValueIndex =
      //     this.uiConfig.groupers[this.grouper][grouperItem].initialValueIndex;
      //   if (initialValueIndex > -1) {
      //     // set the initial value
      //     let model =
      //       this.uiConfig.groupers[this.grouper][grouperItem].properties[
      //         initialValueIndex
      //       ].model;
      //     let modelProp =
      //       this.uiConfig.groupers[this.grouper][grouperItem].properties[
      //         initialValueIndex
      //       ].modelProp;
      //     let value = explain.modelState.Models[model][modelProp];
      //     this.uiConfig.groupers[this.grouper][grouperItem].value1 = value;
      //   }
      // }
    },
  },
  mounted() {
    this.newGrouperSelected();
  },
};
</script>

<style></style>
