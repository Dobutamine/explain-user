<template>
  <div class="q-mt-sm">
    <div class="row q-gutter-xs justify-center">
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="update_diagram"
        >DIAGRAM</q-btn
      >
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="update_config"
        >CONFIG</q-btn
      >
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="update_definition"
        >DEF</q-btn
      >
      <q-btn
        :icon="butIcon"
        :color="butColor"
        size="sm"
        :style="{ width: '70px' }"
        @click="update_engine"
        >ENGINE</q-btn
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
import { useEngineStore } from "src/stores/engine";
import { useDefinitionStore } from "src/stores/definition";
import { useUserStore } from "src/stores/user";
import { useConfigStore } from "src/stores/config";
import { useDiagramStore } from "src/stores/diagram";
export default {
  setup() {
    const engine = useEngineStore();
    const definition = useDefinitionStore();
    const uiConfig = useConfigStore();
    const user = useUserStore();
    const config = useConfigStore();
    const diagram = useDiagramStore();
    return {
      engine,
      definition,
      uiConfig,
      user,
      config,
      diagram,
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
      statusMessage: "",
    };
  },
  methods: {
    async update_diagram() {
      const url = `${this.config.apiUrl}/api/diagrams/update_diagram?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.diagram.engine_version,
          user: this.diagram.user,
          name: this.diagram.name,
          definition: this.diagram.definition,
          protected: this.diagram.protected,
          shared: this.diagram.shared,
          settings: this.diagram.settings,
          components: this.diagram.components,
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
        console.log(this.statusMessage);
      }
    },
    async update_config() {
      const url = `${this.config.apiUrl}/api/configs/update_config?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.config.engine_version,
          user: this.config.user,
          definition: this.config.definition,
          apiUrl: this.config.apiUrl,
          models: { ...this.config.models },
          groupers: { ...this.config.groupers },
          charts: { ...this.config.charts },
          monitors: { ...this.config.monitors },
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new config created on server.";

            break;
          case "update":
            this.statusMessage = "config is updated on server.";
            break;
        }
        console.log(this.statusMessage);
      }
    },
    async update_definition() {
      const url = `${this.uiConfig.apiUrl}/api/definitions/update_definition?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.definition.engine_version,
          name: this.definition.name,
          description: this.definition.description,
          weight: this.definition.weight,
          user: this.definition.user,
          protected: this.definition.protected,
          shared: this.definition.shared,
          models: { ...this.definition.models },
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new definition created on server.";

            break;
          case "update":
            this.statusMessage = "definition is updated on server.";
            break;
        }
        console.log(this.statusMessage);
      }
    },
    async update_engine() {
      const url = `${this.uiConfig.apiUrl}/api/engines/update_engine?token=${this.user.token}`;
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          engine_version: this.engine.engine_version,
          active_experimental_models: [
            ...this.engine.active_experimental_models,
          ],
          modeling_stepsize: this.engine.modeling_stepsize,
          base_model_settings: { ...this.engine.base_model_settings },
          core_models: { ...this.engine.core_models },
          experimental_models: { ...this.engine.experimental_models },
        }),
      });
      if (response.status === 200) {
        let data = await response.json();
        switch (data.message) {
          case "new":
            this.statusMessage = "new engine created on server.";

            break;
          case "update":
            this.statusMessage = "engine is updated on server.";
            break;
        }
        console.log(this.statusMessage);
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
    try {
      document.removeEventListener("status", this.calculationReady);
    } catch {}
    document.addEventListener("status", this.calculationReady);
  },
};
</script>

<style></style>
