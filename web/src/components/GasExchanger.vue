<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div>
      <div class="q-mt-es row gutter text-overline justify-left">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedExchanger"
          :options="exchangers"
          hide-bottom-space
          dense
          label="gas exchanger"
          style="width: 185px; font-size: 12px"
        />
        <q-toggle
          class="q-mt-md"
          size="xs"
          v-model="properties.IsEnabled"
          label="Enabled"
        />
      </div>

      <div class="q-ma-sm q-gutter-sm row items-center">
        <q-input
          v-model="properties.CompBlood"
          label="CompBlood"
          readonly
          filled
          hint=""
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.CompGas"
          label="CompGas"
          readonly
          filled
          hint=""
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.DifO2"
          label="DifO2"
          filled
          type="number"
          hint="mmol/mmHg"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.DifCO2"
          label="DifCo2"
          filled
          type="number"
          hint="mmol/mmHg"
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
      exchangers: ["GASEX_LL", "GASEX_LR"],
      selectedExchanger: "GASEX_LL",
      properties: {
        IsEnabled: true,
        Description: "Gasexchanger left lung",
        NoFlow: false,
        NoBackFlow: true,
        CompBlood: "LL",
        CompGas: "ALL",
        DifO2: 0.0,
        DifCO2: 0.0,
      },
    };
  },
  mounted() {},
};
</script>

<style></style>
