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
          <div
            class="col q-mr-xs text-left text-secondary"
            :style="{ 'font-size': '10px' }"
          >
            {{ field.label }} {{ field.unit }}
          </div>
          <q-input
            v-model="field.value"
            color="blue"
            hide-hint
            filled
            readonly
            dense
            stack-label
            style="max-width: 90px; font-size: 16px"
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
    data_type: Number,
    parameters: Array,
  },
  components: {},
  data() {
    return {
      isEnabled: true,
      currentData: {},
      mutableParameters: [],
    };
  },
  methods: {
    dataUpdateSlow() {
      if (!this.isEnabled) return;

      this.currentData =
        explain.modelDataSlow[explain.modelDataSlow.length - 1];

      this.mutableParameters.forEach((param) => {
        param.value = "";
        if (param.props.length > 1) {
          // two values
          for (let i = 0; i < param.props.length; i++) {
            if (this.currentData[param.props[i]] !== undefined) {
              param.value +=
                (this.currentData[param.props[i]] * param.factor).toFixed(
                  param.rounding
                ) + "/";
            } else {
              param.value = "--";
            }
          }
          // slice off the last value, removing the /
          param.value = param.value.slice(0, -1);
        } else {
          if (this.currentData[param.props[0]] !== undefined) {
            param.value = (
              this.currentData[param.props[0]] * param.factor
            ).toFixed(param.rounding);
          } else {
            param.value = "-";
          }
        }
      });
    },
    dataUpdate() {
      if (!this.isEnabled) return;

      this.currentData = explain.modelData[explain.modelData.length - 1];
      this.mutableParameters.forEach((param) => {
        param.value = "";
        if (param.props.length > 1) {
          // two values
          for (let i = 0; i < param.props.length; i++) {
            param.value +=
              (this.currentData[param.props[i]] * param.factor).toFixed(
                param.rounding
              ) + "/";
          }
          // slice off the last value, removing the /
          param.value = param.value.slice(0, -1);
        } else {
          param.value = (
            this.currentData[param.props[0]] * param.factor
          ).toFixed(param.rounding);
        }
      });
    },
    stateUpdate() {},
  },
  beforeUnmount() {
    document.removeEventListener("data_slow", this.dataUpdateSlow);
    document.removeEventListener("state", this.stateUpdate);
  },
  mounted() {
    this.isEnabled = !this.collapsed;
    this.mutableParameters = [...this.parameters];

    try {
      document.removeEventListener("data_slow", this.dataUpdateSlow);
      document.removeEventListener("state", this.stateUpdate);
    } catch {}

    document.addEventListener("data_slow", this.dataUpdateSlow);
    document.addEventListener("state", this.stateUpdate);
  },
};
</script>

<style></style>
