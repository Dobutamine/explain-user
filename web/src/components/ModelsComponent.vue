<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div v-if="!collapsed">
      <div class="q-mt-es row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedModel"
          :options="models"
          hide-bottom-space
          dense
          label="models"
          style="width: 90%; font-size: 12px"
          @update:model-value="modelSelected"
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <ModelPropUpdaterComponentVue
          v-if="selectedModel"
          :modelType="selectedModel"
          :props="props"
          style="width: 100%"
        ></ModelPropUpdaterComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import ModelPropUpdaterComponentVue from "./ModelPropUpdaterComponent.vue";
import { useUserInterfaceStore } from "src/stores/UserInterface";

export default {
  components: {
    ModelPropUpdaterComponentVue,
  },
  setup() {
    const uiConfig = useUserInterfaceStore();
    return {
      uiConfig,
    };
  },
  data() {
    return {
      title: "INDIVIDUAL MODEL PROPS",
      collapsed: true,
      models: ["BloodCompliance", "BloodResistor"],
      props: [],
      selectedModel: "",
    };
  },
  methods: {
    modelSelected() {
      this.props = this.uiConfig.models[this.selectedModel].properties;
    },
    cancel() {
      this.selectedModel = "";
    },
  },
  mounted() {},
};
</script>

<style></style>
