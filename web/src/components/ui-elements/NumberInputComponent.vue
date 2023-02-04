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
    deleteMe() {
      //this.$emit("propdelete", this.modelName, this.modelProp);
    },
    updateParent() {
      // this.$emit(
      //   "propupdate",
      //   this.modelName,
      //   this.modelProp,
      //   parseFloat(this.newValue) / this.displayFactor
      // );
    },
  },
  mounted() {
    switch (this.unit) {
      case "":
        this.convertedUnit = "";
        break;
      case "l":
        this.convertedUnit = "(mL)";
        this.conversionFactor = 1000;
        break;
      case "mmHg/l":
        this.convertedUnit = "(mmHg/mL)";
        this.conversionFactor = 0.001;
        break;
      case "mmHg/l*s":
        this.convertedUnit = "(mmHg/mL*s)";
        this.conversionFactor = 0.001;
        break;
      default:
        this.convertedUnit = "(" + this.unit + ")";
    }
    this.newValue = this.value * this.conversionFactor;
  },
};
</script>

<style></style>
