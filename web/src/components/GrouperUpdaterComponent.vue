<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div class="q-ma-sm">
      <div
        v-for="(grouperItem, key) in uiConfig.groupers[grouper]"
        :key="grouperItem.caption"
      >
        <SliderComponentVue
          :grouperItem="grouperItem"
          :grouperItemName="key"
          @grouperItemUpdate="updateGrouperItemFromChild"
        ></SliderComponentVue>
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
import SliderComponentVue from "./ui-elements/SliderComponent.vue";
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
  components: { SliderComponentVue },
  props: {
    grouper: String,
  },
  watch: {
    grouper(ng, og) {
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
    updateGrouperItemFromChild(grouperItem, value1, value2) {
      console.log(grouperItem);
      console.log(value1);
      console.log(value2);
    },
    cancel() {
      this.grouperItems = [];
    },
    newGrouperSelected() {
      // this.grouperItems = [];
      // for (let grouperItemName in this.uiConfig.groupers[this.grouper]) {
      //   this.grouperItems[(
      //     this.uiConfig.groupers[this.grouper][grouperItemName]
      //   );
      //   this.grouperValues[grouperItemName] = { value1: 100.0, value2: 100.0 };
      // }
      // console.log(this.grouperValues);
    },
  },
  mounted() {
    this.newGrouperSelected();
  },
};
</script>

<style></style>
