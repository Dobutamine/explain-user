<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      MECHANICAL VENTILATOR
    </div>

    <MultiChannelChart
      :id="chart._id"
      :caption="chart.caption"
      :models="chart.models"
      :props="chart.props"
      :channels="chart.channels"
      :collapsed="chart.collapsed"
      :enabled="chart.enabled"
      :analysisEnabled="chart.analysisEnabled"
      :autoscaleEnabled="chart.autoscaleEnabled"
      :multipliersEnabled="chart.multipliersEnabled"
      :exportEnabled="chart.exportEnabled"
      :fixedProp="true"
    ></MultiChannelChart>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import { useConfigStore } from "src/stores/config";
import MultiChannelChart from "./charts/MultiChannelChart.vue";
export default {
  setup() {
    const config = useConfigStore();
    return {
      config,
    };
  },
  components: {
    MultiChannelChart,
  },
  data() {
    return {
      collapsed: false,
      isEnabled: true,
      currentData: {},
      chart: {
        _id: "3456",
        caption: "Flow",
        models: ["MechanicalVentilator"],
        props: ["Flow", "Pres", "Volume"],
        channels: 3,
        collapsed: false,
        enabled: true,
        analysisEnabled: true,
        autoscaleEnabled: true,
        multipliersEnabled: false,
        exportEnabled: false,
      },
    };
  },
  methods: {},
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdateSlow);
    document.removeEventListener("state", this.stateUpdate);
    document.removeEventListener("rt", this.dataUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;

    try {
      document.removeEventListener("data_slow", this.dataUpdateSlow);
      document.removeEventListener("state", this.stateUpdate);
      document.removeEventListener("rt", this.dataUpdate);
    } catch {}

    document.addEventListener("data_slow", this.dataUpdateSlow);
    document.addEventListener("rt", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);
  },
};
</script>

<style></style>
