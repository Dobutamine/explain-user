<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div>
      <div class="q-mt-es row gutter text-overline justify-left">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedCompliance"
          :options="compliances"
          hide-bottom-space
          dense
          label="gas compliance"
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
          v-model="properties.Vol"
          label="Vol"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.Uvol"
          label="UVol"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.ElBase"
          label="ElBase"
          filled
          type="number"
          hint="mmHg/mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="properties.ElK"
          label="ElK"
          hint="mmHg/mL"
          filled
          type="number"
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
      compliances: ["ALL", "ALR", "DS"],
      selectedCompliance: "ALL",
      properties: {
        IsEnabled: true,
        Description: "Alveolar left lung",
        Vol: 0.0,
        Uvol: 0.0,
        ElBase: 10.0,
        ElK: 1.0,
      },
    };
  },
  mounted() {},
};
</script>

<style></style>
