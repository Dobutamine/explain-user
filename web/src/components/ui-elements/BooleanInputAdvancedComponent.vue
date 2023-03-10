<template>
  <q-toggle
    class="q-pa-xs"
    v-model="newValue"
    size="xs"
    :label="name"
    hide-hint
    type="number"
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
    value: Boolean,
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
      this.$emit("propupdate", this.name, this.newValue);
    },
  },
  mounted() {
    this.newValue = this.value;
  },
};
</script>

<style></style>
