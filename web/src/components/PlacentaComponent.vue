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
          <div class="row justify-center">Resistance</div>
          <q-knob
            v-model="resistance"
            :min="15"
            :max="50000"
            :step="1"
            size="50px"
            :thickness="0.22"
            color="secondary"
            track-color="grey-3"
            class="row q-ml-sm"
            @update:model-value="changeResistance"
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
      resistance: 20.0,
      placenta: false,
      clamp: false,
      advanced: false,
    };
  },
  methods: {
    changeResistance() {
      explain.setModelProperties([
        {
          m: "PLF_UV",
          p: "RFor",
          v: this.resistance,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "PLF_UV",
          p: "RBack",
          v: this.resistance,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "UA_PLF",
          p: "RFor",
          v: this.resistance,
          at: 0.0,
          it: 0.0,
        },
        {
          m: "UA_PLF",
          p: "RBack",
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
      this.resistance = explain.modelState.Models["UA_PLF"].RFor;
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
