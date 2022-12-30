<template>
  <q-card class="q-pb-xs q-pt-xs q-ma-sm" bordered>
    <q-badge class="q-ma-sm" color="red-10" rounded floating>admin </q-badge>
    <div v-if="!collapsed">
      <div class="q-gutter-sm row justify-left q-mb-sm q-mt-xs">
        <div class="q-ml-lg text-subtitle2 text-weight-light">
          Logged in as: <b>Timothy</b><br />
          Loaded model: <b>normal neonate</b><br />
          Model time at: <b>40 sec.</b>
        </div>
      </div>
      <q-separator></q-separator>
      <div class="q-mt-sm row gutter text-overline justify-center">
        <q-select
          class="q-ml-md q-mr-md"
          label-color="red-6"
          v-model="selectedModel"
          :options="availableModels"
          hide-bottom-space
          dense
          label="available models on server"
          style="width: 90%; font-size: 12px"
        />
      </div>

      <q-card class="q-ma-md q-mt-sm"> </q-card>
      <div class="q-gutter-sm row text-overline justify-center q-mb-sm q-mt-sm">
        <q-btn color="secondary" size="sm" style="width: 80px">LOAD</q-btn>
        <q-btn color="red-10" size="sm" style="width: 80px">SAVE</q-btn>
        <q-btn color="blue-10" size="sm" style="width: 80px">LOG OUT</q-btn>
      </div>
      <div
        class="q-gutter-sm row text-overline justify-center q-mb-xs"
        style="font-size: 10px"
      >
        {{ statusMessage }}
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      collapsed: false,
      relative: true,
      availableModels: ["normal neonate"],
      selectedModel: "normal neonate",
      statusMessage: "",
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style></style>
