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
        left heart contractility: {{ contractility }}%
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark">
        right heart contractility: {{ contractility }}%
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      title: "HEART FUNCTION",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
