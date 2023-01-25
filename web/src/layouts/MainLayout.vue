<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-indigo-10 text-white headerCustomStyle"
      height-hint="68"
    >
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          Explanatory models in neonatology
        </q-toolbar-title>
        <div class="text-bold text-subtitle2 q-ml-sm">{{ user.name }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-8 text-white footerCustomStyle">
      <q-toolbar>
        <q-toolbar-title class="text-overline">
          <div>{{ statusMessage }}</div>
        </q-toolbar-title>
        <q-btn
          flat
          round
          dense
          size="sm"
          :icon="butIcon"
          :color="butColor"
          class="q-mr-sm"
          @click="togglePlay"
        />
        <q-btn
          flat
          round
          dense
          :icon="butCalcIcon"
          size="sm"
          @click="calculate"
          :color="butCalcColor"
          class="q-mr-sm"
        />
        <q-select
          class="q-ml-md q-mr-md"
          label-color="white"
          v-model="selectedDuration"
          :options="durations"
          hide-bottom-space
          dense
          label="calculate (sec.)"
          style="width: 130px; font-size: 12px"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { useUserStore } from "src/stores/user";
import { useUiStore } from "src/stores/ui";
import { explain } from "../boot/explain";

export default {
  setup() {
    const user = useUserStore();
    const uiConfig = useUiStore();
    return {
      user,
      uiConfig,
    };
  },
  data() {
    return {
      playArmed: false,
      calcRunning: false,
      rtState: false,
      butCaption: "PLAY",
      butColor: "white",
      butCalcColor: "white",
      butIcon: "fa-solid fa-play",
      butCalcIcon: "fa-solid fa-calculator",
      butCalcCaption: "CALCULATE",
      statusMessage: "No model definition file loaded.",
      selectedDuration: 3,
      durations: [1, 2, 3, 5, 10, 20, 30, 60, 120, 240, 360, 600, 1200, 1800],
    };
  },
  methods: {
    statusUpdate() {
      this.statusMessage = "STATUS: " + explain.statusMessage;
      this.calculationReady();
    },
    togglePlay() {
      this.rtState = !this.rtState;
      if (this.rtState) {
        this.uiConfig.updateDataCollector();
        this.playArmed = true;
        this.calculate();
        this.butColor = "negative";
        this.butIcon = "fa-solid fa-stop";
        this.butCaption = "STOP";
      } else {
        explain.stop();
        this.butColor = "white";
        this.butIcon = "fa-solid fa-play";
        this.butCaption = "PLAY";
      }
    },
    calculate() {
      this.calcRunning = !this.calcRunning;
      if (this.calcRunning) {
        this.butCalcColor = "negative";
        this.uiConfig.updateDataCollector();
        explain.calculate(parseInt(this.selectedDuration));
      }
    },
    calculationReady(e) {
      if (this.statusMessage.includes("calculation ready")) {
        this.calcRunning = false;
        this.butCalcCaption = "CALCULATE";
        this.butCalcColor = "white";
        if (this.playArmed) {
          this.playArmed = false;
          explain.start();
        }
      }
    },
    dataUpdate(e) {
      console.log(explain.modelData);
    },
  },
  beforeUnmount() {
    document.removeEventListener("status", this.statusUpdate);
  },
  mounted() {
    document.addEventListener("status", this.statusUpdate);
  },
};
</script>

<style scoped>
.headerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
.footerCustomStyle {
  height: 30px !important;
  display: flex;
  align-items: center !important;
}
</style>
