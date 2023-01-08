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
        :step="step"
        dense
        dark
        stack-label
        :readonly="locked"
        style="max-width: 70px; font-size: 12px"
        @update:model-value="updateParent"
      />
    </div>
    <div :class="unitClass" :style="{ 'font-size': fontSize, width: '70px' }">
      <div class="col q-mr-xs text-right">
        {{ (initValue * displayFactor).toFixed(displayRounding) }}
      </div>
    </div>
    <div :class="unitClass" :style="{ 'font-size': fontSize, width: '70px' }">
      <div class="col q-mr-xs text-right">
        {{ unit }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelProp: String,
    value: Number,
    initValue: Number,
    unit: String,
    min: Number,
    step: Number,
    displayFactor: Number,
    displayRounding: Number,
    locked: Boolean,
  },
  watch: {
    value(nv, ov) {
      this.newValue = (nv * this.displayFactor).toFixed(this.displayRounding);
    },
  },
  data() {
    return {
      newValue: 0.0,
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
    };
  },
  methods: {
    updateParent() {
      this.$emit(
        "propupdate",
        this.modelProp,
        parseFloat(this.newValue) / this.displayFactor
      );
    },
  },
  mounted() {
    this.newValue = (this.value * this.displayFactor).toFixed(
      this.displayRounding
    );
  },
};
</script>

<style></style>
