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
          label="blood compliance"
          style="width: 90%; font-size: 12px"
        />
      </div>
      <div class="q-mt-sm row gutter text-overline justify-left">
        <q-toggle
          class="q-ml-md"
          size="xs"
          v-model="IsEnabled"
          label="Enabled"
          style="font-size: 10px"
        />
        <q-checkbox
          class="q-ml-md"
          size="xs"
          label="Relative values"
          v-model="relative"
          style="font-size: 10px"
        />
      </div>

      <div v-if="!relative" class="q-ma-sm q-gutter-sm row items-center">
        <q-input
          v-model="Vol"
          label="Vol"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="Uvol"
          label="UVol"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="ElBase"
          label="ElBase"
          filled
          type="number"
          hint="mmHg/mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="ElK"
          label="ElK"
          hint="mmHg/mL"
          filled
          type="number"
          dense
          stack-label
          style="max-width: 90px"
        />
      </div>

      <div v-if="relative" class="q-ma-sm q-gutter-sm row items-center">
        <q-input
          v-model="VolP"
          label="Vol (%)"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="UvolP"
          label="UVol (%)"
          filled
          type="number"
          hint="mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="ElBaseP"
          label="ElBase (%)"
          filled
          type="number"
          hint="mmHg/mL"
          dense
          stack-label
          style="max-width: 90px"
        />
        <q-input
          v-model="ElKP"
          label="ElK (%)"
          hint="mmHg/mL"
          filled
          type="number"
          dense
          stack-label
          style="max-width: 90px"
        />
      </div>

      <div class="q-gutter-sm row text-overline justify-center q-mb-sm">
        <q-btn
          color="red-10"
          size="sm"
          style="width: 70px"
          @click="updateProperty"
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
export default {
  data() {
    return {
      collapsed: false,
      relative: false,
      compliances: ["AA", "AAR", "AD"],
      selectedCompliance: "AA",
      statusMessage: "",
      IsEnabled: true,
      Description: "Aorta ascendens",
      Vol: 0.0,
      Uvol: 0.0,
      ElBase: 10.0,
      ElK: 1.0,
      VolP: 100.0,
      UvolP: 100.0,
      ElBaseP: 100.0,
      ElKP: 100.0,
    };
  },
  methods: {
    updateProperty() {
      this.statusMessage = "property updated";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
    addToScript() {
      this.statusMessage = "property change added to script";
      setTimeout(() => (this.statusMessage = ""), 1000);
    },
  },
  mounted() {},
};
</script>

<style></style>
