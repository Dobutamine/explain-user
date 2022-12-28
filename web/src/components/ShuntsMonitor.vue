<template>
  <q-card class="q-pb-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      SHUNTS
    </div>

    <div v-if="isEnabled">
      <div class="q-ma-xs q-gutter-xs row justify-left">
        <q-input
          v-model="of"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="FO"
        />
        <q-input
          v-model="da"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="DA"
        />
        <q-input
          v-model="vsd"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="VSD"
        />
        <q-input
          v-model="lungshunt"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="LUNG"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      isEnabled: true,
      of: 0.0,
      vsd: 0.0,
      da: 0.0,
      lungshunt: 0.0,
    };
  },
};
</script>

<style></style>
