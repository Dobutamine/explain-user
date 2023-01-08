<template>
  <div class="row q-mt-sm" :style="{ width: '100%' }">
    <div
      class="row justify-left text-grey-3"
      :style="{ width: '100%', 'font-size': '12px' }"
    >
      <div>{{ title }}</div>
    </div>
    <div class="row justify-center">
      <q-btn-toggle
        v-model="newValue"
        size="xs"
        dark
        spread
        no-caps
        toggle-color="indigo-10"
        color="grey-9"
        text-color="black"
        :options="[
          { label: 'Enabled', value: true },
          { label: 'Disabled', value: false },
        ]"
        @update:model-value="updateParent"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    modelName: String,
    modelProp: String,
    value: Boolean,
  },
  watch: {
    value(nv, ov) {
      console.log(nv);
      if (typeof nv === "boolean") {
        this.newValue = nv;
      } else {
        this.newValue = false;
      }
    },
  },
  data() {
    return {
      title: "",
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
  mounted() {
    this.newValue = this.value;
    this.title = this.modelName + " " + this.caption;
  },
};
</script>

<style></style>
