<template>
  <q-select
    class="q-pa-xs"
    v-model="newValue"
    square
    :label="name + ' ' + convertedUnit"
    hide-hint
    :options="options"
    dense
    dark
    stack-label
    @update:model-value="updateParent"
  />
</template>

<script>
import { explain } from "src/boot/explain";
import { useConfigStore } from "src/stores/config";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
export default {
  props: {
    name: String,
    unit: String,
    default: String,
    value: String,
  },
  watch: {
    value(nv, ov) {
      this.newValue = nv;
    },
  },
  setup() {
    const uiConfig = useConfigStore();
    const definition = useDefinitionStore();
    const engine = useEngineStore();
    return {
      uiConfig,
      definition,
      engine,
    };
  },

  data() {
    return {
      title: "",
      options: [],
      convertedUnit: "",
      conversionFactor: 1,
      roundingFactor: 2,
      newValue: "",
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
    getOptions(searchList) {
      this.options = [];
      // find all models of this type
      Object.entries(explain.modelState.Models).forEach(([name, model]) => {
        if (searchList.includes(model.ModelType)) {
          this.options.push(name);
        }
      });
    },
  },
  mounted() {
    // split the unit
    let searchList = this.unit.split("|");
    // get all the options
    this.getOptions(searchList);
    // no unit to display
    //this.convertedUnit = "";
    // set the current value
    this.newValue = this.value;
  },
};
</script>

<style></style>
