<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div class="q-ma-sm">
      <div v-for="(grouperItem, index) in grouperItems" :key="index">
        <SliderComponentVue
          :caption="grouperItem.caption"
          :caption1="grouperItem.caption1"
          :caption2="grouperItem.caption2"
          :min="grouperItem.min"
          :max="grouperItem.max"
          unit="%"
          :closable="grouperItem.closable"
          :splittable="grouperItem.splittable"
          :single="grouperItem.single"
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
      grouperItems: [],
      statusMessage: "",
    };
  },
  methods: {
    cancel() {
      this.grouperItems = [];
    },
    newGrouperSelected() {
      this.grouperItems = [];
      for (let grouperItemName in this.uiConfig.groupers[this.grouper]) {
        this.grouperItems.push(
          this.uiConfig.groupers[this.grouper][grouperItemName]
        );
      }
    },
  },
  mounted() {
    this.newGrouperSelected();
  },
};
</script>

<style></style>
