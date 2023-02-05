<template>
  <div>
    <q-toggle
      v-if="type === 'select'"
      class="q-pa-xs q-mt-sm"
      v-model="newValue"
      square
      size="sm"
      :label="name + ' ' + convertedUnit"
      dense
      dark
      left-label
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
    default: Boolean,
    value: Boolean,
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
    this.newValue = this.value;
  },
};
</script>

<style></style>
