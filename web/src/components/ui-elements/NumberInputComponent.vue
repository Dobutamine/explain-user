<template>
  <q-card bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-sm" :style="{ width: '100%' }">
      <div class="row" :style="{ 'font-size': '12px', width: '100%' }">
        <div class="col q-mr-xs text-left text-bold">
          {{ modelName }} {{ caption }} ({{ unit }})
        </div>
      </div>
      <q-input
        class="col-9"
        v-model="newValue"
        square
        hide-hint
        type="number"
        :min="min"
        :step="step"
        dense
        dark
        stack-label
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
export default {
  props: {
    modelName: String,
    caption: String,
    modelProp: String,
    value: Number,
    initValue: Number,
    unit: String,
    min: Number,
    step: Number,
    displayFactor: Number,
    displayRounding: Number,
    locked: Boolean,
  },
  watch: {
    value(nv, ov) {
      this.newValue = (nv * this.displayFactor).toFixed(this.displayRounding);
    },
  },
  data() {
    return {
      title: "",
      newValue: 0.0,
      unitClass: "bg-indigo-10 col-9",
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
        parseFloat(this.newValue) / this.displayFactor
      );
    },
  },
  mounted() {
    this.newValue = (this.value * this.displayFactor).toFixed(
      this.displayRounding
    );
  },
};
</script>

<style></style>
