<template>
  <div class="q-mt-xs text-overline">
    {{ name }} {{ unit }}

    <div v-for="(value, key) in keyValuePairs" :key="key">
      <NumberInputComponent
        :name="key"
        :default="value"
        :value="value"
        @propupdate="updateFromChild"
      ></NumberInputComponent>
    </div>
  </div>
</template>

<script>
import { explain } from "src/boot/explain";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
import NumberInputComponent from "./NumberInputComponent.vue";

export default {
  components: {
    NumberInputComponent,
  },
  props: {
    name: String,
    unit: String,
    options: String,
    default: Object,
    value: Object,
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
      unitClass: "bg-indigo-10 col-9",
      type: "select",
      disabled: false,
      keyValuePairs: {},
    };
  },
  methods: {
    updateFromChild(propName, propValue) {
      this.keyValuePairs[propName] = propValue;
      this.updateParent("propupdate", this.name, this.keyValuePairs);
    },
    updateParent() {
      this.$emit("propupdate", this.name, this.keyValuePairs);
    },
  },
  mounted() {
    // store the keyvalue pairs
    this.keyValuePairs = this.value;
  },
};
</script>

<style></style>
