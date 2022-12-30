<template>
  <div>
    <q-separator dark size="1px" color="grey-12"></q-separator>
    <div v-if="!combined" class="q-mt-sm">
      <q-badge color="dark">
        left {{ caption }}: {{ value1 }} {{ unit }}
        <q-btn
          :color="butColor"
          class="q-ml-md q-pa-xs"
          dense
          size="xs"
          @click="link"
          >{{ butCap }}</q-btn
        >
      </q-badge>
      <q-slider v-model="value1" :min="min" :max="max" :step="step" />

      <q-badge color="dark">
        right {{ caption }}: {{ value2 }} {{ unit }}
        <q-btn
          :color="butColor"
          class="q-ml-md q-pa-xs"
          dense
          size="xs"
          @click="link"
          >{{ butCap }}</q-btn
        >
      </q-badge>
      <q-slider v-model="value2" :min="min" :max="max" :step="step" />
    </div>

    <div v-if="combined" class="q-mt-sm">
      <q-badge color="dark">
        {{ caption }}: {{ value }} {{ unit }}
        <q-btn
          :color="butColor"
          class="q-ml-md q-pa-xs"
          dense
          size="xs"
          @click="unlink"
          >{{ butCap }}</q-btn
        >
      </q-badge>
      <q-slider
        v-model="value"
        :min="min"
        :max="max"
        :step="step"
        @update:model-value="update"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    caption: String,
    unit: String,
    min: Number,
    max: Number,
    step: Number,
    connected: Boolean,
  },
  data() {
    return {
      butColor: "negative",
      butCap: "",
      value: 100,
      value1: 100,
      value2: 100,
      combined: false,
    };
  },
  methods: {
    unlink() {
      this.combined = false;
      this.butCap = "L/R";
      this.butColor = "negative";
    },
    link() {
      this.combined = true;
      this.butCap = "L=R";
      this.butColor = "secondary";
    },
    update(e) {
      this.value1 = e;
      this.value2 = e;
    },
  },
  mounted() {
    this.combined = this.connected;
    if (this.combined) {
      this.butCap = "L=R";
      this.butColor = "secondary";
    } else {
      this.butCap = "L/R";
      this.butColor = "negative";
    }
  },
};
</script>

<style></style>
