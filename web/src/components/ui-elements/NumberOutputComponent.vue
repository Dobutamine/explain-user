<template>
  <div>
    <div class="row">
      <q-input
        v-model="valueString"
        :label="caption"
        hide-hint
        outlined
        square
        dense
        dark
        stack-label
        readonly
        style="max-width: 90px"
      />
    </div>
    <div
      v-if="!relative"
      :class="unitClass"
      :style="{ 'font-size': fontSize, width: '90px' }"
    >
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
    value1: Number,
    value2: Number,
    relative: Boolean,
    single: Boolean,
  },
  data() {
    return {
      valueString: "",
      fontSize: "8px",
      unitClass: "row bg-negative",
      combined: false,
    };
  },
  mounted() {
    this.combined = !this.single;
    this.valueString = this.value1;
    if (this.combined) {
      this.valueString = this.value1 + "/" + this.value2;
    }
  },
};
</script>

<style></style>
