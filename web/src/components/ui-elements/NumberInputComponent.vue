<template>
  <q-input
    class="q-pa-xs"
    v-model="newValue"
    square
    :label="name + ' ' + convertedUnit"
    hide-hint
    type="number"
    dense
    dark
    stack-label
    @update:model-value="updateParent"
  />
</template>

<script>
export default {
  props: {
    name: String,
    unit: String,
    default: Number,
    value: Number,
  },
  watch: {
    value(nv, ov) {
      this.newValue = nv;
    },
  },
  data() {
    return {
      title: "",
      convertedUnit: "",
      conversionFactor: 1,
      roundingFactor: 2,
      newValue: 0.0,
      unitClass: "bg-indigo-10 col-9",
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.name, parseFloat(this.newValue));
    },
  },
  mounted() {
    this.newValue = this.value;
  },
};
</script>

<style></style>
