<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      MECHANICAL VENTILATOR
    </div>

    <MultiChannelChart
      class="q-ma-sm"
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
    <q-card class="q-pb-sm q-ma-md bg-black" bordered>
      <div class="q-ma-sm row gutter text-overline justify-center">
        <div>
          <div class="row justify-center">Mode</div>
          <q-btn-toggle
            v-model="mode"
            toggle-color="secondary"
            :options="[
              { label: 'PC', value: 'PC' },
              { label: 'PRVC', value: 'PRVC' },
              { label: 'VC', value: 'VC' },
            ]"
            @update:model-value="changeMode"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Synchronized</div>
          <q-toggle
            v-model="synchronized"
            color="secondary"
            @update:model-value="changeSynchro"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Breathing</div>
          <q-toggle
            v-model="breathing"
            color="secondary"
            @update:model-value="changeBreathing"
          />
        </div>
      </div>
      <div class="q-ma-sm row gutter text-overline justify-center">
        <div>
          <div class="row justify-center">Tin</div>
          <q-knob
            v-model="inspTime"
            :min="0.1"
            :max="1.0"
            :step="0.1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeInspTime"
          ></q-knob>
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Freq</div>
          <q-knob
            v-model="freq"
            :min="0"
            :max="100"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeFreq"
          />
        </div>
        <div v-if="mode === 'PC'" class="q-ml-md">
          <div class="row justify-center">Pip</div>
          <q-knob
            v-model="pip"
            :min="0"
            :max="50"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changePip"
          />
        </div>
        <div v-if="mode !== 'PC'" class="q-ml-md">
          <div class="row justify-center">PipMax</div>
          <q-knob
            v-model="pipMax"
            :min="0"
            :max="50"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changePipMax"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Peep</div>
          <q-knob
            v-model="peep"
            :min="0"
            :max="50"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changePeep"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Flow</div>
          <q-knob
            v-model="inspFlow"
            :min="1"
            :max="20"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeInspFlow"
          ></q-knob>
        </div>
        <div v-if="mode !== 'PC'" class="q-ml-md">
          <div class="row justify-center">TV</div>
          <q-knob
            v-model="tidalVolume"
            :min="1"
            :max="50"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeTidalVolume"
          ></q-knob>
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">FiO2</div>
          <q-knob
            v-model="fio2"
            :min="21"
            :max="100"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeFiO2"
          ></q-knob>
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Trigger</div>
          <q-knob
            v-model="triggerVolume"
            :min="0.1"
            :max="10"
            :step="0.1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeTrigger"
          ></q-knob>
        </div>
      </div>
    </q-card>
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
      inspTime: 0.4,
      inspFlow: 8,
      freq: 40,
      pip: 10,
      pipMax: 40,
      peep: 5,
      tidalVolume: 15,
      fio2: 21,
      mode: "PC",
      triggerVolume: 0.5,
      synchronized: false,
      breathing: false,
      chart: {
        _id: "3456",
        caption: "Flow",
        models: ["MechanicalVentilator"],
        props: ["Pres", "Flow", "Volume"],
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
  methods: {
    changeBreathing() {
      explain.setModelProperties([
        {
          m: "Breathing",
          p: "BreathingEnabled",
          v: this.breathing,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeTrigger() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "TriggerVolume",
          v: parseFloat(this.triggerVolume / 1000.0),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeMode() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "Mode",
          v: this.mode,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeFiO2() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "FiO2",
          v: parseFloat(this.fio2 / 100),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeTidalVolume() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "TidalVolume",
          v: parseFloat(this.tidalVolume / 1000.0),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changePip() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "Pip",
          v: parseFloat(this.pip * 0.7355),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changePipMax() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "PipMax",
          v: parseFloat(this.pipMax * 0.7355),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changePeep() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "Peep",
          v: parseFloat(this.peep * 0.7355),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeInspTime() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "InspTime",
          v: parseFloat(this.inspTime),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeInspFlow() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "InspFlow",
          v: parseFloat(this.inspFlow),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeFreq() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "VentRate",
          v: parseFloat(this.freq),
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeSynchro() {
      explain.setModelProperties([
        {
          m: "MechanicalVentilator",
          p: "Synchronized",
          v: this.synchronized,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    stateUpdate(state) {
      this.inspTime =
        explain.modelState.Models["MechanicalVentilator"].InspTime;
      this.inspFlow =
        explain.modelState.Models["MechanicalVentilator"].InspFlow;
      this.freq = explain.modelState.Models["MechanicalVentilator"].VentRate;
      this.pip = explain.modelState.Models["MechanicalVentilator"].Pip * 1.359;
      this.pip = parseFloat(this.pip.toFixed(0));
      this.pipMax =
        explain.modelState.Models["MechanicalVentilator"].PipMax * 1.359;
      this.pipMax = parseFloat(this.pipMax.toFixed(0));
      this.peep =
        explain.modelState.Models["MechanicalVentilator"].Peep * 1.359;
      this.peep = parseFloat(this.peep.toFixed(0));
      this.fio2 = explain.modelState.Models["MechanicalVentilator"].FiO2 * 100;
      this.fio2 = parseFloat(this.fio2.toFixed(0));
      this.tidalVolume =
        explain.modelState.Models["MechanicalVentilator"].TidalVolume * 1000;
      this.tidalVolume = parseFloat(this.tidalVolume.toFixed(0));
      this.triggerVolume =
        explain.modelState.Models["MechanicalVentilator"].TriggerVolume * 1000;
      this.triggerVolume = parseFloat(this.triggerVolume.toFixed(1));
      this.mode = explain.modelState.Models["MechanicalVentilator"].Mode;
      this.synchronized =
        explain.modelState.Models["MechanicalVentilator"].Synchronized;
      this.breathing = explain.modelState.Models["Breathing"].BreathingEnabled;
    },
  },
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
