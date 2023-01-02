<template>
  <div class="q-mt-sm">
    <div class="row q-gutter-xs justify-center">
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="togglePlay"
        >{{ butCaption }}</q-btn
      >
      <q-btn
        icon="fa-solid fa-calculator"
        :color="butCalcColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="calculate"
        >{{ butCalcCaption }}</q-btn
      >
      <q-select
        class="q-ml-md q-mr-md"
        label-color="red-6"
        v-model="selectedDuration"
        :options="durations"
        hide-bottom-space
        dense
        label="calculate (sec.)"
        style="width: 110px; font-size: 10px"
      />
    </div>
  </div>
</template>

<script>
import { explain } from "../boot/explain";
export default {
  data() {
    return {
      calcRunning: false,
      rtState: false,
      butCaption: "PLAY",
      butColor: "secondary",
      butIcon: "fa-solid fa-play",
      butCalcCaption: "CALCULATE",
      butCalcColor: "primary",
      selectedDuration: 5,
      durations: [1, 3, 5, 10, 20, 30, 60, 120, 240, 360, 600, 1200, 1800],
    };
  },
  methods: {
    togglePlay() {
      this.rtState = !this.rtState;
      if (this.rtState) {
        explain.start();
        this.butColor = "negative";
        this.butIcon = "fa-solid fa-stop";
        this.butCaption = "STOP";
      } else {
        explain.stop();
        this.butColor = "secondary";
        this.butIcon = "fa-solid fa-play";
        this.butCaption = "PLAY";
      }
    },
    calculate() {
      this.calcRunning = !this.calcRunning;
      if (this.calcRunning) {
        this.butCalcCaption = "RUNNING";
        this.butCalcColor = "negative";
        explain.calculate(parseInt(this.selectedDuration));
      } else {
        this.butCalcCaption = "CALCULATE";
        this.butCalcColor = "primary";
      }
    },
    calculationReady() {
      this.calcRunning = false;
      this.butCalcCaption = "CALCULATE";
      this.butCalcColor = "primary";
    },
  },
  beforeUnmount() {
    document.removeEventListener("status", this.calculationReady);
  },
  mounted() {
    document.addEventListener("status", this.calculationReady);
  },
};
</script>

<style></style>
