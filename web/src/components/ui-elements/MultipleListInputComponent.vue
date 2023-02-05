<template>
  <div>
    <q-select
      class="q-pa-xs"
      v-model="newValue"
      square
      :label="name + ' ' + convertedUnit"
      hide-hint
      :options="optionList"
      dense
      dark
      multiple
      stack-label
      @update:model-value="updateParent"
    />
  </div>
</template>

<script>
import { explain } from "src/boot/explain";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
export default {
  props: {
    name: String,
    unit: String,
    options: String,
    default: String,
    value: String,
  },
  watch: {
    options(no, oo) {
      this.getOptions();
    },
  },
  setup() {
    const definition = useDefinitionStore();
    const engine = useEngineStore();
    return {
      definition,
      engine,
    };
  },

  data() {
    return {
      title: "",
      optionList: [],
      convertedUnit: "",
      conversionFactor: 1,
      roundingFactor: 2,
      newValue: [],
      unitClass: "bg-indigo-10 col-9",
      type: "select",
      disabled: false,
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.name, this.newValue);
    },
    getOptions() {
      this.optionList = [];
      let searchList = this.options.split("|");

      // find all models of this type
      Object.entries(explain.modelState.Models).forEach(([name, model]) => {
        if (searchList.includes(model.ModelType)) {
          this.optionList.push(name);
        }
      });
    },
  },
  mounted() {
    this.newValue = this.value;
    this.getOptions();
  },
};
</script>

<style></style>
