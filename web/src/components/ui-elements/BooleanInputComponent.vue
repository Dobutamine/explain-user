<template>
  <div>
    <div :style="{ 'font-size': '10px', width: '70px' }">
      <div class="col q-mr-sm text-left">{{ caption }}</div>
    </div>
    <div class="row">
      <q-toggle
        size="xs"
        dark
        v-model="newValue"
        style="font-size: 10px"
        @update:model-value="updateParent"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelProp: String,
    value: Boolean,
  },
  watch: {
    value(nv, ov) {
      if (typeof nv === "boolean") {
        this.newValue = nv;
      } else {
        this.newValue = false;
      }
    },
  },
  data() {
    return {
      newValue: false,
      fontSize: "8px",
      unitClass: "row bg-indigo-10",
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
