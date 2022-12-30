<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
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
import GasExchangerVue from "src/components/GasExchanger.vue";
import ContainerComponentVue from "src/components/ContainerComponent.vue";
import BloodComplianceVue from "src/components/BloodCompliance.vue";
import BloodResistorVue from "src/components/BloodResistor.vue";
import GasComplianceVue from "src/components/GasCompliance.vue";
import GasResistorVue from "src/components/GasResistor.vue";

export default {
  components: {
    BloodComplianceVue,
    BloodResistorVue,
    GasComplianceVue,
    GasResistorVue,
    GasExchangerVue,
    ContainerComponentVue,
  },
  data() {
    return {
      collapsed: false,
      relative: true,
      models: [
        "BloodCompliances",
        "BloodResistors",
        "GasCompliances",
        "GasResistors",
        "Gasexchangers",
        "Containers",
      ],
      selectedModel: "BloodCompliances",
      description: "In this component editing of the raw models is possible",
    };
  },
  mounted() {},
};
</script>

<style></style>
