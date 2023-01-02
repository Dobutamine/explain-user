<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div>
      <div class="q-mt-xs row gutter text-overline justify-left">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedCompliance"
          :options="compliances"
          hide-bottom-space
          dense
          label="compliance"
          style="width: 50%; font-size: 12px"
          @update:model-value="complianceSelected"
        />
        <q-toggle
          class="q-ml-xs q-mt-md"
          size="xs"
          v-model="IsEnabled"
          label="Enabled"
          style="font-size: 10px"
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <NumberInputComponentVue
          caption="Vol"
          unit="mL"
          :min="0.0"
          :max="10000.0"
          :step="0.01"
          :value="Vol"
          @vol="(e) => (this.Vol = parseFloat(e))"
        >
        </NumberInputComponentVue>
        <NumberInputComponentVue
          caption="UVol"
          unit="mL"
          :min="0.0"
          :max="10000.0"
          :step="0.01"
          :value="Uvol"
          @uvol="(e) => (this.Uvol = parseFloat(e))"
        >
        </NumberInputComponentVue>

        <NumberInputComponentVue
          caption="Elbase"
          unit="mmHg/mL"
          :min="0.0"
          :max="10000.0"
          :step="0.01"
          :value="ElBase"
          @elbase="(e) => (this.ElBase = parseFloat(e))"
        >
        </NumberInputComponentVue>
        <NumberInputComponentVue
          caption="ElK"
          unit="mmHg/mL"
          :min="0.0"
          :max="10000.0"
          :step="0.01"
          :value="ElK"
          @elk="(e) => (this.ElK = parseFloat(e))"
        >
        </NumberInputComponentVue>
      </div>

      <div class="q-gutter-sm row text-overline justify-center q-mt-sm q-mb-sm">
        <q-btn
          color="red-10"
          size="sm"
          style="width: 70px"
          @click="updateCompliance"
          >UPDATE</q-btn
        >
        <q-btn
          color="secondary"
          size="sm"
          style="width: 70px"
          @click="addToScript"
          >SCRIPT</q-btn
        >
        <q-btn color="blue-10" size="sm" style="width: 70px">CANCEL</q-btn>
      </div>
      <div
        class="q-gutter-sm row text-overline justify-center q-mb-xs"
        style="font-size: 10px"
      >
        {{ statusMessage }}
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
import NumberInputComponentVue from "./ui-elements/NumberInputComponent.vue";
export default {
  components: {
    NumberInputComponentVue,
  },
  props: {
    mode: Number,
  },
  data() {
    return {
      collapsed: false,
      compliances: ["AA", "AAR", "AD"],
      selectedCompliance: "",
      statusMessage: "",
      IsEnabled: true,
      Description: "Aorta ascendens",
      Vol: 0.0,
      Uvol: 0.0,
      ElBase: 10.0,
      ElK: 1.0,
      modelState: {},
    };
  },
  methods: {
    addToScript() {
      this.statusMessage = "property change added to script";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    updateCompliance() {
      // compose a property list
      let updatePropList = [
        {
          m: this.selectedCompliance,
          p: "IsEnabled",
          v: this.IsEnabled,
          at: 0,
          it: 0.0,
        },
        {
          m: this.selectedCompliance,
          p: "Vol",
          v: this.Vol / 1000.0,
          at: 0,
          it: 0.0,
        },
        {
          m: this.selectedCompliance,
          p: "UVol",
          v: this.Uvol / 1000.0,
          at: 0,
          it: 0.0,
        },
        {
          m: this.selectedCompliance,
          p: "ElBase",
          v: this.ElBase * 1000.0,
          at: 0,
          it: 0.0,
        },
        {
          m: this.selectedCompliance,
          p: "ElK",
          v: this.ElK * 1000.0,
          at: 0,
          it: 0.0,
        },
      ];

      // set the new  properties
      explain.setModelProperties(updatePropList);

      // show user that the update has taken place
      this.statusMessage = "property updated";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    complianceSelected() {
      // find the relevant properties
      this.IsEnabled =
        explain.modelState.Models[this.selectedCompliance].IsEnabled;
      this.Vol =
        explain.modelState.Models[this.selectedCompliance].Vol * 1000.0;
      this.Uvol =
        explain.modelState.Models[this.selectedCompliance].UVol * 1000.0;
      this.ElBase =
        explain.modelState.Models[this.selectedCompliance].ElBase / 1000.0;
      this.ElK =
        explain.modelState.Models[this.selectedCompliance].ElK / 1000.0;
    },
    processModelState() {
      // get all the blood compliances
      this.compliances = [];
      for (let model in explain.modelState.Models) {
        if (explain.modelState.Models[model].ModelType == "BloodCompliance") {
          this.compliances.push(model);
        }
      }
    },
  },
  beforeUnmount() {
    // remove the model state event listener
    document.removeEventListener("state", this.processModelState);
  },
  mounted() {
    // add an event listener for when the model state is ready
    document.addEventListener("state", this.processModelState);

    // get the model state
    explain.getModelState();
  },
};
</script>

<style></style>
