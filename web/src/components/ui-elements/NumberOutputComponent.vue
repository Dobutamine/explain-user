<template>
  <q-card bordered dark :style="{ width: '100%' }">
    <div class="row q-pa-sm" :style="{ width: '100%' }">
      <div class="row" :style="{ 'font-size': '12px', width: '100%' }">
        <div class="col q-mr-xs text-left text-bold">
          {{ label }} ({{ unit }})
        </div>
      </div>
      <q-input
        class="col-9"
        v-model="newValue"
        square
        hide-hint
        readonly
        dense
        dark
        stack-label
      />
    </div>
  </q-card>
</template>

<script>
export default {
  props: {
    label: String,
    unit: String,
    modelProp: String,
    value: String,
  },
  watch: {
    value(nv, ov) {
      this.newValue = nv;
    },
  },
  data() {
    return {
      title: "",
      newValue: 0.0,
      unitClass: "bg-indigo-10 col-9",
    };
  },
  methods: {},
  mounted() {
    this.newValue = this.value;
  },
};
</script>

<style></style>
