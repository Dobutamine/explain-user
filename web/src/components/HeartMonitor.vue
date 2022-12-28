<template>
  <q-card class="q-pb-xs q-ma-sm" bordered>
    <div
      class="q-mt-es row gutter text-overline justify-center"
      @click="isEnabled = !isEnabled"
    >
      HEART
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
          hint="/min"
          label="HR"
        />
        <q-input
          v-model="rhythm"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint=""
          label="RHYTHM"
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
          v-model="lvp"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="LVP"
        />
        <q-input
          v-model="rvp"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="RVP"
        />
        <q-input
          v-model="lap"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="LAP"
        />
        <q-input
          v-model="rap"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="mmHg"
          label="RAP"
        />
        <q-input
          v-model="lvv"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg"
          label="LVV"
        />
        <q-input
          v-model="rvv"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg"
          label="RVV"
        />
        <q-input
          v-model="lav"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg"
          label="LAV"
        />
        <q-input
          v-model="rav"
          readonly
          dense
          stack-label
          style="max-width: 90px"
          squared
          hint="ml/kg"
          label="RAV"
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
      rhythm: "sinus",
      lvp: "60/3",
      rvp: "40/2",
      lap: "8/5",
      rap: "60/40",
      lvv: "40/20",
      rvv: "8/5",
      lav: "7/3",
      rav: "6/2",
    };
  },
};
</script>

<style></style>
