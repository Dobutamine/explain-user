<template>
  <div>
    <div class="row">
      <q-knob
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        show-value
        dark
        size="50px"
        :thickness="0.22"
        color="teal"
        track-color="grey-9"
      />
    </div>
    <div class="row" :style="{ 'font-size': '10px' }">
      <div class="col q-mt-xs text-left">{{ caption }}</div>
    </div>
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
    relative: Boolean,
    startValue: Number,
  },
  data() {
    return {
      value: 100.0,
    };
  },
  mounted() {
    this.value = parseFloat(this.startValue);
  },
};
</script>

<style></style>
