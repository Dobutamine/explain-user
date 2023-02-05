<template>
  <div>
    <q-input
      class="q-pa-xs"
      v-model="newValue"
      square
      :label="name"
      :disable="name === 'Name' || name === 'ModelType'"
      hide-hint
      dense
      dark
      stack-label
      @update:model-value="updateParent"
    />
  </div>
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
      type: "select",
      disabled: false,
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.name, this.newValue);
    },
  },
  mounted() {
    this.disabled = false;

    this.newValue = this.value;
  },
};
</script>

<style></style>
