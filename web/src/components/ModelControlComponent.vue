<template>
  <div class="q-mt-sm">
    <div class="row q-gutter-xs justify-center">
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="test"
        >TEST</q-btn
      >
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="togglePlay"
        >{{ butCaption }}</q-btn
      >
      <q-btn
        :icon="butCalcIcon"
        :color="butCalcColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="calculate"
        >{{ butCalcCaption }}</q-btn
      >
      <q-select
        class="q-ml-md q-mr-md"
        label-color="negative"
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
import { useSettingsStore } from "src/stores/settings";
import { useUiStore } from "src/stores/ui";
import { useUserStore } from "src/stores/user";
export default {
  setup() {
    const settings = useSettingsStore();
    const uiConfig = useUiStore();
    const user = useUserStore();
    return {
      settings,
      uiConfig,
      user,
    };
  },
  data() {
    return {
      calcRunning: false,
      rtState: false,
      butCaption: "PLAY",
      butColor: "secondary",
      butIcon: "fa-solid fa-play",
      butCalcIcon: "fa-solid fa-play",
      butCalcCaption: "CALCULATE",
      butCalcColor: "primary",
      selectedDuration: 5,
      durations: [1, 3, 5, 10, 20, 30, 60, 120, 240, 360, 600, 1200, 1800],
    };
  },
  methods: {
    async test() {
      const url = `${this.uiConfig.settings.apiUrl}/api/settings/update_setting?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.settings.engine_version,
          active_experimental_models: [
            ...this.settings.active_experimental_models,
          ],
          modeling_stepsize: this.settings.modeling_stepsize,
          base_model_settings: { ...this.settings.base_model_settings },
          core_models: { ...this.settings.core_models },
          experimental_models: { ...this.settings.experimental_models },
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new diagram created on server.";
            break;
          case "update":
            this.statusMessage = "diagram is updated on server.";
            break;
        }
      }
    },
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
        console.log("yep");
        this.butCalcCaption = "RUNNING";
        this.butCalcColor = "negative";
        this.butCalcIcon = "fa-solid fa-stop";
        explain.calculate(parseInt(this.selectedDuration));
      } else {
        this.butCalcCaption = "CALCULATE";
        this.butCalcColor = "primary";
        this.butCalcIcon = "fa-solid fa-play";
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
