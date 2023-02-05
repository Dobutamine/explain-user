<template>
  <div>
    <q-select
      v-if="type === 'select'"
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
    <q-input
      v-if="type === 'input'"
      class="q-pa-xs"
      v-model="newValue"
      square
      :label="name + ' ' + convertedUnit"
      hide-hint
      dense
      dark
      :disable="disabled"
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
    editMode: Number,
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
      this.type = "select";
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
    this.disabled = false;
    // split the unit
    if (this.unit) {
      let searchList = this.unit.split("|");
      // get all the options
      this.getOptions(searchList);
    } else {
      this.type = "input";
    }

    if (this.unit === "String") {
      this.type = "input";
    }

    if (this.name === "ModelType" && this.editMode === 0) {
      this.type = "";
    }

    if (
      (this.name === "ModelType" || this.name === "Name") &&
      this.editMode === 1
    ) {
      this.disabled = true;
      this.type = "input";
    }

    this.$bus.on("edit_mode_1", () => {
      if (this.name === "ModelType" || this.name === "Name") {
        this.disabled = true;
        this.type = "input";
      }
    });
    this.$bus.on("edit_mode_0", () => {
      this.disabled = false;
      if (this.name === "ModelType") {
        this.type = "";
      }
    });

    this.newValue = this.value;
  },
};
</script>

<style></style>
