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
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <BloodComplianceVue
          v-if="selectedModel == 'BloodCompliances'"
        ></BloodComplianceVue>
        <BloodResistorVue
          v-if="selectedModel == 'BloodResistors'"
        ></BloodResistorVue>
        <GasComplianceVue
          v-if="selectedModel == 'GasCompliances'"
        ></GasComplianceVue>
        <GasResistorVue v-if="selectedModel == 'GasResistors'"></GasResistorVue>
        <GasExchangerVue
          v-if="selectedModel == 'Gasexchangers'"
        ></GasExchangerVue>
        <ContainerComponentVue
          v-if="selectedModel == 'Containers'"
        ></ContainerComponentVue>
      </div>
    </div>
  </q-card>
</template>

<script>
import GasExchangerVue from "./models/GasExchangerComponent.vue";
import ContainerComponentVue from "./models/ContainerComponent.vue";
import BloodComplianceVue from "./models/BloodComplianceComponent.vue";
import BloodResistorVue from "./models/BloodResistorComponent.vue";
import GasComplianceVue from "./models/GasComplianceComponent.vue";
import GasResistorVue from "./models/GasResistorComponent.vue";

export default {
  components: {
    BloodComplianceVue,
    BloodResistorVue,
    GasComplianceVue,
    GasResistorVue,
    GasExchangerVue,
    ContainerComponentVue,
  },
  props: {
    mode: Number,
  },
  data() {
    return {
      title: "INDIVIDUAL MODEL PROPS",
      collapsed: true,
      relative: true,
      models: [
        "BloodCompliances",
        "BloodResistors",
        "GasCompliances",
        "GasResistors",
        "Gasexchangers",
        "Containers",
      ],
      selectedModel: "",
      description: "In this component editing of the raw models is possible",
    };
  },
  methods: {
    cancel() {
      this.selectedModel = "";
    },
  },
  mounted() {},
};
</script>

<style></style>
