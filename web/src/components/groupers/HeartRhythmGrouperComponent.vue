<template>
  <div>
    <q-select
      v-model="selection"
      :options="grouperItem.options"
      hide-bottom-space
      dense
      label="heart rhythm"
      style="width: 100%; font-size: 12px"
    />
  </div>
</template>

<script>
export default {
  props: {
    grouperItem: Object,
    grouperItemName: String,
  },
  data() {
    return {
      options: ["sinus", "svt", "vt"],
      selection: "sinus",
    };
  },
};
</script>

<style></style>
