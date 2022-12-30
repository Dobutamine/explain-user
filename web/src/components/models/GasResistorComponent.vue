<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div>
      <div class="q-mt-es row gutter text-overline justify-left">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedResistor"
          :options="resistors"
          hide-bottom-space
          dense
          label="gas resistor"
          style="width: 185px; font-size: 12px"
        />
        <q-toggle
          class="q-mt-md"
          size="xs"
          v-model="properties.IsEnabled"
          label="Enabled"
        />
      </div>

      <div class="q-mt-es row gutter text-overline justify-left">
        <q-toggle
          class="q-ml-md"
          size="xs"
          v-model="properties.NoFlow"
          label="NoFlow"
          style="width: 90px"
        />
        <q-toggle
          class="q-ml-md"
          size="xs"
          v-model="properties.NoBackFlow"
          label="NoBackFlow"
          style="width: 90px"
        />
      </div>
      <div class="q-ma-sm q-gutter-sm row items-center">
        <q-input
          v-model="properties.CompFrom"
          label="CompFrom"
          readonly
          filled
          hint=""
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.CompTo"
          label="CompTo"
          readonly
          filled
          hint=""
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.RFor"
          label="RFor"
          filled
          type="number"
          hint="mL/s*mmHg"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.RBack"
          label="RBack"
          filled
          type="number"
          hint="mL/s*mmHg"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.Rk"
          label="Rk"
          filled
          type="number"
          hint="mL/s*mmHg"
          dense
          stack-label
          style="max-width: 90px"
        />
      </div>

      <div class="q-gutter-sm row text-overline justify-center q-mb-sm">
        <q-btn color="red-10" size="sm">UPDATE</q-btn>
        <q-btn color="blue-10" size="sm">CANCEL</q-btn>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      collapsed: true,
      resistors: ["DS_ALL", "DS_ALR", "MOUTH_DS"],
      selectedResistor: "DS_ALL",
      properties: {
        IsEnabled: true,
        Description: "Dead space to alveolar left lung",
        NoFlow: false,
        NoBackFlow: true,
        CompFrom: "DS",
        CompTo: "ALL",
        RFor: 0.0,
        RBack: 0.0,
        Rk: 10.0,
      },
    };
  },
  mounted() {},
};
</script>

<style></style>
