<template>
  <div>
    <div class="row">
      <q-input
        v-if="!relative"
        v-model="value"
        :label="caption"
        filled
        square
        hide-hint
        type="number"
        :min="min"
        :max="max"
        :step="step"
        dense
        dark
        stack-label
        style="max-width: 90px"
      />
      <q-input
        v-if="relative"
        v-model="value"
        :label="caption"
        filled
        type="number"
        min="1"
        max="1000000"
        step="1"
        dense
        dark
        stack-label
        style="max-width: 90px"
      />
    </div>
    <div
      v-if="!relative"
      :class="unitClass"
      :style="{ 'font-size': fontSize, width: '87px' }"
    >
      <div class="col q-ml-sm text-left">abs</div>
      <div class="col q-mr-sm text-right">{{ unit }}</div>
    </div>
    <div
      v-if="relative"
      class="row bg-negative"
      :style="{ 'font-size': fontSize, width: '89px' }"
    >
      <div class="col q-ml-sm text-left">rel</div>
      <div class="col q-mr-sm text-right">%</div>
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
  },
  data() {
    return {
      value: 0.0,
      fontSize: "8px",
      unitClass: "row bg-secondary",
    };
  },
  mounted() {
    this.value = this.min;
  },
};
</script>

<style></style>
