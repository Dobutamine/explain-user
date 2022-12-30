<template>
  <div>
    <q-separator></q-separator>
    <q-badge class="q-mt-sm" color="dark">
      {{ caption }}: {{ value }} {{ unit }}
    </q-badge>
    <q-slider v-model="value" :min="min" :max="max" :step="step" />
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    unit: String,
    min: Number,
    max: Number,
    step: Number,
    rounding: Number,
  },
  data() {
    return {
      value: 100,
    };
  },
};
</script>

<style></style>
