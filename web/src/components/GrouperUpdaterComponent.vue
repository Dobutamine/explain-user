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
            :grouperItem="grouperItem"
            :grouperItemName="key"
            @grouperItemUpdate="updateGrouperItemFromChild"
          >
          </HeartRhythmGrouperComponentVue>
          <SliderComponentVue
            v-if="grouperItem.typeGrouper == 'slider'"
            :grouperItem="grouperItem"
            :grouperItemName="key"
            @grouperItemUpdate="updateGrouperItemFromChild"
          ></SliderComponentVue>
        </div>
      </div>
    </div>

    <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
      <q-btn color="red-10" size="sm" style="width: 70px">UPDATE</q-btn>
      <q-btn color="secondary" size="sm" style="width: 70px">SCRIPT</q-btn>
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
    };
  },
  methods: {
    updateGrouperItemFromChild(grouperItem, value1, value2, combined) {
      // this.uiConfig.groupers[this.grouper][grouperItem].value1 = value1;
      // this.uiConfig.groupers[this.grouper][grouperItem].value2 = value2;
      this.uiConfig.groupers[this.grouper][grouperItem].single = combined;
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
