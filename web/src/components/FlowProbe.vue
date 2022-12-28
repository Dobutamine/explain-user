<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      FLOW PROBE
    </div>

    <div v-if="isEnabled">
      <ChartComponent></ChartComponent>
    </div>
  </q-card>
</template>

<script>
import ChartComponent from "./ChartComponent.vue";
export default {
  components: {
    ChartComponent,
  },
  data() {
    return {
      isEnabled: true,
      hr: 125,
      sv: 1.8,
      co: 225,
      abp: "60/40",
      pap: "40/20",
      cvp: 5,
      lvo: 225,
      rvo: 225,
      ivcFlow: 120,
      svcFlow: 120,
      myoFlow: 5,
      brainFlow: 10,
      daFlow: 0.0,
      foFlow: 0.0,
      vsdFlow: 0.0,
    };
  },
};
</script>

<style></style>
