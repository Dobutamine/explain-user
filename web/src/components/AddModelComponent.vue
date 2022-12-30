<template>
  <q-card class="q-pa-xs q-ma-md" bordered>
    <div
      class="row text-overline justify-center"
      @click="collapsed = !collapsed"
    >
      {{ title }}
    </div>
    <div class="q-ma-sm"></div>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      title: "ADD MODEL COMPONENT",
      collapsed: false,
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
