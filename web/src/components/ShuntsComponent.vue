<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div v-if="!collapsed" class="q-ma-sm">
      <q-badge color="dark">
        foramen ovale size: {{ contractility }} mm
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark">
        ductus arteriosus size: {{ contractility }} mm
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark"> lung shunt: {{ contractility }} % </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
      <q-badge color="dark">
        ventricular septal defect size: {{ contractility }} mm
      </q-badge>
      <q-slider v-model="contractility" :min="0" :max="500" />
    </div>
    <div
      v-if="!collapsed"
      class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm"
    >
      <q-btn color="negative" size="sm" style="width: 70px">UPDATE</q-btn>
      <q-btn color="secondary" size="sm" style="width: 70px">SCRIPT</q-btn>
      <q-btn color="blue-10" size="sm" style="width: 70px">CANCEL</q-btn>
    </div>
    <div
      class="q-gutter-sm row text-overline justify-center q-mb-xs"
      style="font-size: 10px"
    >
      {{ statusMessage }}
    </div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      title: "SHUNTS",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
