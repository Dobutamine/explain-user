<template>
  <div>
    <div class="text-left q-ml-sm">
      <q-select
        label-color="red-6"
        v-model="currentSelection"
        :options="options"
        hide-bottom-space
        dense
        multiple
        :label="caption"
        style="width: 150px; font-size: 12px"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelProp: String,
    value: Array,
    options: Array,
  },
  watch: {
    value(nv, ov) {
      this.currentSelection = nv;
    },
  },
  data() {
    return {
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
      currentSelection: [],
      listOptions: [],
    };
  },
  methods: {
    updateParent() {
      this.$emit("propupdate", this.modelProp, this.newValue);
    },
  },
};
</script>

<style></style>
