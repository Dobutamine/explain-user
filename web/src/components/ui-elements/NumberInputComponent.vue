<template>
  <div>
    <div class="row">
      <q-input
        v-model="newValue"
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
        style="max-width: 70px; font-size: 10px"
        @update:model-value="updateParent"
      />
    </div>
    <div :class="unitClass" :style="{ 'font-size': fontSize, width: '70px' }">
      <div class="col q-mr-sm text-right">{{ unit }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    value: Number,
    unit: String,
    min: Number,
    max: Number,
    step: Number,
  },
  watch: {
    value(nv, ov) {
      this.newValue = nv;
    },
  },
  data() {
    return {
      newValue: 0.0,
      fontSize: "8px",
      unitClass: "row bg-secondary",
    };
  },
  methods: {
    updateParent() {
      this.$emit(this.caption.toLowerCase(), this.newValue);
    },
  },
};
</script>

<style></style>
