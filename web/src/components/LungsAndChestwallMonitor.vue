<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      LUNG AND CHESTWALL
    </div>

    <div v-if="isEnabled">
      <div class="q-ma-xs q-gutter-xs row justify-left">
        <q-input
          v-model="hr"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="bpm"
          label="HR"
        />
        <q-input
          v-model="abp"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="ABP"
        />
        <q-input
          v-model="pap"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="PAP"
        />
        <q-input
          v-model="cvp"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="CVP"
        />
        <q-input
          v-model="sv"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg"
          label="SV"
        />
        <q-input
          v-model="co"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="CO"
        />
        <q-input
          v-model="lvo"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="LVO"
        />
        <q-input
          v-model="rvo"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="RVO"
        />
        <q-input
          v-model="ivcFlow"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="IVC flow"
        />
        <q-input
          v-model="svcFlow"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="SVC flow"
        />
        <q-input
          v-model="myoFlow"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="MYO flow"
        />
        <q-input
          v-model="brainFlow"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg/min"
          label="BRAIN flow"
        />
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      isEnabled: false,
      hr: 125,
      sv: 1.8,
      co: 225,
      abp: "60/40",
      pap: "40/20",
      cvp: 5,
      lvo: 225,
      rvo: 225,
      ivcFlow: 120,
      svcFlow: 120,
      myoFlow: 5,
      brainFlow: 10,
      daFlow: 0.0,
      foFlow: 0.0,
      vsdFlow: 0.0,
    };
  },
};
</script>

<style></style>
