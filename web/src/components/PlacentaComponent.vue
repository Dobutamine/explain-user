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
      </div>

      <div class="q-ma-sm row gutter text-overline justify-center">
        <div>
          <div class="row justify-center">Res</div>
          <q-knob
            v-model="resistance"
            :min="15"
            :max="50000"
            :step="1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row"
            @update:model-value="changeResistance"
          ></q-knob>
        </div>
        <div>
          <div class="row justify-center q-ml-md">Elas</div>
          <q-knob
            v-model="elastance"
            :min="1000"
            :max="50000"
            :step="1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row q-ml-lg"
            @update:model-value="changeElastance"
          ></q-knob>
        </div>
        <div>
          <div class="row justify-center q-ml-md">To2</div>
          <q-knob
            v-model="to2"
            :min="0"
            :max="10"
            :step="0.1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row q-ml-lg"
            show-value
            @update:model-value="changeTo2"
          ></q-knob>
        </div>
        <div>
          <div class="row justify-center q-ml-md">Tco2</div>
          <q-knob
            v-model="tco2"
            :min="24"
            :max="35"
            :step="0.1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            show-value
            track-color="grey-3"
            class="row q-ml-lg"
            @update:model-value="ChangeTco2"
          ></q-knob>
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
      resistance: 250.0,
      elastance: 5000,
      placenta: false,
      clamp: false,
      advanced: false,
      to2: 7.8,
      tco2: 27.4,
    };
  },
  methods: {
    changeTo2() {
      explain.setModelProperties([
        {
          m: "Placenta",
          p: "MaternalTo2",
          v: this.to2,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    ChangeTco2() {
      explain.setModelProperties([
        {
          m: "Placenta",
          p: "MaternalTco2",
          v: this.tco2,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },
    changeElastance() {
      explain.setModelProperties([
        {
          m: "Placenta",
          p: "Elastance",
          v: this.elastance,
          at: 0.0,
          it: 0.0,
        },
      ]);
    },

    changeResistance() {
      explain.setModelProperties([
        {
          m: "Placenta",
          p: "Resistance",
          v: this.resistance,
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
      this.resistance = explain.modelState.Models["Placenta"].Resistance;
      this.elastance = explain.modelState.Models["Placenta"].Elastance;
      this.to2 = explain.modelState.Models["Placenta"].MaternalTo2;
      this.tco2 = explain.modelState.Models["Placenta"].MaternalTco2;
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
