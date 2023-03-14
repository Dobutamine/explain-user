<template>
  <q-input
    class="q-pa-xs"
    v-model="newValue"
    square
    :label="name"
    hide-hint
    type="number"
    :step="0.1"
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
    value: Number,
  },
  watch: {
    value(nv, ov) {
      this.newValue = nv;
    },
  },
  data() {
    return {
      newValue: 0.0,
      unitClass: "bg-indigo-10 col-9",
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.name, parseFloat(this.newValue));
    },
  },
  mounted() {
    this.newValue = this.value;
  },
};
</script>

<style></style>
