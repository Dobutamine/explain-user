<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div class="q-ma-sm">
      <q-badge color="dark">
        intravascular volume: {{ contractility }} mL/kg
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark">
        systemic vascular resistance: {{ contractility }}%
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark">
        pulmonary vascular resistance: {{ contractility }}%
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark"> venous pool size: {{ contractility }}% </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      title: "CIRCULATION",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
