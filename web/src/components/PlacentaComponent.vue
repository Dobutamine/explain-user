<template>
  <q-card class="q-mt-sm" bordered>
    <div
      class="q-mt-es q-mb-sm row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      PLACENTA
    </div>

    <q-card class="q-ma-md bg-black" bordered>
      <div class="q-ma-sm row gutter text-overline justify-center">
        <div class="q-ml-md">
          <q-toggle
            v-model="placenta"
            label="placenta"
            size="sm"
            color="secondary"
            @update:model-value="togglePlacenta"
          />
        </div>
        <div v-if="placenta" class="q-ml-md">
          <q-toggle
            v-model="clamp"
            label="clamp"
            size="sm"
            color="secondary"
            @update:model-value="toggleClamp"
          />
        </div>
        <div class="q-ml-md">
          <q-toggle
            v-model="advanced"
            label="advanced"
            size="sm"
            color="secondary"
          />
        </div>
      </div>

      <div class="q-ma-sm row gutter text-overline justify-center">
        <div>
          <div class="row justify-center">ART</div>
          <q-knob
            v-model="uaResistance"
            :min="20"
            :max="100000"
            :step="1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeUaResistance"
          ></q-knob>
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">VEN</div>
          <q-knob
            v-model="uvResistance"
            :min="20"
            :max="100000"
            :step="1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeUvResistance"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">Sweep</div>
          <q-knob
            v-model="sweep"
            :min="0"
            :max="5"
            :step="0.1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeSweep"
          />
        </div>
        <div class="q-ml-md">
          <div class="row justify-center">CO2</div>
          <q-knob
            v-model="co2"
            :min="0"
            :max="100"
            :step="1"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeCo2"
          />
        </div>
        <!-- <div class="q-ml-md">
          <div class="row justify-center">Temp</div>
          <q-knob
            v-model="temp"
            :min="28"
            :max="40"
            :step="0.5"
            show-value
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeTemp"
          />
        </div> -->
      </div>

      <div
        v-if="advanced"
        class="q-ma-sm q-mt-md row gutter text-overline justify-center"
      >
        <div class="q-ml-xs q-mt-sm">
          <q-select
            v-model="drainageSite"
            stack-label
            label="Drainage site"
            type="number"
            :options="cannulationSites"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeDrainageSite"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-select
            v-model="drainageCannula"
            stack-label
            label="Drainage Fr"
            type="number"
            :options="cannulas"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeDrainageCannulaDiameter"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-select
            v-model="returnSite"
            stack-label
            label="Return site"
            type="number"
            :options="cannulationSites"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeReturnSite"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-select
            v-model="returnCannula"
            stack-label
            label="Return Fr"
            type="number"
            :options="cannulas"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeReturnCannulaDiameter"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-select
            v-model="tubingSize"
            stack-label
            label="Tubing (inch)"
            :options="tubings"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeTubingDiameter"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-input
            v-model="tubingLength"
            stack-label
            label="Tubing length (m)"
            type="number"
            :min="0.5"
            :max="5.0"
            :step="0.1"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeTubingLength"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-input
            v-model="tubingElastance"
            stack-label
            label="Tubing elastance"
            type="number"
            :min="100.0"
            :max="10000.0"
            :step="50"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeTubingElastance"
          />
        </div>
        <div class="q-ml-xs q-mt-sm">
          <q-input
            v-model="height"
            stack-label
            label="Bed height (m)"
            type="number"
            :min="0.0"
            :max="3.0"
            :step="0.1"
            outlined
            dense
            hide-hint
            :style="{ width: '120px' }"
            color="secondary"
            @update:model-value="changeBedHeight"
          />
        </div>
      </div>
      <div
        class="q-ma-sm q-mt-md row gutter text-overline justify-center"
      ></div>
    </q-card>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import { useConfigStore } from "src/stores/config";
import { useDiagramStore } from "src/stores/diagram";

export default {
  setup() {
    const config = useConfigStore();
    const diagram = useDiagramStore();
    return {
      config,
      diagram,
    };
  },
  components: {},
  data() {
    return {
      collapsed: false,
      isEnabled: true,
      currentData: {},
      uaResistance: 20.0,
      uvResistance: 20.0,
      uaResistanceSlider: 0,
      uaResistanceFactor: 1,
      rpm: 1500,
      flow: 500,
      fio2: 21,
      sweep: 1.4,
      co2: 40,
      temp: 37.0,
      drainageSite: "AD",
      drainageCannula: 12,
      returnSite: "IVCI",
      returnCannula: 10,
      cannulationSites: [],
      cannulas: [8, 10, 12, 13, 14, 16, 18],
      tubingSize: "1/4",
      tubings: ["1/4", "3/8", "1/2"],
      mode: "VA",
      height: 1.0,
      tubingLength: 1.5,
      tubingElastance: 1160,
      placenta: false,
      clamp: false,
      advanced: false,
    };
  },
  methods: {
    changeFiO2() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "Fo2",
          v: this.fio2 / 100.0,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeSweep() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "SweepGasFlow",
          v: this.sweep,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeCo2() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "Co2GasFlow",
          v: this.co2 / 1000,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeTemp() {},
    changeBedHeight() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "BedHeight",
          v: this.height,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeDrainageSite() {
      explain.rewireResistor([
        {
          m: "ArtificialWhomb._drainageSite_TubingIn",
          p: "CompFrom",
          v: this.drainageSite,
        },
      ]);
      this.$bus.emit("rewire", {
        m: "AwDrainage_TubingIn",
        p: "CompFrom",
        v: this.drainageSite,
      });
    },
    changeReturnSite() {
      explain.rewireResistor([
        {
          m: "ArtificialWhomb._tubingOut_ReturnSite",
          p: "CompTo",
          v: this.returnSite,
        },
      ]);
      this.$bus.emit("rewire", {
        m: "AwTubingOut_Return",
        p: "CompTo",
        v: this.returnSite,
      });
    },
    changeTubingDiameter() {
      let newDiameter = 0.0254 * 0.25;
      switch (this.tubingSize) {
        case "1/4":
          newDiameter = 0.0254 * 0.25;
          break;
        case "3/8":
          newDiameter = 0.0254 * 0.375;
          break;
        case "1/2":
          newDiameter = 0.0254 * 0.5;
          break;
      }
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "TubingDiameter",
          v: newDiameter,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeTubingLength() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "TubingInLength",
          v: this.tubingLength / 2,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "ArtificialWhomb",
          p: "TubingOutLength",
          v: this.tubingLength / 2,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeTubingElastance() {
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "TubingElastance",
          v: this.tubingElastance,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeDrainageCannulaDiameter() {
      let newDiameter = (0.33 * this.drainageCannula) / 1000.0;
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "DrainageCannulaDiameter",
          v: newDiameter,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeReturnCannulaDiameter() {
      let newDiameter = (0.33 * this.returnCannula) / 1000.0;
      explain.setModelProperties([
        {
          m: "ArtificialWhomb",
          p: "ReturnCannulaDiameter",
          v: newDiameter,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeUvResistance() {
      //this.uaResistanceFactor = this.translateSlider(this.uaResistanceSlider);
      explain.setModelProperties([
        {
          m: "PLF_UV",
          p: "RFor",
          v: this.uvResistance,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "PLF_UV",
          p: "RBack",
          v: this.uvResistance,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeUaResistance() {
      //this.uaResistanceFactor = this.translateSlider(this.uaResistanceSlider);
      explain.setModelProperties([
        {
          m: "UA_PLF",
          p: "RFor",
          v: this.uaResistance,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "UA_PLF",
          p: "RBack",
          v: this.uaResistance,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },

    toggleClamp() {
      explain.setModelProperties([
        {
          m: "AD_UA",
          p: "NoFlow",
          v: this.clamp,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "UV_IVCI",
          p: "NoFlow",
          v: this.clamp,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    translateFactor(f) {
      let sv = 0.0;
      if (f < 1.0) {
        sv = -(1.0 / f);
      }
      if (f > 1.0) {
        sv = f;
      }
      return sv;
    },
    translateSlider(s) {
      let f = 1.0;
      if (s > 0.1) {
        f = s;
      }
      if (s < -0.1) {
        f = -(1.0 / s);
      }
      return f;
    },
    togglePlacenta() {
      if (this.placenta) {
        this.diagram.updateDataCollector();
        explain.enable("Placenta");
      } else {
        explain.disable("Placenta");
      }
    },

    stateUpdate(state) {
      this.cannulationSites = [];

      Object.entries(explain.modelState.Models).forEach(([name, model]) => {
        if (
          model.ModelType === "BloodCompliance" ||
          model.ModelType === "BloodTimeVaryingElastance"
        ) {
          this.cannulationSites.push(name);
        }
      });

      this.placenta = explain.modelState.Models["Placenta"].IsEnabled;
      this.uaResistance = explain.modelState.Models["UA_PLF"].RFor;
      this.uvResistance = explain.modelState.Models["PLF_UV"].RFor;
      this.uaResistanceFactor = explain.modelState.Models["AD_UA"].RForFactor;
      this.uaResistanceSlider = this.translateFactor(this.uaResistanceFactor);

      this.tubingElastance =
        explain.modelState.Models["ArtificialWhomb"].TubingElastance;
      this.rpm = explain.modelState.Models["ArtificialWhomb"].Rpm;
      this.sweep = explain.modelState.Models["ArtificialWhomb"].SweepGasFlow;
      this.co2 =
        explain.modelState.Models["ArtificialWhomb"].Co2GasFlow * 1000.0;
      this.tubingLength =
        explain.modelState.Models["ArtificialWhomb"].TubingInLength +
        explain.modelState.Models["ArtificialWhomb"].TubingOutLength;
    },
  },
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdateSlow);
    document.removeEventListener("state", this.stateUpdate);
    document.removeEventListener("rt", this.dataUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;
    explain.getModelState();

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
