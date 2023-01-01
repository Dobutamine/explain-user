<template>
  <div>
    <div class="row q-gutter-xs justify-center">
      <div class="col">
        <q-select
          label-color="red-6"
          v-model="selectedModel"
          :options="models"
          hide-bottom-space
          dense
          label="models"
          style="width: 90%; font-size: 10px"
        />
      </div>
      <div class="col">
        <q-select
          label-color="red-6"
          v-model="selectedProp"
          :options="props"
          hide-bottom-space
          dense
          label="props"
          style="width: 90%; font-size: 10px"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      selectedModel: "",
      selectedProp: "",
      models: ["AA", "AAR"],
      props: ["Pres", "Vol"],
    };
  },
  methods: {},
};
</script>

<style></style>
