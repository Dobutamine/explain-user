<template>
  <div class="row"></div>
</template>

<script>
import { explain } from "src/boot/explain";
import { useConfigStore } from "src/stores/config";
import { useDefinitionStore } from "src/stores/definition";
import { useEngineStore } from "src/stores/engine";
import NumberInputComponent from "./NumberInputComponent.vue";
import ListInputComponent from "./ListInputComponent.vue";

export default {
  components: {},
  props: {
    name: String,
    unit: String,
    default: Object,
    value: Object,
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
      newValue: [],
      unitClass: "bg-indigo-10 col-9",
      props: [],
      selectedModelItemLeft: {},
      selectedModelItemRight: {},
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
    //
    console.log("Structure :", this.unit);
    console.log("Values : ", this.value);

    // split the unit
    // let objectProperties = this.unit.split(":");
    // // determine the left side
    // let left_side = objectProperties[0];
    // this.selectedModelItemLeft = {
    //   type: "String",
    //   name: this.name,
    //   default: "",
    //   unit: left_side,
    //   value: "",
    // };
    // let right_side = objectProperties[1];
    // this.selectedModelItemRight = {
    //   type: "Number",
    //   name: this.name,
    //   default: 0,
    //   unit: right_side,
    //   value: 0,
    // };
    // get all the options
    //this.getOptions(objectProperties);
    // no unit to display
    //this.convertedUnit = "";
    // set the current value
    this.newValue = this.value;
  },
};
</script>

<style></style>
