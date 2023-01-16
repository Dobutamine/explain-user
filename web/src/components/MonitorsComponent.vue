<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      {{ title }}
    </div>
    <div v-if="parameters.length > 0 && isEnabled">
      <div class="q-ma-sm q-gutter-xs row items-center">
        <div v-for="(field, index) in mutableParameters" :key="index">
          <q-input
            v-model="field.value"
            :label="field.label"
            :hint="field.unit"
            filled
            readonly
            dense
            stack-label
            style="max-width: 90px"
            squared
          />
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { explain } from "../boot/explain";
export default {
  props: {
    title: String,
    collapsed: Boolean,
    parameters: Array,
  },
  data() {
    return {
      isEnabled: true,
      currentData: {},
      mutableParameters: [],
    };
  },
  methods: {
    dataUpdate() {
      this.currentData =
        explain.modelDataSlow[explain.modelDataSlow.length - 1];

      this.mutableParameters.forEach((param) => {
        param.value = "";
        if (param.props.length > 1) {
          // two values
          for (let i = 0; i < param.props.length; i++) {
            param.value +=
              this.currentData[param.props[i]].toFixed(param.rounding) + "/";
          }
          // slice off the last value
          param.value = param.value.slice(0, -1);
        } else {
          param.value = this.currentData[param.props[0]].toFixed(
            param.rounding
          );
        }
      });
    },
    stateUpdate() {},
  },
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdate);
    document.removeEventListener("state", this.stateUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;
    this.mutableParameters = [...this.parameters];
    document.addEventListener("data_slow", this.dataUpdate);
    document.addEventListener("state", this.stateUpdate);
  },
};
</script>

<style></style>
