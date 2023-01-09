<template>
  <q-card bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-sm" :style="{ width: '100%' }">
      <div class="row" :style="{ 'font-size': '12px', width: '100%' }">
        <div class="col q-mr-xs text-left text-bold">
          {{ title }}
        </div>
      </div>
      <q-select
        class="col-9"
        label-color="grey-4"
        v-model="currentSelection"
        :options="listOptions"
        hide-bottom-space
        dense
        multiple
        :readonly="locked"
        style="font-size: 12px"
        @update:model-value="updateParent"
      />
      <q-btn
        class="q-ma-sm col"
        color="grey-9"
        outline
        size="xs"
        dense
        icon="fa-solid fa-delete-left"
        @click="deleteMe"
      ></q-btn>
    </div>
  </q-card>
</template>

<script>
import { explain } from "src/boot/explain";

export default {
  props: {
    caption: String,
    modelName: String,
    modelProp: String,
    value: Array,
    options: Array,
    locked: Boolean,
  },
  watch: {
    value(nv, ov) {
      this.currentSelection = nv;
    },
  },
  data() {
    return {
      title: "",
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
      currentSelection: "",
      listOptions: [],
    };
  },
  methods: {
    deleteMe() {
      this.$emit("propdelete", this.modelName, this.modelProp);
    },
    updateParent() {
      this.$emit(
        "propupdate",
        this.modelName,
        this.modelProp,
        this.currentSelection
      );
    },
  },
  mounted() {
    this.title = this.modelName + "." + this.caption;
    // we now have to find all the optionals
    for (let model in explain.modelState.Models) {
      if (this.options.includes(explain.modelState.Models[model].ModelType)) {
        this.listOptions.push(model);
      }
    }
    // now find the current value
    this.currentSelection =
      explain.modelState.Models[this.modelName][this.modelProp];
  },
};
</script>

<style></style>
